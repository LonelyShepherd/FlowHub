import Alter from "./core/Alter";
import Utils from "./core/Utils";
import Traversal from "./core/Traversal";


let composer = document.querySelector('.post-composer')
    , postContent = composer.querySelector('textarea')
    , createPost = composer.querySelector('.post-btn')
    , uploadHolder = composer.querySelector('.post-composer__content__uploader')
    , uploader = uploadHolder.querySelector('.post-composer__content__uploader--upload')
    , input = uploader.querySelector('input')
    , uniqueId = 0
    , uploads = []
    , actions
    , postsPresenter = document.querySelector('.posts-presenter')
    , loadPosts = document.querySelector('.dashboard-section--post-presenter .load-posts');

document.addEventListener('DOMContentLoaded', function () {
    loadPosts.click();
}, false);

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


createPost.addEventListener('click', () => {
    if (postContent.value !== '' || uploads.length !== 0) {
        var formData = new FormData();
        formData.append('message', postContent.value);

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
            uploadedImages.filter(e => Utils.hasClass(e, 'post-composer__content__uploader--image')).forEach(e => Alter.unmount(e));
            uploads.length = 0;
            postContent.value = '';
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
    console.log(action);
    //switch (action.innerHTML) {
    //    case 'Comment':
    //        let post = Traversal.parents(action, '.posts-presenter__post');

    //        post.querySelector('.posts-presenter__post__comments').style.display = 'block';
    //        break;

    //}

    switch (action.className) {
        case 'show-commentos':
            let postContent = Traversal.parents(action, 'posts-presenter__post__content');
            console.log(postContent);
            let commentsPresenter = Traversal.next(postContent, 'posts-presenter__post__comments');
            console.log(commentsPresenter);
            break;

        case 'post-comment':

            break;
    }
});