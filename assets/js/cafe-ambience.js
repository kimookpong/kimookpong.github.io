/* ================================================================
   CAFE-AMBIENCE.JS
   Plays assets/sound/cafe.mp3 as looping background ambience.
   Fade in/out via Web Audio API GainNode for smooth transitions.
   AudioContext is created ONLY inside start() — after a user gesture —
   to comply with browser autoplay policy.
   Exposes: window.cafeAmbience = { toggle, isPlaying }
   ================================================================ */
(function () {
  'use strict';

  let ac       = null;
  let source   = null;   // MediaElementSourceNode
  let gainNode = null;
  let audio    = null;   // HTMLAudioElement
  let running  = false;
  let fadeTick = null;

  const FADE_STEPS  = 40;
  const FADE_IN_MS  = 2500;
  const FADE_OUT_MS = 1500;
  const TARGET_VOL  = 0.55;

  /* ── Init audio + AudioContext (call only after user gesture) ── */
  function initAudio() {
    // Create HTMLAudioElement once (no AudioContext yet)
    if (!audio) {
      audio = new Audio('assets/sound/cafe.mp3');
      audio.loop    = true;
      audio.preload = 'auto';
    }

    // Create AudioContext only when we're actually about to play
    if (!ac) {
      ac       = new (window.AudioContext || window.webkitAudioContext)();
      source   = ac.createMediaElementSource(audio);
      gainNode = ac.createGain();
      gainNode.gain.value = 0;
      source.connect(gainNode);
      gainNode.connect(ac.destination);
    }

    // If the context was suspended by the browser, resume it now
    if (ac.state === 'suspended') {
      return ac.resume();
    }
    return Promise.resolve();
  }

  /* ── Smooth fade helper ──────────────────────────────────────── */
  function fadeTo(targetVol, durationMs, onDone) {
    if (!gainNode) return;
    clearInterval(fadeTick);

    const startVol = gainNode.gain.value;
    const diff     = targetVol - startVol;
    const interval = durationMs / FADE_STEPS;
    let   step     = 0;

    fadeTick = setInterval(() => {
      step++;
      const t    = step / FADE_STEPS;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      gainNode.gain.value = startVol + diff * ease;
      if (step >= FADE_STEPS) {
        clearInterval(fadeTick);
        gainNode.gain.value = targetVol;
        if (onDone) onDone();
      }
    }, interval);
  }

  /* ── Start ───────────────────────────────────────────────────── */
  function start() {
    if (running) return;
    running = true;

    // initAudio() creates/resumes AudioContext inside this user-gesture call stack
    initAudio().then(() => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      fadeTo(TARGET_VOL, FADE_IN_MS);
    });
  }

  /* ── Stop ────────────────────────────────────────────────────── */
  function stop() {
    if (!running) return;
    running = false;
    fadeTo(0, FADE_OUT_MS, () => {
      if (audio) audio.pause();
    });
  }

  /* ── Toggle ──────────────────────────────────────────────────── */
  function toggle() {
    if (running) { stop(); return false; }
    else         { start(); return true; }
  }

  window.cafeAmbience = { toggle, get isPlaying() { return running; } };

})();
