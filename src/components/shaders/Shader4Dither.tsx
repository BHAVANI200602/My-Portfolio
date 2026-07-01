import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Dither.css';

// Dithered waves shader — raw Three.js (no R3F) to avoid React 19 peer-dep conflicts
// Bayer-matrix ordered dithering over a fractal Brownian motion (fBm) wave pattern

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform vec2  uResolution;
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;
uniform vec3  uWaveColor;
uniform vec2  uMouse;
uniform float uMouseRadius;
uniform float uColorNum;
uniform float uPixelSize;

// ---------- classic Perlin noise (2-D) ----------
vec4 mod289v(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 permute4(vec4 x){ return mod289v(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt4(vec4 r){ return 1.79284291400159-0.85373472095314*r; }
vec2 fade2(vec2 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy)+vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy)-vec4(0.0,0.0,1.0,1.0);
  Pi = mod289v(Pi);
  vec4 ix=Pi.xzxz, iy=Pi.yyww, fx=Pf.xzxz, fy=Pf.yyww;
  vec4 i  = permute4(permute4(ix)+iy);
  vec4 gx = fract(i*(1.0/41.0))*2.0-1.0;
  vec4 gy = abs(gx)-0.5;
  vec4 tx = floor(gx+0.5);
  gx -= tx;
  vec2 g00=vec2(gx.x,gy.x), g10=vec2(gx.y,gy.y);
  vec2 g01=vec2(gx.z,gy.z), g11=vec2(gx.w,gy.w);
  vec4 norm=taylorInvSqrt4(vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11)));
  g00*=norm.x; g01*=norm.y; g10*=norm.z; g11*=norm.w;
  float n00=dot(g00,vec2(fx.x,fy.x)), n10=dot(g10,vec2(fx.y,fy.y));
  float n01=dot(g01,vec2(fx.z,fy.z)), n11=dot(g11,vec2(fx.w,fy.w));
  vec2 fade_xy=fade2(Pf.xy);
  vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
  return 2.3*mix(n_x.x,n_x.y,fade_xy.y);
}

// ---------- fBm ----------
float fbm(vec2 p){
  float v=0.0, amp=1.0, freq=uWaveFrequency;
  for(int i=0;i<4;i++){
    v   += amp*abs(cnoise(p));
    p   *= freq;
    amp *= uWaveAmplitude;
  }
  return v;
}

float pattern(vec2 p){
  vec2 p2 = p - uTime*uWaveSpeed;
  return fbm(p + fbm(p2));
}

// ---------- Bayer 8x8 ordered dither ----------
float bayer(vec2 coord){
  // unrolled 8x8 Bayer matrix (0-63 values / 64)
  int x = int(mod(coord.x, 8.0));
  int y = int(mod(coord.y, 8.0));
  // store as flat array via cascaded ifs (GLSL ES 1.0 compatible)
  float m[64];
  m[0]=0.0;  m[1]=32.0; m[2]=8.0;  m[3]=40.0; m[4]=2.0;  m[5]=34.0; m[6]=10.0; m[7]=42.0;
  m[8]=48.0; m[9]=16.0; m[10]=56.0;m[11]=24.0;m[12]=50.0;m[13]=18.0;m[14]=58.0;m[15]=26.0;
  m[16]=12.0;m[17]=44.0;m[18]=4.0; m[19]=36.0;m[20]=14.0;m[21]=46.0;m[22]=6.0; m[23]=38.0;
  m[24]=60.0;m[25]=28.0;m[26]=52.0;m[27]=20.0;m[28]=62.0;m[29]=30.0;m[30]=54.0;m[31]=22.0;
  m[32]=3.0; m[33]=35.0;m[34]=11.0;m[35]=43.0;m[36]=1.0; m[37]=33.0;m[38]=9.0; m[39]=41.0;
  m[40]=51.0;m[41]=19.0;m[42]=59.0;m[43]=27.0;m[44]=49.0;m[45]=17.0;m[46]=57.0;m[47]=25.0;
  m[48]=15.0;m[49]=47.0;m[50]=7.0; m[51]=39.0;m[52]=13.0;m[53]=45.0;m[54]=5.0; m[55]=37.0;
  m[56]=63.0;m[57]=31.0;m[58]=55.0;m[59]=23.0;m[60]=61.0;m[61]=29.0;m[62]=53.0;m[63]=21.0;
  return (m[y*8+x]-0.25*64.0) / 64.0;
}

void main(){
  // snap to pixel grid
  vec2 pixCoord  = floor(vUv * uResolution / uPixelSize) * uPixelSize;
  vec2 uv        = pixCoord / uResolution - 0.5;
  uv.x          *= uResolution.x / uResolution.y;

  float f = pattern(uv);

  // mouse dent
  vec2 mUv = (uMouse / uResolution - 0.5) * vec2(uResolution.x/uResolution.y, -1.0);
  float md = length(uv - mUv);
  f -= 0.5 * (1.0 - smoothstep(0.0, uMouseRadius, md));

  // quantise colour
  vec3 col = mix(vec3(0.0), uWaveColor, f);

  vec2 bayerCoord = floor(gl_FragCoord.xy / uPixelSize);
  float threshold = bayer(bayerCoord);
  float step_     = 1.0 / (uColorNum - 1.0);
  col += threshold * step_;
  col  = clamp(col - 0.2, 0.0, 1.0);
  col  = floor(col * (uColorNum-1.0) + 0.5) / (uColorNum-1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Shader4Dither({
  waveSpeed     = 0.05,
  waveFrequency = 3.0,
  waveAmplitude = 0.3,
  waveColor     = [0.70, 0.70, 0.72] as [number, number, number],
  colorNum      = 4,
  pixelSize     = 2,
  mouseRadius   = 1.0,
}: {
  waveSpeed?:     number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?:     [number, number, number];
  colorNum?:      number;
  pixelSize?:     number;
  mouseRadius?:   number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Three.js scene ---
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(1); // dither effect looks best at 1:1
    renderer.setClearColor(0x000000, 1);

    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms: { [key: string]: THREE.IUniform } = {
      uResolution:    { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
      uTime:          { value: 0 },
      uWaveSpeed:     { value: waveSpeed },
      uWaveFrequency: { value: waveFrequency },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveColor:     { value: new THREE.Color(waveColor[0], waveColor[1], waveColor[2]) },
      uMouse:         { value: new THREE.Vector2(0, 0) },
      uMouseRadius:   { value: mouseRadius },
      uColorNum:      { value: colorNum },
      uPixelSize:     { value: pixelSize },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh     = new THREE.Mesh(geometry, material);
    const scene    = new THREE.Scene();
    scene.add(mesh);

    container.appendChild(renderer.domElement);

    // resize
    const resize = () => {
      const w = container.offsetWidth, h = container.offsetHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener('resize', resize);
    resize();

    // mouse
    const targetMouse  = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.set(
        (e.clientX - rect.left),
        (rect.height - (e.clientY - rect.top)),
      );
    };
    container.addEventListener('mousemove', onMouse);

    // render loop
    let rafId: number;
    const clock = new THREE.Clock();
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      uniforms.uTime.value = clock.getElapsedTime();
      currentMouse.lerp(targetMouse, 0.08);
      uniforms.uMouse.value.copy(currentMouse);
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMouse);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="dither-container"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
}
