const REVIEW_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwi0OYLQUDeoJP16VUKUYd-d584k59223PZJolOjoEbqS8sA5f0nS2NkDhdLp0GuD6f/exec';


const totalReviews = document.getElementById('totalReviews');
const totalFinished = document.getElementById('totalFinished');
const totalDnf = document.getElementById('totalDnf');
const totalCurrent = document.getElementById('totalCurrent');

const awardGrid = document.getElementById('awardGrid');
const dateGrid = document.getElementById('dateGrid');
const lastUpdated = document.getElementById('lastUpdated');


function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function cleanNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}


function prettyNumber(value) {
  const number = cleanNumber(value);

  return number
    .toFixed(2)
    .replace(/\.00$/, '')
    .replace(/(\.\d)0$/, '$1');
}


function makeAward(icon, name, item, field, suffix = '') {
  if (!item) {
    return `
      <article class="award-card">
        <div class="award-icon">${icon}</div>
        <p class="award-name">${escapeHtml(name)}</p>
        <h3>Awaiting testimony</h3>
        <p class="award-book">The House has insufficient gossip.</p>
      </article>
    `;
  }

  return `
    <article class="award-card">
      <div class="award-icon">${icon}</div>
      <p class="award-name">${escapeHtml(name)}</p>

      <h3>${escapeHtml(item.archetype)}</h3>

      <p class="award-book">
        ${escapeHtml(item.book)}
        ${item.author ? ` · ${escapeHtml(item.author)}` : ''}
      </p>

      <span class="award-value">
        ${prettyNumber(item[field])}${suffix}
      </span>
    </article>
  `;
}


function renderReport(data) {
  totalReviews.textContent = data.totalReviews ?? 0;
  totalFinished.textContent = data.totals?.finished ?? 0;
  totalDnf.textContent = data.totals?.dnf ?? 0;
  totalCurrent.textContent = data.totals?.current ?? 0;

  const awards = data.awards || {};

  awardGrid.innerHTML =
    makeAward(
      '🏆',
      'Most Successful Match',
      awards.mostSuccessfulMatch,
      'averageOverall',
      ' / 5'
    ) +

    makeAward(
      '♥',
      'Most Chemistry',
      awards.mostChemistry,
      'averageChemistry',
      ' / 5'
    ) +

    makeAward(
      '🌶️',
      'Spiciest Date',
      awards.spiciestDate,
      'averageSpice',
      ' / 5'
    ) +

    makeAward(
      '💌',
      'Most Popular Match',
      awards.mostPopularMatch,
      'reviewCount',
      ' reviews'
    ) +

    makeAward(
      '✕',
      'Most Frequently Blocked',
      awards.mostFrequentlyBlocked,
      'blocked',
      ' blocks'
    );


  const preferredOrder = [
    'The Bad Decision',
    'The Yearner',
    'The Adventure Date',
    'The Sweetheart',
    'The Aristocratic Asshole'
  ];

  const dates = [...(data.dates || [])];

  dates.sort((a, b) => {
    const ai = preferredOrder.indexOf(a.archetype);
    const bi = preferredOrder.indexOf(b.archetype);

    const aOrder = ai === -1 ? 999 : ai;
    const bOrder = bi === -1 ? 999 : bi;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return String(a.book).localeCompare(String(b.book));
  });


  if (!dates.length) {
    dateGrid.innerHTML = `
      <article class="loading-card">
        <span>✦</span>
        No reviews have been filed yet.
      </article>
    `;
  } else {
    dateGrid.innerHTML = dates.map(date => {
      const againRows = Object
        .entries(date.wouldDateAgain || {})
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => `
          <div class="again-row">
            <span>${escapeHtml(label)}</span>
            <b>${count}</b>
          </div>
        `)
        .join('');

      return `
        <article class="date-card">

          <h3>${escapeHtml(date.archetype)}</h3>

          <p class="date-book">
            ${escapeHtml(date.book)}
          </p>

          <p class="date-author">
            ${escapeHtml(date.author)}
          </p>


          <div class="metrics">

            <div class="metric">
              <strong>${prettyNumber(date.averageOverall)}</strong>
              <span>Overall</span>
            </div>

            <div class="metric">
              <strong>${prettyNumber(date.averageChemistry)}</strong>
              <span>Chemistry</span>
            </div>

            <div class="metric">
              <strong>${prettyNumber(date.averageSpice)}</strong>
              <span>Spice</span>
            </div>

          </div>


          <div class="status-line">
            <span>✓ ${date.finished} finished</span>
            <span>↶ ${date.dnf} DNF</span>
            <span>… ${date.current} current</span>
          </div>


          <p class="again-label">
            Would Date Again
          </p>

          <div class="again-list">
            ${againRows || `
              <div class="again-row">
                <span>No testimony yet.</span>
              </div>
            `}
          </div>

        </article>
      `;
    }).join('');
  }


  const date = data.updatedAt
    ? new Date(data.updatedAt)
    : new Date();

  lastUpdated.textContent =
    `House records refreshed ${date.toLocaleString()}.`;
}


function renderFailure() {
  awardGrid.innerHTML = `
    <article class="loading-card">
      <span>⚠</span>
      The gossip machine could not reach the House records.
      Make sure the Apps Script web app was redeployed after adding doGet().
    </article>
  `;
}


window.receiveMatchmakingSummary = renderReport;


// Google Apps Script JSONP request.
const request = document.createElement('script');

request.src =
  `${REVIEW_ENDPOINT}` +
  `?callback=receiveMatchmakingSummary` +
  `&v=${Date.now()}`;

request.onerror = renderFailure;

document.head.appendChild(request);
