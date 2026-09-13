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

// POST-DATE REVIEW — THE ADVENTURE DATE / ANIMATION V1
// Uses the Web Animations API so the motion is explicit and
// independent of inherited CSS keyframe rules.
// =========================================================
const reviewToggle = document.getElementById('review-toggle');
const reviewPanel = document.getElementById('review-panel');
const reviewForm = document.getElementById('review-form');
const reviewStatus = document.getElementById('review-status');
const reviewSuccess = document.getElementById('review-success');
const submitReview = document.getElementById('submit-review');
const reviewSeal = reviewPanel.querySelector('.review-card-seal');
const reviewSheen = reviewPanel.querySelector('.review-card-sheen');
const reviewStars = [...reviewPanel.querySelectorAll('.review-card-stars span')];

const REVIEW_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwi0OYLQUDeoJP16VUKUYd-d584k59223PZJolOjoEbqS8sA5f0nS2NkDhdLp0GuD6f/exec';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateReviewOpen() {
  if (prefersReducedMotion) return;

  reviewPanel.animate([
    { opacity: 0, transform: 'translateY(70px) scale(.92)', filter: 'blur(8px)' },
    { opacity: 1, transform: 'translateY(-10px) scale(1.018)', filter: 'blur(0)' , offset: .68 },
    { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
  ], {
    duration: 900,
    easing: 'cubic-bezier(.16,.88,.2,1)',
    fill: 'both'
  });

  reviewSheen.animate([
    { opacity: 0, transform: 'translateX(-95%) rotate(5deg)' },
    { opacity: .95, offset: .25 },
    { opacity: 0, transform: 'translateX(95%) rotate(5deg)' }
  ], {
    duration: 1250,
    delay: 220,
    easing: 'ease-out'
  });

  reviewSeal.animate([
    { opacity: 0, transform: 'translateY(-85px) rotate(-35deg) scale(.35)' },
    { opacity: 1, transform: 'translateY(8px) rotate(8deg) scale(1.22)', offset: .72 },
    { opacity: 1, transform: 'translateY(0) rotate(0deg) scale(1)' }
  ], {
    duration: 760,
    delay: 360,
    easing: 'cubic-bezier(.14,1.35,.32,1)',
    fill: 'both'
  });

  reviewStars.forEach((star, i) => {
    const angle = (-150 + i * 55) * Math.PI / 180;
    const distance = 35 + (i % 2) * 18;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 18;
    star.animate([
      { opacity: 0, transform: 'translate(0, 18px) scale(.2)' },
      { opacity: 1, transform: 'translate(0, 0) scale(1.35)', offset: .34 },
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.55)` }
    ], {
      duration: 900,
      delay: 380 + i * 85,
      easing: 'ease-out'
    });
  });

  const fields = [...reviewForm.children];
  fields.forEach((field, i) => {
    field.animate([
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 480,
      delay: 520 + i * 85,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'both'
    });
  });
}

reviewToggle.addEventListener('click', () => {
  const isOpen = reviewToggle.getAttribute('aria-expanded') === 'true';
  reviewToggle.setAttribute('aria-expanded', String(!isOpen));

  if (isOpen) {
    reviewPanel.hidden = true;
    return;
  }

  reviewPanel.hidden = false;
  reviewPanel.classList.remove('review-complete');
  animateReviewOpen();

  window.setTimeout(() => {
    reviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
});

// Tiny pulse when an answer is selected.
reviewPanel.addEventListener('change', (event) => {
  const input = event.target;
  if (!input.matches('input[type="radio"]') || prefersReducedMotion) return;
  const pill = input.nextElementSibling;
  if (!pill) return;

  pill.animate([
    { transform: 'scale(.92)', boxShadow: '0 0 0 rgba(180,198,255,0)' },
    { transform: 'scale(1.08)', boxShadow: '0 0 32px rgba(225,190,123,.38)' },
    { transform: 'scale(1)', boxShadow: '0 0 18px rgba(116,151,92,.18)' }
  ], { duration: 330, easing: 'ease-out' });
});

async function playSubmissionRitual() {
  if (prefersReducedMotion) return;

  // Form folds inward like a letter.
  await reviewForm.animate([
    { opacity: 1, transform: 'perspective(900px) rotateX(0deg) scale(1)', filter: 'blur(0)' },
    { opacity: .72, transform: 'perspective(900px) rotateX(18deg) scale(.97)', offset: .45 },
    { opacity: 0, transform: 'perspective(900px) rotateX(76deg) scale(.88)', filter: 'blur(4px)' }
  ], {
    duration: 620,
    easing: 'cubic-bezier(.4,0,.2,1)',
    fill: 'forwards'
  }).finished;

  // The moon seal slams down in the center with an obvious thump.
  reviewSeal.style.zIndex = '20';
  await reviewSeal.animate([
    { opacity: 1, transform: 'translate(-315px, -40px) scale(.8) rotate(-14deg)' },
    { opacity: 1, transform: 'translate(-315px, 185px) scale(2.1) rotate(7deg)', offset: .68 },
    { opacity: 1, transform: 'translate(-315px, 170px) scale(1.75) rotate(0deg)' }
  ], {
    duration: 520,
    easing: 'cubic-bezier(.12,1.45,.26,1)',
    fill: 'forwards'
  }).finished;

  // Big celestial burst after impact.
  reviewStars.forEach((star, i) => {
    const angle = (i * 60 - 15) * Math.PI / 180;
    const dx = Math.cos(angle) * 150;
    const dy = Math.sin(angle) * 115;
    star.animate([
      { opacity: 0, transform: 'translate(0,0) scale(.3)' },
      { opacity: 1, transform: 'translate(0,0) scale(1.7)', offset: .18 },
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.4)` }
    ], {
      duration: 760,
      delay: i * 35,
      easing: 'ease-out'
    });
  });

  reviewPanel.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(.965)', offset: .35 },
    { transform: 'scale(1.015)', offset: .62 },
    { transform: 'scale(1)' }
  ], { duration: 460, easing: 'ease-out' });

  await new Promise(resolve => setTimeout(resolve, 500));
}

reviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!reviewForm.reportValidity()) return;

  const formData = new FormData(reviewForm);
  const payload = {
    discordName: formData.get('discordName') || '',
    archetype: 'The Adventure Date',
    book: 'A Hunt Bound in Blood',
    author: 'Krista Walsh',
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
  submitReview.textContent = 'SEALING THE GOSSIP…';
  reviewStatus.textContent = '';

  try {
    await fetch(REVIEW_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    await playSubmissionRitual();

    reviewForm.hidden = true;
    reviewPanel.classList.add('review-complete');
    reviewSuccess.hidden = false;

    // The date has been reviewed. No necromancy, no duplicate reopening.
    reviewToggle.disabled = true;
    reviewToggle.setAttribute('aria-expanded', 'true');
    reviewToggle.innerHTML = '<span aria-hidden="true">✓</span> DATE REVIEWED';

    if (!prefersReducedMotion) {
      reviewSeal.style.opacity = '0';
      reviewSuccess.animate([
        { opacity: 0, transform: 'translateY(34px) scale(.88)', filter: 'blur(7px)' },
        { opacity: 1, transform: 'translateY(-5px) scale(1.035)', filter: 'blur(0)', offset: .72 },
        { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
      ], {
        duration: 700,
        easing: 'cubic-bezier(.15,1.2,.28,1)',
        fill: 'both'
      });

      const successSeal = reviewSuccess.querySelector('.success-seal');
      successSeal.animate([
        { opacity: 0, transform: 'scale(2.4) rotate(-25deg)' },
        { opacity: 1, transform: 'scale(.88) rotate(5deg)', offset: .7 },
        { opacity: 1, transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 650,
        delay: 120,
        easing: 'cubic-bezier(.16,1.35,.3,1)',
        fill: 'both'
      });
    }

    reviewSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    submitReview.disabled = false;
    submitReview.textContent = '⚔ SUBMIT FIELD REPORT ⚔';
    reviewStatus.textContent = 'The field-report courier got eaten by something. Please try again.';
  }
});
