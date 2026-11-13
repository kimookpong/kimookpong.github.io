/* =========================================================
   Music — a projector screen on the back wall of the scene plays a
   looping YouTube playlist (like slides being presented behind the
   person), controlled from a frosted dock at the bottom of the screen.
   The YouTube player script only loads after the first tap (no cost
   or tracking until then).
   ========================================================= */
(() => {
  const TRACKS = ['h-KuoHHjGRs', 'T8y_RsF4TSw', 'EMYa07zHC9w'];   // played in order, then loops
  const watch = id => `https://www.youtube.com/watch?v=${id}`;
  const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const L = {
    en: { play: 'Play music', pause: 'Pause music', prev: 'Previous song', next: 'Next song', mute: 'Mute', unmute: 'Unmute', tap: 'Tap to play · YouTube', now: 'Now playing', paused: 'Paused', loading: 'Loading…', open: 'Open on YouTube', title: 'Music' },
    th: { play: 'เล่นเพลง', pause: 'หยุดเพลง', prev: 'เพลงก่อนหน้า', next: 'เพลงถัดไป', mute: 'ปิดเสียง', unmute: 'เปิดเสียง', tap: 'แตะเพื่อเล่น · YouTube', now: 'กำลังเล่น', paused: 'หยุดชั่วคราว', loading: 'กำลังโหลด…', open: 'เปิดบน YouTube', title: 'เพลง' }
  };
  const tr = k => (L[document.documentElement.lang] || L.en)[k];
  const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const I = {
    play: svg('<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>'),
    pause: svg('<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/>'),
    prev: svg('<path d="M18 6v12l-8.5-6z" fill="currentColor"/><rect x="6" y="6" width="2.4" height="12" rx="1" fill="currentColor"/>'),
    next: svg('<path d="M6 6v12l8.5-6z" fill="currentColor"/><rect x="15.6" y="6" width="2.4" height="12" rx="1" fill="currentColor"/>'),
    vol: svg('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    mute: svg('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    yt: svg('<path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8z" fill="currentColor"/><path d="M10 15V9l5.2 3z" fill="#0b0d16"/>')
  };

  /* ---- projector screen, placed on the wall just in front of the office photo ---- */
  const proj = document.createElement('div');
  proj.className = 'projector'; proj.id = 'projector';
  proj.innerHTML = `
    <span class="pj-spill" aria-hidden="true"></span>
    <span class="pj-roll" aria-hidden="true"></span>
    <div class="pj-screen">
      <span class="pj-thumb" aria-hidden="true"></span>
      <span class="pj-video" aria-hidden="true"><span id="ytPlayer"></span></span>
      <span class="pj-shade" aria-hidden="true"></span>
    </div>`;
  const bgEl = document.getElementById('bg');
  if (bgEl) bgEl.after(proj); else document.body.appendChild(proj);

  /* ---- dock ---- */
  const dock = document.createElement('div');
  dock.className = 'music';
  dock.innerHTML = `
    <div class="m-bar">
      <span class="m-bg" aria-hidden="true"></span>
      <button class="m-skip m-prev" type="button"></button>
      <button class="m-play" type="button"></button>
      <button class="m-skip m-next" type="button"></button>
      <span class="m-info"><b class="m-title"></b><small class="m-sub"></small><span class="m-prog" aria-hidden="true"><i></i></span></span>
      <span class="m-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <button class="m-mute" type="button" hidden></button>
      <a class="m-yt" target="_blank" rel="noopener"></a>
    </div>`;
  document.body.appendChild(dock);
  document.body.classList.add('has-music');
  const $ = s => dock.querySelector(s);
  const playBtn = $('.m-play'), prevBtn = $('.m-prev'), nextBtn = $('.m-next'), muteBtn = $('.m-mute'),
        titleEl = $('.m-title'), subEl = $('.m-sub'), prog = $('.m-prog i'), ytLink = $('.m-yt');
  const thumbEls = [$('.m-bg'), proj.querySelector('.pj-thumb'), proj.querySelector('.pj-spill')];

  let player = null, state = 'idle', idx = 0, muted = false, timer = 0, shownId = '';
  const titles = {};

  function paint(){
    const playing = state === 'playing', id = TRACKS[idx];
    for (const el of [dock, proj]) {
      el.classList.toggle('playing', playing);
      el.classList.toggle('loading', state === 'loading');
      el.classList.toggle('paused', state === 'paused');
    }
    if (shownId !== id) {          // new track: swap thumbnails / link
      shownId = id;
      thumbEls.forEach(el => { el.style.backgroundImage = `url(${thumb(id)})`; });
      ytLink.href = watch(id);
    }
    playBtn.innerHTML = playing ? I.pause : I.play;
    playBtn.setAttribute('aria-label', playing ? tr('pause') : tr('play'));
    prevBtn.innerHTML = I.prev; prevBtn.setAttribute('aria-label', tr('prev'));
    nextBtn.innerHTML = I.next; nextBtn.setAttribute('aria-label', tr('next'));
    muteBtn.innerHTML = muted ? I.mute : I.vol;
    muteBtn.setAttribute('aria-label', muted ? tr('unmute') : tr('mute'));
    ytLink.innerHTML = I.yt; ytLink.setAttribute('aria-label', tr('open'));
    titleEl.textContent = titles[id] || tr('title');
    const n = `${idx + 1}/${TRACKS.length}`;
    subEl.textContent = (state === 'idle' ? tr('tap') : state === 'loading' ? tr('loading') : playing ? tr('now') : tr('paused')) + ` · ${n}`;
  }

  // song titles for the dock before anything is played (each fails quietly)
  TRACKS.forEach(id => fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watch(id))}&format=json`)
    .then(r => r.ok ? r.json() : null).then(d => { if (d && d.title) { titles[id] = d.title; paint(); } }).catch(() => {}));

  function loadApi(){
    return new Promise((res, rej) => {
      if (window.YT && YT.Player) return res();
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev && prev(); res(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api'; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function tick(){
    if (!player || !player.getDuration) return;
    const d = player.getDuration() || 0, c = player.getCurrentTime() || 0;
    prog.style.transform = `scaleX(${d ? c / d : 0})`;
  }

  async function start(){
    state = 'loading'; paint();
    try { await loadApi(); } catch { state = 'idle'; paint(); window.open(watch(TRACKS[idx]), '_blank', 'noopener'); return; }
    player = new YT.Player('ytPlayer', {
      host: 'https://www.youtube-nocookie.com',
      videoId: TRACKS[idx], width: '100%', height: '100%',
      playerVars: { autoplay: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, iv_load_policy: 3 },
      events: {
        onReady: e => {
          e.target.setVolume(60);
          e.target.loadPlaylist(TRACKS, idx);   // the whole list, starting at the selected song
          e.target.setLoop(true);
          muteBtn.hidden = false; paint();
        },
        onStateChange: e => {
          if (e.data === YT.PlayerState.PLAYING) state = 'playing';
          else if (e.data === YT.PlayerState.PAUSED) state = 'paused';
          else if (e.data === YT.PlayerState.BUFFERING && state !== 'playing') state = 'loading';
          const i = e.target.getPlaylistIndex ? e.target.getPlaylistIndex() : -1;
          if (i >= 0 && i < TRACKS.length) idx = i;
          const t = e.target.getVideoData && e.target.getVideoData().title;
          if (t && !titles[TRACKS[idx]]) titles[TRACKS[idx]] = t;   // official (oEmbed) title wins over the player's translated one
          clearInterval(timer);
          if (state === 'playing') timer = setInterval(tick, 500);
          paint();
        }
      }
    });
  }

  function toggle(){
    if (!player) return start();
    if (!player.getPlayerState) return;
    state === 'playing' ? player.pauseVideo() : player.playVideo();
  }
  function skip(dir){
    if (player && player.nextVideo) { prog.style.transform = 'scaleX(0)'; dir > 0 ? player.nextVideo() : player.previousVideo(); return; }
    idx = (idx + dir + TRACKS.length) % TRACKS.length;   // before the first play: just pick the song
    paint();
  }
  playBtn.addEventListener('click', toggle);
  prevBtn.addEventListener('click', () => skip(-1));
  nextBtn.addEventListener('click', () => skip(1));
  proj.querySelector('.pj-screen').addEventListener('click', toggle);   // tapping the projected screen works too
  muteBtn.addEventListener('click', () => {
    if (!player || !player.isMuted) return;
    muted ? player.unMute() : player.mute(); muted = !muted; paint();
  });
  // keyboard: M = play/pause, N = next song
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === 'm') toggle(); else if (k === 'n') skip(1);
  });
  // follow the page language switch
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  paint();
})();
