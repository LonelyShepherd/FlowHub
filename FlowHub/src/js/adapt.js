import Event from './core/Event';

let authBox = document.querySelector('.sign-container');
    
window.addEventListener('resize', () => {
  let authBoxH = authBox.offsetHeight;

  if(window.innerHeight < (authBoxH + 160))
    authBox.style = 'position: relative; margin: 50px auto; transform: none; top: 0';
  else authBox.style = '';
});

Event.trigger(window, 'resize');