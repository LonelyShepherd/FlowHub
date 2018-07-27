import Component from './Component';
import Utils from '../core/Utils';
import Traversal from '../core/Traversal';
import Alter from '../core/Alter';
import Event from '../core/Event';
import { SELECT } from '../helpers/common';

class Select extends Component {
  constructor(settings) {
    super(settings);

    this.layout = undefined;
    this.container = undefined;
    this.selected = undefined;
    this.hasResult = false;
    this.mouseDown = false;
    this.result = Utils.createElement('ul', {
      className: SELECT.RESULT
    });
  }

  attachEvents() {
    let arrowsUsed = false;

    this.container.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if(this.result.style.display !== 'none')
          this.selected ? this.select(this.selected.previousElementSibling) 
          : this.select(this.result.querySelector('li:last-of-type'));
          arrowsUsed = true;
          break;
        case 'ArrowDown':
          e.preventDefault();
          if(this.result.style.display !== 'none')
            this.selected ? this.select(this.selected.nextElementSibling) 
              : this.select(this.result.querySelector('li'));
            arrowsUsed = true;
          break;
        case 'Enter':
          e.preventDefault();
          if(arrowsUsed) {
            this.registerSelected(this.selected);
            arrowsUsed = false;
          } else if (this.container.tagName === 'BUTTON') {
            this.result.style.display !== 'none' 
              ? this.hideResult()
              : this.showResult(); 
          }
          break;
      }
    });

    if(this.container.tagName === 'BUTTON') {
      this.container.addEventListener('mousedown', e => {
        e.stopImmediatePropagation();

        this.result.style.display === 'none' 
          ? this.showResult()
          : this.hideResult();          
      });
    }

    this.container.addEventListener('focus', () => this.showResult());

    this.container.addEventListener('blur', () => this.mouseDown || this.hideResult());

    this.result.addEventListener('mousedown', e => {
      this.mouseDown = true;

      let self = this;
      this.result.addEventListener('mouseup', () => { self.mouseDown = false;}, 
        { once: true });
    });
    
    this.result.addEventListener('click', e => this.registerSelected(e.target));
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
    if(!element) {    
      element = this.result
        .querySelector(`#${this.result.getAttribute(SELECT.RESULT_ACTIVE_CHILD)}`);
    } else {
      element = Utils.hasClass(element, SELECT.RESULT_ITEM) ? element 
        : Traversal.parents(element, '.' + SELECT.RESULT_ITEM);
    }

    this.settings.onRegisterSelected 
      && this.settings.onRegisterSelected(this, element);
  }

  showResult() {
    if(this.container.tagName === 'INPUT' && !this.container.value.trim())
      return;
  
    if(!this.hasResult) {
      Alter.after(this.result, this.container);
      this.hasResult = true;
    } 
  
    this.result.style.display = 'block';
  }

  hideResult() {
    this.result.style.display = 'none';
    this.result.removeAttribute(SELECT.RESULT_ACTIVE_CHILD);
  }

  init() {
    this.layout = Utils.createElement('div', { className: SELECT.CONTAINER });
    this.container = Utils.createElement('button', {type: 'button' });
    this.layout.appendChild(this.container);

    this.settings.customClass && Utils.addClass(this.layout, this.settings.customClass);
    this.settings.displayData && this.settings.displayData(this.result);

    this.result.style.display = 'none';
    this.layout.appendChild(this.result);
    this.hasResult = true;

    if(this.settings.initialValue) {
      this.container.innerHTML = this.settings.initialValue;
      Alter.prepend(Utils.createElement('li', {
        innerHTML: this.settings.initialValue,
        className: SELECT.RESULT_ITEM
      }), this.result);
    } else
      this.container.innerHTML = this.result.firstElementChild.innerHTML;

    this.attachEvents();

    if(this.settings.returnCreated) return this.layout;
  }
}

export default Select;