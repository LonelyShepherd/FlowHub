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
  , galleryOverlay = Utils.createElement('div', { className: 'gallery-overlay' })
  , galleryPhoto = Utils.createElement('img', { className: 'gallery-photo' })
  , galleryContainer = Utils.createElement('div', { className: 'gallery-container' })
  , galleryPrev = Utils.createElement('button', { className: 'gallery-container__prev' })
  , galleryNext = Utils.createElement('button', { className: 'gallery-container__next' })
  , cloned = uploadHolder.cloneNode(true)
  , uniqueId = 0
  , uploads = []
  , edits = []
  , actions
  , mouseDown = false
  , load = true
  , postsPresenter = document.querySelector('.posts-presenter')
  , editModal = new Modal({
    title: 'Edit post',
    buttons: {
      Save: () => {
        // ajax handler for editing an existing post
      }
    }
  });

cloned.querySelector('input').addEventListener('change', display);
cloned.addEventListener('click', e => {
  if(e.target.className === 'remove-image') {
    edits = edits.filter(file => e.target.parentNode.id !== file.id);
    Alter.unmount(e.target.parentNode);
  }
})

const actionsMenu = Utils.createElement('div', {
  className: 'post-actions-menu',
  innerHTML: `<ul><li><button class="post-actions-menu__action">Edit</button></li><li><button class="post-actions-menu__action">Delete</button></li></ul>`
});

function close(e) {
  let parent = Traversal.parents(e.target, '.post-composer');

  if (parent === null && !Utils.hasClass(e.target, 'remove-image')) {
    Utils.css(textbox, {
      height: 'auto',
      overflow: 'hidden'
    });
    Utils.removeClass(manager, 'post-composer__manager--slide');
    document.removeEventListener('click', close);
  }
}

function loadPosts() {
  if (postsPresenter.getAttribute('data-acursor') === '' && !load)
    return;

  $.ajax({
    url: '/Post/GetPosts',
    dataType: 'json',
    data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')
  }).done(data => {
    postsPresenter.setAttribute('data-acursor', data.cursors.after);
    postsPresenter.innerHTML += data.posts;
  });

  load = false;
}

function autoresize(e) {
  let target = e.target;

  target.style.height = window.getComputedStyle(target).minHeight;
  target.style.height = target.scrollHeight + target.offsetHeight - target.clientHeight + 'px';
}

function showComments(action, display) {
  let postContent = Traversal.parents(action, '.posts-presenter__post__content')
    , comments = postContent.nextElementSibling
    , commentsPresenter = comments.querySelector('.comment-presenter');

  if (commentsPresenter.getAttribute('data-acursor') === '') {
    let commentLoader = comments.querySelector('.loadmore');

    if (commentLoader)
      commentLoader.click();
  }

  if (display === true) comments.style.display = 'block';
  else if (display === 'auto') comments.style.display = window.getComputedStyle(comments).display === 'none' ? 'block' : 'none';
}

function display(e) {
  [].forEach.call(e.target.files, file => {
    let image = Utils.createElement('img');

    if (new RegExp(/^image\/(jpeg|png|tiff)$/).test(file.type)) {
      let reader = new FileReader();

      reader.onload = m =>
        image.src = m.target.result;

      reader.readAsDataURL(file);

      let imageHolder = Utils.createElement('div', { id: `image-${uniqueId++}`, className: 'post-composer__uploader__image' })
        , close = Utils.createElement('button', { className: 'remove-image' })
        , f = {
          id: imageHolder.id,
          file: file
        };

      Traversal.parents(e.target, '.js-modal__body') ? edits.push(f) : uploads.push(f);
      imageHolder.appendChild(close);
      imageHolder.appendChild(image);
      Alter.before(imageHolder, e.target.parentNode);
    }
  });

  e.target.value = '';

  let u = e.target.parentNode.parentNode.parentNode;

  let scrollW = u.scrollWidth
    , clientW = u.clientWidth;

  if (scrollW > clientW)
    u.scrollLeft = scrollW - clientW;
}

let current;

galleryContainer.appendChild(galleryPrev);
galleryContainer.appendChild(galleryNext);

document.addEventListener('click', e => {
  if (e.target.getAttribute('data-item') === 'gallery') {
    document.body.style.overflow = 'hidden';
    current = e.target.parentNode;

    galleryPrev.style.opacity = '1';
    galleryNext.style.opacity = '1';
    if (!current.nextElementSibling) galleryNext.style.opacity = '.5';
    if (!current.previousElementSibling) galleryPrev.style.opacity = '.5';

    galleryPhoto.src = current.getAttribute('data-photo');
    galleryContainer.appendChild(galleryPhoto);

    Alter.prepend(galleryContainer, document.body);
    Alter.prepend(galleryOverlay, document.body);
  } else if (Utils.hasClass(e.target, 'gallery-overlay')) {
    Alter.unmount(galleryContainer);
    Alter.unmount(galleryOverlay);
    document.body.style.overflow = '';
  } else if (Utils.hasClass(e.target, 'gallery-container__prev')) {
    galleryPrev.style.opacity = '1';
    if (current === current.parentNode.children[1]) galleryPrev.style.opacity = '.5'
    current = current.previousElementSibling ? current.previousElementSibling : (galleryPrev.style.opacity = '.5', current);
    if (current.nextElementSibling) galleryNext.style.opacity = '1';

    galleryPhoto.src = current.getAttribute('data-photo');
  } else if (Utils.hasClass(e.target, 'gallery-container__next')) {
    galleryNext.style.opacity = '1';
    if (current === current.parentNode.children[current.parentNode.children.length - 2]) galleryNext.style.opacity = '.5'
    current = current.nextElementSibling ? current.nextElementSibling : (galleryNext.style.opacity = '.5', current);
    if (current.previousElementSibling) galleryPrev.style.opacity = '1';

    galleryPhoto.src = current.getAttribute('data-photo');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
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

input.addEventListener('change', display);

uploadHolder.addEventListener('click', e => {
  let action = e.target;

  if (Utils.hasClass(action, 'remove-image')) {
    let parent = action.parentNode;
    uploads = uploads.filter(file => file.id !== parent.id);
    Alter.unmount(parent);
  }
});

createPost.addEventListener('click', () => {
  if (textbox.value.trim() !== '' || uploads.length !== 0) {
    let formData = new FormData();
    formData.append('message', textbox.value);

    for (var i = 0; i < uploads.length; i++)
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

window.addEventListener('scroll', () => {
  if (document.documentElement.offsetHeight === window.scrollY + window.innerHeight)
    loadPosts();
});

postsPresenter.addEventListener('mousedown', e => {
  if (Utils.hasClass(e.target, 'post-comment'))
    mouseDown = true;
  else if (Utils.hasClass(e.target, 'post-actions-menu') || Traversal.parents(e.target, '.post-actions-menu'))
    mouseDown = true;
  else if (Utils.hasClass(e.target, 'post-actions'))
    if (e.target.nextElementSibling === actionsMenu) {
      e.preventDefault();
      e.target.blur();
    }
});

postsPresenter.addEventListener('focusin', e => {
  switch (e.target.className) {
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
  if (!mouseDown) {
    switch (e.target.className) {
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

  switch (action.innerHTML) {
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
      let photos = post.querySelector('.content__photos');

      let fragment = document.createDocumentFragment()
        , uploader;

      textarea.value = post.querySelector('.content__post').innerHTML;

      fragment.appendChild(textarea);

      if (photos) {
        edits.length = 0;

        uploader = cloned.querySelector('.post-composer__uploader__upload');

        [].forEach.call(uploader.parentNode.querySelectorAll('.post-composer__uploader__image'), item => Alter.unmount(item));

        [].forEach.call(photos.children, photo => {
          let container = Utils.createElement('div', {
            className: 'post-composer__uploader__image',
            innerHTML: photo.innerHTML
          });

          let remove = container.querySelector('button');
          remove.className = 'remove-image';
          remove.innerHTML = '';
          remove.removeAttribute('data-item');

          Alter.before(container, uploader);
        });

        textarea.style.height = '110px';
        fragment.appendChild(cloned);
      }

      editModal.setContent(fragment);
      editModal.open();
      textarea.focus();

      let sw = uploader.parentNode.parentNode.scrollWidth
        , cw = uploader.parentNode.parentNode.clientWidth;
          
      if(sw > cw)
        uploader.parentNode.parentNode.scrollLeft = sw - cw;

      break;
  }

  switch (action.className) {
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
        if (data.cursors.after === '')
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

  if (Utils.hasClass(action, 'post-comment')) {
    let commentComposer = action.parentNode.previousElementSibling.querySelector('#comment-composer')
      , commentValue = commentComposer.value.trim();

    post = Traversal.parents(action, '.posts-presenter__post');
    commentsPresenter = post.querySelector('.comment-presenter');

    formData = new FormData();
    formData.append('message', commentValue);
    formData.append('post_id', post.getAttribute('data-postid'));

    if (commentComposer.value !== '') {
      $.ajax({
        url: '/Post/CreateComment',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        mimeType: 'multipart/form-data'
      }).done(data => {
        let temp = Utils.createElement('div', { innerHTML: data });

        commentsPresenter.getAttribute('data-acursor') !== ''
          ? (Alter.prepend(temp.firstElementChild, commentsPresenter), commentsPresenter.parentNode.style.display = 'block')
          : showComments(action, true, true);

        commentComposer.value = '';
        action.parentNode.style.display = 'none';
      });
    } else action.parentNode.style.display = 'none';
  }
});