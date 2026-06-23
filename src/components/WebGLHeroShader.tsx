import { useEffect, useRef } from "react";

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision highp float;
  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform float u_speed;

  vec3 C_VOID    = vec3(0.000, 0.000, 0.000); // #000000 — pure black
  vec3 C_CRIMSON = vec3(0.757, 0.031, 0.004); // #C10801 — rich crimson
  vec3 C_EMBER   = vec3(0.945, 0.376, 0.004); // #F16001 — vibrant orange
  vec3 C_SILK    = vec3(0.851, 0.765, 0.671); // #D9C3AB — muted beige/cream

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 6; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float t = u_time * mix(1.0, u_speed, 0.35);

    // PASS 1 — FBM DOMAIN WARP
    vec2 warpVec = vec2(
      fbm(uv * 2.2 + vec2(t * 0.031, 0.0)),
      fbm(uv * 2.2 + vec2(0.0, t * 0.027))
    ) * 0.22 - 0.11;
    vec2 warpedUV = uv + warpVec;

    // PASS 2 — PRIMARY WAVE STACK
    float yInfluence = clamp(u_mouse.y / u_res.y, 0.0, 1.0);
    float waveScale = mix(0.65, 1.35, yInfluence);

    float w = 0.0;
    w += sin(warpedUV.x * 6.283 * 1.0  - t * 0.44) * 0.072;
    w += sin(warpedUV.x * 6.283 * 2.3  + t * 0.31) * 0.051;
    w += cos(warpedUV.x * 6.283 * 3.7  - t * 0.23) * 0.038;
    w += sin(warpedUV.x * 6.283 * 5.1  + t * 0.17) * 0.026;
    w += cos(warpedUV.x * 6.283 * 7.9  - t * 0.12) * 0.018;
    w *= waveScale;

    float sway = sin(warpedUV.y * 3.14 * 1.3 + t * 0.14) * 0.038
               + cos(warpedUV.y * 3.14 * 2.9 - t * 0.09) * 0.021;

    // PASS 3 — HORIZONTAL COLOR DRIVER
    float mousePush = (u_mouse.x / u_res.x - 0.5) * 0.22;
    float breathe = sin(t * 0.21) * 0.038
                  + sin(t * 0.13) * 0.022
                  + sin(t * 0.07) * 0.014;

    float xDriver = warpedUV.x + w + sway + mousePush + breathe;
    xDriver = clamp(xDriver, 0.0, 1.0);

    // PASS 4 — 4-COLOR SMOOTH BAND REMAP
    float t0 = smoothstep(0.0,  0.4,  xDriver);
    float t1 = smoothstep(0.28, 0.68, xDriver);
    float t2 = smoothstep(0.58, 1.0,  xDriver);

    vec3 col = mix(C_VOID, C_CRIMSON, t0);
    col      = mix(col,    C_EMBER,   t1);
    col      = mix(col,    C_SILK,    t2);

    // PASS 5 — VERTICAL UNDULATION
    float yRipple = sin(uv.y * 6.28 * 1.8  + uv.x * 3.1  + t * 0.53) * 0.028
                  + sin(uv.y * 6.28 * 4.2  - uv.x * 1.7  - t * 0.37) * 0.016
                  + cos(uv.y * 6.28 * 7.6  + uv.x * 5.3  + t * 0.24) * 0.009;

    col.r += yRipple * 0.55;
    col.g += yRipple * 0.18;
    col = clamp(col, 0.0, 1.0);

    // PASS 6 — HEAT SHIMMER / CAUSTIC LAYER
    vec2 causticUV = warpedUV * 4.5 + vec2(t * 0.06, -t * 0.04);
    float caustic = fbm(causticUV) * fbm(causticUV + vec2(0.5));
    caustic = pow(caustic, 2.2) * 0.07;

    float causMask = smoothstep(0.2, 0.5, xDriver) * smoothstep(0.9, 0.5, xDriver);
    col += vec3(caustic * 0.9, caustic * 0.3, 0.0) * causMask;

    // PASS 7 — DEPTH PULSE
    float pulse = 1.0
      + sin(t * 0.28) * 0.018
      + sin(t * 0.17) * 0.011
      + sin(t * 0.09) * 0.007;

    col *= pulse;

    // PASS 8 — FILM GRAIN
    float grain = fract(sin(dot(gl_FragCoord.xy + t * 0.07,
                  vec2(127.1, 311.7))) * 43758.5453) * 0.032 - 0.016;
    col += vec3(grain);

    // PASS 9 — VIGNETTE CRUSH
    vec2 vigUV = (uv - 0.5) * vec2(1.0, 1.25);
    float vig = smoothstep(0.38, 1.05, length(vigUV));
    col = mix(col, vec3(0.0), vig * 0.68);

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

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
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

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_res");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uSpeedLoc = gl.getUniformLocation(program, "u_speed");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let posX = targetX;
    let posY = targetY;
    let velX = 0;
    let velY = 0;
    let isActive = false;
    let lastMoveTime = performance.now();
    let targetSpeed = 0.0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = window.innerHeight - e.clientY;
      isActive = true;
      lastMoveTime = performance.now();
    };

    window.addEventListener("mousemove", handleMouseMove);

    let rafId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      if (now - lastMoveTime > 2200) {
        isActive = false;
        targetX = canvas.width * 0.5;
        targetY = canvas.height * 0.5;
      }

      const STIFFNESS_ACTIVE = 0.032;
      const STIFFNESS_IDLE   = 0.008;
      const DAMPING          = 0.78;

      velX += (targetX - posX) * (isActive ? STIFFNESS_ACTIVE : STIFFNESS_IDLE);
      velY += (targetY - posY) * (isActive ? STIFFNESS_ACTIVE : STIFFNESS_IDLE);
      velX *= DAMPING;
      velY *= DAMPING;
      posX += velX;
      posY += velY;

      const rawSpeed = Math.hypot(velX, velY);
      targetSpeed += (rawSpeed * 12.0 - targetSpeed) * 0.08;
      targetSpeed *= 0.94;

      gl.uniform1f(uTimeLoc, (now - startTime) * 0.001);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, posX, posY);
      gl.uniform1f(uSpeedLoc, targetSpeed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
