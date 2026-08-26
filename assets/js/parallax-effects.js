(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  if (reduceMotion.matches) return;

  const decorations = [
    ['✦', 'decor decor-one', 0.12],
    ['⌁', 'decor decor-two', -0.08],
    ['●', 'decor decor-three', 0.18],
    ['✎', 'decor decor-four', -0.14],
    ['{ }', 'decor decor-five', 0.1],
    ['☕', 'decor decor-six', -0.16]
  ];
  const layer = document.createElement('div');
  layer.className = 'parallax-decorations';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = decorations.map(([symbol, className, speed]) =>
    `<span class="${className}" data-parallax-speed="${speed}">${symbol}</span>`
  ).join('');
  document.body.append(layer);

  const assignments = [
    ['.portrait .sun', -0.09, 0.035],
    ['.portrait picture', 0.06, 0.055],
    ['.portrait .n1', -0.15, 0.085],
    ['.portrait .n2', 0.13, 0.07],
    ['.hero .eyebrow', -0.04, 0.018],
    ['.hero h1', 0.025, 0.014],
    ['.ticker div', -0.035, 0],
    ['.section > .kicker', -0.045, 0.012],
    ['.heatmap', 0.035, 0.012],
    ['.contact h2', -0.035, 0.015]
  ];
  assignments.forEach(([selector, scroll, pointer]) => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.add('parallax-item');
      element.dataset.parallaxSpeed = scroll;
      element.dataset.pointerSpeed = pointer;
    });
  });

  const items = [...document.querySelectorAll('[data-parallax-speed]')];
  let pointerX = 0;
  let pointerY = 0;
  let scrollY = window.scrollY;
  let scheduled = false;

  function update() {
    scheduled = false;
    const viewportCenter = innerHeight / 2;
    items.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -180 || rect.top > innerHeight + 180) return;
      const speed = Number(element.dataset.parallaxSpeed || 0);
      const pointerSpeed = Number(element.dataset.pointerSpeed || 0);
      const distance = rect.top + rect.height / 2 - viewportCenter;
      const y = Math.max(-55, Math.min(55, distance * speed));
      const x = pointerX * pointerSpeed;
      const mouseY = pointerY * pointerSpeed;
      element.style.setProperty('--parallax-x', `${x.toFixed(2)}px`);
      element.style.setProperty('--parallax-y', `${(y + mouseY).toFixed(2)}px`);
    });
  }

  function requestUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  addEventListener('scroll', () => { scrollY = window.scrollY; requestUpdate(); }, { passive: true });
  if (finePointer.matches) {
    addEventListener('pointermove', event => {
      pointerX = event.clientX - innerWidth / 2;
      pointerY = event.clientY - innerHeight / 2;
      requestUpdate();
    }, { passive: true });
  }
  addEventListener('resize', requestUpdate, { passive: true });
  update();
})();
