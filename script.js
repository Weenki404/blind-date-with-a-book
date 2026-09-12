const area = document.querySelector('.gift-area');
const gift = document.getElementById('gift');
const reveal = document.getElementById('reveal');
const reset = document.getElementById('reset');

gift.addEventListener('click', () => {
  area.classList.add('opened');
  reveal.setAttribute('aria-hidden', 'false');
});

reset.addEventListener('click', () => {
  area.classList.remove('opened');
  reveal.setAttribute('aria-hidden', 'true');
});
