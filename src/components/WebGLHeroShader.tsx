import { useEffect, useRef } from "react";

interface WebGLHeroShaderProps {
  activeShader?: number;
}

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Common uniforms and varyings prepended to all fragment shaders
const fsHeader = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec2  u_mouse;
`;

// SHADER 0: The Pillars (No Cyan)
const fsShader0 = `
  void main() {
    vec2 uv = v_uv;
    float aspect = u_res.x / u_res.y;
    float N = 12.0 * max(1.0, aspect * 0.7);
    float x_scaled = uv.x * N;
    float col_index = floor(x_scaled);
    float nx = fract(x_scaled) * 2.0 - 1.0;
    
    float volume = smoothstep(1.0, 0.0, abs(nx));
    volume = pow(volume, 1.4);
    float gap = smoothstep(0.98, 0.85, abs(nx));
    float t = u_time * 1.5;
    
    float mouse_norm = u_mouse.x / u_res.x;
    float dist_to_mouse = abs(uv.x - mouse_norm);
    float mouse_wave = sin(dist_to_mouse * 10.0 - t * 2.0) * exp(-dist_to_mouse * 3.0);
    float wave = sin(col_index * 0.4 - t) * 0.5 + 0.5;
    
    float brightness = clamp(wave + mouse_wave * 0.5, 0.0, 1.0);
    
    vec3 darkShadow = vec3(0.01, 0.01, 0.012);
    vec3 midTone    = vec3(0.2, 0.2, 0.2);
    vec3 highlight  = vec3(0.8, 0.8, 0.8);
    
    vec3 col = mix(darkShadow, midTone, brightness);
    col = mix(col, highlight, smoothstep(0.6, 1.0, brightness) * 0.8);
    col *= volume * gap;
    
    float y_fade = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
    col *= mix(0.1, 1.0, y_fade);
    col += vec3(0.02) * (1.0 - volume);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// SHADER 1: Charcoal Silk (Domain Warping)
const fsShader1 = `
  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for(int i=0; i<4; i++) {
      v += a * noise(p);
      p = rot(0.5) * p * 2.0;
      a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 uv = v_uv;
    vec2 p = uv * 3.0;
    float t = u_time * 0.2;
    
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2)), fbm(p + 4.0 * q + vec2(8.3, 2.8)));
    float f = fbm(p + 4.0 * r);
    
    vec3 colDark = vec3(0.02, 0.02, 0.03);
    vec3 colLight = vec3(0.3, 0.3, 0.3);
    vec3 col = mix(colDark, colLight, f * f);
    
    float highlight = smoothstep(0.6, 1.0, f);
    col += vec3(0.5) * highlight;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

// SHADER 2: Overlapping Curves (Screenshot 1)
const fsShader2 = `
  float curve(vec2 uv, float offset, float thickness, float t) {
    float y = sin(uv.x * 2.0 + offset + t) * 0.3 + 0.5;
    float dist = uv.y - y;
    float edge = smoothstep(0.02, 0.0, abs(dist));
    float shadow = smoothstep(0.0, -0.3, dist); // shadow below
    float mask = step(dist, 0.0); // fill below
    return mask * (0.05 + shadow * 0.1) + edge * thickness;
  }
  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.3;
    
    vec3 bg = vec3(0.05);
    vec3 col = bg;
    
    float c1 = curve(uv, 0.0, 1.0, t);
    float c2 = curve(uv, 1.5, 0.8, t * 1.2);
    float c3 = curve(uv, 3.0, 1.2, t * 0.8);
    
    // Composite layers from back to front (simplistic)
    // Actually let's draw them properly
    // layer 1
    float y1 = sin(uv.x * 2.0 + t) * 0.3 + 0.7;
    float mask1 = step(uv.y, y1);
    float edge1 = smoothstep(0.01, 0.0, abs(uv.y - y1));
    vec3 l1 = mix(vec3(0.02), vec3(0.15), smoothstep(y1-0.4, y1, uv.y));
    
    float y2 = sin(uv.x * 1.5 + 2.0 + t*1.3) * 0.2 + 0.4;
    float mask2 = step(uv.y, y2);
    float edge2 = smoothstep(0.01, 0.0, abs(uv.y - y2));
    vec3 l2 = mix(vec3(0.01), vec3(0.12), smoothstep(y2-0.3, y2, uv.y));

    float y3 = sin(uv.x * 3.0 + 4.0 + t*0.7) * 0.15 + 0.2;
    float mask3 = step(uv.y, y3);
    float edge3 = smoothstep(0.01, 0.0, abs(uv.y - y3));
    vec3 l3 = mix(vec3(0.05), vec3(0.2), smoothstep(y3-0.2, y3, uv.y));

    // Combine
    col = mix(vec3(0.05), l1, mask1);
    col += vec3(0.6, 0.6, 0.65) * edge1 * mask1; // Glowing rim
    
    col = mix(col, l2, mask2);
    col += vec3(0.7, 0.7, 0.75) * edge2 * mask2;
    
    col = mix(col, l3, mask3);
    col += vec3(0.9, 0.9, 0.95) * edge3 * mask3;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// SHADER 3: Compound Soft Blur (Screenshot 2)
const fsShader3 = `
  void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    uv.x *= u_res.x / u_res.y;
    float t = u_time * 0.5;
    
    vec2 p1 = vec2(sin(t*0.5)*1.5, cos(t*0.3)*0.5);
    vec2 p2 = vec2(cos(t*0.4)*1.0, sin(t*0.6)*1.0);
    vec2 p3 = vec2(sin(t*0.7)*0.5, cos(t*0.2)*0.8);
    
    float d1 = length(uv - p1);
    float d2 = length(uv - p2);
    float d3 = length(uv - p3);
    
    float v1 = smoothstep(2.5, 0.0, d1);
    float v2 = smoothstep(2.0, 0.0, d2);
    float v3 = smoothstep(1.5, 0.0, d3);
    
    vec3 c1 = vec3(0.15, 0.15, 0.16);
    vec3 c2 = vec3(0.05, 0.05, 0.05);
    vec3 c3 = vec3(0.3, 0.3, 0.32);
    
    vec3 col = vec3(0.02); // Dark base
    col += c1 * v1;
    col += c2 * v2;
    col += c3 * v3;
    
    // Add some noise to prevent banding
    float noise = fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
    col += noise * 0.01;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

// SHADER 4: Wavy Bands (Screenshot 3)
const fsShader4 = `
  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.4;
    
    // Create multiple horizontal wavy bands
    float bands = 0.0;
    vec3 col = vec3(0.02);
    
    for(float i=0.0; i<6.0; i++) {
      float y_offset = i * 0.2 - 0.1;
      float wave = sin(uv.x * 3.0 + t + i*1.2) * 0.1 * sin(t*0.5 + i);
      float center = y_offset + wave;
      
      // Distance to the center of this band
      float d = abs(uv.y - center);
      float bandMask = smoothstep(0.08, 0.0, d);
      
      // Internal shading for 3D stack effect
      float shading = smoothstep(0.0, 0.08, uv.y - center);
      
      vec3 bandColor = mix(vec3(0.02), vec3(0.2 + i*0.05), shading);
      // Rim light on the top edge
      bandColor += vec3(0.5) * smoothstep(0.06, 0.08, uv.y - center);
      
      col = mix(col, bandColor, bandMask);
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

// SHADER 5: Fine Grooves (Screenshot 4)
const fsShader5 = `
  void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    uv.x *= u_res.x / u_res.y;
    float t = u_time * 0.1;
    
    // Two center points for interesting interference pattern
    vec2 p1 = vec2(sin(t)*1.0, cos(t*0.8)*0.5);
    vec2 p2 = vec2(-cos(t*1.2)*1.2, -sin(t*0.9)*0.8);
    
    float d1 = length(uv - p1);
    float d2 = length(uv - p2);
    
    // Distort space slightly
    float dist = d1 + d2 + sin(uv.x * 2.0 + t)*0.1;
    
    // Create fine grooves
    float grooves = sin(dist * 60.0 - u_time * 2.0);
    grooves = smoothstep(0.8, 1.0, grooves);
    
    // Global shading
    float shade = smoothstep(3.0, 0.0, dist);
    
    vec3 baseCol = vec3(0.03, 0.03, 0.035);
    vec3 grooveCol = vec3(0.15, 0.15, 0.16);
    
    vec3 col = mix(baseCol, grooveCol, grooves * shade);
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

// SHADER 6: Bottom Curve Glow (Screenshot 5)
const fsShader6 = `
  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.5;
    
    // Base curve
    float curveY = 0.2 + sin(uv.x * 2.0 - t) * 0.1 + cos(uv.x * 4.0 + t*1.5) * 0.05;
    
    float distToCurve = uv.y - curveY;
    
    // The glow comes from below the curve
    float glow = smoothstep(0.6, 0.0, distToCurve);
    float intenseGlow = smoothstep(0.1, 0.0, distToCurve);
    
    // Mask out above the curve
    float mask = step(0.0, -distToCurve); // 1 if below curve, 0 if above
    
    vec3 bg = vec3(0.02, 0.02, 0.025);
    
    vec3 glowCol = vec3(0.15, 0.15, 0.16);
    vec3 intenseCol = vec3(0.4, 0.4, 0.45);
    
    vec3 col = bg;
    if (distToCurve < 0.0) {
      col = mix(bg, glowCol, 1.0 + distToCurve); // gradient down
    } else {
      col = mix(bg, glowCol, glow);
      col = mix(col, intenseCol, intenseGlow);
    }
    
    // Add noise
    col += fract(sin(dot(uv, vec2(12.9,78.2))) * 43758.5) * 0.02;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const FRAGMENT_SHADERS = [
  fsHeader + fsShader0,
  fsHeader + fsShader1,
  fsHeader + fsShader2,
  fsHeader + fsShader3,
  fsHeader + fsShader4,
  fsHeader + fsShader5,
  fsHeader + fsShader6,
];

export default function WebGLHeroShader({ activeShader = 0 }: WebGLHeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const programRef = useRef<WebGLProgram | null>(null);

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
    // Safely clamp activeShader index
    const safeIndex = Math.max(0, Math.min(activeShader, FRAGMENT_SHADERS.length - 1));
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADERS[safeIndex]);
    
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

    programRef.current = program;
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

      posX += (targetX - posX) * 0.05;
      posY += (targetY - posY) * 0.05;

      currentT += dt;

      gl.useProgram(programRef.current);
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
      if (programRef.current) gl.deleteProgram(programRef.current);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    };
  }, [activeShader]); // Re-run effect when activeShader changes to compile new program

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
