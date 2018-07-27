import Alter from '../core/Alter';
import Utils from '../core/Utils';
import Traversal from '../core/Traversal';
import Modal from './Modal';

class MultiStepModal extends Modal {
  constructor(content, options, steps) {
    super(content, options);

    this.steps = steps;
    this.current = 0;
    this.stepTitle = undefined;
    this.stepPoints = [];
    this.stepSections = [];
    this.actions = undefined;
  }

  configure(fn) {
    fn(this.content, this.options, this.steps);
  }

  prev(action) {
    if(--this.current < 0) {
      this.current = 0;
      return;
    }
    
    this.stepTitle.innerHTML = this.steps.steps[this.current].stepTitle;

    Utils.removeClass(this.stepPoints[this.current + 1], 'fh-multistep__progress__point--current');
    Utils.addClass(this.stepPoints[this.current], 'fh-multistep__progress__point--current');

    this.stepSections[this.current + 1].style.display = 'none';
    this.stepSections[this.current].style.display = 'block';

    Traversal.next(action, '.step-next').innerHTML = 'Next';
  }

  next(action) {
    if(++this.current > this.steps.steps.length - 1) {
      this.current = this.steps.steps.length - 1;
      return;
    } else if(this.current === this.steps.steps.length - 1)
      action.innerHTML = 'Done';

    this.stepTitle.innerHTML = this.steps.steps[this.current].stepTitle;

    Utils.removeClass(this.stepPoints[this.current - 1], 'fh-multistep__progress__point--current');
    Utils.addClass(this.stepPoints[this.current], 'fh-multistep__progress__point--current');

    this.stepSections[this.current - 1].style.display = 'none';
    this.stepSections[this.current].style.display = 'block';
  }

  attachEvents() {
    super.attachEvents();

    this.actions.addEventListener('click', e => {
      let action = e.target;

      if(Utils.hasClass(action, 'step-next'))
        this.next(action);
      else if(Utils.hasClass(action, 'step-prev'))
        this.prev(action);
    });
  }

  init() {
    this.createModal();

    this.current = 0;

    let multiStep = this.modal.querySelector('.fh-multistep__steps');
    let fragment = document.createDocumentFragment();

    let multiStepProgress = document.createElement('div');
    multiStepProgress.className = 'fh-multistep__progress';

    if(!this.stepTitle) {
      this.stepTitle = Utils.createElement('div', { className: 'fh-multistep__step-title' })
    }

    this.stepSections = multiStep.querySelectorAll('.fh-multistep__steps__step');

    this.actions = Traversal.next(Traversal.parents(multiStep, '.fh-modal__content__body'), '.fh-modal__content__footer');
    
    fragment.appendChild(multiStepProgress);
    fragment.appendChild(this.stepTitle);
    Alter.before(fragment, multiStep);
    
    let multiStepProgressWidth = multiStepProgress.offsetWidth;
    fragment = document.createDocumentFragment();
    
    let multiStepLine = Utils.createElement('div', { className: 'fh-multistep__progress__line' });
    fragment.appendChild(multiStepLine);

    this.stepPoints = [];
    
    for(let i = 0; i < this.steps.steps.length; i++) {
      let point = Utils.createElement('div', {
        className: 'fh-multistep__progress__point',
        innerHTML: i + 1
      })

      if(i < this.steps.steps.length - 1) {
        point.style.marginRight = (multiStepProgressWidth - this.steps.steps.length * 25) / (this.steps.steps.length - 1) + 'px';
      }

      this.stepPoints.push(point);
      fragment.appendChild(point);

      if(this.stepSections[i]) { 
        if(i !== 0) this.stepSections[i].style.display = 'none';
      }
    }

    this.stepTitle.innerHTML = this.steps.steps[this.current].stepTitle;
    Utils.addClass(this.stepPoints[this.current], 'fh-multistep__progress__point--current');
    
    multiStepProgress.appendChild(fragment);

    this.attachEvents();
  }
}

export default MultiStepModal;