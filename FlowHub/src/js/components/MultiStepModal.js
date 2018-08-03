import Alter from '../core/Alter';
import Utils from '../core/Utils';
import Modal from '../components/Modal';
import { MULTI_STEP_MODAL, MODAL } from '../helpers/common';

let old;

class MultiStepModal extends Modal {
  constructor(settings) { // OK
    super(settings, true);

    this._current = 0;
    this._stepTitle = Utils.createElement('div', { 
      className: MULTI_STEP_MODAL.STEP_TITLE 
    });
    this._checkpoints = [];
    this._activeCheckpoint = undefined;
    this._sections = [];
    this._activeSection = undefined;
    this._done;

    let body = this._component.querySelector('.' + MODAL.BODY);
    
    if(Utils.isFunction(this._settings.body.content)) {
      this._settings.body.async
        ? this._settings.body.content(body, this)
        : this._settings.body.content(body); 
    } else { 
      this._settings.body.isRaw || this._settings.body.isRaw === 'undefined'
        ? body.innerHTML = this._settings.body.content
        : body.appendChild(this._settings.body.content); 

      this.init();
    }
  } 

  jumpAt(position) {
    this._current = position;

    this._stepTitle.innerHTML = this._settings.steps[position].stepTitle;

    this._activeCheckpoint = this._activeCheckpoint || this._checkpoints[0];
    Utils.removeClass(this._activeCheckpoint, MULTI_STEP_MODAL.PROGRESS_POINT_CURRENT);
    this._activeCheckpoint = this._checkpoints[position];
    Utils.addClass(this._activeCheckpoint, MULTI_STEP_MODAL.PROGRESS_POINT_CURRENT);

    this._activeSection = this._activeSection || this._sections[0];
    this._activeSection.style.display = 'none';
    this._activeSection = this._sections[position];
    this._activeSection.style.display = 'block';
  }

  prev() {
    if(--this._current < 0) {
      this._current = 0;
      return;
    }
    
    if(this._done)
      this._done.innerHTML = this._done.getAttribute('data-old-value');
    this.jumpAt(this._current);
  }

  next() {
    ++this._current;

    if(this._current === this._settings.steps.length - 1) {
      this._done = this._component.querySelector(this._settings.doneButton.change);
      this._done.setAttribute('data-old-value', this._done.innerHTML);
      this._done.innerHTML = this._settings.doneButton.text;
    } else if(this._current > this._settings.steps.length - 1) {
      this._settings.doneHandler(this);
      this._current = this._settings.steps.length - 1;
      return;
    }

    this.jumpAt(this._current);
  }

  reset() {
    this.jumpAt(0);
    console.log('pero');
    if(this._done)
      this._done.innerHTML = this._done.getAttribute('data-old-value');
  }

  _init() {
    let body = this._component.querySelector('.' + MODAL.BODY);
  
    let fragment = document.createDocumentFragment()
      , sectionsContainer = this._component.querySelector('.' + MULTI_STEP_MODAL.STEPS)
      , progressLine = Utils.createElement('div', { 
          className: MULTI_STEP_MODAL.PROGRESS_LINE 
        })
      , progress = Utils.createElement('div', {
          className: MULTI_STEP_MODAL.PROGRESS
        });
        
    this._sections = sectionsContainer.querySelectorAll('.' + MULTI_STEP_MODAL.STEP);
    fragment.appendChild(progress);
    fragment.appendChild(this._stepTitle);
    Alter.before(fragment, body);

    super._init();
  
    fragment = document.createDocumentFragment();
    fragment.appendChild(progressLine);
  
    this._settings.steps.forEach((checkpoint, index) => {
      if(!this._checkpoints.length) {
        checkpoint = Utils.createElement('div', {
          className: MULTI_STEP_MODAL.PROGRESS_POINT,
          innerHTML: index + 1
        })
      }
  
      if(index < this._settings.steps.length - 1)
        checkpoint.style.marginRight = 
          (progress.offsetWidth - this._settings.steps.length * 25) / (this._settings.steps.length - 1) + 'px';
  
      fragment.appendChild(checkpoint);
  
      if(this._sections[index])
        if(index !== 0) this._sections[index].style.display = 'none';
    });
  
    progress.appendChild(fragment);
    this._checkpoints = progress.querySelectorAll('.' + MULTI_STEP_MODAL.PROGRESS_POINT);
    this.jumpAt(this._current);
  
    let stepTitleCSS = window.getComputedStyle(this._stepTitle)
      , progressCSS = window.getComputedStyle(progress);
  
    body.style.height = body.offsetHeight 
      - (this._stepTitle.offsetHeight + parseInt(stepTitleCSS.marginTop) + parseInt(stepTitleCSS.marginBottom))
      - (progress.offsetHeight + parseInt(progressCSS.marginTop) + parseInt(progressCSS.marginBottom)) + 'px'; 
  }   

  dispose() {
    super.dispose();
    
    this._current = 0;
    this._stepTitle = null;
    this._sections = [];
    this._checkpoints = [];
    this._activeCheckpoint = null;
    this._activeSection = null;
  }
}

export default MultiStepModal;