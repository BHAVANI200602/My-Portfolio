import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;

#define HALF_PI 1.5707963

float hashF(float n) { return fract(sin(n*127.1)*43758.5453123); }
float smoothNoise(float x) {
  float i=floor(x);float f=fract(x);float u=f*f*(3.0-2.0*f);
  return mix(hashF(i),hashF(i+1.0),u);
}
float displaceA(float c,float t){
  return sin(c*2.123)*0.2+sin(c*3.234+t*4.345)*0.1+sin(c*0.589+t*0.934)*0.5;
}
float displaceB(float c,float t){
  return sin(c*1.345)*0.3+sin(c*2.734+t*3.345)*0.2+sin(c*0.189+t*0.934)*0.3;
}
vec2 rotate2D(vec2 p,float a){float c=cos(a);float s=sin(a);return vec2(p.x*c-p.y*s,p.x*s+p.y*c);}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  // Mouse influence
  vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
  float mDist = length(coords - mPos);
  float mouseWarp = 0.8 * exp(-mDist * mDist * 4.0);

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, 0.5);

  float fadeTop    = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  float ridge = pow(
    step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for(float i=1.0;i<3.0;i+=1.0) lines += pow(max(fract(scaledY),fract(-scaledY)), i*2.0);

  float pattern = vMask * lines;
  float cycleT = fullT * 0.5;

  float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gChannel = (pattern + vMask  * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

export default function Shader1LineWaves() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    let program: Program;
    let currentMouse = [0.5, 0.5];
    let targetMouse  = [0.5, 0.5];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.canvas.getBoundingClientRect();
      targetMouse = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      ];
    };

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = [
          gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height,
        ];
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);
    const rotRad = (-25 * Math.PI) / 180;

    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:          { value: 0 },
        uResolution:    { value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height] },
        uSpeed:         { value: 0.25 },
        uInnerLines:    { value: 28.0 },
        uOuterLines:    { value: 32.0 },
        uWarpIntensity: { value: 0.9 },
        uRotation:      { value: rotRad },
        uEdgeFadeWidth: { value: 0.0 },
        uBrightness:    { value: 0.14 },
        // Charcoal palette: silver / mid-grey / off-white
        uColor1: { value: [0.72, 0.72, 0.72] },
        uColor2: { value: [0.45, 0.45, 0.45] },
        uColor3: { value: [0.90, 0.90, 0.90] },
        uMouse:  { value: new Float32Array([0.5, 0.5]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    gl.canvas.addEventListener('mousemove', handleMouseMove);

    let rafId: number;
    const update = (time: number) => {
      rafId = requestAnimationFrame(update);
      program.uniforms.uTime.value = time * 0.001;
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      (program.uniforms.uMouse.value as Float32Array)[0] = currentMouse[0];
      (program.uniforms.uMouse.value as Float32Array)[1] = currentMouse[1];
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      gl.canvas.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
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
