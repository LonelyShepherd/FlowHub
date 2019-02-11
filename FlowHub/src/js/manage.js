import Utils from "./core/Utils";
import Alter from "./core/Alter";
import Async from "./core/Async";
import Traversal from "./core/Traversal";
import Component from "./components/Component";
import { SEQUENTIAL_ADD } from "./helpers/common";
import Modal from './components/Modal';
import Event from "./core/Event";

let composer = document.querySelector('.post-composer')
    , role = 'Team'
    , textbox = composer.querySelector('textarea')
    , manager = textbox.nextElementSibling
    , createPost = composer.querySelector('.post-btn')
    , uploadHolder = composer.querySelector('.post-composer__uploader')
    , uploaded = uploadHolder.querySelector('.post-composer__uploader__uploaded')
    , uploader = uploadHolder.querySelector('.post-composer__uploader__upload')
    , input = uploader.querySelector('input')
    , accounts = composer.querySelector('.post-composer__profiles')
    , galleryOverlay = Utils.createElement('div', { className: 'gallery-overlay' })
    , galleryPhoto = Utils.createElement('img', { className: 'gallery-photo' })
    , galleryContainer = Utils.createElement('div', { className: 'gallery-container' })
    , galleryPrev = Utils.createElement('button', { className: 'gallery-container__prev' })
    , galleryNext = Utils.createElement('button', { className: 'gallery-container__next' })
    , textarea = Utils.createElement('textarea')
    , cloned = uploadHolder.cloneNode(true)
    , uniqueId = 0
    , uploads = []
    , edits = []
    , deleted = []
    , allPhotos = []
    , editingPost
    , currentTab = 'all'
    , load = true
    , postsPresenter = document.querySelector('.posts-presenter')
    , editModal = new Modal({
        title: 'Edit post',
        buttons: {
            Save: () => {
                let data = new FormData();
                allPhotos = allPhotos.filter(id => !deleted.includes(id));
                data.append('message', textarea.value);
                data.append('deleted', deleted.join(','));
                for (var i = 0; i < edits.length; i++) {
                    data.append(edits[i].id, edits[i].file);
                }
                data.append('old-photos', allPhotos.join(','));
                data.append('post-id', editingPost.getAttribute('data-postid'));
                data.append('account_type', role);

                main.notify('working');
                $.ajax({
                    url: '/Post/EditPost',
                    method: 'POST',
                    data: data,
                    contentType: false,
                    processData: false,
                    mimeType: 'multipart/form-data'
                }).done(data => {
                    main.notify('success', 'Your post has been successfully edited');

                    editingPost.display = 'none';
                    editingPost.insertAdjacentHTML('afterend', data);
                    Alter.unmount(editingPost);
                }).fail((jqXHR, textStatus, errorThrown) => {
                    main.notify('error', errorThrown);
                });

                deleted.length = edits.length = 0;
                editModal.close();
            }
        }
    });

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

        if (selected === 'overview') {
            body_wrap.style.display = 'block';
            Alter.unmount(settings_wrap);
            load = true;
        }

        if (selected !== 'settings')
            return;

        load = false;
        body_wrap.style.display = 'none';
        settings_wrap.innerHTML = data;
        Alter.before(settings_wrap, body_wrap);

        document.body.appendChild(script);
        loaded = true;
    });
}

function selectTab(trigger) {
    if (trigger.tagName === 'A') {
        Utils.removeClass(active, 'active');
        active = trigger;
        Utils.addClass(active, 'active');

        ajaxHandler(trigger.getAttribute('data-href'));
    }
}

let body = document.querySelector('.team__body')
    , body_wrap = body.querySelector('.team__body__content-wrapper')
    , settings_wrap = Utils.createElement('div', { className: 'settings-wrapper' })
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
    , membersList = document.querySelector('.team-members-list ul');

body.onclick = e => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A')
        return;

    if (Utils.hasClass(e.target, 'update-team')) {
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
    if (Utils.hasClass(e.target, 'delete-team')) {
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
    if (Utils.hasClass(e.target, 'add-members-team')) {
        let removeMembers = body.querySelector('.remove-members ul')
            , added = body.querySelector('.' + SEQUENTIAL_ADD.ELEMENTS)
            , addedItems = added.querySelectorAll('.' + SEQUENTIAL_ADD.ITEM_ADDED)
            , emails = Utils.uniqueEmails(addedItems)
            , formData = new FormData();

        if (!emails.length)
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

                let firstMember = membersList.firstElementChild;
                membersList.innerHTML = '';
                membersList.appendChild(firstMember);

                data.forEach(member => {
                    removeMembers.innerHTML +=
                        `<li>
            <div>
              <img src="/Avatars/${member.Avatar}">
            </div>
            <div>
              <div>${member.FullName}</div>
              <div class="user-email">${member.Email}</div>
            </div>
            <div><button type="button" class="remove-member"></button></div>
          </li>`;

                    membersList.innerHTML +=
                        `<li>
            <img src="/Avatars/${member.Avatar}">
            <span>${member.FullName}</span>
          </li>`;
                });

                Traversal.prev(membersList).innerHTML = `Members &mdash; ${membersList.children.length}`;
            }
        });
    }
    if (Utils.hasClass(e.target, 'remove-members-team')) {
        let removeMembers = body.querySelector('.remove-members ul')
            , forRemoval = removeMembers.querySelectorAll('.for-removal')
            , emails = Utils.uniqueEmails(forRemoval)
            , formData = new FormData();

        if (!emails.length)
            return main.notify('warning', 'We don\'t really know what we\'re supposed to do...');

        formData.append('emails', emails.join(','));
        Async.post({
            url: '../Team/RemoveMembers',
            data: formData,
            successMessage: 'The selected members have been remove from your team',
            onDone: () => {
                [].forEach.call(forRemoval, element => {
                    Alter.unmount(element);
                });
                console.log(removeMembers);

                let firstMember = membersList.firstElementChild
                    , fragment = document.createDocumentFragment();

                membersList.innerHTML = '';
                membersList.appendChild(firstMember);

                [].forEach.call(removeMembers.children, member => {
                    let li = Utils.createElement('li');

                    li.appendChild(member.querySelector('img'));
                    li.appendChild(Utils.createElement('span', {
                        innerHTML: member.querySelector('div > div').innerHTML
                    }));

                    fragment.appendChild(li);
                });

                membersList.appendChild(fragment);
                Traversal.prev(membersList).innerHTML = `Members &mdash; ${membersList.children.length}`;

                if (!removeMembers.firstElementChild)
                    removeMembers.innerHTML = '<li class="no-members">There are currently no other members in your team to remove</li>';
            }
        });
    }
};

nav.addEventListener('click', e => {
    e.preventDefault();
    selectTab(e.target);
});

window.addEventListener('scroll', () => {
    let navPosition = nav.getBoundingClientRect().top;

    if (navPosition < 0) {
        triggeredOn = window.scrollY;
        nav.style.position = 'fixed';
        nav.style.top = 0;
        Alter.after(placeholder, nav);
        mounted = true;
    } else if (navPosition === 0) {
        if (window.scrollY <= triggeredOn) {
            nav.style.position = 'relative';
            nav.style.top = 'auto';
            mounted && Alter.unmount(placeholder);
            mounted = false;
        }
    }
});

cloned.querySelector('input').addEventListener('change', display);
cloned.addEventListener('click', e => {
    if (e.target.className === 'remove-image') {
        edits = edits.filter(file => e.target.parentNode.id !== file.id);
        deleted.push(e.target.nextElementSibling.id);
        Alter.unmount(e.target.parentNode);
    }
});

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
    if ((postsPresenter.getAttribute('data-fbAcursor') === '' &&
        postsPresenter.getAttribute('data-twAcursor') === '') &&
        !load)
        return;

    main.notify('working');
    $.ajax({
        url: '/Post/Get' + role + 'Posts',
        dataType: 'json',
        data: 'tab=' + currentTab + '&fb_after_cursor=' + postsPresenter.getAttribute('data-fbAcursor') + '&twitter_after_cursor=' + postsPresenter.getAttribute('data-twAcursor')
    }).done(data => {
        main.notify('clear');
  
        postsPresenter.setAttribute('data-fbAcursor', data.cursors.fbafter);
        postsPresenter.setAttribute('data-twAcursor', data.cursors.twafter);
        postsPresenter.innerHTML += data.posts;
    }).fail((jqXHR, textStatus, errorThrown) => {
        main.notify('error', errorThrown);
    });

    load = true;
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
    if (textbox.value.trim() === '' && uploads.length === 0)
        return;

    let formData = new FormData();
    formData.append('message', textbox.value);

    for (var i = 0; i < uploads.length; i++)
        formData.append(`image-${i}`, uploads[i].file);

    let selectedAccounts = [];

    Array.from(accounts.querySelectorAll('input[type=checkbox]')).forEach((checkbox) => {
        if (checkbox.checked)
            selectedAccounts.push({
                id: checkbox.getAttribute('data-accountid'),
                type: checkbox.getAttribute('data-accounttype')
            });
    });

    formData.append('accounts', JSON.stringify(selectedAccounts));
    formData.append('account_type', role);

    main.notify('working');
    $.ajax({
        url: '/Post/CreatePost',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        mimeType: 'multipart/form-data'
    }).done(data => {
        main.notify('success', 'You have successfully created a post');
        let temp = Utils.createElement('div', { innerHTML: data.trim() }); // Never return a text node of whitespace as the result

        let fbPost = Array.from(temp.children).find(post => post.getAttribute('data-postType').toLowerCase() === 'facebook');
        let twPost = Array.from(temp.children).find(post => post.getAttribute('data-postType').toLowerCase() === 'twitter');

        if (currentTab === 'all') {
            Alter.prepend(temp, postsPresenter);
        }
        else if (currentTab === 'facebook') {
            Alter.prepend(fbPost, postsPresenter);
        }
        else if (currentTab === 'twitter') {
            Alter.prepend(twPost, postsPresenter);
        }

        //Alter.prepend(template.content.firstChild, postsPresenter);

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
    }).fail((jqXHR, textStatus, errorThrown) => {
        main.notify('error', errorThrown);
    });
});

window.addEventListener('scroll', () => {
    if (document.documentElement.offsetHeight === window.scrollY + window.innerHeight && load)
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
        , formData;

    switch (action.innerHTML) {
        case 'Delete':
            post = Traversal.parents(action, '.posts-presenter__post');
            let postType = post.getAttribute('data-postType')

            main.notify('working');
            $.ajax({
                url: '/Post/Delete' + postType + 'Post',
                method: 'DELETE',
                data: 'post_id=' + post.getAttribute('data-postid') + '&account_type=' + role
            }).done(() => {
                main.notify('success', 'Your have successfully deleted the post');
                Alter.unmount(post);
            }).fail((jqXHR, textStatus, errorThrown) => {
                main.notify('error', errorThrown);
            });
            break;
        case 'Edit':
            post = Traversal.parents(action, '.posts-presenter__post');
            editingPost = post;

            let photos = post.querySelector('.content__photos');

            let fragment = document.createDocumentFragment()
                , uploader;

            textarea.value = post.querySelector('.content__post').innerHTML;

            fragment.appendChild(textarea);
            // Taken out 1
            uploader = cloned.querySelector('.post-composer__uploader__upload');

            [].forEach.call(uploader.parentNode.querySelectorAll('.post-composer__uploader__image'), item => Alter.unmount(item));

            edits.length = deleted.length = allPhotos.length = 0;
            if (photos) {
                [].forEach.call(photos.children, photo => {
                    let currentId = photo.querySelector('a img').getAttribute('id');
                    allPhotos.push(currentId);
                });

                // From here 1

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

                // From here 2
            }
            // Taken out 2
            textarea.style.height = '110px';
            fragment.appendChild(cloned);

            editModal.setContent(fragment);
            editModal.open();
            textarea.focus();

            let sw = uploader.parentNode.parentNode.scrollWidth
                , cw = uploader.parentNode.parentNode.clientWidth;

            if (sw > cw)
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
            let postType = post.getAttribute('data-postType');
            commentsPresenter = Traversal.prev(action, '.comment-presenter');

            main.notify('working');
            $.ajax({
                url: '/Post/Get' + postType + 'Comments',
                dataType: 'json',
                data: 'post_id=' + postId + '&after_cursor=' + commentsPresenter.getAttribute('data-acursor') + '&account_type=' + role
            }).done(data => {
                main.notify('clear');
                if (data.cursors.after === '')
                    Alter.unmount(action);

                commentsPresenter.innerHTML += data.comments;
                commentsPresenter.setAttribute('data-acursor', data.cursors.after);
            }).fail((jqXHR, textStatus, errorThrown) => {
                main.notify('error', errorThrown);
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
        formData.append('account_type', role);
        let postType = post.getAttribute('data-postType');

        if (commentComposer.value !== '') {
            showComments(action, true, true);

            main.notify('working');
            $.ajax({
                url: '/Post/Create' + postType + 'Comment',
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                mimeType: 'multipart/form-data'
            }).done(data => {
                main.notify('success', 'You have successfully commented on the post..');

                let temp = Utils.createElement('div', { innerHTML: data });

                //commentsPresenter.getAttribute('data-acursor') !== ''
                //  ? (Alter.prepend(temp.firstElementChild, commentsPresenter), commentsPresenter.parentNode.style.display = 'block')
                //  : showComments(action, true, true);

                Alter.prepend(temp.firstElementChild, commentsPresenter);

                commentComposer.value = '';
                action.parentNode.style.display = 'none';
            }).fail((jqXHR, textStatus, errorThrown) => {
                main.notify('error', errorThrown);
            });
        } else action.parentNode.style.display = 'none';
    }
});