import Component from './Component';
import Utils from '../core/Utils';
import Traversal from '../core/Traversal';
import Alter from '../core/Alter';
import { SELECT } from '../helpers/common';

class Select extends Component {
  constructor(settings) {
    super(settings);

    this.layout = this.layout = Utils.createElement('div', { 
      className: SELECT.CONTAINER 
    });
    this.trigger = this.trigger = Utils.createElement('button', { 
      type: 'button'
    });
    this.result = Utils.createElement('ul', {
      className: SELECT.RESULT
    }, {
      display: 'none'
    });
    this.selected = undefined;
    this.hasResult = false;
    this.mouseDown = false;
    this.selectable = true;
  }

  mount() {
    if(this.settings.reference) {
      switch(this.settings.reference.add) {
        case 'before':
          Alter.before(this.layout, this.settings.reference.element);
          break;
        case 'after':
          Alter.after(this.layout, this.settings.reference.element);
          break;
      }
    } else if(this.settings.context) {
      switch(this.settings.context.method) {
        case 'prepend':
          Alter.prepend(this.layout, this.settings.context.element);
          break;
        case 'append':
          this.settings.context.element.appendChild(this.layout);
          break;
      }
    }

    this.settings.onMount 
      && this.settings.onMount(this);
  }

  select(element) {
    if(!element) return; 
  
    if(!this.selected) {
      Utils.addClass(element, SELECT.RESULT_SELECTED_ITEM);
    } else {
      Utils.removeClass(this.selected, SELECT.RESULT_SELECTED_ITEM);
      Utils.addClass(element, SELECT.RESULT_SELECTED_ITEM);
    }
  
    this.selected = element;
    this.result.setAttribute(SELECT.RESULT_ACTIVE_CHILD, element.id);
  }

  deselect() {
    if(!this.selected) return;
    
    Utils.removeClass(this.selected, SELECT.RESULT_SELECTED_ITEM);
    this.selected = undefined;
  }

  registerSelected(element) {
    element = Utils.hasClass(element, SELECT.RESULT_ITEM) 
      ? element 
      : Traversal.parents(element, '.' + SELECT.RESULT_ITEM);

    this.select(element);

    this.settings.onRegisterSelected 
      && this.settings.onRegisterSelected(this, element);
  }

  showResult() {  
    if(!this.hasResult) {
      Alter.after(this.result, this.trigger);
      this.hasResult = true;

      return;
    } 
  
    this.result.style.display = 'block';
  }

  hideResult() {
    this.result.style.display = 'none';
    this.result.removeAttribute(SELECT.RESULT_ACTIVE_CHILD);
  }

  toggleResult() {
    this.result.style.display !== 'none' 
      ? this.hideResult()
      : this.showResult(); 
  }

  attachEvents() {
    let arrowsUsed = false;

    this.trigger.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if(this.result.style.display !== 'none')
            this.selected 
              ? this.select(this.selected.previousElementSibling) 
              : this.select(this.result.lastElementChild);
          arrowsUsed = true;
          break;
        case 'ArrowDown':
          e.preventDefault();
          if(this.result.style.display !== 'none')
            this.selected 
              ? this.select(this.selected.nextElementSibling) 
              : this.select(this.result.firstElementChild);
          arrowsUsed = true;
          break;
        case 'Enter':
          e.preventDefault();
          if(arrowsUsed) {
            if(this.result.style.display !== 'none') {
              this.registerSelected(this.selected);
              this.hideResult();
            } else
              this.selectable && this.toggleResult();
            arrowsUsed = false;
          } else
            this.selectable && this.toggleResult();
          break;
        case 'Escape':
          this.hideResult();
          break;
      }
    });

    if(this.trigger.tagName === 'BUTTON') {
      this.trigger.addEventListener('mousedown', e => {
        e.stopImmediatePropagation();
        this.toggleResult();        
      });
    }

    this.trigger.addEventListener('blur', () => this.mouseDown || this.hideResult());

    this.result.addEventListener('mousedown', e => {
      this.mouseDown = true;

      let self = this;
      this.result.addEventListener('mouseup', () => { 
        self.mouseDown = false;
      }, { 
        once: true 
      });
    });
    
    this.result.addEventListener('click', e => this.registerSelected(e.target));
  }

  init() {
    this.layout.appendChild(this.trigger);

    this.settings.customClass && Utils.addClass(this.layout, this.settings.customClass);
    this.settings.displayData && this.settings.displayData(this.result);

    this.showResult();
    
    if(this.settings.initialValue) {
      this.trigger.innerHTML = this.settings.initialValue;
      Alter.prepend(Utils.createElement('li', {
        id: 'default',
        innerHTML: this.settings.initialValue,
        className: SELECT.RESULT_ITEM
      }), this.result);
    } else
      this.trigger.innerHTML = this.result.firstElementChild.innerHTML;

    this.attachEvents();

    return this.settings.returnCreated ? this.layout : this.mount();
  }
}

export default Select;