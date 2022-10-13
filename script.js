'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollButtonTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//scrolling

scrollButtonTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth', // smooth way going down
    //modern way section1.scrollIntoView({ behavior: 'smooth' });
  });
});
/////Page navigation
//this is good, but only for a few elements/links, but what if we wpould have 1000 it canont be inserted in 1 function, thats why we have delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//Page navigation with delegation
//1. we add event lstener to the current parent element
//2,.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// Building a Tabbed Component //IMPORTANT

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return; // if there is no click, the function ends
  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');
  //Acitavte content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//Passing Arguments to Event Handlers//
// links fading out after we hover over
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

//passing 'argument' into handler.. Prof used the bind method, so we dont have to call another functiion, then changed the opacity at the end to 'this'
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
/*
//Implementing a Sticky Navigation: The Scroll Event
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
//BUT THERE IS A BETTER WAY,...scroll event is not the best
*/
//A Better Way: The Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2], // if we add a zero it will start at the beggining AND the end...numbers are in %
// };

// const observer = new IntersectionObserver(obsCallback, observerOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //  the header shows 90px before  the section 1 showing
});
headerObserver.observe(header);
//////Revealing Elements on Scroll  - We gonna reveal elements whenwe are close to them
// first we hide them with js into html, then we gnna reveal them,.,,smart move hehe

//Reveal Sections
const allsections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  rootMargin: '200px',
});
allsections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden'); //  here we hide them
});

/////LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]'); // the ones that are going to be lazy loaded are tghe ones with the data-src attributes
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//200. Building a Slider Component: Part 1
//we saved EVERYTHING INTO 1 FUNCTION
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnright = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // 0%, 100%,200%,300%
  //Going to the next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  //Event Handlers
  btnright.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //keyboard events
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide; // .slide from the data set html...data-slide
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
///185. How the DOM Really Works///

///186. Selecting, Creating, and Deleting Elements///
/*
//Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
//.insertAdjacementHTML

const message = document.createElement('div'); // its nowhere to be found on our web page, we just created it
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.'
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// we can use prepend and append to move the elements, because it exist only once, we have to copy if we want more

//header.prepend(message); // we inserted this element, message is the first child of header, but we can add it as last, so it will be down
header.append(message); // append moved message from first child tpo last child
//header.append(message.cloneNode(true)); // now we have cookies up and down the page, but we dont need that now

//header.before(message); // before the ehader
//header.after(message); // after the header

//REMOVING ELLEMNTS
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    //message.remove() // new way deleting it
    message.parentElement.removeChild(message); // old way deleting it
  });
*/
///187. Styles, Attributes and Classes////
/*
//Styles
message.style.backgroundColor = '#37383d'; // styles directly set in dom, these are called in-line styles
message.style.width = '120%';

//console.log(message.style.height); // nothing shows, maybe it doesnt ever exist but read the under line
//console.log(message.style.backgroundColor); // we got the color, because we set it before manually, inline stlye

console.log(getComputedStyle(message)); // this contains all of the properties with values
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//if we cant change colors in css, we can do it with js
document.documentElement.style.setProperty('--color-primary', 'orange');

//Attributes // src, alt,class...
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
logo.alt = 'Beautiful minimalist logo';

//Non-standard
console.log(logo.designer); // this is not a standart property that should be there, so its undenifed...we added designer
console.log(logo.getAttribute('designer')); // now it returns the designer we added
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href); //http://127.0.0.1:5500/#
console.log(link.getAttribute('href')); //#

//Data Attributes
console.log(logo.dataset.versionNumber); // we use this when we want to save data in the user interface

//Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes
*/
//dont use, it will overwrite every class
//logo.className = 'jonas';
/*
////188. Implementing Smooth Scrolling
const scrollButtonTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

scrollButtonTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // //current scroll posiotion
  // console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // //rectangle of viewpont
  // console.log(
  //   'hegiht/width veiwport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset, // current postiotn + current scroll
  //   s1coords.top + window.pageYOffset
  // );
  //second soluton
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth', // smooth way going down
  });

  //Third solution, modern way...this works in modern browsers only
  // section1.scrollIntoView({ behavior: 'smooth' });
});

//189.Types of Events and Event handlers
// Event is a signal that is generated by a certain dom note, so if something has happened on our web page, generates an event
//Mouse events...we used a mouse event 'click' but now mouseenter etc.
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert("addEventListener: Great! You're reading the heading :D");
};
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// we can come across this way of listening to events, but the addEventListener is better
// h1.onmouseenter = function (e) {
//   alert("OnmouseEnter: Great! You're reading the heading :D");
// };
*/
//190. Event Propagation: Bubbling and Capturing

//191. Event Propagation in Practice
/*
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)},
${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  //SSTOP PROPAGATION
  //e.stopPropagation();
  //we stopped it here so only the .nav__link changed the color
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINEER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('nAV', e.target, e.currentTarget);
}); //  IF we add TRUE, now the first element is the nav, and the other onves are listetning to the event as this Bubbles up
*/
///192. Event Delegation: Implementing Page Navigation
//

///193. DOM Traversing
/*
//we can select an element by another element
const h1 = document.querySelector('h1');

//Going downwards: selecting child elemeents .....we can use queryselector
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //child element....text ,comment,br
console.log(h1.children); // this owrks only for direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orange';

//Going upwards: parents
console.log(h1.parentNode); //same
console.log(h1.parentElement); //same
//closest is an opposite of queryselector, we select closest like it
h1.closest('.header').style.background = 'var(--gradient-secondary)'; // it sleected the colsest parent from the head, and then we changed the color

h1.closest('h1').style.background = 'var(--gradient-primary)';

//GOing Sideways: siblings
console.log(h1.previousElementSibling); // null, theres nothing there
console.log(h1.nextElementSibling); // most of the tme we work with ele,emnts

console.log(h1.previousSibling);
console.log(h1.nextSibling);
//if we want to select all the children/siblings elements
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.50)';
});
*/
//194. Building a Tabbed Component //IMPORTANT
//eahc content has its own area

//195. Passing Arguments to Event Handlers//
// links fading out after we hover over

//196. Implementing a Sticky Navigation: The Scroll Event

//198. Revealing Elements on Scroll

//////202. Lifecycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  // this event does not wait for the images to load
  console.log('HTML parsed and DOM tree built!', e);
  //so this we can now execute code which should be executed after the dom is ready
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   //this event here is created imedtiatelly after clickin on exist , we can use thos event to ask if they want to elave
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; // it asks if we want to leave then....it should be only used when its neccesary

// });

//203. Efficient Script Loading: defer and async
