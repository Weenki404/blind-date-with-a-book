(() => {
  'use strict';
  const endpoint = window.WEENKI_HOUSE_ENDPOINT || 'https://script.google.com/macros/s/AKfycby0K3Yqbjhtd8sxIpC451GUl2ZII3TcIGLdF2e7UifOAJF7YPXDQTMETQD76-PKIGlp/exec';
  const params = new URLSearchParams(location.search);
  const setting = params.get('traffic');
  let disabled = false;
  const randomID = () => (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'house_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  let visitorId;
  try {
    if (setting === 'off') localStorage.setItem('weenki-traffic-disabled','1');
    if (setting === 'on') localStorage.removeItem('weenki-traffic-disabled');
    disabled = localStorage.getItem('weenki-traffic-disabled') === '1';
    visitorId = localStorage.getItem('weenki-browser-id');
    if (!visitorId && !disabled) { visitorId = randomID(); localStorage.setItem('weenki-browser-id',visitorId); }
  } catch (_) { visitorId = randomID(); disabled = setting === 'off'; }
  if (setting === 'on' || setting === 'off') {
    const clean = new URL(location.href); clean.searchParams.delete('traffic');
    history.replaceState(null,'',clean.href);
  }
  if (disabled) return;
  const known = ['bad-decision','yearner','adventure','sweetheart','aristocrat','awards','former-residents'];
  const parts = location.pathname.split('/').filter(Boolean);
  const last = parts[parts.length-1];
  const page = known.includes(last) ? last : 'parlor';
  function send(action) {
    const body = JSON.stringify({type:'house-traffic',eventId:randomID(),visitorId,action,page});
    fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body,keepalive:true}).catch(() => {});
  }
  send('visit');
  const parcel = document.getElementById('parcel');
  let revealed = false;
  if (parcel) parcel.addEventListener('click', () => { if (!revealed) { revealed = true; send('reveal'); } });
})();
