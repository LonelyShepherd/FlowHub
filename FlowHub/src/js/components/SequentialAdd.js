import Traversal from '../core/Traversal';
import Alter from '../core/Alter';
import Utils from '../core/Utils';

class SequentialAdd {
  constructor(trigger) {
    this.trigger = trigger;
    this.container = undefined;
  }

  setTrigger(trigger) {
    this.trigger = trigger;
  }

  add() {
    let formGroup = Utils.createElement('div', {
      className: 'form-group form-group--small form-group--no-validation',
      innerHTML: '<input type="text" placeholder="johnsmith@mail.com">',
    });

    Alter.prepend(formGroup, this.container);
  }

  attachEvents() {
    this.trigger.addEventListener('click', () => {
      this.add();
    });
  }

  init() {
    this.container = Traversal.parents(this.trigger, '.fh-sequential-add');

    this.attachEvents();
  }
}

export default SequentialAdd;