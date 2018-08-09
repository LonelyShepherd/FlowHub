import Utils from "./core/Utils";
import Alter from "./core/Alter";
import Async from "./core/Async";
import Event from "./core/Event";
import Component from "./components/Component";
import { SEQUENTIAL_ADD } from "./helpers/common";

function ajaxHandler(selected) {
  main.notify('working');
  loaded && Alter.unmount(script);
  script = Utils.createElement('script', {
    type: 'text/javascript',
    src: '/dist/js/team-settings.js'
  });
  loaded = false;

  $.ajax({
    url: '../Team/Manage',
    data: `tab=${selected}`,
    dataType: 'html'
  }).done(data => {
    main.notify('clear');
    body.innerHTML = data;
    
    if(selected !== 'settings')
      return;

    document.body.appendChild(script);
    loaded = true;    
  });
}

function selectTab(trigger) {
  if(trigger.tagName === 'A') {
    Utils.removeClass(active, 'active');
    active = trigger;
    Utils.addClass(active, 'active');
    
    ajaxHandler(trigger.getAttribute('data-href'));
  }
}

let body = document.querySelector('.team__body')
  , nav = document.querySelector('.team__header__nav')
  , placeholder = Utils.createElement('div', {}, {
      height: nav.offsetHeight + 'px'
    })
  , items = nav.querySelectorAll('a')
  , mounted = false
  , active = items[0]
  , triggeredOn
  , main = Component
  , header = document.querySelector('.team__header__info')
  , hImage = header.querySelector('img')
  , hName = header.querySelector('h3')
  , hInfo = header.querySelector('p')
  , script
  , loaded = false
  , membersTab = nav.querySelector('li:nth-child(2) a');

body.onclick = e => {
  if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A')
    return;

  if(Utils.hasClass(e.target, 'update-team')) {
    let input = body.querySelector('input[type="file"]')
      , teamName = body.querySelector('.team-name input')
      , teamInfo = body.querySelector('.team-info textarea');

    let formData = new FormData();
    formData.append('logo', input.files[0]);
    formData.append('name', teamName.value);
    formData.append('info', teamInfo.value);

    Async.post({
      url: '../Team/Update',
      data: formData,
      successMessage: 'Your changes have been saved',
      onDone: data => {
        data = JSON.parse(data);
        hImage.src = data.LogoURL;
        hName.innerHTML = data.Name;
        hInfo.innerHTML = data.Info;
      }
    })
  }
  if(Utils.hasClass(e.target, 'delete-team')) {
    main.notify('working');
    $.ajax({
      url: '../Team/Delete',
      method: 'POST'
    }).done(data => {
      main.notify('success', 'Your team has been successfuly deleted');

      setTimeout(() => {
        window.location = data.redirectUrl;
      }, 5000);
    }).fail(() => {
      main.notify('error', 'Something went terribly wrong. Sorry...');
    });
  }
  if(Utils.hasClass(e.target, 'add-members-team')) {
    let removeMembers = body.querySelector('.remove-members ul')
      , added = body.querySelector('.' + SEQUENTIAL_ADD.ELEMENTS)
      , addedItems = added.querySelectorAll('.' + SEQUENTIAL_ADD.ITEM_ADDED)
      , emails = Utils.uniqueEmails(addedItems)
      , formData = new FormData();

    if(!emails.length)
      return main.notify('warning', 'Are you really trying to add new members, without actually adding new members?');

    formData.append('emails', emails.join(','));
    Async.post({
      url: '../Team/AddMembers',
      data: formData,
      successMessage: 'The new members have been successfuly added',
      onDone: data => {
        added.innerHTML = '';
        data = JSON.parse(data);
        removeMembers.innerHTML = '';

        data.forEach(member => {
          removeMembers.innerHTML +=
          `<li>
            <div>
              <div>${member.FullName}</div>
              <div class="user-email">${member.Email}</div>
            </div>
            <div><button type="button" class="remove-member"></button></div>
          </li>`
        })
      }
    });
  }
  if(Utils.hasClass(e.target, 'remove-members-team')) {
    let removeMembers = body.querySelector('.remove-members ul')
      , forRemoval = removeMembers.querySelectorAll('.for-removal')
      , emails = Utils.uniqueEmails(forRemoval)
      , formData = new FormData();

    if(!emails.length)
      return main.notify('warning', 'Are you really trying to add new members, without actually adding new members?');

    formData.append('emails', emails.join(','));
    Async.post({
      url: '../Team/RemoveMembers',
      data: formData,
      successMessage: 'The selected members have been remove from your team',
      onDone: () => {
        [].forEach.call(forRemoval, element => {
          Alter.unmount(element);
        });
        
        if(!removeMembers.firstElementChild)
          removeMembers.innerHTML = '<li class="no-members">There are currently no other members in your team to remove</li>';
      }
    });
  }   
  if(Utils.hasClass(e.target, 'view-all-members'))
    selectTab(membersTab);
};

nav.addEventListener('click', e => {
  e.preventDefault();
  selectTab(e.target);
});

window.addEventListener('scroll', () => {
  let navPosition = nav.getBoundingClientRect().top;

  if(navPosition < 0) {
    triggeredOn = window.scrollY;
    nav.style.position = 'fixed';
    nav.style.top = 0;
    Alter.after(placeholder, nav);
    mounted = true;
  } else if(navPosition === 0) {
    if(window.scrollY <= triggeredOn) {
      nav.style.position = 'relative';
      nav.style.top = 'auto';
      mounted && Alter.unmount(placeholder);
      mounted = false;
    }
  }
});

