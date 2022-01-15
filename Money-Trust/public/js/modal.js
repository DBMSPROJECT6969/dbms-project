document.querySelector('.img__btn').addEventListener('click', function() {
  document.querySelector('.cont').classList.toggle('s--signup');
});
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("loginBtn");
var logoutbtn = document.getElementById("logoutBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function(e) {
  e.preventDefault();
  modal.style.display = "block";
}
// logoutbtn.onclick = function(e){
//   e.preventDefault();
// }
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
 // Confirm password validation 
function onChange() {
  const password = document.querySelector('input[name=pswd1]');
  const confirm = document.querySelector('input[name=pswd2]');
  if (confirm.value === password.value) {
    confirm.setCustomValidity('');
  } else {
    confirm.setCustomValidity('Passwords do not match');
  }
}


// const contactForm = document.querySelector('.php-email-form');

// let name = document.getElementById('name');
// let email = document.getElementById('email');
// let subject = document.getElementById('subject');
// let message = document.getElementById('message');

//   contactForm.addEventListener('submit',(e)=>{
//     e.preventDefault();
    
//     let formData = {
//       name:name.value,
//       email:email.value, 
//       subject:subject.value,
//       message:message.value
//     }

//     const options = {
//       method : 'POST',
//       body: JSON.stringify(formData),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };

//     fetch('/',options);

//   })

    






