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

// =========================================================
// POST-DATE REVIEW — THE YEARNER
// =========================================================
const reviewToggle = document.getElementById('review-toggle');
const reviewPanel = document.getElementById('review-panel');
const reviewForm = document.getElementById('review-form');
const reviewStatus = document.getElementById('review-status');
const reviewSuccess = document.getElementById('review-success');
const submitReview = document.getElementById('submit-review');

const REVIEW_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwi0OYLQUDeoJP16VUKUYd-d584k59223PZJolOjoEbqS8sA5f0nS2NkDhdLp0GuD6f/exec';

reviewToggle.addEventListener('click', () => {
  const isOpen = reviewToggle.getAttribute('aria-expanded') === 'true';
  reviewToggle.setAttribute('aria-expanded', String(!isOpen));
  reviewPanel.hidden = isOpen;

  if (!isOpen) {
    window.setTimeout(() => reviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
});

reviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!reviewForm.reportValidity()) return;

  const formData = new FormData(reviewForm);
  const payload = {
    discordName: formData.get('discordName') || '',
    archetype: 'The Yearner',
    book: 'The Everlasting',
    overallRating: formData.get('overallRating') || '',
    chemistry: formData.get('chemistry') || '',
    spice: formData.get('spice') || '',
    status: formData.get('status') || '',
    greenFlag: formData.get('greenFlag') || '',
    redFlag: formData.get('redFlag') || '',
    oneSentence: formData.get('oneSentence') || '',
    wouldDateAgain: formData.get('wouldDateAgain') || ''
  };

  submitReview.disabled = true;
  submitReview.textContent = 'SENDING THE GOSSIP…';
  reviewStatus.textContent = '';

  try {
    await fetch(REVIEW_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    reviewForm.hidden = true;
    reviewSuccess.hidden = false;
    reviewSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    submitReview.disabled = false;
    submitReview.textContent = '☾ SUBMIT THE GOSSIP ☾';
    reviewStatus.textContent = 'The gossip chute jammed. Please try again.';
  }
});

