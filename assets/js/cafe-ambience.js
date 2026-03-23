/* ================================================================
   CAFE-AMBIENCE.JS
   Procedural café ambient sound using Web Audio API.
   Layers:
     1. Brown noise  – room rumble / HVAC hum
     2. Murmur       – filtered noise bursts simulating chatter
     3. Clinks       – random glass/cup clink sounds
     4. Music hum    – very soft muffled background music drone
   Exposes: window.cafeAmbience = { toggle, isPlaying }
   ================================================================ */
(function () {
  'use strict';

  let ac = null;
  let masterGain = null;
  let running = false;

  // Keep track of nodes to cleanly stop them
  const nodes = [];

  /* ── Helper: get or create AudioContext ────────────────────────── */
  function getCtx() {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ac.createGain();
      masterGain.gain.setValueAtTime(0.001, ac.currentTime);
      masterGain.connect(ac.destination);
    }
    return ac;
  }

  /* ── 1. Brown noise source ─────────────────────────────────────── */
  function createBrownNoise(ctx, dest) {
    const bufSec  = 4;
    const bufLen  = ctx.sampleRate * bufSec;
    const buffer  = ctx.createBuffer(2, bufLen, ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5; // scale
      }
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop   = true;

    // Low-pass filter — keep only the rumble
    const lpf       = ctx.createBiquadFilter();
    lpf.type        = 'lowpass';
    lpf.frequency.value = 280;
    lpf.Q.value     = 0.7;

    const g = ctx.createGain();
    g.gain.value = 0.55;

    src.connect(lpf);
    lpf.connect(g);
    g.connect(dest);
    src.start();
    nodes.push(src);
  }

  /* ── 2. Murmur layer (crowd chatter) ───────────────────────────── */
  function createMurmur(ctx, dest) {
    // Use three slightly offset noise loops with different bandpass filters
    // to emulate overlapping voices
    const voices = [
      { freq: 320,  Q: 4,  vol: 0.28, rate: 0.98 },
      { freq: 520,  Q: 5,  vol: 0.22, rate: 1.01 },
      { freq: 740,  Q: 6,  vol: 0.18, rate: 0.995 },
      { freq: 1100, Q: 8,  vol: 0.10, rate: 1.003 },
    ];

    voices.forEach(v => {
      const bufLen = Math.floor(ctx.sampleRate * 3.7);
      const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data   = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer           = buffer;
      src.loop             = true;
      src.playbackRate.value = v.rate;

      const bpf     = ctx.createBiquadFilter();
      bpf.type      = 'bandpass';
      bpf.frequency.value = v.freq;
      bpf.Q.value   = v.Q;

      // Slow LFO to make volume wobble — like conversation rising/falling
      const lfo     = ctx.createOscillator();
      lfo.type      = 'sine';
      lfo.frequency.value = 0.07 + Math.random() * 0.05;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = v.vol * 0.35;

      const baseGain = ctx.createGain();
      baseGain.gain.value = v.vol * 0.65;

      const sumGain = ctx.createGain();
      sumGain.gain.value = 1;

      lfo.connect(lfoGain);
      lfoGain.connect(sumGain.gain); // modulate output gain
      src.connect(bpf);
      bpf.connect(baseGain);
      baseGain.connect(dest);

      src.start();
      lfo.start();
      nodes.push(src, lfo);
    });
  }

  /* ── 3. Random clinks (cup / glass) ────────────────────────────── */
  function scheduleClink(ctx, dest) {
    function playOneClink() {
      if (!running) return;

      const now    = ctx.currentTime;
      const freq   = 1800 + Math.random() * 2400; // high ping
      const dur    = 0.04 + Math.random() * 0.06;

      const osc    = ctx.createOscillator();
      osc.type     = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + dur);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.06, now + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.15);

      osc.connect(g);
      g.connect(dest);
      osc.start(now);
      osc.stop(now + dur + 0.2);

      // Schedule next clink: every 4–14 seconds
      const nextMs = (4000 + Math.random() * 10000);
      setTimeout(playOneClink, nextMs);
    }

    // First clink after 3–8 s
    setTimeout(playOneClink, 3000 + Math.random() * 5000);
  }

  /* ── 4. Muffled background music drone ─────────────────────────── */
  function createMusicHum(ctx, dest) {
    // A simple chord drone: root + minor third + fifth, very quiet
    const notes = [130.81, 155.56, 196.00]; // C3, Eb3, G3
    notes.forEach(freq => {
      const osc   = ctx.createOscillator();
      osc.type    = 'sawtooth';
      osc.frequency.value = freq;

      const lpf   = ctx.createBiquadFilter();
      lpf.type    = 'lowpass';
      lpf.frequency.value = 380;
      lpf.Q.value = 0.5;

      const g = ctx.createGain();
      g.gain.value = 0.018;

      osc.connect(lpf);
      lpf.connect(g);
      g.connect(dest);
      osc.start();
      nodes.push(osc);
    });
  }

  /* ── Fade master gain ───────────────────────────────────────────── */
  function fadeTo(value, durationSec) {
    if (!masterGain) return;
    masterGain.gain.cancelScheduledValues(ac.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime);
    masterGain.gain.linearRampToValueAtTime(value, ac.currentTime + durationSec);
  }

  /* ── Start ──────────────────────────────────────────────────────── */
  function start() {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    if (running) return;
    running = true;

    createBrownNoise(ctx, masterGain);
    createMurmur(ctx, masterGain);
    createMusicHum(ctx, masterGain);
    scheduleClink(ctx, masterGain);

    fadeTo(1, 2.5);
  }

  /* ── Stop ───────────────────────────────────────────────────────── */
  function stop() {
    if (!running) return;
    running = false;
    fadeTo(0, 1.5);
    setTimeout(() => {
      nodes.forEach(n => { try { n.stop(); } catch (_) {} });
      nodes.length = 0;
    }, 1800);
  }

  /* ── Toggle ─────────────────────────────────────────────────────── */
  function toggle() {
    if (running) { stop(); return false; }
    else         { start(); return true; }
  }

  window.cafeAmbience = { toggle, get isPlaying() { return running; } };

})();
