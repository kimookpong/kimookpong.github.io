(() => {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot = document.createElement('i'), ring = document.createElement('i');
  dot.className = 'cur-dot'; ring.className = 'cur-ring';
  ring.innerHTML = '<b></b>';
  document.body.append(ring, dot);
  document.documentElement.classList.add('custom-cursor');
  let x = -100, y = -100, rx = x, ry = y, sx = 0, sy = 0;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px,${y}px)`;
    const t = e.target.closest ? e.target.closest('a,button,.project,.stack-card,.repo-card,.skill,input,textarea') : null;
    ring.classList.toggle('link', !!t);
    ring.classList.toggle('gem', !t && document.body.classList.contains('gl-hover'));
  }, { passive: true });
  addEventListener('pointerdown', () => ring.classList.add('down'));
  addEventListener('pointerup', () => ring.classList.remove('down'));
  document.addEventListener('pointerleave', () => { dot.style.opacity = ring.style.opacity = 0; });
  document.addEventListener('pointerenter', () => { dot.style.opacity = ring.style.opacity = 1; });
  (function loop() {
    const px = rx; rx += (x - rx) * .16; ry += (y - ry) * .16;
    // stretch the ring along its velocity for a liquid feel
    sx += ((rx - px) - sx) * .3; sy += ((ry - ry) - sy) * .3;
    const v = Math.min(Math.hypot(x - rx, y - ry) / 90, .45), a = Math.atan2(y - ry, x - rx) * 180 / Math.PI;
    ring.style.transform = `translate(${rx}px,${ry}px) rotate(${a}deg) scale(${1 + v},${1 - v * .5})`;
    requestAnimationFrame(loop);
  })();
})();
