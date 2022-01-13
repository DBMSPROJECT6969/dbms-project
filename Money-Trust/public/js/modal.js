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
logoutbtn.onclick = function(e){
  e.preventDefault();
}
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

/**
* Template Name: KnightOne - v4.7.0
* Template URL: https://bootstrapmade.com/knight-simple-one-page-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
// (function() {
//   "use strict";


// })()


/**
   * Easy selector helper function
   */
 const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

/**
 * Easy event listener function
 */
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

/**
 * Easy on scroll event listener 
 */
const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}

/**
 * Navbar links active state on scroll
 */
let navbarlinks = select('#navbar .scrollto', true)
const navbarlinksActive = () => {
  let position = window.scrollY + 200
  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return
    let section = select(navbarlink.hash)
    if (!section) return
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      navbarlink.classList.add('active')
    } else {
      navbarlink.classList.remove('active')
    }
  })
}
window.addEventListener('load', navbarlinksActive)
onscroll(document, navbarlinksActive)

/**
 * Scrolls to an element with header offset
 */
const scrollto = (el) => {
  let header = select('#header')
  let offset = header.offsetHeight

  let elementPos = select(el).offsetTop
  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  })
}

/**
 * Toggle .header-scrolled class to #header when page is scrolled
 */
let selectHeader = select('#header')
if (selectHeader) {
  const headerScrolled = () => {
    if (window.scrollY > 100) {
      selectHeader.classList.add('header-scrolled')
    } else {
      selectHeader.classList.remove('header-scrolled')
    }
  }
  window.addEventListener('load', headerScrolled)
  onscroll(document, headerScrolled)
}

/**
 * Back to top button
 */
let backtotop = select('.back-to-top')
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add('active')
    } else {
      backtotop.classList.remove('active')
    }
  }
  window.addEventListener('load', toggleBacktotop)
  onscroll(document, toggleBacktotop)
}

/**
 * Mobile nav toggle
 */
on('click', '.mobile-nav-toggle', function(e) {
  select('#navbar').classList.toggle('navbar-mobile')
  this.classList.toggle('bi-list')
  this.classList.toggle('bi-x')
})

/**
 * Mobile nav dropdowns activate
 */
on('click', '.navbar .dropdown > a', function(e) {
  if (select('#navbar').classList.contains('navbar-mobile')) {
    e.preventDefault()
    this.nextElementSibling.classList.toggle('dropdown-active')
  }
}, true)

/**
 * Scrool with ofset on links with a class name .scrollto
 */
on('click', '.scrollto', function(e) {
  if (select(this.hash)) {
    e.preventDefault()

    let navbar = select('#navbar')
    if (navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile')
      let navbarToggle = select('.mobile-nav-toggle')
      navbarToggle.classList.toggle('bi-list')
      navbarToggle.classList.toggle('bi-x')
    }
    scrollto(this.hash)
  }
}, true)

/**
 * Scroll with ofset on page load with hash links in the url
 */
window.addEventListener('load', () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash)
    }
  }
});

/**
 * Preloader
 */
let preloader = select('#preloader');
if (preloader) {
  window.addEventListener('load', () => {
    preloader.remove()
  });
}

/**
 * Initiate glightbox 
 */
const glightbox = GLightbox({
  selector: '.glightbox'
});

/**
 * Porfolio isotope and filter
 */
window.addEventListener('load', () => {
  let portfolioContainer = select('.portfolio-container');
  if (portfolioContainer) {
    let portfolioIsotope = new Isotope(portfolioContainer, {
      itemSelector: '.portfolio-item'
    });

    let portfolioFilters = select('#portfolio-flters li', true);

    on('click', '#portfolio-flters li', function(e) {
      e.preventDefault();
      portfolioFilters.forEach(function(el) {
        el.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      portfolioIsotope.arrange({
        filter: this.getAttribute('data-filter')
      });

    }, true);
  }

});

/**
 * Initiate portfolio lightbox 
 */
const portfolioLightbox = GLightbox({
  selector: '.portfolio-lightbox'
});

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

    






