import Utils from '../core/Utils';
import Select from '../components/Select';
import { AUTOCOMPLETE } from '../helpers/common';

class Autocomplete extends Select {
  constructor(settings) {
    super(settings, false);
    this._result.style.display = 'block';

    this._init();
  }

  _showResult() {
    if(!this._selectable && !this._trigger.value.trim())
      return;

    super._showResult();
  }

  _hideResult() {
    super._hideResult();
    this._deselect();
  }

  _init() {
    this._component.className = AUTOCOMPLETE.CONTAINER 
    + ' form-group form-group--small form-group--no-validation';
    
    this._trigger = Utils.createElement('input', {
      type: 'text',
      placeholder: this._settings.placeholder
    });
    this._component.appendChild(this._trigger);
    
    super._init();
    
    this._trigger.addEventListener('focus', () => this._showResult());
    
    let typingTimer;
    
    this._trigger.addEventListener('input', () => {
      this._showResult();      
      clearTimeout(typingTimer);
      
      if(this._trigger.value.trim())
        typingTimer = setTimeout(doneTyping, 300);
      else
        this._hideResult();
    });
    
    let self = this;
    function doneTyping() {
      self._settings.onInput(self);
      self._deselect();
    }   
  }
}

export default Autocomplete;