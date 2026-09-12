const experience = document.getElementById('experience');
const parcel = document.getElementById('parcel');
const reveal = document.getElementById('reveal');
const reset = document.getElementById('reset');

parcel.addEventListener('click', () => {
  experience.classList.add('opened');
  reveal.setAttribute('aria-hidden', 'false');

  window.setTimeout(() => {
    reveal.focus?.();
  }, 800);
});

reset.addEventListener('click', () => {
  experience.classList.remove('opened');
  reveal.setAttribute('aria-hidden', 'true');
});
