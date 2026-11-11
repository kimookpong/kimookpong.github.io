(() => {
  const P = {
    home: '<path d="M3 11l9-7.5 9 7.5"/><path d="M5.5 9.5V20h13V9.5M10 20v-6h4v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    pill: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>',
    hospital: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8v8M8 12h8"/>',
    grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5v4.5c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.8 0 4.5 2 4.5 5"/>',
    box: '<path d="M12 3l8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12C12 8 9 5.5 4.5 5.5 4.5 10 7 12 12 12z"/><path d="M12 14c0-3 2.3-5 6.5-5 0 3.5-2 5-6.5 5z"/>',
    utensils: '<path d="M6 3v7a2 2 0 002 2v9M10 3v7a2 2 0 01-2 2"/><path d="M17 21V3c-2.5 1.5-3.5 4-3.5 7.5 0 1.6 1.2 2.5 3.5 2.5"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3M20 14v.01M14 20h.01M17 20h3v-3"/>',
    plane: '<path d="M21 3L3 10.5l6.5 2.5L12 20z"/><path d="M9.5 13L21 3"/>',
    landmark: '<path d="M3 9l9-5 9 5z"/><path d="M5 9v8M10 9v8M14 9v8M19 9v8M3 20h18"/>',
    gamepad: '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18" cy="13.8" r=".8"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    cow: '<path d="M5 8c-2 0-3-1.5-3-3 2 0 3.5.5 4.5 1.8M19 8c2 0 3-1.5 3-3-2 0-3.5.5-4.5 1.8"/><path d="M6.5 6.8C8 6 10 5.5 12 5.5s4 .5 5.5 1.3c.8 3-.3 5.7-1 8.2-.4 2-2 4-4.5 4s-4.1-2-4.5-4c-.7-2.5-1.8-5.2-1-8.2z"/><circle cx="9.5" cy="11" r=".7"/><circle cx="14.5" cy="11" r=".7"/><ellipse cx="12" cy="16.2" rx="2.6" ry="1.7"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    pin: '<path d="M12 21s7-6 7-11.5A7 7 0 005 9.5C5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    react: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
    db: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
    docker: '<path d="M2.5 12.5h17.5c0 4-3.5 7-8 7s-8.5-3-9.5-7z"/><path d="M5 9.5h3v3H5zM8 9.5h3v3H8zM11 9.5h3v3h-3zM8 6.5h3v3H8zM11 6.5h3v3h-3z"/>',
    node: '<path d="M12 2.5l8 4.5v10l-8 4.5-8-4.5V7z"/><path d="M9 15.5V9l6 6.5V9"/>',
    coffee: '<path d="M4 9h12v5a5 5 0 01-5 5H9a5 5 0 01-5-5z"/><path d="M16 10h2a2.5 2.5 0 010 5h-2M7 3c0 1.5 1 1.5 1 3M11 3c0 1.5 1 1.5 1 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"/>',
    sparkle: '<path d="M12 2c.8 5.2 3.8 8.2 10 10-6.2 1.8-9.2 4.8-10 10-.8-5.2-3.8-8.2-10-10 6.2-1.8 9.2-4.8 10-10z" fill="currentColor" stroke="none"/>',
    star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill="currentColor" stroke="none"/>'
  };
  const EMO = { '💊': 'pill', '🏥': 'hospital', '🎓': 'grad', '👥': 'users', '📦': 'box', '🌱': 'sprout', '🍽': 'utensils', '▦': 'qr', '✈': 'plane', '🏛': 'landmark', '🎮': 'gamepad', '⏱': 'timer', '⚡': 'bolt', '🐄': 'cow', '🎙': 'mic', '📱': 'phone', '📍': 'pin', '⚛': 'react', '🐘': 'db', '🐳': 'docker', '🟢': 'node', '☕': 'coffee', '✦': 'sparkle', '☀': 'sun', '☾': 'moon', '★': 'star' };
  window.ICON = (n, grad) => {
    n = P[n] ? n : EMO[String(n).replace(/️/g, '')];
    if (!P[n]) return '';
    return `<svg class="ic${grad ? ' ic-grad' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
  };
  // shared gradient for .ic-grad
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="icg" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0" stop-color="#7c6cff"/><stop offset=".55" stop-color="#ff7aa8"/><stop offset="1" stop-color="#ffb86b"/></linearGradient></defs></svg>');
  const re = /[✦☕☀☾★📍]/g;
  const fillIc = root => root.querySelectorAll && root.querySelectorAll('[data-ic]:not([data-done])').forEach(e => { e.innerHTML = ICON(e.dataset.ic, e.hasAttribute('data-grad')); e.dataset.done = 1; });
  const swap = root => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [];
    for (let n; (n = w.nextNode());) if (re.test(n.nodeValue) && !n.parentElement.closest('script,style,#typed,textarea')) hits.push(n); else re.lastIndex = 0;
    hits.forEach(n => {
      const span = document.createElement('span'); span.className = 'ic-wrap';
      span.innerHTML = n.nodeValue.replace(re, c => ICON(c)); n.replaceWith(...span.childNodes);
    });
    fillIc(root);
  };
  const run = () => swap(document.body);
  run();
  let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { obs.disconnect(); run(); obs.observe(document.body, o); }, 30); });
  const o = { childList: true, subtree: true, characterData: true };
  const obs = new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { obs.disconnect(); run(); obs.observe(document.body, o); }, 30); });
  obs.observe(document.body, o);
})();
