import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_COLORS = 6;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform float uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform float uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x*uRot.x - p.y*uRot.y, p.x*uRot.y + p.y*uRot.x);
  vec2 q = vec2(rp.x*(uCanvas.x/uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2*dot(q,q);
  q += 0.2*cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for(int j=0;j<5;j++){
    if(float(j)>=uIterations-1.0) break;
    vec2 rr=sin(1.5*(q.yx*uFrequency)+2.0*cos(q*uFrequency));
    q+=(rr-q)*0.15;
  }

  vec2 s = q;
  vec3 col = vec3(0.0);
  for(int i=0;i<MAX_COLORS;++i){
    if(float(i)>=uColorCount) break;
    s -= 0.01;
    vec2 r=sin(1.5*(s.yx*uFrequency)+2.0*cos(s*uFrequency));
    float kBelow=clamp(uWarpStrength,0.0,1.0);
    float kMix=pow(kBelow,0.3);
    float gain=1.0+max(uWarpStrength-1.0,0.0);
    vec2 disp=(r-s)*kBelow;
    vec2 warped=s+disp*gain;
    float m0=length(r+sin(5.0*r.y*uFrequency-3.0*t+float(i))/4.0);
    float m1=length(warped+sin(5.0*warped.y*uFrequency-3.0*t+float(i))/4.0);
    float m=mix(m0,m1,kMix);
    float w=1.0-exp(-uBandWidth/exp(uBandWidth*m));
    col+=uColors[i]*w;
  }
  col=clamp(col,0.0,1.0)*uIntensity;

  if(uNoise>0.0001){
    float n=fract(sin(dot(gl_FragCoord.xy+vec2(uTime),vec2(12.9898,78.233)))*43758.5453123);
    col+=(n-0.5)*uNoise;
    col=clamp(col,0.0,1.0);
  }
  gl_FragColor=vec4(col,1.0);
}
`;

const vert = `
varying vec2 vUv;
void main(){ 
  vUv = uv; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}
`;

export default function Shader4ColorBends() {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef  = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef       = useRef<number | null>(null);
  const pointerTarget  = useRef(new THREE.Vector2(0, 0));
  const pointerCurrent = useRef(new THREE.Vector2(0, 0));
  const rotRef = useRef(90);

  useEffect(() => {
    const container = containerRef.current!;
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Charcoal palette: deeper contrast and sharper silver/grey bands
    const charcoalColors = [
      new THREE.Vector3(0.01, 0.01, 0.01),
      new THREE.Vector3(0.10, 0.10, 0.11),
      new THREE.Vector3(0.25, 0.25, 0.27),
      new THREE.Vector3(0.45, 0.45, 0.48),
      new THREE.Vector3(0.80, 0.80, 0.82),
      new THREE.Vector3(0.15, 0.15, 0.17),
    ];

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas:       { value: new THREE.Vector2(1, 1) },
        uTime:         { value: 0 },
        uSpeed:        { value: 0.3 }, // Faster speed
        uRot:          { value: new THREE.Vector2(1, 0) },
        uColorCount:   { value: charcoalColors.length },
        uColors:       { value: charcoalColors },
        uScale:        { value: 1.0 },
        uFrequency:    { value: 1.2 },
        uWarpStrength: { value: 1.8 }, // stronger warp
        uPointer:      { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: 1.5 }, // Stronger mouse interaction
        uParallax:     { value: 0.4 },
        uNoise:        { value: 0.03 }, // Less noise
        uIterations:   { value: 3 },
        uIntensity:    { value: 1.5 }, // More contrast
        uBandWidth:    { value: 12 }, // Sharper bands
      },
      transparent: false,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      (material.uniforms.uCanvas.value as THREE.Vector2).set(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();

    const handlePointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerTarget.current.set(
        ((e.clientX - rect.left) / (rect.width  || 1)) * 2 - 1,
        -(((e.clientY - rect.top ) / (rect.height || 1)) * 2 - 1),
      );
    };
    container.addEventListener('pointermove', handlePointer);

    const loop = () => {
      const dt = clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      const deg = rotRef.current;
      const rad = (deg * Math.PI) / 180;
      (material.uniforms.uRot.value as THREE.Vector2).set(Math.cos(rad), Math.sin(rad));
      pointerCurrent.current.lerp(pointerTarget.current, Math.min(1, dt * 8));
      (material.uniforms.uPointer.value as THREE.Vector2).copy(pointerCurrent.current);
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.removeEventListener('pointermove', handlePointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
}
