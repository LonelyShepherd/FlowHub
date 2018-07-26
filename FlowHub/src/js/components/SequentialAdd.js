import Traversal from '../core/Traversal';
import Utils from '../core/Utils';
import AutoComplete from './AutoComplete';

class SequentialAdd {
  constructor(trigger) {
    this.trigger = trigger;
    this.container = undefined;
  }

  setTrigger(trigger) {
    this.trigger = trigger;
  }

  add() {
    let formGroup = Utils.createElement('div', {
      className: 'form-group form-group--small form-group--no-validation',
      innerHTML: '<input type="text" placeholder="johnsmith@mail.com">',
    });

    let autoComplete = new AutoComplete({
      reference: this.trigger,
      layout: formGroup,
      onAdd: () => {
        formGroup.querySelector('input').focus();
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
              let name = data.result[i].Name + data.result[i].Surname;

              let li = Utils.createElement('li', {
                innerHTML: `<div>${name}</div>
                            <div>${data.result[i].Email}</div>`,
                className: 'fh-autocomplete__result__item'
              });

              fragment.appendChild(li);
            }
          } else {
            let noMatch = Utils.createElement('li', { 
              innerHTML: `${input.value} isn't a FlowHub user`, 
              className: 'fh-autocomplete__result__item' 
            });
            fragment.appendChild(noMatch);
          }

          result.innerHTML = '';
          result.appendChild(fragment);
        });
      }
    })
    .add();
  }

  attachEvents() {
    this.trigger.addEventListener('click', () => {
      this.add();
    });
  }

  init() {
    this.container = Traversal.parents(this.trigger, '.fh-sequential-add');
    this.attachEvents();
  }
}

export default SequentialAdd;