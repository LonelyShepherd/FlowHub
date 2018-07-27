import Alter from '../core/Alter';
import Utils from '../core/Utils';

class Modal {
  constructor(content, options) {
    this.content = content;
    this.options = options;
    this.opened = false;
    this.modal = undefined;
    this.modalOverlay = undefined;
    this.modalClose = undefined;
  }

  getModal() {
    return this.modal;
  }

  configure(fn) {
    fn(this.content, this.options);
  }

  open() {
    if(this.opened)
      return;

    this.modal.style.visibility = 'visible';
    this.opened = true;
  }

  close() {
    if(!this.opened)
      return;

    Alter.unmount(this.modal);
    this.opened = false;
  }

  attachEvents() {
    this.modalOverlay.addEventListener('click', () => {
      this.close();
    });

    this.modalClose.addEventListener('click', () => {
      this.close();
    });
  }

  createModal() {
    this.modal = Utils.createElement('div', {
      className: 'fh-modal' + (this.options.customClass ? ' ' + this.options.customClass : '')
    }, { visibility: 'hidden' });
    Alter.prepend(this.modal, document.body);

    
    let modalContent;
    let fragment = document.createDocumentFragment();
    
    if(this.options.modalOverlay) {
      this.modalOverlay = Utils.createElement('div', { className: 'fh-modal__overlay' })
      fragment.appendChild(this.modalOverlay);
    }
    
    if(this.content.isBody) {
      modalContent = Utils.createElement('div', {
        className: 'fh-modal__content',
        innerHTML: this.content.html
      });
    } else modalContent = this.content.html;
    modalContent.style = `width: ${this.options.width || 600}px; height: ${this.options.height || 450}px;`;
    
    this.modalClose = Utils.createElement('button', { className: 'fh-modal__close' })
    modalContent.appendChild(this.modalClose);
    
    let modalContentPlaceholder = Utils.createElement('div', { className: 'fh-modal__placeholder' });
    modalContentPlaceholder.appendChild(modalContent);

    fragment.appendChild(modalContentPlaceholder);
    this.modal.appendChild(fragment);    

    let modalContentBody = modalContent.querySelector('.fh-modal__content__body');
    let modalContentHeader = window.getComputedStyle(modalContent.querySelector('.fh-modal__content__header'));
    let modalContentFooter = window.getComputedStyle(modalContent.querySelector('.fh-modal__content__footer'));
    let modalContentFooterH = parseInt(modalContentFooter.height) + parseInt(modalContentFooter.marginTop) + parseInt(modalContentFooter.marginBottom);
    let modalContentHeaderH = parseInt(modalContentHeader.height) + parseInt(modalContentHeader.marginTop) + parseInt(modalContentHeader.marginBottom);

    modalContentBody.style.height = modalContent.offsetHeight - modalContentFooterH - modalContentHeaderH + 'px';
  }

  init() {
    this.createModal();

    this.attachEvents();
  }
}

export default Modal;