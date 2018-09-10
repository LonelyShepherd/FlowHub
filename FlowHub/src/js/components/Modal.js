import Utils from "../core/Utils";
import Alter from "../core/Alter";

let zIndex = 100;

const DEFAULTS = {};

const TEMPLATE = 
`<div class="js-modal" style="z-index: ${zIndex++}">
  <div class="js-modal__header">
  </div>
  <div class="js-modal__body">
  </div>
  <div class="js-modal__footer">
  </div>
</div>`

function Modal(settings) {
  let _options = {...DEFAULTS, ...settings}
    , _modal
    , _body
    , _footer
    , _closeButton
    , _overlay
    , _opened = false
    , _events = [];

  function _init() {
    _create();
    _addEvents();
  }
  
  function _create() {
    _overlay = Utils.createElement('div', { className: 'js-modal-overlay' });
    _closeButton = Utils.createElement('button', { className: 'js-modal__header-close'});

    let generator = Utils.createElement('div', {
      innerHTML: TEMPLATE
    }, {
      visibility: 'hidden'
    });

    _modal = generator.children[0];
    _body = _modal.children[1];
    _footer = _modal.children[2];

    _modal.children[0].appendChild(Utils.createElement('h1', { innerHTML: settings.title }));
    _modal.children[0].appendChild(_closeButton);

    for(let button in settings.buttons)
      _footer.appendChild(Utils.createElement('button', { innerHTML: button }));
  }

  function _footerEvents(e) {
    if(e.target.tagName !== 'BUTTON')
      return;

    for(let button in settings.buttons)
      if(e.target.innerHTML === button)
        settings.buttons[button].call();
  }

  function _addEvents() {
    _events.push({ element: _closeButton, event: 'click', handler: close });
    _events.push({ element: _footer, event: 'click', handler: _footerEvents });
    _events.push({ element: _overlay, event: 'click', handler: close });

    _attachEvents(_events);
  }

  function _attachEvents(ref) {
    ref.forEach(({ element, event, handler }) => {
      element.addEventListener(event, handler);
    });
  }

  function _detachEvents(ref) {
    ref.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    ref.length = 0;
  }

  function _open() {
    if(_opened)
      return;

    let fragment = document.createDocumentFragment();
    fragment.appendChild(_overlay);
    fragment.appendChild(_modal);
    Alter.prepend(fragment, document.body);

    _opened = true;
  }

  function _close() {
    if(!_opened)
      return;

    Alter.unmount(_overlay);
    Alter.unmount(_modal);

    _opened = false;
  }

  function open() {
    _open();
  }

  function close() {
    _close();
  }

  function setContent(content) {
    _body.innerHTML = '';

    content instanceof Element 
      ? _body.appendChild(content)
      : typeof content === 'string' && (_body.innerHTML = content);
  }

  _init();

  return {
    open,
    close,
    setContent
  }
}

export default Modal;