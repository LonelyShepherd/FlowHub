import Event from './core/Event';

let signContainer = document.querySelector('.sign-container');
    
window.addEventListener('resize', () => {
  let signContainerHeight = parseInt(window.getComputedStyle(signContainer).height);

  if(window.innerHeight < (signContainerHeight + 160)) {
    signContainer.style = 'position: static; margin: 50px auto; transform: none;';
  } else signContainer.style = '';
});

Event.trigger(window, 'resize');
