import Alter from "./core/Alter";
import Utils from "./core/Utils";
import Traversal from "./core/Traversal";
import Event from "./core/Event";
import Modal from "./components/Modal";

let composer = document.querySelector('.post-composer')
  , textbox = composer.querySelector('textarea')
  , manager = textbox.nextElementSibling
  , createPost = composer.querySelector('.post-btn')
  , uploadHolder = composer.querySelector('.post-composer__uploader')
  , uploaded = uploadHolder.querySelector('.post-composer__uploader__uploaded')
  , uploader = uploadHolder.querySelector('.post-composer__uploader__upload')
  , input = uploader.querySelector('input')
  , uniqueId = 0
  , uploads = []
  , actions
  , mouseDown = false
  , postsPresenter = document.querySelector('.posts-presenter')
  , loadPosts = document.querySelector('.dashboard-section--post-presenter .load-posts')
  , editModal = new Modal({
      title: 'Edit post',
      buttons: {
        Save: () => {
          // ajax handler for editing an existing post
        }
      }
    });

const actionsMenu = Utils.createElement('div', {
  className: 'post-actions-menu',
  innerHTML: `<ul><li><button class="post-actions-menu__action">Edit</button></li><li><button class="post-actions-menu__action">Delete</button></li></ul>`
});

function close(e) {
  let parent = Traversal.parents(e.target, '.post-composer');
  
  if(parent === null && !Utils.hasClass(e.target, 'remove-image')) {
    Utils.css(textbox, {
      height: 'auto',
      overflow: 'hidden'
    });
    Utils.removeClass(manager, 'post-composer__manager--slide');
    document.removeEventListener('click', close);
  } 
}

function autoresize(e) {
  let target = e.target;

  target.style.height = window.getComputedStyle(target).minHeight;
  target.style.height = target.scrollHeight + target.offsetHeight - target.clientHeight + 'px';
}

function showComments(action, display, fetch) {
  let postContent = Traversal.parents(action, '.posts-presenter__post__content')
    , comments = postContent.nextElementSibling
    , commentsPresenter = comments.querySelector('.comment-presenter');

  if(commentsPresenter.getAttribute('data-acursor') === '' && fetch) {
    let commentLoader = comments.querySelector('.loadmore');
    
    if(commentLoader)
      commentLoader.click();
  }

  if(display === true) comments.style.display = 'block';
  else if(display === 'auto') comments.style.display = window.getComputedStyle(comments).display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  Event.trigger(loadPosts, 'click');
}, false);

textbox.addEventListener('input', () => {
  Utils.css(textbox, {
    height: 'auto',
    overflow: 'auto'
  });
  textbox.style.height = textbox.scrollHeight + textbox.offsetHeight - textbox.clientHeight + 'px';
});

textbox.addEventListener('focus', () => {
  Event.trigger(textbox, 'input');
  Utils.addClass(manager, 'post-composer__manager--slide');
  document.addEventListener('click', close);
});

input.addEventListener('change', () => {
  [].forEach.call(input.files, file => {
    let image = Utils.createElement('img');

    if(new RegExp(/^image\/(jpeg|png|tiff)$/).test(file.type)) {
      let reader = new FileReader();
      
      reader.onload = e => 
        image.src = e.target.result;
      
      reader.readAsDataURL(file);
    
      let imageHolder = Utils.createElement('div', { id: `image-${uniqueId++}`, className: 'post-composer__uploader__image' })
        , close = Utils.createElement('button', { className: 'remove-image' })
        , f = {
          id: imageHolder.id,
          file: file
        };

      uploads.push(f);
      
      imageHolder.appendChild(close);
      imageHolder.appendChild(image);
      Alter.before(imageHolder, uploader);
    }
  });
  
  input.value = '';
  
  let scrollW = uploadHolder.scrollWidth
    , clientW = uploadHolder.clientWidth;

  if(scrollW > clientW)
    uploadHolder.scrollLeft = scrollW - clientW;
});

uploadHolder.addEventListener('click', e => {
  let action = e.target;

  if (Utils.hasClass(action, 'remove-image')) {
    let parent = action.parentNode;
    uploads = uploads.filter(file => file.id !== parent.id);
    Alter.unmount(parent);
  }
});

createPost.addEventListener('click', () => {
  if(textbox.value.trim() !== '' || uploads.length !== 0) {
    let formData = new FormData();
    formData.append('message', textbox.value);

    for(var i = 0; i < uploads.length; i++)
      formData.append(`image-${i}`, uploads[i].file);

    $.ajax({
      url: '/Post/Create',
      method: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      mimeType: 'multipart/form-data'
    }).done(data => {
      let template = document.createElement('template');
      data = data.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = data;
      Alter.prepend(template.content.firstChild, postsPresenter);
      
      let uploadedImages = Array.from(uploaded.children);
      uploadedImages
        .filter(e => Utils.hasClass(e, 'post-composer__uploader__image'))
        .forEach(e => Alter.unmount(e));

      uploads.length = 0;
      textbox.value = '';

      Utils.css(textbox, {
        height: 'auto',
        overflow: 'hidden'
      });
      Utils.removeClass(manager, 'post-composer__manager--slide');
      document.removeEventListener('click', close);
    });
  }
});

loadPosts.addEventListener('click', e => {
  $.ajax({
    url: '/Post/GetPosts',
    dataType: 'json',
    data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')
  }).done(data => {
    if (data.cursors.after === '')
      Alter.unmount(loadPosts);

    postsPresenter.setAttribute('data-acursor', data.cursors.after);
    postsPresenter.innerHTML += data.posts;
  });
});

postsPresenter.addEventListener('mousedown', e => {
  if(Utils.hasClass(e.target, 'post-comment'))
    mouseDown = true;
  else if(Utils.hasClass(e.target, 'post-actions-menu') || Traversal.parents(e.target, '.post-actions-menu'))
    mouseDown = true;
  else if(Utils.hasClass(e.target, 'post-actions'))
    if(e.target.nextElementSibling === actionsMenu) {
      e.preventDefault();
      e.target.blur();
    } 
});

postsPresenter.addEventListener('focusin', e => {
  switch(e.target.className) {
    case 'comment-textbox':
      e.target.parentNode.nextElementSibling.style.display = 'block';
      e.target.addEventListener('input', autoresize);
      break;
    case 'post-actions':
      e.target.parentNode.appendChild(actionsMenu);
      break;
  }  
});

postsPresenter.addEventListener('focusout', e => {
  if(!mouseDown) {
    switch(e.target.className) {
      case 'comment-textbox':
        e.target.parentNode.nextElementSibling.style.display = 'none';
        e.target.removeEventListener('input', autoresize);
        break;
      case 'post-actions':
        Alter.unmount(actionsMenu);
        break;
    }
  }

  mouseDown = false;
});

postsPresenter.addEventListener('click', e => {
  let action = e.target
    , post
    , commentsPresenter
    , formData
    , textarea = Utils.createElement('textarea');

  switch(action.innerHTML) {
    case 'Delete':
      post = Traversal.parents(action, '.posts-presenter__post');

      $.ajax({
        url: '/Post/DeletePost',
        method: 'DELETE',
        data: 'post_id=' + post.getAttribute('data-postid')
      }).done(() => {
        Alter.unmount(post);
      });
      break;
    case 'Edit':
      post = Traversal.parents(action, '.posts-presenter__post');
      textarea.value = post.querySelector('.content__post').innerHTML;
      
      editModal.setContent(textarea);
      editModal.open();
      textarea.focus();
      break;
  }

  switch(action.className) {
    case 'show-comments':
      showComments(action, 'auto', true);
      break;

    case 'loadmore':
      let post = Traversal.parents(action, '.posts-presenter__post');
      let postId = post.getAttribute('data-postid');
      commentsPresenter = Traversal.prev(action, '.comment-presenter');

      $.ajax({
        url: '/Post/GetComments',
        dataType: 'json',
        data: 'post_id=' + postId + '&after_cursor=' + commentsPresenter.getAttribute('data-acursor')
      }).done(data => {
        if(data.cursors.after === '')
          Alter.unmount(action);

        commentsPresenter.innerHTML += data.comments;
        commentsPresenter.setAttribute('data-acursor', data.cursors.after);
      });
      break;
    case 'post-actions-menu__action':
      Alter.unmount(actionsMenu);
      mouseDown = false;
      break;
  }

  if(Utils.hasClass(action, 'post-comment')) {
    let commentComposer = action.parentNode.previousElementSibling.querySelector('#comment-composer')
      , commentValue = commentComposer.value.trim();

    post = Traversal.parents(action, '.posts-presenter__post');
    commentsPresenter = post.querySelector('.comment-presenter');

    formData = new FormData();
    formData.append('message', commentValue);
    formData.append('post_id', post.getAttribute('data-postid'));

    if(commentComposer.value !== '') {
      $.ajax({
        url: '/Post/CreateComment',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        mimeType: 'multipart/form-data'
      }).done(data => {
        let temp = Utils.createElement('div', { innerHTML: data });
        
        if(commentsPresenter.getAttribute('data-acursor') !== '')
          Alter.prepend(temp.firstElementChild, commentsPresenter);
        showComments(action, true, true);
        
        commentComposer.value = '';
        action.parentNode.style.display = 'none';
      });
    } else action.parentNode.style.display = 'none';
  }
});