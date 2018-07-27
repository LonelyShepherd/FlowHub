import Alter from '../core/Alter';
import Utils from '../core/Utils';
import Select from './Select';
import { AUTOCOMPLETE } from '../helpers/common';

class AutoComplete extends Select {
  constructor(settings) {
    super(settings);

    this.trigger = Utils.createElement('input', {
      type: 'text',
      placeholder: this.settings.placeholder
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
      self.settings.onInput(self.trigger, self.result);
      self.deselect();
    }

    super.attachEvents();
  }
  
  init() {
    this.layout.className = AUTOCOMPLETE.CONTAINER 
      + ' form-group form-group--small form-group--no-validation';
    this.layout.appendChild(this.trigger);

    if(this.settings.customClass)
      Utils.addClass(this.layout, this.settings.customClass);

    if(this.settings.context)
      Alter.prepend(this.layout, this.settings.context);
    else if(this.settings.reference)
      Alter.before(this.layout, this.settings.reference);
    
    if(this.settings.onAdd) this.settings.onAdd(this.trigger);
    this.attachEvents();
  }
}

export default AutoComplete;