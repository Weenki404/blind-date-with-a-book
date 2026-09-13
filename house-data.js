(() => {
  'use strict';

  const ENDPOINT = "https://script.google.com/macros/s/AKfycby0K3Yqbjhtd8sxIpC451GUl2ZII3TcIGLdF2e7UifOAJF7YPXDQTMETQD76-PKIGlp/exec";
  const VALID_KEYS = new Set(["bad-decision", "yearner", "adventure", "sweetheart", "aristocrat"]);

  // One canonical endpoint for the whole House. Review forms and the Trophy
  // Case can use this too, so a future deployment URL only needs changing here.
  window.WEENKI_HOUSE_ENDPOINT = ENDPOINT;

  const parts = window.location.pathname.split('/').filter(Boolean);
  const key = parts[parts.length - 1] || '';
  if (!VALID_KEYS.has(key)) return;

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  function applyConfig(config) {
    if (!config || !config.book || !config.profile || !config.reveal) return;

    window.currentDateConfig = config;

    setText('.teaser', config.profile.teaser);
    setText('.gift-tag > em', config.profile.tagline);
    setText('.open-label small', config.profile.ctaSubline);
    setText('.match-sub', config.reveal.matchSub);
    setText('.verdict', config.reveal.verdict);
    setText('.details-title', config.reveal.detailsTitle);

    // Profile rows stay in the exact existing layout; only the words change.
    const rowEls = [...document.querySelectorAll('.profile-lines > span')];
    (config.profile.rows || []).slice(0, 3).forEach((row, i) => {
      if (!rowEls[i]) return;
      const b = document.createElement('b');
      b.textContent = row.label || '';
      rowEls[i].replaceChildren(b, document.createTextNode(' ' + (row.value || '')));
    });

    // CTA text is a direct text node between the decorative symbols.
    const openLabel = document.querySelector('.open-label');
    if (openLabel && config.profile.cta) {
      const directTextNodes = [...openLabel.childNodes].filter(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
      if (directTextNodes.length) {
        directTextNodes[0].textContent = '\n          ' + config.profile.cta + '\n          ';
      }
    }

    const coverCard = document.querySelector('.cover-card');
    const coverLink = document.querySelector('.cover-link');
    const coverImg = document.querySelector('.book-cover');
    const titleEl = document.querySelector('.cover-caption strong');
    const authorEl = document.querySelector('.cover-caption span');

    if (titleEl) titleEl.textContent = config.book.title || '';
    if (authorEl) authorEl.textContent = config.book.author || '';

    if (coverLink) {
      coverLink.href = config.book.sourceUrl || '#';
      coverLink.setAttribute(
        'aria-label',
        `View ${config.book.title || 'this book'} by ${config.book.author || 'the author'}`
      );
    }

    if (coverImg) {
      coverImg.src = config.book.coverUrl || '';
      coverImg.alt = `Cover of ${config.book.title || 'the book'} by ${config.book.author || 'the author'}`;
    }

    if (coverCard) {
      coverCard.setAttribute(
        'aria-label',
        `Your date is ${config.book.title || 'Unknown'} by ${config.book.author || 'Unknown'}`
      );
    }

    const message = document.querySelector('.message');
    if (message) {
      const lead = document.createTextNode((config.reveal.messageLead || 'You chose') + ' ');
      const strong = document.createElement('strong');
      strong.textContent = (config.archetype || '') + '.';
      const br = document.createElement('br');
      const body = document.createTextNode(config.reveal.messageBody || '');
      message.replaceChildren(lead, strong, br, body);
    }

    const chips = document.querySelector('.chips');
    if (chips) {
      chips.replaceChildren();
      (config.reveal.tropes || []).forEach(trope => {
        const span = document.createElement('span');
        span.textContent = trope;
        chips.appendChild(span);
      });
    }

    const warning = document.querySelector('.warning-note p');
    if (warning) {
      const strong = document.createElement('strong');
      strong.textContent = 'House warning:';
      warning.replaceChildren(
        strong,
        document.createTextNode(' ' + (config.reveal.warning || ''))
      );
    }

    document.title = `${config.archetype || 'Blind Date'} · Blind Date With a Book`;
    document.documentElement.dataset.houseConfig = 'loaded';
  }

  function requestConfig() {
    const callback = '__weenkiHouseConfig_' + key.replace(/[^a-z0-9]/gi, '_') + '_' + Date.now();
    const script = document.createElement('script');

    window[callback] = payload => {
      try {
        if (payload && payload.success && payload.config) {
          applyConfig(payload.config);
        } else {
          console.warn('The House returned no published config; using the baked-in fallback.');
        }
      } finally {
        delete window[callback];
        script.remove();
      }
    };

    script.onerror = () => {
      console.warn('The House records could not be reached; using the baked-in fallback.');
      delete window[callback];
      script.remove();
    };

    script.src =
      ENDPOINT +
      '?mode=config' +
      '&key=' + encodeURIComponent(key) +
      '&callback=' + encodeURIComponent(callback) +
      '&v=' + Date.now();

    document.head.appendChild(script);
  }

  requestConfig();
})();
