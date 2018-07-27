import Alter from '../core/Alter';
import Utils from '../core/Utils';
import Select from './Select';
import { AUTOCOMPLETE } from '../helpers/common';

class AutoComplete extends Select {
  constructor(settings) {
    super(settings);
  }

  init() {
    this.layout = Utils.createElement('div', {
      className: AUTOCOMPLETE.CONTAINER + 
        ' form-group form-group--small form-group--no-validation'
    });
    this.container = Utils.createElement('input', {
      type: 'text',
      placeholder: this.settings.placeholder
    });
    this.layout.appendChild(this.container);

    if(this.settings.customClass)
      Utils.addClass(this.layout, this.settings.customClass);

    if(this.settings.context)
      Alter.prepend(this.layout, this.settings.context);
    else if(this.settings.reference)
      Alter.before(this.layout, this.settings.reference);
    
    if(this.settings.onAdd) this.settings.onAdd(this.container);
    this.attachEvents();
  }

  attachEvents() {
    super.attachEvents();

    let typingTimer;

    this.container.addEventListener('input', () => {
      this.showResult();      
      clearTimeout(typingTimer);

      if(this.container.value.trim())
        typingTimer = setTimeout(doneTyping, 300);
      else
        this.hideResult();
    });

    let self = this;
    function doneTyping() {
      self.settings.onInput(self.container, self.result);
      self.deselect();
    }
  }

  
}

export default AutoComplete;