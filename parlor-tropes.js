(() => {
  'use strict';
  const endpoint = window.WEENKI_HOUSE_ENDPOINT || 'https://script.google.com/macros/s/AKfycby0K3Yqbjhtd8sxIpC451GUl2ZII3TcIGLdF2e7UifOAJF7YPXDQTMETQD76-PKIGlp/exec';
  const keys = ['bad-decision', 'yearner', 'adventure', 'sweetheart', 'aristocrat'];
  const pending = new Set();
  let sequence = 0;
  function fitTitles() {
    document.querySelectorAll('.date strong').forEach(heading => {
      heading.style.fontSize = '';
      let size = parseFloat(getComputedStyle(heading).fontSize);
      const words = [...heading.querySelectorAll('.date-title-word')];
      while (size > 12 && words.some(word => word.getBoundingClientRect().width > heading.clientWidth)) {
        size -= 0.5;
        heading.style.fontSize = size + 'px';
      }
    });
  }
  function showTitle(heading, name) {
    const lines = document.createElement('span');
    lines.className = 'date-title-lines';
    String(name).toUpperCase().trim().split(/\s+/).forEach((word, index) => {
      if (index) lines.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'date-title-word';
      span.textContent = word;
      lines.appendChild(span);
    });
    heading.replaceChildren(lines);
    fitTitles();
  }
  document.querySelectorAll('.date strong').forEach(heading => showTitle(heading, [...heading.childNodes].map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('')));
  window.addEventListener('resize', fitTitles);
  if (document.fonts) document.fonts.ready.then(fitTitles);
  function refresh() {
    keys.forEach(key => {
      if (pending.has(key)) return;
      const clues = document.querySelector(`.date[href="${key}/"] .date-tropes`);
      if (!clues) return;
      pending.add(key);
      const callback = '__parlorTropes_' + (++sequence);
      const script = document.createElement('script');
      let timeout;
      function cleanup() {
        clearTimeout(timeout);
        pending.delete(key);
        // Late responses may arrive after a timeout; retain a harmless handler then.
        window[callback] = () => {};
        script.remove();
      }
      window[callback] = payload => {
        try {
          if (!payload || !payload.success || !payload.config) return;
          const name = payload.config.archetype;
          if (name) {
            const card = document.querySelector(`.date[href="${key}/"]`);
            const heading = card && card.querySelector('strong');
            if (heading) showTitle(heading, name);
            const option = document.querySelector(`#letter-appointment option[data-resident-key="${key}"]`);
            if (option) {
              option.textContent = name;
              option.value = name;
            }
          }
          const source = payload.config.reveal && payload.config.reveal.tropes;
          if (!Array.isArray(source)) return;
          const tropes = source.flatMap(trope => String(trope || '').split(/\r?\n|\\n|,/))
            .map(trope => trope.trim()).filter(Boolean).slice(0, 3);
          clues.replaceChildren(...tropes.map(trope => {
            const span = document.createElement('span');
            span.textContent = trope;
            return span;
          }));
        } finally { cleanup(); }
      };
      script.onerror = cleanup;
      timeout = setTimeout(cleanup, 15000);
      script.src = endpoint + '?mode=config&key=' + encodeURIComponent(key)
        + '&callback=' + encodeURIComponent(callback) + '&v=' + Date.now();
      document.head.appendChild(script);
    });
  }
  refresh();
  window.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  window.setInterval(() => { if (!document.hidden) refresh(); }, 60000);
})();
