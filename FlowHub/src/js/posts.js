import Alter from "./core/Alter";
import Utils from "./core/Utils";
import Traversal from "./core/Traversal";
import Event from "./core/Event";

let composer = document.querySelector('.post-composer')
  , textbox = composer.querySelector('textarea')
  , manager = textbox.nextElementSibling
  , createPost = composer.querySelector('.post-btn')
  , uploadHolder = composer.querySelector('.post-composer__uploader')
  , uploader = uploadHolder.querySelector('.post-composer__uploader__upload')
  , input = uploader.querySelector('input')
  , uniqueId = 0
  , uploads = []
  , actions
  , postsPresenter = document.querySelector('.posts-presenter')
  , loadPosts = document.querySelector('.dashboard-section--post-presenter .load-posts');

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

document.addEventListener('DOMContentLoaded', () => {
  loadPosts.click();
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
  let image = Utils.createElement('img');
  let successful = Utils.URLToImage(input, image);

  if (!successful) {
    console.log('failed');
    input.value = '';
    return;
  }

  let imageHolder = Utils.createElement('div', { id: `image-${uniqueId++}`, className: 'post-composer__uploader__image' })
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
    console.log(uploads);
    Alter.unmount(parent);
  }
});

createPost.addEventListener('click', () => {
  if (textbox.value !== '' || uploads.length !== 0) {
    var formData = new FormData();
    formData.append('message', textbox.value);

    for (var i = 0; i < uploads.length; i++) {
      formData.append(`image-${i}`, uploads[i].file);
    }

    console.log(formData);
    $.ajax({
      url: '/Post/Create',
      method: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      mimeType: 'multipart/form-data'
    }).done(data => {
      console.log(data);
      var template = document.createElement('template');
      data = data.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = data;
      Alter.prepend(template.content.firstChild, postsPresenter);
      let uploadedImages = Array.from(uploadHolder.children);
      uploadedImages.filter(e => Utils.hasClass(e, 'post-composer__uploader__image')).forEach(e => Alter.unmount(e));
      uploads.length = 0;
      textbox.value = '';
    });
  }
});

loadPosts.addEventListener('click', e => {
  $.ajax({
    url: '/Post/GetPosts',
    dataType: 'json',
    data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')
  }).done(data => {
    console.log(data.cursors.after);
    if (data.cursors.after === '') {
      Alter.unmount(loadPosts);
      // Say sth
    }

    postsPresenter.setAttribute('data-acursor', data.cursors.after);
    postsPresenter.innerHTML += data.posts;
  });
});

//loadPosts.addEventListener('click', e => {
//    $.ajax({
//        url: '/Post/GetComments'
//        //dataType: 'json',
//        //data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')
//    }).done(data => {

//        console.log(data);
//    });
//});

postsPresenter.addEventListener('click', e => {
  let action = e.target;

  switch (action.innerHTML) {
    case 'Delete':
      let post = Traversal.parents(action, '.posts-presenter__post');
      $.ajax({
          url: '/Post/DeletePost',
          method: 'GET',
          data: 'post_id=' + post.getAttribute('data-postid')
      }).done(data => {
          Alter.unmount(post);
      });
      break;
  }

  switch (action.className) {
    case 'show-commentos':
      let textbox = Traversal.parents(action, '.posts-presenter__post__content');
      let comments = Traversal.next(textbox, '.posts-presenter__post__comments');
      let commentsPresenter = comments.querySelector('.comment-presenter');
      if (commentsPresenter.getAttribute('data-acursor') === '') {
        var commentLoader = comments.querySelector('.loadmore');
        if (commentLoader)
          commentLoader.click();
      }
      comments.style.display = window.getComputedStyle(comments).display === 'none' ? 'block' : 'none';
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
        console.log(data.cursors.after);
        if (data.cursors.after === '') {
          Alter.unmount(action);
          //action.style.display = 'none';
          // Say sth
        }

        commentsPresenter.innerHTML += data.comments;
        commentsPresenter.setAttribute('data-acursor', data.cursors.after);
        //console.log(data.cursors);
      });

      break;

    case 'post-comment':
      let commentInput = Traversal.parents(action, '.comment-input').querySelector('#comment-composer');
      post = Traversal.parents(action, '.posts-presenter__post');
      commentsPresenter = post.querySelector('.comment-presenter');
      var formData = new FormData();
      formData.append('message', commentInput.value);
      formData.append('post_id', post.getAttribute('data-postid'));
      if (commentInput !== '') {
        $.ajax({
          url: '/Post/CreateComment',
          method: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          mimeType: 'multipart/form-data'
        }).done(data => {
          //var template = document.createElement('template');
          //data = data.trim(); // Never return a text node of whitespace as the result
          //template.innerHTML = data;
          //Alter.prepend(template.content.firstChild, commentsPresenter);
          commentsPresenter.innerHTML = data + commentsPresenter.innerHTML;
          commentInput.value = '';
        });
      }
      break;
  }
});