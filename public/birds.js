// grabbing the birds last div
const birds = document.querySelector('#birds');
// grabbing the form for creating a bird
const newForm = document.querySelector('#newBirdForm')
// creating a var for our URL
/*
  TODO: CHANGE TO '/birds'
*/
const BIRDS_URL = 'http://localhost:8000/birds';

newForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the form
})

const data = {
  title: newForm.querySelector
}
