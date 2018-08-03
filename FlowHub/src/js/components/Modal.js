import Alter from '../core/Alter';
import Utils from '../core/Utils';
import Traversal from '../core/Traversal';
import Component from '../components/Component';
import { MODAL } from '../helpers/common';

let zIndex = 100;

class Modal extends Component {
  constructor(settings, preventOriginal) {
    super(settings);

    this._component = Utils.createElement('div', {
      className: MODAL.CONTAINER + (this._settings.customClass ? ' ' + this._settings.customClass : ''),
      innerHTML: '<div class="' + MODAL.CONTENT_CONTAINER + '">'
               +  '<div class="' + MODAL.CONTENT_PLACEHOLDER + ' ">'
               +    '<div class="' + MODAL.CONTENT + '">'
               +      '<div class="' + MODAL.HEADER + '">'
               +        this._settings.title
               +      '</div>'
               +      '<div class="' + MODAL.BODY + '">'
               +      '</div>'
               +      '<div class="' + MODAL.FOOTER + '">'
               +      '</div>'
               +    '</div>'   
               +  '</div>'
               + '</div>' 
    }, {
      zIndex: zIndex++,
      visibility: 'hidden'
    });
    this.opened = false;
    this._initialized = false;
    this._openWhenReady = false;

    if(!preventOriginal) {
      console.log(preventOriginal);
      console.log('pero');
      let body = this._component.querySelector('.' + MODAL.BODY);

      if(Utils.isFunction(this._settings.body.content)) {
        this._settings.body.async
          ? this._settings.body.content(body, this)
          : this._settings.body.content(body); 
      } else { 
        this._settings.body.isRaw || this._settings.body.isRaw === 'undefined'
          ? body.innerHTML = this._settings.body.content
          : body.appendChild(this._settings.body.content); 

        this.init();
      }
    }
  }

  open() {
    if(this.opened)
      return;

    if(!this._initialized) {
      console.log('pero');
      this._openWhenReady = true;
      return;
    }
    
    this._settings.beforeOpen
      && this._settings.beforeOpen(this);

    this._component.style.visibility === 'hidden' 
      ? this._component.style.visibility = 'visible'
      : Alter.prepend(this._component, document.body);
    document.body.style.overflow = 'hidden';
    this.opened = true;
  }

  close() {
    if(!this.opened)
      return;

    this._settings.beforeClose(this);

    Alter.unmount(this._component);
    document.body.style.overflow = 'auto';
    this.opened = false;
  }

  toTop() {
    this._component.style.zIndex = ++zIndex;
  }

  _init() {
    let content = this._component.querySelector('.' + MODAL.CONTENT)
      , body = this._component.querySelector('.' + MODAL.BODY)
      , footer = Traversal.next(body, '.' + MODAL.FOOTER)
      , close = Utils.createElement('button', { 
          className: MODAL.CLOSE
        });
  
    if(this._settings.outsideWillClose || this._settings.outsideWillClose === undefined) {
      this._component.querySelector('.' + MODAL.CONTENT_PLACEHOLDER)
      .addEventListener('click', () => {
        this.close();
      });
      
      content.addEventListener('click', e => {
        e.stopPropagation();
      });
    }
    
    if(this._settings.closeButton === undefined || this._settings.closeButton) { // has close button, by default
      Alter.prepend(close, content);
  
      close.addEventListener('click', () => {
        this.close();
      });
    }
  
    if(this._settings.buttons !== undefined || JSON.stringify(this._settings.buttons) !== JSON.stringify({})) {
      let fragment = document.createDocumentFragment()
      for(let key in this._settings.buttons) {
        let button = Utils.createElement('button', {
          innerHTML: key,
          className: 'btn' + (this._settings.buttons[key].customClass ? ' ' + this._settings.buttons[key].customClass : '')
        });

        button.addEventListener('click', () => {
          this._settings.buttons[key].handler(this);
        });
  
        fragment.appendChild(button);
      };

      footer.appendChild(fragment);
    } 
  
    Alter.prepend(this._component, document.body);
  
    let header = Traversal.prev(body, '.' + MODAL.HEADER)
      , headerCSS = window.getComputedStyle(header)
      , footerCSS = window.getComputedStyle(footer)
      , footerHeight = footer.offsetHeight 
        + parseInt(footerCSS.marginTop) 
        + parseInt(footerCSS.marginBottom)
      , headerHeight = header.offsetHeight 
        + parseInt(headerCSS.marginTop) 
        + parseInt(headerCSS.marginBottom);
    
    body.style.height = 
      content.offsetHeight - footerHeight - headerHeight + 'px';

    this._initialized = true;
    if(this._openWhenReady)
      this.open();
  }

  dispose() {
    super.dispose();

    this._component = null;
    this.opened = false;
  }
}

export default Modal;