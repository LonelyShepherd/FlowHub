import Alter from "./core/Alter";
import Utils from "./core/Utils";
import SequentialAdd from "./components/SequentialAdd";
import Autocomplete from "./components/Autocomplete";
import Select from "./components/Select";
import Component from "./components/Component";
import { SEQUENTIAL_ADD } from "./helpers/common";

function filter(array) {
  let result = []
    , found = {};

  for(let i = 0; i < array.length; i++) {
    let stringified = JSON.stringify(array[i][0]);

    if(found[stringified])
      continue;
    
    result.push(array[i].join(','));
    found[stringified] = true;
  }

  return result;
}

const defaultValue = 'Select role';

let content = document.body.querySelector('.main .content')
  , createNewSection = content.querySelector('.dashboard-section--create-team')
  , create = createNewSection.querySelector('.create-new')
  , image = Utils.createElement('img')
  , input
  , teamName
  , teamInfo
  , main = new Component()
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
      let select = new Select({
        initialValue: 'Select role',
        source: ['Administrator', 'Moderator', 'Editor']
      }).get();
      let remove = Utils.createElement('button', {
        type: 'button',
        className: SEQUENTIAL_ADD.ITEM_REMOVE
      });

      selectedResult.appendChild(select);
      selectedResult.appendChild(remove);
      Alter.replace(selectedResult, self.get());
    }
  })
});

create.addEventListener('click', () => {
  main.notify('working');

  $.ajax({
    url: '../Team/NewTeam',
    dataType: 'html'
  }).done(data => {
    main.notify('clear');
    Alter.unmount(createNewSection);
    content.innerHTML = data;

    let logo = content.querySelector('.team-logo')
    input = logo.querySelector('input');
    teamName = content.querySelector('.team-name input');
    teamInfo = content.querySelector('.team-info textarea');
    
    input.addEventListener('input', () => {
      let successful = Utils.URLToImage(input, image);
    
      if(!successful) {
        main.notify('warning', 'You are trying to upload image which file format we don\'t support. Only supported formats are .png, .jpeg and .tiff');
        input.value = '';
        return;
      }
    });
    logo.querySelector('label').appendChild(image);

    content.querySelector('.team-members')
    .appendChild(sequentialAdd.get());

    let actions = content.querySelector('.actions');
    actions.addEventListener('click', e => {
      let action = e.target;

      switch(action.innerHTML) {
        case 'Cancel':
          sequentialAdd.clear();
          image = Utils.createElement('img');
          content.innerHTML = '';
          content.appendChild(createNewSection);
          break;
        case 'Create team':
          let emails = []
            , members = sequentialAdd._elements.querySelectorAll('.' + SEQUENTIAL_ADD.ITEM_ADDED);
          
          for(let i = 0; i < members.length; i++) {
            let member = members[i]
              , selectedValue = member.querySelector('button').innerHTML;

            if(selectedValue === defaultValue) {
              main.notify('error', 'Seems like some of your members doesn\'t have a role assigned');
              return;
            } else
              emails.push([member.querySelector('.user-email').innerHTML, selectedValue]);
          }

          let formData = new FormData();
          formData.append('logo', input.files[0]);
          formData.append('name', teamName.value);
          formData.append('info', teamInfo.value);
          formData.append('emails', filter(emails).join(';'));
          
          main.notify('working');

          $.ajax({
            url: '../Team/Create',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            mimeType: 'multipart/form-data'
          }).done(data => {
            if(JSON.stringify(data.team) !== JSON.stringify({}))
              main.notify('success', 'Your team has been created');
            else 
              main.notify('error', 'Something went terribly wrong. Sorry...')
          });

          break;
      }
    });
  });
});