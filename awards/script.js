const REVIEW_ENDPOINT = window.WEENKI_HOUSE_ENDPOINT || "https://script.google.com/macros/s/AKfycby0K3Yqbjhtd8sxIpC451GUl2ZII3TcIGLdF2e7UifOAJF7YPXDQTMETQD76-PKIGlp/exec";


const totalReviews = document.getElementById('totalReviews');
const totalFinished = document.getElementById('totalFinished');
const totalDnf = document.getElementById('totalDnf');
const totalCurrent = document.getElementById('totalCurrent');

const awardGrid = document.getElementById('awardGrid');
const dateGrid = document.getElementById('dateGrid');
const verdictGrid = document.getElementById('verdictGrid');
const lastUpdated = document.getElementById('lastUpdated');
const eventHeading = document.getElementById('eventHeading');


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


function makeAward(icon, name, winners, field, suffix = '', declassified = false) {
  const items = Array.isArray(winners) ? winners : (winners ? [winners] : []);
  if (!items.length) {
    return `
      <article class="award-card">
        <div class="award-icon">${icon}</div>
        <p class="award-name">${escapeHtml(name)}</p>
        <h3>No verdict yet</h3>
        <p class="award-book">The House refuses to crown a resident with zero evidence.</p>
      </article>
    `;
  }

  const value = items[0][field];
  return `
    <article class="award-card">
      <div class="award-icon">${icon}</div>
      <p class="award-name">${escapeHtml(name)}</p>

      <h3>${items.map(item => escapeHtml(item.archetype)).join('<span class="tie-mark"> &amp; </span>')}</h3>

      <p class="award-book">
        ${declassified
          ? items.map(item => `${escapeHtml(item.book)}${item.author ? ` · ${escapeHtml(item.author)}` : ''}`).join('<br>')
          : 'Identity withheld while this resident remains in the House.'}
      </p>

      <span class="award-value">
        ${prettyNumber(value)}${suffix}
      </span>
    </article>
  `;
}


function makeVerdict(icon, name, winners, field, suffix, evidenceMaker, declassified) {
  const items = Array.isArray(winners) ? winners : (winners ? [winners] : []);
  if (!items.length) {
    return `<article class="award-card"><div class="award-icon">${icon}</div><p class="award-name">${escapeHtml(name)}</p><h3>No verdict yet</h3><p class="award-book">The House cannot condemn anyone without paperwork.</p></article>`;
  }
  const item = items[0];
  return `<article class="award-card">
    <div class="award-icon">${icon}</div>
    <p class="award-name">${escapeHtml(name)}</p>
    <h3>${items.map(x => escapeHtml(x.archetype)).join('<span class="tie-mark"> &amp; </span>')}</h3>
    <p class="award-book">${declassified ? items.map(x => `${escapeHtml(x.book)}${x.author ? ` · ${escapeHtml(x.author)}` : ''}`).join('<br>') : 'Identity withheld while this resident remains in the House.'}</p>
    <span class="award-value">${prettyNumber(item[field])}${suffix}</span>
    <p class="verdict-evidence">${escapeHtml(evidenceMaker(item))}</p>
  </article>`;
}


function renderReport(data) {
  const declassified = Boolean(data.declassified);
  if (data.event && eventHeading) {
    eventHeading.textContent = [data.event.title, data.event.date].filter(Boolean).join(' · ').toUpperCase();
  }
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
      ' / 5',
      declassified
    ) +

    makeAward(
      '♥',
      'Most Chemistry',
      awards.mostChemistry,
      'averageChemistry',
      ' / 5',
      declassified
    ) +

    makeAward(
      '🌶️',
      'Spiciest Date',
      awards.spiciestDate,
      'averageSpice',
      ' / 5',
      declassified
    ) +

    makeAward(
      '💌',
      'Most Popular Match',
      awards.mostPopularMatch,
      'reviewCount',
      ' reviews',
      declassified
    ) +

    makeAward(
      '✕',
      'Most Frequently Blocked',
      awards.mostFrequentlyBlocked,
      'blocked',
      ' blocks',
      declassified
    );

  const completed = awards.mostCompleted;
  const secondDate = awards.strongestSecondDate;
  const goodbye = awards.strongestGoodbye;
  verdictGrid.innerHTML =
    makeVerdict('🏁', 'Most Dates Completed', completed, 'finished', ' finished',
      item => `${item.finished} of ${item.reviewCount} readers made it to the end.`, declassified) +
    makeVerdict('💌', 'Most Likely to Get a Second Date', secondDate, 'secondDateRate', '%',
      item => `${item.secondDate} of ${item.decisionCount} readers would return.`, declassified) +
    makeVerdict('🚪', 'Most Decisive Goodbye', goodbye, 'noSecondDateRate', '%',
      item => `${item.noSecondDate} of ${item.decisionCount} readers declined another date.`, declassified);


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
            ${declassified ? escapeHtml(date.book) : 'Classified Resident'}
          </p>

          <p class="date-author">
            ${declassified ? escapeHtml(date.author) : 'Identity withheld until this residency ends'}
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
  if (verdictGrid) verdictGrid.innerHTML = awardGrid.innerHTML;
}


window.receiveMatchmakingSummary = renderReport;


// Google Apps Script JSONP request.
const request = document.createElement('script');

request.src =
  `${REVIEW_ENDPOINT}` +
  `?callback=receiveMatchmakingSummary` +
  `${new URLSearchParams(location.search).get('event') ? `&event=${encodeURIComponent(new URLSearchParams(location.search).get('event'))}` : ''}` +
  `&v=${Date.now()}`;

request.onerror = renderFailure;

document.head.appendChild(request);
