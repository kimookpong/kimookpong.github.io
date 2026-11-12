/* =========================================================
   Liquid glass for the floating cards (WebGL).
   Adapted from the "Liquid Glass Shader" technique: a superellipse
   (x⁶ + y⁶) lens mask → edge refraction → blurred sampling of the
   scene behind → rim light + top-down light gradient.
   Each card owns a small canvas that renders the slice of the office
   background behind it, so the glass tilts/bobs with the card.
   ========================================================= */
window.LiquidGlass = (() => {
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `
precision mediump float;
uniform vec2  uSize;   // canvas size (px)
uniform vec4  uRect;   // card rect on screen (x, y, w, h) in CSS px
uniform vec4  uBg;     // background image draw rect on screen (x, y, w, h)
uniform vec3  uTint;   // card colour
uniform vec2  uLight;  // pointer position inside the card (0..1), for the moving glint
uniform sampler2D uTex;

vec3 bgAt(vec2 screen){                       // sample the office photo at a screen point
  vec2 t = (screen - uBg.xy) / uBg.zw;
  return texture2D(uTex, clamp(t, 0.001, .999)).rgb;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uSize; uv.y = 1. - uv.y;        // 0..1, y down
  vec2 m  = uv - .5;                                          // centred
  // superellipse "rounded box": 0 at centre → 1 at the card edge
  float r  = pow(abs(m.x * 2.), 6.) + pow(abs(m.y * 2.), 6.);
  float rb1 = clamp((1. - r) * 8., 0., 1.);                                              // glass body
  float rb2 = clamp((.95 - r * .95) * 16., 0., 1.) - clamp((.9 - r * .95) * 16., 0., 1.); // rim ring
  float rb3 = clamp((1.5 - r * 1.1) * 2., 0., 1.) - clamp((1. - r * 1.1) * 2., 0., 1.);   // outer falloff

  // lens: magnify toward the edges like a thick glass bevel
  vec2 lens = m * (1. - r * .45) + .5;
  vec2 base = uRect.xy + lens * uRect.zw;

  // frosted blur (5×5 taps, ~7px spread)
  vec3 col = vec3(0.);
  for (float x = -2.; x <= 2.; x++)
    for (float y = -2.; y <= 2.; y++)
      col += bgAt(base + vec2(x, y) * 3.5);
  col /= 25.;

  // light: brighter toward the top edge, plus the rim ring
  float grad = clamp((clamp(-m.y, 0., .2) + .1) / 2., 0., 1.)
             + clamp((clamp(m.y, -1000., .2) * rb3 + .1) / 2., 0., 1.);
  vec3 lit = clamp(col + vec3(rb1) * grad * .55 + vec3(rb2) * .35, 0., 1.);

  // darken + tint so white text stays readable, colour bleeds in at the edges
  vec3 deep = vec3(.05, .07, .14);
  vec3 outc = mix(lit, deep, .52);
  outc += uTint * (rb3 * .55 + rb2 * .35 + .06);
  // soft specular glint following the pointer
  float g = smoothstep(.55, 0., distance(uv, uLight));
  outc += vec3(.16) * g * (1. - uv.y);
  gl_FragColor = vec4(clamp(outc, 0., 1.), 1.);
}`;

  const items = [];
  let img = null, ready = false, ok = true;

  function hex(c){ const n = parseInt(c.slice(1), 16); return [(n>>16&255)/255, (n>>8&255)/255, (n&255)/255]; }

  function setup(item){
    const gl = item.canvas.getContext('webgl', { antialias:false, premultipliedAlpha:false, powerPreference:'low-power' });
    if (!gl) { ok = false; return; }
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const U = n => gl.getUniformLocation(pr, n);
    item.gl = gl; item.u = { size:U('uSize'), rect:U('uRect'), bg:U('uBg'), tint:U('uTint'), light:U('uLight') };
    gl.uniform3fv(item.u.tint, hex(item.color));
  }

  /* where the (object-fit: cover) background photo is drawn on screen */
  function bgRect(bgEl){
    const r = bgEl.getBoundingClientRect(), iw = img.naturalWidth, ih = img.naturalHeight;
    const s = Math.max(r.width / iw, r.height / ih), dw = iw * s, dh = ih * s;
    const pos = getComputedStyle(bgEl).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    return [r.left + (r.width - dw) * (pos[0] ?? .5), r.top + (r.height - dh) * (pos[1] ?? .5), dw, dh];
  }

  return {
    /* call once per card; returns false when WebGL is unavailable */
    attach(face, color){
      if (!ok) return false;
      const canvas = document.createElement('canvas');
      canvas.className = 'lg-canvas'; canvas.setAttribute('aria-hidden', 'true');
      face.prepend(canvas);
      const item = { face, canvas, color, light:[.5, .15] };
      face.addEventListener('pointermove', e => { const r = face.getBoundingClientRect(); item.light = [(e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height]; });
      face.addEventListener('pointerleave', () => { item.light = [.5, .15]; });
      items.push(item);
      if (ready) { try { setup(item); } catch { ok = false; } }
      return true;
    },
    /* loads the background texture; resolves true when the glass can render */
    init(src){
      return new Promise(res => {
        img = new Image(); img.src = src;
        img.onload = () => {
          ready = true;
          try { items.forEach(setup); } catch (e) { ok = false; }
          res(ok);
        };
        img.onerror = () => { ok = false; res(false); };
      });
    },
    get active(){ return ready && ok; },
    /* draw every card; call once per animation frame after layout transforms are set */
    render(bgEl){
      if (!ready || !ok) return;
      const B = bgRect(bgEl), dpr = Math.min(devicePixelRatio || 1, 1.5);
      for (const it of items) {
        if (!it.gl) continue;
        const c = it.canvas, w = Math.max(1, Math.round(c.clientWidth * dpr)), h = Math.max(1, Math.round(c.clientHeight * dpr));
        if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
        const r = c.getBoundingClientRect(), gl = it.gl;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(it.u.size, w, h);
        gl.uniform4f(it.u.rect, r.left, r.top, r.width, r.height);
        gl.uniform4f(it.u.bg, B[0], B[1], B[2], B[3]);
        gl.uniform2f(it.u.light, it.light[0], it.light[1]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  };
})();
