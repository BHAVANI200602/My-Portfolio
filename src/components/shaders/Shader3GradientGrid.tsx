import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// GradientGrid — animated flowing grey/white gradient blobs + subtle grid overlay
// WebGL1 / OGL, mouse-reactive, charcoal theme

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uMouse;      // 0-1 normalised, Y up

// ---- simplex noise 2-D ----
vec3 permute3(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy  -= i1;
  i = mod(i, 289.0);
  vec3 p = permute3(permute3(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x  = 2.0*fract(p*C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x*x0.x  + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0 * dot(m, g);
}

// ---- fbm ----
float fbm(vec2 p, int oct){
  float v=0.0, amp=0.5, freq=1.0;
  for(int i=0;i<6;i++){
    if(i>=oct) break;
    v   += amp * snoise(p*freq);
    freq *= 2.0;
    amp  *= 0.5;
  }
  return v;
}

// ---- grid lines ----
float grid(vec2 uv, float cellSize, float lineWidth){
  vec2 g = fract(uv / cellSize);
  float lx = smoothstep(0.0, lineWidth, g.x) * (1.0-smoothstep(1.0-lineWidth, 1.0, g.x));
  float ly = smoothstep(0.0, lineWidth, g.y) * (1.0-smoothstep(1.0-lineWidth, 1.0, g.y));
  return 1.0 - min(lx, ly);  // 1 = on a line, 0 = interior
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;

  float t = uTime * 0.18;

  // Mouse offset — warps the entire flow toward cursor
  vec2 m   = (uMouse - 0.5) * aspect;
  float md = length(p - m);
  vec2 mouseWarp = (m - p) * 0.18 * exp(-md * md * 2.5);

  vec2 q = p + mouseWarp;

  // --- blob 1: large slow white blob, top-centre ---
  vec2 b1c = vec2(0.05 + 0.12*sin(t*0.7), 0.10 + 0.08*cos(t*0.9));
  float b1 = exp(-dot(q-b1c, q-b1c) * 3.2) * 1.0;

  // --- blob 2: mid-grey, drifts left-right ---
  vec2 b2c = vec2(-0.25 + 0.20*sin(t*1.1 + 1.2), -0.05 + 0.12*cos(t*0.8 + 2.1));
  float b2 = exp(-dot(q-b2c, q-b2c) * 5.5) * 0.85;

  // --- blob 3: silver streak, bottom ---
  vec2 b3c = vec2(0.22 + 0.15*cos(t*0.6 + 3.0), -0.18 + 0.10*sin(t*1.3 + 0.5));
  float b3 = exp(-dot(q-b3c, q-b3c) * 7.0) * 0.70;

  // --- blob 4: large dark shape opposite white blob ---
  vec2 b4c = vec2(-0.10 + 0.08*sin(t*0.5 + 4.0), -0.08 + 0.06*cos(t*1.0 + 1.8));
  float b4 = exp(-dot(q-b4c, q-b4c) * 2.0) * 0.55;

  // turbulence on top
  float noise1 = fbm(q * 2.2 + t * vec2(0.3, 0.2), 5);
  float noise2 = fbm(q * 1.5 - t * vec2(0.2, 0.35) + 3.7, 4);

  // Combine blobs + noise into a single luminance value
  float lum = b1 * 0.90
            + b2 * 0.55
            + b3 * 0.45
            + b4 * 0.25
            + noise1 * 0.18
            + noise2 * 0.12;

  lum = clamp(lum, 0.0, 1.0);

  // Charcoal ramp: near-black → charcoal → mid-grey → silver → white
  vec3 col;
  if(lum < 0.25){
    col = mix(vec3(0.04, 0.04, 0.045),   // near-black
              vec3(0.14, 0.14, 0.15),     // charcoal
              lum * 4.0);
  } else if(lum < 0.55){
    col = mix(vec3(0.14, 0.14, 0.15),    // charcoal
              vec3(0.40, 0.40, 0.42),     // mid-grey
              (lum - 0.25) * 3.33);
  } else if(lum < 0.80){
    col = mix(vec3(0.40, 0.40, 0.42),    // mid-grey
              vec3(0.72, 0.72, 0.75),     // silver
              (lum - 0.55) * 4.0);
  } else {
    col = mix(vec3(0.72, 0.72, 0.75),    // silver
              vec3(0.96, 0.96, 0.97),     // near-white
              (lum - 0.80) * 5.0);
  }

  // ---- subtle grid overlay ----
  // Grid UVs slightly warped by noise so lines feel organic
  float warp = fbm(uv * 3.0 + t * 0.1, 3) * 0.018;
  vec2 gridUv = uv * aspect * vec2(12.0, 8.0) + warp;
  float g = grid(gridUv, 1.0, 0.04);

  // Grid tint: slightly brighter on dark areas, slightly darker on bright
  float gridBright = mix(0.30, 0.08, lum);
  col = mix(col, vec3(gridBright), g * 0.55);

  // Vignette
  float vign = 1.0 - dot(p*1.2, p*1.2);
  vign = clamp(vign * vign, 0.0, 1.0);
  col *= 0.65 + 0.35 * vign;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Shader3GradientGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ antialias: true, alpha: false });
    const gl = renderer.gl;
    gl.clearColor(0.04, 0.04, 0.045, 1);

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

    // Style canvas to fill container
    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    });

    // Resize
    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight];
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking with smooth lerp
    const target  = new Float32Array([0.5, 0.5]);
    const current = new Float32Array([0.5, 0.5]);

    const onMouse = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      target[0] = (e.clientX - rect.left) / rect.width;
      target[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMouse);

    // Render loop
    let rafId: number;
    const start = performance.now();
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const t = (performance.now() - start) / 1000;
      program.uniforms.uTime.value = t;
      // Smooth mouse
      current[0] += 0.04 * (target[0] - current[0]);
      current[1] += 0.04 * (target[1] - current[1]);
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
