import MultiStepModal from './components/MultiStepModal';
import SequentialAdd from './components/SequentialAdd';
import Select from './components/Select';
import AutoComplete from './components/AutoComplete';
import Utils from './core/Utils';
import Alter from './core/Alter';
import { SEQUENTIAL_ADD, SELECT } from './helpers/common';

let createTeam = document.querySelector('.create-team-btn');

let MSModal = new MultiStepModal({
    isBody: true
  }, {
    modalOverlay: true,
    modalOverlayClose: true,
    customClass: 'fh-modal--create-team',
    width: 700
  }, {
    steps: [
      {
        stepTitle: 'Team info',
      }, {
        stepTitle: 'Add members'
      }, {
        stepTitle: 'Everything looks good?'
      }
  ]});

let sequentialAdd = new SequentialAdd(null, {
  addElement: instance => new AutoComplete({
    reference: instance.trigger,
    customClass: SEQUENTIAL_ADD.ITEM_ADD_NEW,
    placeholder: 'johnsmith@mail.com',
    onAdd: input => {
      input.focus();
    },
    onInput: (input, result) => {
      $.ajax({
        url: '/Dashboard/SearchUsers',
        data: `q=${input.value}`,
        dataType: 'json'
      }).done((data) => {
        let fragment = document.createDocumentFragment();

        if(data.result.length !== 0) {
          for(let i = 0; i < data.result.length; i++) {
            let name = data.result[i].Name + ' ' + data.result[i].Surname;

            let li = Utils.createElement('li', {
              innerHTML: `<div>${name}</div>
                          <div>${data.result[i].Email}</div>`,
              className: 'fh-select__result__item',
              id: `result-option-${i}`
            });

            fragment.appendChild(li);
          }
        } else {
          let noMatch = Utils.createElement('li', { 
            innerHTML: `${input.value} isn't a FlowHub user`, 
            className: 'fh-select__result__item' 
          });
          fragment.appendChild(noMatch);
        }

        result.innerHTML = '';
        result.appendChild(fragment);
      });
    },
    onRegisterSelected: (instance, selected) => {
      let selectedResult = Utils.createElement('div', {
        innerHTML: `<div>${selected.innerHTML}</div>`,
        className: `${SEQUENTIAL_ADD.ITEM_ADDED + ' ' + SEQUENTIAL_ADD.ITEM_ADDED}--custom`
      });

      let remove = Utils.createElement('button', {
        type: 'button',
        className: SEQUENTIAL_ADD.ITEM_REMOVE
      });

      let select = new Select({
        returnCreated: true,
        initialValue: 'Select role',
        displayData: result => {
          let roles = ['Administrator', 'Moderator', 'Editor'];

          let fragment = document.createDocumentFragment();

          for(let i = 0; i < roles.length; i++) {
            let li = Utils.createElement('li', {
              id: `result-option-${i}`,
              className: SELECT.RESULT_ITEM,
              innerHTML: roles[i]
            });
            fragment.appendChild(li);
          }

          result.appendChild(fragment);
        },
        onRegisterSelected: (instance, selected) => {    
          instance.trigger.innerHTML = selected.innerHTML;
    
          instance.hideResult();
        }
      }).init();

      selectedResult.appendChild(select);
      selectedResult.appendChild(remove);
      Alter.replace(selectedResult, instance.layout);
    }
  })
  .init()
});

createTeam.addEventListener('click', () => {
  $.ajax({
    url: '/Dashboard/CreateTeam',
    dataType: 'html'
  }).done((data) => {
    MSModal.configure(content => { content.html = data });
    MSModal.init();
    MSModal.open();

    let addMember = MSModal.getModal()
      .querySelector('.' + SEQUENTIAL_ADD.TRIGGER);
    sequentialAdd.setTrigger(addMember);
    sequentialAdd.init();
  });
});