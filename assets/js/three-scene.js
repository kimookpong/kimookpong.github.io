import * as THREE from 'three';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js';

const canvas = document.querySelector('#gl');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  const mobile = innerWidth < 800;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  // coloured lights give the glass its pastel rim light
  const L = (c, i, x, y, z) => { const l = new THREE.PointLight(c, i, 40, 1.6); l.position.set(x, y, z); scene.add(l); return l; };
  const l1 = L(0xff7aa8, 90, -6, 4, 6), l2 = L(0x7c6cff, 90, 7, -2, 5), l3 = L(0x4cc9f0, 70, 0, 6, 3);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  // ---- glass material factory ----
  const glass = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
    color, metalness: 0, roughness: 0.06, transmission: 1, thickness: 1.6, ior: 1.45,
    iridescence: 1, iridescenceIOR: 1.6, clearcoat: 1, clearcoatRoughness: 0.05,
    attenuationColor: new THREE.Color(color), attenuationDistance: 2.2, envMapIntensity: 1.4, ...extra
  });
  const glow = c => new THREE.MeshBasicMaterial({ color: c });

  const world = new THREE.Group(); scene.add(world);
  const items = []; // interactive glass bodies
  const add = (geo, mat, x, y, z, s = 1, spin = [0.1, 0.15]) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.setScalar(s);
    m.userData = { base: new THREE.Vector3(x, y, z), s, spin, boost: 0, ph: Math.random() * 6.28 };
    world.add(m); items.push(m); return m;
  };

  // spacing: each "scene" is ~one viewport tall in world units
  const STEP = 9;
  add(new THREE.TorusKnotGeometry(1, 0.32, 220, 32, 2, 3), glass(0xc9b8ff), -7.8, 2.0, -2, 1.7, [0.12, 0.2]);
  add(new THREE.IcosahedronGeometry(1, 0), glass(0xffc2dc) , 7.6, -2.6, -1, 1.4, [0.2, 0.1]);
  add(new THREE.TorusGeometry(1.1, 0.28, 48, 120), glass(0xa8e6ff) , 7.6, -STEP + 0.5, -1, 1.4, [0.25, 0.1]);
  add(new THREE.OctahedronGeometry(1.1, 0), glass(0xffd7a8), -7.6, -STEP - 2.5, -1, 1.1, [0.15, 0.25]);
  add(new THREE.SphereGeometry(1.1, 64, 64), glass(0xc7d2ff), -7.8, -STEP * 2 - 0.5, -1, 1.1, [0.05, 0.1]);
  add(new THREE.DodecahedronGeometry(1, 0), glass(0xffb8e6), 7.8, -STEP * 2 - 3, -1, 1.2, [0.18, 0.12]);
  add(new THREE.TorusKnotGeometry(0.8, 0.25, 180, 24, 3, 5), glass(0xb8ffe8), -7.6, -STEP * 3 - 1, -1, 1.3, [0.2, 0.15]);
  add(new THREE.CapsuleGeometry(0.6, 1.4, 16, 48), glass(0xffc2dc) , 7.6, -STEP * 3.6, -1, 1, [0.1, 0.2]);
  add(new THREE.IcosahedronGeometry(1.2, 1), glass(0xbfd0ff), -7.6, -STEP * 4.4, -2, 1.7, [0.15, 0.2]);

  // bright coloured orbs behind the glass so refraction has something to bend
  const orbCols = [0xff6fa5, 0x7c6cff, 0x4cc9f0, 0xffb86b, 0xff8ad8];
  for (let i = 0; i < 26; i++) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.18 + Math.random() * 0.4, 24, 24), glow(orbCols[i % 5]));
    o.position.set((Math.random() - 0.5) * 18, -Math.random() * STEP * 5, -3.5 - Math.random() * 3);
    o.userData = { ph: Math.random() * 6.28, y0: o.position.y };
    world.add(o); items.push(o); o.userData.orb = true;
  }

  // dust: soft glowing points
  const N = mobile ? 350 : 900, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos.set([(Math.random() - 0.5) * 30, 4 - Math.random() * STEP * 5.5, -Math.random() * 10], i * 3);
    const c = new THREE.Color(orbCols[i % 5]).lerp(new THREE.Color(0xffffff), 0.5); col.set([c.r, c.g, c.b], i * 3);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
  world.add(dust);

  // ---- interaction ----
  const mouse = new THREE.Vector2(0, 0), tgt = new THREE.Vector2(0, 0), ray = new THREE.Raycaster();
  let hover = null, scrollY = scrollY0();
  function scrollY0() { return window.scrollY; }
  addEventListener('pointermove', e => { tgt.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)); }, { passive: true });
  addEventListener('pointerdown', e => {
    if (hover) hover.userData.boost = 1;
  });
  const glassItems = items.filter(m => !m.userData.orb);
  let scrollTarget = 0, scrollCur = 0, lastScroll = 0, vel = 0;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    scrollTarget = h > 0 ? scrollY0() / h : 0;
  };
  addEventListener('dash:view', e => { scrollTarget = e.detail; });
  addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  });
  const dark = () => document.documentElement.dataset.theme === 'dark';

  const clock = new THREE.Clock();
  document.body.classList.add('gl');
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime(), dt = Math.min(clock.getDelta(), 0.05) || 0.016;
    mouse.lerp(tgt, 0.06);
    scrollCur += (scrollTarget - scrollCur) * 0.07;
    vel = (scrollTarget - lastScroll) * 40; lastScroll = scrollTarget;

    // camera descends through the world as you scroll, tilts with the mouse
    camera.position.y = -scrollCur * STEP * 4.6 + mouse.y * 0.6;
    camera.position.x = mouse.x * 1.1;
    camera.lookAt(mouse.x * 0.6, camera.position.y - mouse.y * 0.3, 0);

    // hover detection
    ray.setFromCamera(tgt, camera);
    const hit = ray.intersectObjects(glassItems, false)[0];
    hover = hit ? hit.object : null;
    document.body.classList.toggle('gl-hover', !!hover);

    for (const m of items) {
      const u = m.userData;
      if (u.orb) { m.position.y = u.y0 + Math.sin(t * 0.6 + u.ph) * 0.4; m.position.x += Math.sin(t * 0.3 + u.ph) * 0.0015; continue; }
      u.boost *= 0.95;
      const k = reduce ? 0 : 1;
      m.rotation.x += (u.spin[0] * dt + u.boost * 0.15 + vel * 0.02) * k;
      m.rotation.y += (u.spin[1] * dt + u.boost * 0.2) * k;
      m.position.y = u.base.y + Math.sin(t * 0.7 + u.ph) * 0.25 * k;
      // repel gently from the mouse in screen-space-ish
      const dx = u.base.x - mouse.x * 8, push = Math.max(0, 1 - Math.abs(dx) / 5) * 0.4;
      m.position.x = u.base.x + (u.base.x > 0 ? 1 : -1) * push * 0.0 + mouse.x * (u.base.z + 3) * 0.12;
      const ts = u.s * (hover === m ? 1.14 : 1) * (1 + u.boost * 0.25);
      m.scale.setScalar(m.scale.x + (ts - m.scale.x) * 0.12);
    }
    dust.rotation.y = t * 0.012 + mouse.x * 0.1; dust.position.y = scrollCur * 3;
    l1.position.x = -6 + mouse.x * 6; l1.position.y = camera.position.y + 4 + mouse.y * 4;
    l2.position.x = 7 - mouse.x * 5; l2.position.y = camera.position.y - 2;
    l3.position.y = camera.position.y + 6;
    renderer.toneMappingExposure = dark() ? 0.85 : 1.15;
    renderer.render(scene, camera);
  });
} catch (e) {
  console.warn('WebGL unavailable, using 2D fallback', e);
}
