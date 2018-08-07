import Alter from "./core/Alter";
import Utils from "./core/Utils";
import Async from "./core/Async";
import SequentialAdd from "./components/SequentialAdd";
import Autocomplete from "./components/Autocomplete";
import Component from "./components/Component";
import { SEQUENTIAL_ADD } from "./helpers/common";

let content = document.body.querySelector('.main .content')
  , createNewSection = content.querySelector('.dashboard-section--create-team')
  , create = createNewSection.querySelector('.create-new')
  , image
  , input
  , teamName
  , teamInfo
  , notifier = Component.notify
  , sequentialAdd = new SequentialAdd({
  trigger: {
    text: 'Add new member'
  },
  onAdd: element => {
    element.querySelector('input').focus();
  },
  element: () => new Autocomplete({
    placeholder: 'johnsmith@mail.com',
    onInput: self => {
      $.ajax({
        url: '/Dashboard/SearchUsers',
        data: `q=${self._trigger.value}`,
        dataType: 'json'
      }).done(data => {
        self._populate(data.result, item => {
          return(
            `<div>${item.FullName}</div>
            <div class="user-email">${item.Email}</div>`
          );
        }, () => `${self._trigger.value} isn't a FlowHub user`);
      });
    },
    onRegisterSelected: (self, selected) => {
      let selectedResult = Utils.createElement('div', {
        innerHTML: `<div>${selected.innerHTML}</div>`,
        className: `${SEQUENTIAL_ADD.ITEM_ADDED + ' ' + SEQUENTIAL_ADD.ITEM_ADDED}--member`
      });
      let remove = Utils.createElement('button', {
        type: 'button',
        className: SEQUENTIAL_ADD.ITEM_REMOVE
      });

      selectedResult.appendChild(remove);
      Alter.replace(selectedResult, self.get());
    }
  })
});

create.addEventListener('click', () => {
  notifier('working');

  $.ajax({
    url: '../Team/NewTeam',
    dataType: 'html'
  }).done(data => {
    notifier('clear');
    Alter.unmount(createNewSection);
    content.innerHTML = data;

    let logo = content.querySelector('.team-logo')
    input = logo.querySelector('input');
    image = logo.querySelector('img');
    teamName = content.querySelector('.team-name input');
    teamInfo = content.querySelector('.team-info textarea');
    
    input.addEventListener('input', () => {
      let successful = Utils.URLToImage(input, image);
    
      if(!successful) {
        notifier('warning', 'You are trying to upload image which file format we don\'t support. Only supported formats are .png, .jpeg and .tiff');
        input.value = '';
        return;
      }
    });

    content.querySelector('.team-members')
    .appendChild(sequentialAdd.get());

    let actions = content.querySelector('.actions');
    actions.addEventListener('click', e => {
      let action = e.target;

      switch(action.innerHTML) {
        case 'Cancel':
          sequentialAdd.clear();
          content.innerHTML = '';
          content.appendChild(createNewSection);
          image = null;
          teamName = null;
          teamInfo = null;
          input = null;
          break;
        case 'Create team':
          let members = sequentialAdd._elements.querySelectorAll('.' + SEQUENTIAL_ADD.ITEM_ADDED);
          console.log(Utils.uniqueEmails(members));
          let formData = new FormData();
          formData.append('logo', input.files[0]);
          formData.append('name', teamName.value);
          formData.append('info', teamInfo.value);
          formData.append('emails', Utils.uniqueEmails(members).join(','));
          
          notifier('working');
          Async.post({
            url: '../Team/Create',
            data: formData,
            successMessage: 'Your team has been created',
            onDone: data => {
              data = JSON.parse(data);
              setTimeout(() => {
                window.location = data.redirectUrl;
              }, 5000);
            }
          });
          break;
      }
    });
  });
});