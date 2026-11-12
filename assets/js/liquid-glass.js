/* =========================================================
   Liquid glass for the floating cards (WebGL).
   Adapted from the "Liquid Glass Shader" technique (lens refraction →
   frosted sampling of the scene behind → rim light + top light), but
   shaped by the card's real rounded rectangle so only a thin bevel at
   the edge refracts — no inner "second card" outline.
   Each card owns a small canvas that renders the slice of the office
   background behind it, so the glass tilts/bobs with the card.
   ========================================================= */
window.LiquidGlass = (() => {
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `
precision mediump float;
uniform vec2  uSize;   // canvas size (device px)
uniform vec2  uBox;    // card face size (CSS px, untransformed)
uniform float uRadius; // inner corner radius (CSS px) — matches the card's border-radius
uniform vec4  uRect;   // card's on-screen bounding rect (CSS px) — where to sample the scene
uniform vec4  uBg;     // background photo draw rect on screen (CSS px)
uniform vec3  uTint;   // card colour
uniform vec2  uLight;  // pointer position inside the card (0..1)
uniform sampler2D uTex;

vec3 bgAt(vec2 screen){
  vec2 t = (screen - uBg.xy) / uBg.zw;
  return texture2D(uTex, clamp(t, .001, .999)).rgb;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uSize; uv.y = 1. - uv.y;   // 0..1, y down
  vec2 p  = (uv - .5) * uBox;                            // CSS px from centre
  vec2 hb = uBox * .5;
  // signed distance to the card's real rounded rectangle (negative inside)
  vec2 q  = abs(p) - hb + uRadius;
  float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRadius;
  float e = -d;                                          // distance from the edge, inward

  // bevel: only the outer ~16px bends light, like the thick edge of a glass slab
  float bevel = 16.;
  float t = clamp(e / bevel, 0., 1.);
  vec2 n = q.x > q.y ? vec2(sign(p.x), 0.) : vec2(0., sign(p.y));
  if (q.x > 0. && q.y > 0.) n = normalize(q) * sign(p);
  vec2 refr = -n * pow(1. - t, 2.) * 14.;                // pull the scene inward near the rim

  vec2 base = uRect.xy + uv * uRect.zw + refr;
  vec3 col = vec3(0.);
  for (float x = -2.; x <= 2.; x++)
    for (float y = -2.; y <= 2.; y++)
      col += bgAt(base + vec2(x, y) * 1.5);   // blur spread (px): higher = frostier
  col /= 25.;

  // smoked glass so white text stays readable
  vec3 outc = mix(col, vec3(.05, .07, .14), .5);
  // colour of the card glows softly in the bevel only
  outc += uTint * (.05 + .22 * pow(1. - t, 1.5));
  // thin specular rim, strongest along the top edge
  float rim = smoothstep(2.5, 0., e);
  outc += vec3(.45) * rim * (1. - uv.y * .8);
  // soft top-down sheen + glint following the pointer
  outc += vec3(.07) * (1. - smoothstep(0., .45, uv.y));
  outc += vec3(.12) * smoothstep(.5, 0., distance(uv, uLight)) * (1. - uv.y);
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
    item.gl = gl; item.u = { size:U('uSize'), box:U('uBox'), radius:U('uRadius'), rect:U('uRect'), bg:U('uBg'), tint:U('uTint'), light:U('uLight') };
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
        const gl = it.gl;
        if (c.width !== w || c.height !== h) {
          c.width = w; c.height = h;
          gl.uniform1f(it.u.radius, parseFloat(getComputedStyle(c).borderTopLeftRadius) || 0);
        }
        const r = c.getBoundingClientRect();
        gl.viewport(0, 0, w, h);
        gl.uniform2f(it.u.size, w, h);
        gl.uniform2f(it.u.box, c.clientWidth, c.clientHeight);
        gl.uniform4f(it.u.rect, r.left, r.top, r.width, r.height);
        gl.uniform4f(it.u.bg, B[0], B[1], B[2], B[3]);
        gl.uniform2f(it.u.light, it.light[0], it.light[1]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  };
})();
