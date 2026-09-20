(() => {
  'use strict';
  const endpoint = window.WEENKI_HOUSE_ENDPOINT;
  const archive = document.getElementById('archive');

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
  }

  const awardLabels = {
    mostSuccessfulMatch: '🏆 Most Successful Match',
    mostChemistry: '♥ Most Chemistry',
    spiciestDate: '🌶️ Spiciest Date',
    mostPopularMatch: '💌 Most Popular Match',
    mostFrequentlyBlocked: '✕ Most Frequently Blocked',
    mostCompleted: '🏁 Most Dates Completed',
    strongestSecondDate: '💌 Most Likely Second Date',
    strongestGoodbye: '🚪 Most Decisive Goodbye'
  };

  function residentAwards(config, awards) {
    const title = String(config?.book?.title || '');
    return Object.entries(awards || {}).flatMap(([key, winners]) => {
      const items = Array.isArray(winners) ? winners : (winners ? [winners] : []);
      return items.some(item => String(item.book || '') === title) && awardLabels[key]
        ? [`<span>${esc(awardLabels[key])}</span>`]
        : [];
    }).join('');
  }

  function residentCard(config, awards) {
    const book = config.book || {};
    const profile = config.profile || {};
    return `<article class="resident">
      <a class="cover-link" href="${esc(book.sourceUrl || '#')}" target="_blank" rel="noopener noreferrer">
        <img src="${esc(book.coverUrl || '')}" alt="Cover of ${esc(book.title || 'former resident')} by ${esc(book.author || 'unknown author')}">
      </a>
      <p class="archetype">${esc(config.archetype || 'FORMER RESIDENT')}</p>
      <h3>${esc(book.title || 'Title withheld')}</h3>
      <p class="author">${esc(book.author || '')}</p>
      <p class="teaser">${esc(profile.teaser || '')}</p>
      <div class="resident-awards">${residentAwards(config, awards)}</div>
    </article>`;
  }

  function render(payload) {
    const rounds = payload?.rounds || [];
    if (!rounds.length) {
      const active = payload?.activeRound || {title:"The House's Debut",date:'October 2026'};
      archive.innerHTML = `<div class="empty"><strong>NO ONE HAS MOVED OUT YET.</strong>${esc(active.title)} · ${esc(active.date)} remains in residence. The archivist is disappointed but prepared.</div>`;
      return;
    }
    archive.innerHTML = rounds.map(round => `<section class="round">
      <header class="round-head"><h2>${esc(round.title)}</h2><p class="round-date">${esc(round.date)} · ${Number(round.totalReviews || 0)} reviews filed</p></header>
      <div class="residents">${(round.residents || []).map(config => residentCard(config, round.awards)).join('')}</div>
      <a class="full-report" href="../awards/?event=${encodeURIComponent(round.id)}">VIEW THE FULL MATCHMAKING REPORT →</a>
    </section>`).join('');
  }

  if (!endpoint) {
    archive.innerHTML = '<div class="failure">The archive door appears to be locked.</div>';
    return;
  }
  const callback = '__weenkiFormerResidents_' + Date.now();
  const request = document.createElement('script');
  window[callback] = payload => {
    try { render(payload); }
    finally { delete window[callback]; request.remove(); }
  };
  request.onerror = () => {
    archive.innerHTML = '<div class="failure">The old ledgers could not be reached. The archivist blames management.</div>';
    delete window[callback];
    request.remove();
  };
  request.src = `${endpoint}?mode=archive&callback=${encodeURIComponent(callback)}&v=${Date.now()}`;
  document.head.appendChild(request);
})();
