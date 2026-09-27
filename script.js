const houseFavicon = document.createElement('link');
houseFavicon.rel = 'icon';
houseFavicon.type = 'image/svg+xml';
houseFavicon.href = 'favicon.svg';
document.head.appendChild(houseFavicon);

document.querySelectorAll('.date').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});

const fateBell = document.getElementById('fate-bell');
const assistanceCopy = document.getElementById('assistance-copy');

if (fateBell && assistanceCopy) {
  const dates = [
    'bad-decision/',
    'yearner/',
    'adventure/',
    'sweetheart/',
    'aristocrat/'
  ];

  fateBell.addEventListener('click', () => {
    if (fateBell.disabled) return;

    fateBell.disabled = true;
    fateBell.classList.add('is-ringing');
    assistanceCopy.textContent = 'The House is considering your predicament…';

    const chosenDate = dates[Math.floor(Math.random() * dates.length)];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.setTimeout(() => {
      assistanceCopy.textContent = 'A decision has been made.';

      window.setTimeout(() => {
        window.location.href = new URL(chosenDate, window.location.href).href;
      }, reducedMotion ? 150 : 650);
    }, reducedMotion ? 150 : 1050);
  });
}


// ---------- The Matchmaker · Public correspondence ----------
const matchmakerLetterButton = document.getElementById('matchmaker-letter');
const matchmakerLetterModal = document.getElementById('matchmaker-letter-modal');
const matchmakerLetterForm = document.getElementById('matchmaker-letter-form');
const letterBody = document.getElementById('letter-body');
const letterCount = document.getElementById('letter-count');
const letterStatus = document.getElementById('letter-status');
const letterSubmit = document.getElementById('letter-submit');

if (matchmakerLetterButton && matchmakerLetterModal && matchmakerLetterForm) {
  let lastFocus = null;
  const endpoint = window.WEENKI_HOUSE_ENDPOINT || 'https://script.google.com/macros/s/AKfycby0K3Yqbjhtd8sxIpC451GUl2ZII3TcIGLdF2e7UifOAJF7YPXDQTMETQD76-PKIGlp/exec';
  const openLetter = () => { lastFocus = document.activeElement; matchmakerLetterModal.hidden = false; document.body.classList.add('letter-open'); document.getElementById('letter-address').focus(); };
  const closeLetter = () => { matchmakerLetterModal.hidden = true; document.body.classList.remove('letter-open'); if (lastFocus) lastFocus.focus(); };
  matchmakerLetterButton.addEventListener('click', openLetter);
  matchmakerLetterModal.querySelectorAll('[data-close-letter]').forEach(el => el.addEventListener('click', closeLetter));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !matchmakerLetterModal.hidden) closeLetter(); });
  letterBody.addEventListener('input', () => { letterCount.textContent = `${letterBody.value.length} / 4000`; });
  matchmakerLetterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const letter = letterBody.value.trim();
    if (!letter) { letterStatus.textContent = 'The Matchmaker cannot receive an empty letter.'; letterBody.focus(); return; }
    letterSubmit.disabled = true; letterSubmit.textContent = 'DELIVERING…'; letterStatus.textContent = 'A footman has been summoned.';
    const payload = { type:'matchmaker-letter', addressAs:document.getElementById('letter-address').value.trim() || 'A Resident', regarding:document.getElementById('letter-regarding').value, letter };
    try {
      await fetch(endpoint, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload) });
      matchmakerLetterForm.reset(); letterCount.textContent = '0 / 4000';
      letterStatus.textContent = 'Your correspondence has been slipped beneath the Matchmaker’s door.';
      letterSubmit.textContent = 'DELIVERED';
      window.setTimeout(() => { closeLetter(); letterStatus.textContent=''; letterSubmit.disabled=false; letterSubmit.textContent='SEAL & DELIVER'; }, 1800);
    } catch (err) {
      letterStatus.textContent = 'The House failed to deliver your correspondence. Please try again.';
      letterSubmit.disabled=false; letterSubmit.textContent='SEAL & DELIVER';
    }
  });
}
