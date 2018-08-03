import Traversal from '../core/Traversal';
import Utils from '../core/Utils';
import Alter from '../core/Alter';
import Component from '../components/Component';
import { SEQUENTIAL_ADD } from '../helpers/common';

class SequentialAdd extends Component {
  constructor(settings) {
    super(settings);

    this._component = Utils.createElement('div', {
      className: SEQUENTIAL_ADD.CONTAINER + (this._settings.customClass ? ' ' + this._settings.customClass : ''),
      innerHTML: '<button type="button" class="btn ' + SEQUENTIAL_ADD.TRIGGER + '">'
               +  this._settings.trigger.text
               + '</button>'
    });
    this._elements = Utils.createElement('div', {
      className: SEQUENTIAL_ADD.ELEMENTS,
    });
    Alter.before(this._elements, this._component.querySelector('.' + SEQUENTIAL_ADD.TRIGGER));

    this._init();
  }

  _add() {
    let element = this._settings.element();
    if(element instanceof Component) element = element.get();

    let added = Utils.createElement('div', {
      className: SEQUENTIAL_ADD.ITEM_ADDED
    })
    .appendChild(element);

    this._elements.appendChild(added);
  
    this._settings.onAdd
      && this._settings.onAdd(element);
  }

  clear() {
    this._elements.innerHTML = '';
  }

  _init() {
    this._component.addEventListener('click', e => {
      let action = e.target;

      Utils.hasClass(action, SEQUENTIAL_ADD.TRIGGER) && this._add();
  
      if(Utils.hasClass(action, SEQUENTIAL_ADD.ITEM_REMOVE)) {
        let parent = Traversal.parents(action, '.' + SEQUENTIAL_ADD.ITEM_ADDED);
        parent && Alter.unmount(parent);
  
        this._settings.onRemove
          && this._settings.onRemove();
      }
    });

    this._insert();
  }

  dispose() {
    super.dispose();

    this._component = null;
    this._elements = null;
  }
}

export default SequentialAdd;