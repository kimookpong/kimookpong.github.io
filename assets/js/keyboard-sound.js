/* ================================================================
   KEYBOARD-SOUND.JS
   Synthetic mechanical keyboard click using Web Audio API.
   No audio files needed — all sounds are generated procedurally.
   Triggered by the typing animation in main.js via window.kbClick()
   ================================================================ */
(function () {
  'use strict';

  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  /**
   * Plays a single synthetic mechanical key click.
   * Layered: a short noise burst (contact) + a soft low thump (bottom-out).
   * @param {boolean} [isDelete=false] – slightly different tone for backspace
   */
  function playKeyClick(isDelete = false) {
    try {
      const ac  = getCtx();
      const now = ac.currentTime;

      // ── 1. Noise burst (the "click" of the switch actuating) ──────
      const bufLen = Math.floor(ac.sampleRate * 0.025); // 25 ms
      const buffer = ac.createBuffer(1, bufLen, ac.sampleRate);
      const data   = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 6);
      }

      const noiseSource = ac.createBufferSource();
      noiseSource.buffer = buffer;

      // Band-pass filter — mimics the "click" frequency of a mech switch
      const bpf       = ac.createBiquadFilter();
      bpf.type        = 'bandpass';
      bpf.frequency.value = isDelete ? 2200 : 3200;
      bpf.Q.value     = 1.2;

      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(isDelete ? 0.18 : 0.22, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      noiseSource.connect(bpf);
      bpf.connect(noiseGain);
      noiseGain.connect(ac.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.03);

      // ── 2. Thump (key bottom-out) ─────────────────────────────────
      const osc       = ac.createOscillator();
      osc.type        = 'sine';
      osc.frequency.setValueAtTime(isDelete ? 160 : 200, now);
      osc.frequency.exponentialRampToValueAtTime(isDelete ? 60 : 80, now + 0.04);

      const thumpGain = ac.createGain();
      thumpGain.gain.setValueAtTime(isDelete ? 0.12 : 0.15, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(thumpGain);
      thumpGain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.07);

    } catch (e) {
      // Silently ignore – audio is purely cosmetic
    }
  }

  // Expose globally so main.js typing loop can call it
  window.kbClick = playKeyClick;

})();
