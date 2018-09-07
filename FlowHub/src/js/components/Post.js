import Alter from '../core/Alter';
import Utils from '../core/Utils';

class Post {
    constructor (postInfo) {
        this.postInfo = postInfo;
        this.post = undefined;
    }

    editPost() {

    }

    deletePost() {

    }

    setContent(content) {
        this.postInfo.content = content;
    }

    createPost() {
        let postPresenter = document.querySelector('.posts-presenter');
        this.post = Utils.createElement('div', { className: 'posts-presenter__post' });
        let postContent = Utils.createElement('div', { className: 'posts-presenter__post__content' });
        postContent.innerHTML = this.postInfo.content;
        this.post.appendChild(postContent);

        let postFooter = Utils.createElement('div', { className: 'posts-presenter__post__footer' });
        let postStatus = Utils.createElement('div', { className: 'post__footer__status', innerHTML: this.postInfo.status } );

        if(this.postInfo.status) {
            postFooter.appendChild(postStatus);
        }

        this.post.appendChild(postFooter);

        let fragment = document.createDocumentFragment();
        fragment.appendChild(this.post);

        Alter.prepend(fragment, postPresenter);

        this.post.className += ' showme';
    }
}

export default Post