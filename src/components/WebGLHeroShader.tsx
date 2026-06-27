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

  void main() {
    // Aspect ratio correction
    vec2 p = v_uv * 2.0 - 1.0;
    p.x *= u_res.x / u_res.y;

    float t = u_time * 0.15;

    // Charcoal Palette
    vec3 c0 = vec3(0.04, 0.04, 0.05); // Deep Charcoal / Black
    vec3 c1 = vec3(0.12, 0.13, 0.15); // Dark Grey
    vec3 c2 = vec3(0.35, 0.36, 0.40); // Mid Grey
    vec3 c3 = vec3(0.90, 0.92, 0.95); // White / Silver
    
    // Domain warping to create sweeping waves
    // We recursively distort the coordinate space
    for(float i = 1.0; i <= 3.0; i++) {
        vec2 newP = p;
        newP.x += 0.5 / i * sin(i * 2.1 * p.y + t + i);
        newP.y += 0.5 / i * cos(i * 1.8 * p.x - t + i);
        p = newP;
    }
    
    // A linear driver creates repeating lines in the warped space
    float driver = p.x * 1.8 + p.y * 1.3 + t * 1.5;
    
    // Fract creates sharp fold edges
    float fold = fract(driver);
    
    // Smooth step across the fold to create gradients
    // 0.0 -> 0.5: c0 to c1 (deep shadow into body)
    // 0.5 -> 0.9: c1 to c2 (body into highlight rim)
    // 0.9 -> 1.0: c2 to c3 (sharp glowing white edge)
    vec3 col = mix(c0, c1, smoothstep(0.0, 0.5, fold));
    col = mix(col, c2, smoothstep(0.5, 0.9, fold));
    col = mix(col, c3, smoothstep(0.9, 1.0, fold));
    
    // Film Grain
    float grain = fract(sin(dot(v_uv * 123.456 + t, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.04;
    
    // Vignette
    float dist = length(v_uv - 0.5);
    col *= smoothstep(0.9, 0.2, dist);

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
    let lastTime = performance.now();
    let currentT = 0;

    const render = (now: number) => {
      let dt = (now - lastTime) * 0.001;
      lastTime = now;

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

      // Dramatically lower the multiplier so it doesn't cause manic speed
      const rawSpeed = Math.hypot(velX, velY);
      targetSpeed += (rawSpeed * 0.1 - targetSpeed) * 0.08;
      targetSpeed *= 0.94;

      // Integrate time smoothly to prevent time-jumping
      let speedMultiplier = 1.0 + targetSpeed;
      currentT += dt * speedMultiplier;

      gl.uniform1f(uTimeLoc, currentT);
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
