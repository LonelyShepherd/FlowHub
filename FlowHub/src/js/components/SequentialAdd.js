import Component from './Component';
import Traversal from '../core/Traversal';
import Utils from '../core/Utils';
import Alter from '../core/Alter';
import { SEQUENTIAL_ADD } from '../helpers/common';

class SequentialAdd extends Component {
  constructor(trigger, settings) {
    super(settings);

    this.trigger = trigger;
    this.container = undefined;
  }

  setTrigger(trigger) {
    this.trigger = trigger;
  }

  add() {
    this.settings.element
      && this.settings.element(this);
  }

  attachEvents() {
    this.container.addEventListener('click', e => {
      let action = e.target;

      Utils.hasClass(action, SEQUENTIAL_ADD.TRIGGER) && this.add();
      if(Utils.hasClass(action, SEQUENTIAL_ADD.ITEM_REMOVE)) {
        let parent = Traversal.parents(e.target, '.' + SEQUENTIAL_ADD.ITEM_ADDED);
        parent && Alter.unmount(parent);
      }
    });
  }

  init() {
    this.container = Traversal.parents(this.trigger, '.' + SEQUENTIAL_ADD.CONTAINER);
    this.attachEvents();
  }
}

export default SequentialAdd;