import MultiStepModal from './components/MultiStepModal';
import SequentialAdd from './components/SequentialAdd';

let createTeam = document.querySelector('.create-team-btn');

let MSModal = new MultiStepModal({
  isBody: true
}, {
  modalOverlay: true,
  modalOverlayClose: true,
  customClass: 'fh-modal--create-team',
  width: 700
}, {
  steps: [
    {
      stepTitle: 'Team info',
    }, {
      stepTitle: 'Add members'
    }, {
      stepTitle: 'Everything looks good?'
    }
]});

let SAdd = new SequentialAdd(null);

createTeam.addEventListener('click', () => {
  $.ajax({
    url: '/Dashboard/CreateTeam',
    dataType: 'html'
  }).done((data) => {
    MSModal.configure(content => { content.html = data });
    MSModal.init();
    MSModal.open();

    let addMember = MSModal.getModal()
      .querySelector('.fh-sequential-add__trigger');
    SAdd.setTrigger(addMember);
    SAdd.init();
  });
});