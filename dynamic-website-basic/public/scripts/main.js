const dialog = document.querySelector('dialog');
const openDialogBtn = document.querySelector('#open-dialog-btn');
const cancelBtn = document.querySelector('dialog .btn-alt');

openDialogBtn.addEventListener('click', function() {
  dialog.showModal();
})

cancelBtn.addEventListener('click', function() {
  dialog.close();
})