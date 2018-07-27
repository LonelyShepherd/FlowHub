import Utils from '../core/Utils';
import Select from './Select';
import { AUTOCOMPLETE, SELECT } from '../helpers/common';

class AutoComplete extends Select {
  constructor(settings) {
    super(settings);

    this.trigger = Utils.createElement('input', {
      type: 'text',
      placeholder: this.settings.placeholder
    });
    this.result = Utils.createElement('ul', {
      className: SELECT.RESULT
    }, {
      display: 'block'
    });
    this.selectable = false;
    this.persistSelected = false;
  }

  showResult() {
    if(!this.selectable && !this.trigger.value.trim())
      return;

    super.showResult();
  }

  hideResult() {
    super.hideResult();

    !this.persistSelected && this.deselect();
  }

  attachEvents() {
    let typingTimer;

    this.trigger.addEventListener('focus', () => this.showResult());
    
    this.trigger.addEventListener('input', () => {
      this.showResult();      
      clearTimeout(typingTimer);
      
      if(this.trigger.value.trim())
      typingTimer = setTimeout(doneTyping, 300);
      else
      this.hideResult();
    });
    
    let self = this;
    function doneTyping() {
      self.settings.onInput(self);
      self.deselect();
    }

    super.attachEvents();
  }
  
  init() {
    this.layout.className = AUTOCOMPLETE.CONTAINER 
      + ' form-group form-group--small form-group--no-validation';
    this.layout.appendChild(this.trigger);

    this.settings.customClass 
      && Utils.addClass(this.layout, this.settings.customClass);

    this.attachEvents();

    return this.settings.returnCreated ? this.layout : this.mount();
  }
}

export default AutoComplete;