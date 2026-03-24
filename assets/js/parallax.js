/* ================================================================
   PARALLAX.JS  –  Advanced Smooth Parallax Engine  v2
   ================================================================
   Features:
   ① Scroll-based layer parallax  — [data-parallax-speed]
   ② Mouse-driven 3-D tilt        — [data-parallax-tilt]
   ③ Floating idle animation      — [data-parallax-float]  (CSS anim)
   ④ Magnetic cursor pull         — [data-parallax-magnetic]
   ⑤ Section depth fade-in        — .section (IntersectionObserver)
   ⑥ Mouse-follow depth layers    — [data-parallax-follow]
   ⑦ Lerp / spring physics        — all values interpolated in RAF
   ⑧ Reduced-motion safe          — prefers-reduced-motion respected

   Elements with both speed + tilt get composed transforms:
     perspective + translate(scroll) + rotateX/Y(mouse tilt)
   ================================================================ */
(function () {
  'use strict';

  /* ── Reduced-motion guard ──────────────────────────────────── */
  const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Math helpers ──────────────────────────────────────────── */
  const lerp = (a, b, t) => a + (b - a) * t;

  function makeSpring(stiffness, damping) {
    return { v: 0, x: 0, target: 0, k: stiffness || 0.1, d: damping || 0.72 };
  }
  function stepSpring(s) {
    const f = (s.target - s.x) * s.k;
    s.v     = s.v * s.d + f;
    s.x    += s.v;
    return s.x;
  }

  /* ── Global mouse (normalised –1 → +1) ────────────────────── */
  const mouse = { raw: { x: 0, y: 0 }, smooth: { x: 0, y: 0 } };
  window.addEventListener('mousemove', e => {
    mouse.raw.x = (e.clientX / innerWidth  - 0.5) * 2;
    mouse.raw.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ── Scroll ────────────────────────────────────────────────── */
  let rawScroll = 0;
  window.addEventListener('scroll', () => { rawScroll = window.scrollY; }, { passive: true });

  /* ================================================================
     ①  SCROLL PARALLAX  —  data-parallax-speed="0.2"
         data-parallax-axis="y|x"  (default: y)
         Skips elements that also have tilt (they compose their own).
     ================================================================ */
  const layers = [];

  function initScrollParallax() {
    document.querySelectorAll('[data-parallax-speed]').forEach(el => {
      if (el.dataset.parallaxTilt !== undefined) return; // handled by tilt
      layers.push({
        el,
        speed : parseFloat(el.dataset.parallaxSpeed) || 0.2,
        axis  : el.dataset.parallaxAxis || 'y',
        cy    : 0, cx : 0,
      });
    });
  }

  function tickScrollParallax() {
    const vH = innerHeight;
    layers.forEach(l => {
      const rect   = l.el.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5 - vH * 0.5;
      const ty = l.axis !== 'x' ? center * l.speed * -1 : 0;
      const tx = l.axis === 'x' ? center * l.speed * -1 : 0;
      l.cy = lerp(l.cy, ty, 0.07);
      l.cx = lerp(l.cx, tx, 0.07);
      l.el.style.transform =
        `translate3d(${l.cx.toFixed(2)}px,${l.cy.toFixed(2)}px,0)`;
    });
  }

  /* ================================================================
     ②  MOUSE TILT  —  data-parallax-tilt="12"
         data-parallax-glare="false"  — disable light sweep
         Supports combined scroll+tilt (both attributes present).
     ================================================================ */
  const tilts = [];

  function initTilt() {
    document.querySelectorAll('[data-parallax-tilt]:not([data-pax-init])').forEach(el => {
      el.setAttribute('data-pax-init', '1');
      const maxTilt   = parseFloat(el.dataset.parallaxTilt) || 12;
      const hasGlare  = el.dataset.parallaxGlare !== 'false';
      const hasScroll = el.dataset.parallaxSpeed !== undefined;
      const speed     = hasScroll ? (parseFloat(el.dataset.parallaxSpeed) || 0.2) : 0;

      el.style.willChange     = 'transform';
      el.style.position       = el.style.position || 'relative';
      el.style.overflow       = el.style.overflow  || 'hidden';
      el.style.transformStyle = 'preserve-3d';

      let glare = null;
      if (hasGlare) {
        glare = document.createElement('div');
        glare.className = 'parallax-glare';
        el.appendChild(glare);
      }

      const entry = {
        el, maxTilt, glare, hasScroll, speed,
        inside : false,
        rx : makeSpring(0.1, 0.72),
        ry : makeSpring(0.1, 0.72),
        cy : 0,
      };
      tilts.push(entry);

      el.addEventListener('mouseenter', () => { entry.inside = true; }, { passive: true });
      el.addEventListener('mouseleave', () => {
        entry.inside    = false;
        entry.rx.target = 0;
        entry.ry.target = 0;
        if (glare) glare.style.opacity = '0';
      }, { passive: true });
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        entry.rx.target = ny * -maxTilt;
        entry.ry.target = nx *  maxTilt;
        if (glare) {
          const deg = Math.atan2(ny, nx) * (180 / Math.PI);
          glare.style.background =
            `linear-gradient(${deg}deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,0) 72%)`;
          glare.style.opacity = '1';
        }
      }, { passive: true });
    });
  }

  function tickTilt() {
    const vH = innerHeight;
    tilts.forEach(t => {
      if (t.hasScroll) {
        const rect   = t.el.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5 - vH * 0.5;
        t.cy = lerp(t.cy, center * t.speed * -1, 0.07);
      }
      const rx = stepSpring(t.rx);
      const ry = stepSpring(t.ry);
      t.el.style.transform = t.hasScroll
        ? `perspective(900px) translate3d(0,${t.cy.toFixed(2)}px,0) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`
        : `perspective(900px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateZ(0)`;
    });
  }

  /* ================================================================
     ③  FLOATING IDLE  —  data-parallax-float="12"
         data-parallax-float-dur="4"    (seconds)
         data-parallax-float-delay="0"  (seconds, or auto-stagger)
     ================================================================ */
  function initFloat() {
    document.querySelectorAll('[data-parallax-float]').forEach((el, i) => {
      el.style.setProperty('--float-amp',   `${parseFloat(el.dataset.parallaxFloat)    || 12}px`);
      el.style.setProperty('--float-dur',   `${parseFloat(el.dataset.parallaxFloatDur) || 4}s`);
      el.style.setProperty('--float-delay', `${parseFloat(el.dataset.parallaxFloatDelay) || i * 0.45}s`);
      el.classList.add('parallax-floating');
    });
  }

  /* ================================================================
     ④  MAGNETIC BUTTONS  —  data-parallax-magnetic="0.4"
     ================================================================ */
  const magnets = [];

  function initMagnetic() {
    document.querySelectorAll('[data-parallax-magnetic]:not([data-pax-init])').forEach(el => {
      el.setAttribute('data-pax-init', '1');
      const strength = parseFloat(el.dataset.parallaxMagnetic) || 0.4;
      const entry = {
        el, strength,
        active : false,
        sx : makeSpring(0.14, 0.62),
        sy : makeSpring(0.14, 0.62),
      };
      magnets.push(entry);

      el.addEventListener('mouseenter', () => { entry.active = true; }, { passive: true });
      el.addEventListener('mouseleave', () => {
        entry.active    = false;
        entry.sx.target = 0;
        entry.sy.target = 0;
      }, { passive: true });
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        entry.sx.target = (e.clientX - (r.left + r.width  / 2)) * strength;
        entry.sy.target = (e.clientY - (r.top  + r.height / 2)) * strength;
      }, { passive: true });
    });
  }

  function tickMagnetic() {
    magnets.forEach(m => {
      const x = stepSpring(m.sx);
      const y = stepSpring(m.sy);
      m.el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    });
  }

  /* ================================================================
     ⑤  SECTION ENTRANCE  —  .section:not(#hero)  (auto-detected)
         JS adds .parallax-section-hidden first (so sections are
         visible if JS is slow/blocked), then IntersectionObserver
         swaps it to .parallax-section-in when entering viewport.
     ================================================================ */
  function initSectionDepth() {
    const sections = Array.from(document.querySelectorAll('.section:not(#hero)'));

    if (PRM) {
      sections.forEach(s => s.classList.add('parallax-section-in'));
      return;
    }

    // Mark all as hidden NOW (synchronously, before first paint of these sections)
    sections.forEach(s => s.classList.add('parallax-section-hidden'));

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('parallax-section-hidden');
          entry.target.classList.add('parallax-section-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    sections.forEach(s => obs.observe(s));
  }

  /* ================================================================
     ⑥  CURSOR FOLLOW  —  data-parallax-follow="0.05"
         Decorative orbs drift gently toward the cursor.
     ================================================================ */
  const followers = [];

  function initFollow() {
    document.querySelectorAll('[data-parallax-follow]').forEach(el => {
      followers.push({
        el,
        speed : parseFloat(el.dataset.parallaxFollow) || 0.05,
        sx    : makeSpring(0.06, 0.78),
        sy    : makeSpring(0.06, 0.78),
      });
    });
  }

  function tickFollow() {
    followers.forEach(f => {
      f.sx.target = mouse.smooth.x * innerWidth  * f.speed;
      f.sy.target = mouse.smooth.y * innerHeight * f.speed;
      const x = stepSpring(f.sx);
      const y = stepSpring(f.sy);
      f.el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    });
  }

  /* ================================================================
     MAIN RAF LOOP
     ================================================================ */
  function tick() {
    requestAnimationFrame(tick);
    mouse.smooth.x = lerp(mouse.smooth.x, mouse.raw.x, 0.075);
    mouse.smooth.y = lerp(mouse.smooth.y, mouse.raw.y, 0.075);
    if (PRM) return;
    tickScrollParallax();
    tickTilt();
    tickMagnetic();
    tickFollow();
  }

  /* ================================================================
     BOOT
     ================================================================ */
  function init() {
    initScrollParallax();
    initTilt();
    initFloat();
    initMagnetic();
    initSectionDepth();
    initFollow();
    tick();
  }

  /* Public API — call after dynamically injecting tilt/magnetic elements */
  window.parallaxRefresh = function () {
    initTilt();
    initMagnetic();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    requestAnimationFrame(init);
  }

})();
