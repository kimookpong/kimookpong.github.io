/* ================================================================
   THREE.JS BACKGROUND – Floating particle network + rotating torus
   ================================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ──────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene / Camera ────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 50);

  /* ── Particle system ───────────────────────────────────────── */
  const PARTICLE_COUNT = window.innerWidth < 768 ? 800 : 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const speeds    = new Float32Array(PARTICLE_COUNT);

  const colorA = new THREE.Color(0x22c55e); // accent
  const colorB = new THREE.Color(0x86efac); // accent-2
  const colorC = new THREE.Color(0x0a0a0f); // bg (dim)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 140;
    positions[i3 + 1] = (Math.random() - 0.5) * 100;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    speeds[i] = 0.02 + Math.random() * 0.05;

    const t = Math.random();
    const c = t < 0.5 ? colorA.clone().lerp(colorB, t * 2) : colorB.clone().lerp(colorC, (t - 0.5) * 2);
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Torus knot ────────────────────────────────────────────── */
  const torusGeo = new THREE.TorusKnotGeometry(9, 2.4, 160, 18, 2, 3);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(22, -8, -10);
  scene.add(torus);

  /* ── Ring ──────────────────────────────────────────────────── */
  const ringGeo = new THREE.TorusGeometry(14, 0.15, 4, 90);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x86efac,
    transparent: true,
    opacity: 0.08,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(-20, 10, -20);
  ring.rotation.x = Math.PI / 3;
  scene.add(ring);

  /* ── Icosahedron ───────────────────────────────────────────── */
  const icoGeo = new THREE.IcosahedronGeometry(6, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-28, -14, -15);
  scene.add(ico);

  /* ── Mouse parallax ────────────────────────────────────────── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  document.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  /* ── Scroll ────────────────────────────────────────────────── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ── Resize ────────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Animation loop ────────────────────────────────────────── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    /* smooth mouse follow */
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;

    camera.position.x  =  mouse.x * 6;
    camera.position.y  = -mouse.y * 4 - scrollY * 0.004;
    camera.lookAt(0, -scrollY * 0.004, 0);

    /* gentle particle drift */
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.12;
      if (pos[i * 3 + 1] > 52) pos[i * 3 + 1] = -52;
    }
    pGeo.attributes.position.needsUpdate = true;

    /* rotate objects */
    particles.rotation.y =  t * 0.06;
    particles.rotation.x =  t * 0.02;
    torus.rotation.x      =  t * 0.3;
    torus.rotation.y      =  t * 0.18;
    ring.rotation.z       = -t * 0.12;
    ico.rotation.x        =  t * 0.22;
    ico.rotation.y        =  t * 0.15;

    renderer.render(scene, camera);
  }

  animate();
})();
