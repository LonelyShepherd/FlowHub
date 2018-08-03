import Alter from '../core/Alter';
import Utils from '../core/Utils';

let notifier = document.createElement('div')
  , title = Utils.createElement('div', { className: 'fh-notify__title' })
  , body = Utils.createElement('div', { className: 'fh-notify__body' })
  , close = Utils.createElement('button', { className: 'fh-notify__close', innerHTML: 'OK' })
  , display
  , awaitAnimation;

notifier.appendChild(body);

close.addEventListener('click', () => {
  Utils.addClass(notifier, 'fh-notify--close');
  Utils.removeClass(notifier, 'fh-notify--pop');

  clearTimeout(awaitAnimation);
  clearTimeout(awaitAnimation);
  awaitAnimation = setTimeout(() => Alter.unmount(notifier), 400);
  clearTimeout(display);
});

class Component {
  constructor(settings) {
    this._settings = settings;
  }
  
  get() {
    return this._component;
  }

  notify(type, message) {
    function hide(timeout) {
      display = setTimeout(() => {
        Utils.removeClass(notifier, 'fh-notify--pop');
        Utils.addClass(notifier, 'fh-notify--close');
        clearTimeout(awaitAnimation);
        awaitAnimation = setTimeout(() => Alter.unmount(notifier), 400);
      }, timeout);
    }

    if(type === 'clear') {
      hide(0);
      return;
    }

    notifier.className = 'fh-notify fh-notify--pop';
    Alter.before(title, body);
    notifier.appendChild(close);

    switch(type) {
      case 'error': 
        notifier.className += ' fh-notify--error';
        title.innerHTML = 'Oops!';
        break;
      case 'success':
        notifier.className += ' fh-notify--success';
        title.innerHTML = 'Yaay!';
        break;
      case 'warning':
        notifier.className += ' fh-notify--warning';
        title.innerHTML = 'Hmm...';
        break;
      case 'working':
        notifier.className += ' fh-notify--working';
        Alter.unmount(title);
        Alter.unmount(close);
        message = 'Working on it...';
        break;
    }

    body.innerHTML = message;
    Alter.prepend(notifier, document.body);
    clearTimeout(display);

    if(type === 'working') return;

    hide(10000);
  }

  configure(fn) {
    fn(this._settings);
  }

  _insert() {
    if(this._settings.reference) {
      switch(this._settings.reference.add) {
        case 'before':
          Alter.before(this._component, this._settings.reference.element);
          break;
        case 'after':
          Alter.after(this._component, this._settings.reference.element);
          break;
      }
    } else if(this._settings.context) {
      switch(this._settings.context.method) {
        case 'prepend':
          Alter.prepend(this._component, this._settings.context.element);
          break;
        case 'append':
          this._settings.context.element.appendChild(this._component);
          break;
      }
    }
  }

  _init() {}

  dispose() {
    this._settings = null;
  }
}

export default Component;