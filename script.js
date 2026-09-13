document.querySelectorAll('.date').forEach(card=>{card.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-8px) rotateX(${-y*2}deg) rotateY(${x*2}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

// Ring for Assistance — let the House choose the disaster.
(() => {
  const bell = document.getElementById('service-bell');
  const copy = document.getElementById('assistance-copy');
  if (!bell || !copy) return;

  const dates = [
    'bad-decision/',
    'yearner/',
    'adventure/',
    'sweetheart/',
    'aristocrat/'
  ];

  let choosing = false;

  bell.addEventListener('click', () => {
    if (choosing) return;
    choosing = true;
    bell.disabled = true;
    bell.classList.add('is-ringing');
    copy.className = 'assistance-copy is-deciding';
    copy.textContent = 'The House is considering your predicament…';

    const destination = dates[Math.floor(Math.random() * dates.length)];

    window.setTimeout(() => {
      copy.className = 'assistance-copy is-chosen';
      copy.textContent = 'A decision has been made.';
    }, 650);

    window.setTimeout(() => {
      window.location.href = destination;
    }, 1350);
  });
})();
