import { useEffect, useRef } from "react";

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// ─── Enhanced Charcoal Fluid Shader ───────────────────────────────────────────
// Technique: Multi-octave domain warping → smooth luminance ribbons
// No grain. Deep blacks pool naturally, light ribbons sweep through.
// Mouse reactive — fluid distorts toward cursor position.
const fsSource = `
  precision highp float;
  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2  u_res;
  uniform vec2  u_mouse;

  // Smooth, grain-free rotation helper
  vec2 rot(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  }

  // Smooth value noise — NO fract(sin) so there is zero grain
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep curve

    float a = sin(i.x * 127.1  + i.y * 311.7)  * 43758.5453;
    float b = sin((i.x + 1.0) * 127.1 + i.y * 311.7) * 43758.5453;
    float c = sin(i.x * 127.1  + (i.y + 1.0) * 311.7) * 43758.5453;
    float d = sin((i.x + 1.0) * 127.1 + (i.y + 1.0) * 311.7) * 43758.5453;

    return mix(mix(fract(a), fract(b), u.x),
               mix(fract(c), fract(d), u.x), u.y);
  }

  // 3-octave smooth FBM (Fractional Brownian Motion) — pure smooth waves
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v   += amp * smoothNoise(p);
      p    = rot(p * 2.1, 0.37);
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_res.x / u_res.y;

    // Centre-origin coordinates
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Normalised mouse influence (0..1 range)
    vec2 mouse = (u_mouse / u_res) - 0.5;
    mouse.x *= aspect;
    mouse.y  = -mouse.y;

    float t = u_time * 0.12;

    // ── Layer 1: large slow base warp ──────────────────────────────────────────
    vec2 q;
    q.x = fbm(p + vec2(0.0, 0.0) + t * 0.40);
    q.y = fbm(p + vec2(5.2, 1.3) + t * 0.36);

    // ── Layer 2: secondary warp driven by q ────────────────────────────────────
    vec2 r;
    r.x = fbm(p + 1.8 * q + vec2(1.7, 9.2) + t * 0.28);
    r.y = fbm(p + 1.8 * q + vec2(8.3, 2.8) + t * 0.24);

    // ── Mouse ripple: gentle radial pull toward cursor ─────────────────────────
    float mouseDistSq = dot(p - mouse, p - mouse);
    float mouseRipple = exp(-mouseDistSq * 1.8) * 0.18;
    r += mouseRipple * (mouse - p);

    // ── Final noise value ──────────────────────────────────────────────────────
    float f = fbm(p + 2.4 * r + t * 0.18);

    // ── Charcoal colour map ────────────────────────────────────────────────────
    // Very dark base; light ribbons emerge only at high f values
    vec3 deepBlack  = vec3(0.02, 0.02, 0.025);
    vec3 charcoal   = vec3(0.07, 0.07, 0.085);
    vec3 darkGrey   = vec3(0.18, 0.18, 0.20);
    vec3 midGrey    = vec3(0.38, 0.38, 0.42);
    vec3 silver     = vec3(0.70, 0.72, 0.76);
    vec3 softWhite  = vec3(0.92, 0.93, 0.96);

    // Map f (0..1) through the palette with smooth transitions
    vec3 col = deepBlack;
    col = mix(col, charcoal,  smoothstep(0.00, 0.30, f));
    col = mix(col, darkGrey,  smoothstep(0.30, 0.50, f));
    col = mix(col, midGrey,   smoothstep(0.50, 0.68, f));
    col = mix(col, silver,    smoothstep(0.68, 0.82, f));
    col = mix(col, softWhite, smoothstep(0.82, 1.00, f));

    // ── Subtle edge vignette (pure math, no texture) ──────────────────────────
    float vDist = length(uv - 0.5);
    float vignette = smoothstep(0.85, 0.20, vDist);
    col *= vignette;

    // ── Very slight warmth at bright peaks ────────────────────────────────────
    float warmth = smoothstep(0.75, 1.0, f) * 0.04;
    col += vec3(warmth * 0.5, warmth * 0.4, warmth * 0.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function WebGLHeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader   = compileShader(gl.VERTEX_SHADER,   vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1,1,
      -1, 1,  1,-1,   1,1,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc  = gl.getUniformLocation(program, "u_time");
    const uResLoc   = gl.getUniformLocation(program, "u_res");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");

    // Smooth spring mouse
    let targetX = window.innerWidth  * 0.5;
    let targetY = window.innerHeight * 0.5;
    let posX = targetX, posY = targetY;
    let velX = 0, velY = 0;
    let lastMoveTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = window.innerHeight - e.clientY;
      lastMoveTime = performance.now();
    };
    window.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    let lastTime = performance.now();
    let currentT = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      // Resize
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Drift back to centre after 2.5s idle
      if (now - lastMoveTime > 2500) {
        targetX = canvas.width  * 0.5;
        targetY = canvas.height * 0.5;
      }

      // Smooth spring
      const K = 0.04, D = 0.82;
      velX += (targetX - posX) * K;
      velY += (targetY - posY) * K;
      velX *= D; velY *= D;
      posX += velX; posY += velY;

      currentT += dt;

      gl.uniform1f(uTimeLoc,  currentT);
      gl.uniform2f(uResLoc,   canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, posX, posY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
