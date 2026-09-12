const experience = document.getElementById('experience');
const parcel = document.getElementById('parcel');
const reveal = document.getElementById('reveal');
const reset = document.getElementById('reset');

function openDate() {
  if (experience.classList.contains('opened')) return;

  experience.classList.add('opening');
  parcel.setAttribute('aria-expanded', 'true');

  window.setTimeout(() => {
    experience.classList.add('opened');
    experience.classList.remove('opening');
    reveal.setAttribute('aria-hidden', 'false');
  }, 720);

  window.setTimeout(() => {
    reveal.focus({ preventScroll: true });
  }, 980);
}

function resetDate(event) {
  event.stopPropagation();
  experience.classList.remove('opened', 'opening');
  reveal.setAttribute('aria-hidden', 'true');
  parcel.setAttribute('aria-expanded', 'false');
  parcel.focus({ preventScroll: true });
}

parcel.addEventListener('click', openDate);
reset.addEventListener('click', resetDate);
