import Async from './core/Async';
import Component from './components/Component';
import Utils from './core/Utils';

let form = document.querySelector('#update-info')
  , avatar = document.querySelector('.user-avatar')
  , input = avatar.querySelector('input')
  , image = avatar.querySelector('img')
  , notifier = Component.notify
  , file = null;

input.addEventListener('input', () => {
  let successful = Utils.URLToImage(input, image);

  if(!successful) {
    notifier('warning', 'You are trying to upload image which file format we don\'t support. Only supported formats are .png, .jpeg and .tiff');
    input.value = '';
    file = null;
  } else file = input.files[0];
});

form.addEventListener('submit', e => {
  e.preventDefault();

  if($(form).valid()) {
    let formData = new FormData(form);
    file && formData.append('avatar', file);
    
    Async.post({
      url: '/Manage/Update',
      data: formData,
      successMessage: 'Your account have been updated successfuly'
    });
  }

  return false;
});