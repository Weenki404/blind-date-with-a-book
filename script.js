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
