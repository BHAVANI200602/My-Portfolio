import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// Chromatic Aberration C-Curve
// Shape: a single luminous curve from the top of the screen to the center,
// arching right like the top half of the letter "C".
// White glowing core + RGB chromatic fringe, mouse warps the apex.

const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uMouse;   // 0-1, Y-up

// ── Quadratic Bézier exact SDF (Inigo Quilez) ─────────────────────────────
float dot2(vec2 v){ return dot(v,v); }

float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C){
  vec2 a = B - A;
  vec2 b = A - 2.0*B + C;
  vec2 c = a * 2.0;
  vec2 d = A - pos;
  float kk = 1.0 / dot(b,b);
  float kx = kk * dot(a,b);
  float ky = kk * (2.0*dot(a,a) + dot(d,b)) / 3.0;
  float kz = kk * dot(d,a);
  float res = 0.0;
  float p  = ky - kx*kx;
  float p3 = p*p*p;
  float q  = kx*(2.0*kx*kx - 3.0*ky) + kz;
  float h  = q*q + 4.0*p3;
  if(h >= 0.0){
    h = sqrt(h);
    vec2 x  = (vec2(h,-h) - q) / 2.0;
    vec2 uv = sign(x) * pow(abs(x), vec2(1.0/3.0));
    float t = clamp(uv.x + uv.y - kx, 0.0, 1.0);
    res = dot2(d + (c + b*t)*t);
  } else {
    float z  = sqrt(-p);
    float v  = acos(q / (p*z*2.0)) / 3.0;
    float m  = cos(v);
    float n  = sin(v) * 1.732050808;
    vec3  t3 = clamp(vec3(m+m,-n-m,n-m)*z - kx, 0.0, 1.0);
    res = min(dot2(d+(c+b*t3.x)*t3.x),
              dot2(d+(c+b*t3.y)*t3.y));
  }
  return sqrt(res);
}

// ── Normal of the distance field (finite diff) ────────────────────────────
vec2 bezierNormal(vec2 pos, vec2 A, vec2 B, vec2 C){
  float e = 0.0015;
  float dx = sdBezier(pos+vec2(e,0.0),A,B,C) - sdBezier(pos-vec2(e,0.0),A,B,C);
  float dy = sdBezier(pos+vec2(0.0,e),A,B,C) - sdBezier(pos-vec2(0.0,e),A,B,C);
  return normalize(vec2(dx,dy));
}

// ── Glow curve ─────────────────────────────────────────────────────────────
float glow(float dist, float thickness, float falloff){
  float g = thickness / max(dist + thickness*falloff, 0.0001);
  return g * g;
}

void main(){
  vec2 uv     = gl_FragCoord.xy / uResolution;
  float ar    = uResolution.x / uResolution.y;
  // aspect-correct space, Y-up, centred at (ar*0.5, 0.5)
  vec2 p      = uv * vec2(ar, 1.0);

  float t = uTime * 0.25;

  // ── C-curve control points ───────────────────────────────────────────────
  // A = near top-centre
  // B = apex that swings to the right (mouse + gentle sway animate it)
  // Cv= centre of screen
  vec2 A  = vec2(ar * 0.45, 0.97);
  vec2 Cv = vec2(ar * 0.45, 0.50);

  // Mouse influence: pulls the apex toward the cursor
  vec2 mWorld = uMouse * vec2(ar, 1.0);
  float bx = ar * (0.90 + 0.04*sin(t*0.9))
             + (mWorld.x - ar*0.5) * 0.18;
  float by = 0.73 + 0.025*sin(t*1.4)
             + (mWorld.y - 0.5) * 0.12;
  vec2 B  = vec2(bx, by);

  // ── Distance + normal ────────────────────────────────────────────────────
  float d0  = sdBezier(p, A, B, Cv);
  vec2  nor = bezierNormal(p, A, B, Cv);

  // Aberration amount scales with proximity to the curve
  float abbStrength = 0.020 * (1.0 - smoothstep(0.0, 0.18, d0));

  // Sample each channel along the normal at different offsets
  float dR = sdBezier(p - nor * abbStrength * 2.2, A, B, Cv);
  float dG = sdBezier(p,                            A, B, Cv);
  float dB = sdBezier(p + nor * abbStrength * 2.2,  A, B, Cv);

  // Tight bright core
  float core = 0.008;
  float gR = glow(dR, core, 0.35);
  float gG = glow(dG, core, 0.35);
  float gB = glow(dB, core, 0.35);

  // Wide soft halo (white)
  float halo   = exp(-d0 * 9.0)  * 0.55;
  float halo2  = exp(-d0 * 22.0) * 1.20;   // tight white core bloom

  // Compose: chromatic fringe + white bloom
  vec3 col;
  col.r = gR + halo + halo2;
  col.g = gG + halo + halo2;
  col.b = gB + halo + halo2;

  // Subtle warm orange on upper side, cold blue on lower side
  float side = dot(nor, vec2(0.0, 1.0));  // +1 = above curve, -1 = below
  float warmMask = smoothstep(0.0, 0.18, d0) - smoothstep(0.18, 0.35, d0);
  warmMask *= clamp(side * 0.5 + 0.5, 0.0, 1.0);
  float coolMask = smoothstep(0.0, 0.18, d0) - smoothstep(0.18, 0.35, d0);
  coolMask *= clamp(-side * 0.5 + 0.5, 0.0, 1.0);

  col.r += warmMask * 0.35;
  col.g += warmMask * 0.10;
  col.b += coolMask * 0.40;

  // Tone-map so we don't clip
  col = 1.0 - exp(-col * 1.6);

  // Background stays pure black — no fog
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Shader3ChromaticCurve() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ antialias: true, alpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uTime:       { value: 0 },
        uMouse:      { value: new Float32Array([0.5, 0.5]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
    });

    // Resize
    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      (program.uniforms.uResolution.value as number[])[0] = ctn.offsetWidth;
      (program.uniforms.uResolution.value as number[])[1] = ctn.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse — smooth lerp
    const target  = new Float32Array([0.5, 0.5]);
    const current = new Float32Array([0.5, 0.5]);

    const onMouse = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      target[0] = (e.clientX - rect.left) / rect.width;
      target[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMouse);

    // Loop
    let rafId: number;
    const start = performance.now();
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      current[0] += 0.045 * (target[0] - current[0]);
      current[1] += 0.045 * (target[1] - current[1]);
      (program.uniforms.uMouse.value as Float32Array)[0] = current[0];
      (program.uniforms.uMouse.value as Float32Array)[1] = current[1];
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
}
