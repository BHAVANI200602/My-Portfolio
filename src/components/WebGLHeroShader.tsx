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
  uniform vec2  u_res;
  uniform vec2  u_mouse;

  void main() {
    vec2 uv = v_uv;
    
    // Number of pills/columns across the screen
    // Adjust based on aspect ratio so they don't get too fat on ultrawide
    float aspect = u_res.x / u_res.y;
    float N = 12.0 * max(1.0, aspect * 0.7);
    
    float x_scaled = uv.x * N;
    float col_index = floor(x_scaled);
    
    // Local x inside the column (-1.0 to 1.0)
    float nx = fract(x_scaled) * 2.0 - 1.0;
    
    // Create the 3D cylinder/pill volume
    // smoothstep gives a nice soft falloff to black at the edges
    float volume = smoothstep(1.0, 0.0, abs(nx));
    // pow makes the highlight tighter and the shadows deeper
    volume = pow(volume, 1.4);
    
    // Gap between pills
    float gap = smoothstep(0.98, 0.85, abs(nx));
    
    // Animation: a wave of brightness passing through the columns
    float t = u_time * 1.5;
    
    // Mouse influence: wave ripples away from mouse X
    float mouse_norm = u_mouse.x / u_res.x;
    float dist_to_mouse = abs(uv.x - mouse_norm);
    float mouse_wave = sin(dist_to_mouse * 10.0 - t * 2.0) * exp(-dist_to_mouse * 3.0);
    
    // Base wave driven by column index and time
    float wave = sin(col_index * 0.4 - t) * 0.5 + 0.5;
    
    // Combine waves
    float brightness = wave + mouse_wave * 0.5;
    brightness = clamp(brightness, 0.0, 1.0);
    
    // Colors
    vec3 darkShadow = vec3(0.01, 0.01, 0.012);
    vec3 midTone    = vec3(0.25, 0.25, 0.25);
    vec3 highlight  = vec3(0.9, 0.9, 0.9);
    
    // Mix the color based on the animated brightness
    vec3 col = mix(darkShadow, midTone, brightness);
    col = mix(col, highlight, smoothstep(0.6, 1.0, brightness) * 0.8);
    
    // Apply the 3D volume shading
    col *= volume;
    
    // Apply the gap (black in between)
    col *= gap;
    
    // Vertical fading to make them look like finite pills
    // fade out at top and bottom
    float y_fade = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
    col *= mix(0.1, 1.0, y_fade);
    
    // Teal edge tint
    float left_edge = smoothstep(0.15, 0.0, uv.x);
    float right_edge = smoothstep(0.85, 1.0, uv.x);
    vec3 teal = vec3(0.0, 0.35, 0.4);
    
    // Add the teal glow to the edges of the screen, affected by the 3D volume
    col += teal * (left_edge + right_edge) * volume * y_fade;

    // Optional: a subtle overall ambient glow so it's not totally pitch black
    col += vec3(0.02) * (1.0 - volume);

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

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_res");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;
    let posX = targetX;
    let posY = targetY;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    let lastTime = performance.now();
    let currentT = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Smooth mouse follow
      posX += (targetX - posX) * 0.05;
      posY += (targetY - posY) * 0.05;

      currentT += dt;

      gl.uniform1f(uTimeLoc, currentT);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
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
