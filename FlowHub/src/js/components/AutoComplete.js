import Alter from '../core/Alter';
import Utils from '../core/Utils';

const SELECTED_ITEM_CLASS = 'fh-autocomplete__result__item--selected';

let selected;

function select(element) {
  if(!element)
    return; 

  if(!selected) {
    Utils.addClass(element, SELECTED_ITEM_CLASS);
    selected = element;

    return;
  }

  Utils.removeClass(selected, SELECTED_ITEM_CLASS);
  Utils.addClass(element, SELECTED_ITEM_CLASS);

  selected = element;
}

function deselect() {
  if(selected) {
    Utils.removeClass(selected, SELECTED_ITEM_CLASS);
    selected = undefined;
  }
}

function showResult(instance) {
  if(!instance.input.value.trim())
    return;

  if(!instance.hasResult) {
    Alter.after(instance.result, instance.input);
    instance.hasResult = true;
  } else instance.result.style.display = 'block';
}

function hideResult(instance) {
  instance.result.style.display = 'none';
}

class AutoComplete {
  constructor(options) {
    this.options = options;
    this.input = undefined;
    this.hasResult = false;
    this.result = Utils.createElement('ul', {
      className: 'fh-autocomplete__result'
    });
  }

  add() {
    this.input = this.options.layout.querySelector('input');

    if(this.options.context)
      Alter.prepend(this.options.layout, this.options.context);
    else if(this.options.reference)
      Alter.before(this.options.layout, this.options.reference);
    
    this.options.onAdd();
    this.attachEvents();
  }

  attachEvents() {
    let typingTimer;

    this.input.addEventListener('input', () => {
      showResult(this);      
      clearTimeout(typingTimer);

      if(this.input.value.trim()) {
        typingTimer = setTimeout(doneTyping, 300);
      } else {
        this.result.style.display = 'none';
      }
    });

    this.input.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          selected ? select(selected.previousElementSibling) 
            : select(this.result.querySelector('li:last-of-type'));
          break;
        case 'ArrowDown':
          e.preventDefault();
          selected ? select(selected.nextElementSibling) 
            : select(this.result.querySelector('li'));
          break;
        case 'Enter':
          e.preventDefault();
          break;
      }
    });

    this.input.addEventListener('focus', () => {
      showResult(this);
    });

    this.input.addEventListener('blur', () => {
      hideResult(this);
      deselect();
    });

    this.result.addEventListener('click', e => {
      console.log(e.target);
    });

    let self = this;
    function doneTyping() {
      self.options.onInput(self.input, self.result);
      deselect();
    }
  }
}

export default AutoComplete;