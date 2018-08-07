import Alter from "./core/Alter";
import Utils from "./core/Utils";
import Traversal from "./core/Traversal";


let composer = document.querySelector('.post-composer')
    , send = composer.querySelector('.post-btn')
    , uploadHolder = composer.querySelector('.post-composer__content__uploader')
    , uploader = uploadHolder.querySelector('.post-composer__content__uploader--upload')
    , input = uploader.querySelector('input')
    , uniqueId = 0
    , uploads = []
    , actions;

input.addEventListener('change', e => {
    let image = Utils.createElement('img');
    let successful = Utils.URLToImage(input, image);
    
    if(!successful) {
      console.log('failed');
      input.value = '';
      return;
    }

    let imageHolder = Utils.createElement('div', { id: `image-${uniqueId++}`, className: 'post-composer__content__uploader--image' })
        , close = Utils.createElement('button', { className: 'remove-image' })
        , file = {
            id: imageHolder.id, 
            file: input.files[0]
        };
    uploads.push(file);
    console.log(uploads);
    imageHolder.appendChild(close);
    imageHolder.appendChild(image);
    Alter.before(imageHolder, uploader);
    input.value = '';
});

uploadHolder.addEventListener('click', e => {
    let action = e.target;

    if(Utils.hasClass(action, 'remove-image')) {
        let parent = action.parentNode;
        uploads = uploads.filter(file => file.id !== parent.id);
        console.log(uploads);
        Alter.unmount(parent);
    }
});

