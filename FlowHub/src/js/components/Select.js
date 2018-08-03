import Utils from '../core/Utils';
import Traversal from '../core/Traversal';
import Alter from '../core/Alter';
import Component from '../components/Component';
import { SELECT } from '../helpers/common';

let shownTop;

class Select extends Component {
  constructor(settings, selectable) {
    super(settings);

    this._component = this._component = Utils.createElement('div', { 
      className: SELECT.CONTAINER + (this._settings.customClass ? ' ' + this._settings.customClass : '')
    });
    this._trigger = undefined;
    this._result = Utils.createElement('ul', {
      className: SELECT.RESULT
    }, {
      display: 'none'
    });
    this._hasResult = false;
    this._selected = undefined;
    this._mouseDown = false;
    this._selectable = selectable === undefined ? true : selectable;

    if(this._selectable)
      this._init();    
  }

  _select(element) {
    if(!this._selected) {
      Utils.addClass(element, SELECT.RESULT_SELECTED_ITEM);
    } else {
      Utils.removeClass(this._selected, SELECT.RESULT_SELECTED_ITEM);
      Utils.addClass(element, SELECT.RESULT_SELECTED_ITEM);
    }
  
    this._selected = element;
    
    let selectedRect = this._selected.getBoundingClientRect().bottom - shownTop;
    if(selectedRect > this._result.offsetHeight || selectedRect < this._selected.offsetHeight)
      this._selected.scrollIntoView();

    this._result.setAttribute(SELECT.RESULT_ACTIVE_CHILD, element.id);
  }

  _deselect() {
    if(!this._selected) return;
    
    Utils.removeClass(this._selected, SELECT.RESULT_SELECTED_ITEM);
    this._selected = undefined;
  }

  _registerSelected(element) {
    element = Utils.hasClass(element, SELECT.RESULT_ITEM) 
      ? element 
      : Traversal.parents(element, '.' + SELECT.RESULT_ITEM);

    if(Utils.hasClass(element, SELECT.RESULT_ITEM_NO_RESULT))
      return;

    this._select(element);

    if(this._selectable)
      this._trigger.innerHTML = element.innerHTML;

    this._settings.onRegisterSelected
      && this._settings.onRegisterSelected(this, element);

    this._hideResult();
  }

  _showResult() {
    if(!this._hasResult) {
      Alter.after(this._result, this._trigger);
      this._hasResult = true;

      this._result.style.display = 'block';
      shownTop = this._result.getBoundingClientRect().top;

      return;
    } 

    this._result.style.display = 'block';
    shownTop = this._result.getBoundingClientRect().top;
  }

  _hideResult() {
    this._result.style.display = 'none';
    this._result.removeAttribute(SELECT.RESULT_ACTIVE_CHILD);
  }

  _toggleResult() {
    this._result.style.display !== 'none' 
      ? this._hideResult()
      : this._showResult(); 
  }

  _populate(source, result, empty) {
    let temp = ''
      , start = 0;

    if(this._selectable && source.length) {
      if(this._settings.initialValue) {
        temp = item(this._settings.initialValue, 'default');
        this._trigger.innerHTML = this._settings.initialValue;
      } else {
        let first = result.call(source, source[0]);

        temp = item(first, 'default');
        this._trigger.innerHTML = first;
        ++start;
      }      
    }

    if(source.length) {
      for(let i = start; i < source.length; i++) 
        temp += item(result.call(source, source[i], i, source), i);
    } else {
      if(empty)
        temp = '<li class="' + SELECT.RESULT_ITEM + ' ' + SELECT.RESULT_ITEM_NO_RESULT + '">' 
                + empty()
               + '</li>';
    }

    this._result.innerHTML = '';
    this._result.innerHTML = temp;

    function item(content, index) {
      return `<li id="result-option-${index}" class=${SELECT.RESULT_ITEM}>${content}</li>`;
    }
  }

  _init() {
    if(this._selectable) {
      this._trigger = Utils.createElement('button', {
        type: 'button'
      });
  
      this._component.appendChild(this._trigger);

      this._trigger.addEventListener('mousedown', e => {
        e.stopImmediatePropagation();
        this._toggleResult();        
      });
    }

    this._settings.source  
      && this._populate(this._settings.source, item => item);
  
    let arrowsUsed = false;
  
    this._trigger.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
            if(this._result.style.display !== 'none') {
              arrowsUsed = true;
              this._selected
                ? this._selected.previousElementSibling
                  ? this._select(this._selected.previousElementSibling)
                  : this._select(this._result.lastElementChild)
                : this._select(this._result.lastElementChild);
            } else return;
            break;
        case 'ArrowDown':
          e.preventDefault();
          if(this._result.style.display !== 'none') {
            arrowsUsed = true;
            this._selected
              ? this._selected.nextElementSibling
                ? this._select(this._selected.nextElementSibling)
                : this._select(this._result.firstElementChild)
              : this._select(this._result.firstElementChild);
          } else return;
          break;
        case 'Enter':
          e.preventDefault();
          if(arrowsUsed) {
            if(this._result.style.display !== 'none')
              this._registerSelected(this._selected);
            else
              this._selectable && this._toggleResult();
            arrowsUsed = false;
          } else
            this._selectable && this._toggleResult();
          break;
        case 'Escape':
          this._hideResult();
          break;
      }
    });

    this._trigger.addEventListener('blur', () => this._mouseDown || this._hideResult());
  
    this._result.addEventListener('mousedown', e => {
      this._mouseDown = true;
  
      let self = this;
      this._result.addEventListener('mouseup', () => { 
        self._mouseDown = false;
      }, { 
        once: true 
      });
    });
      
    this._result.addEventListener('click', e => this._registerSelected(e.target));
    //this._showResult();
  
    this._insert();
  }

  dispose() {
    super.dispose();

    this._component = null;
    this._trigger = null;
    this._result = null;
    this._hasResult = false;
    this._selected = null;
    this._mouseDown = false;
  }
}



export default Select;