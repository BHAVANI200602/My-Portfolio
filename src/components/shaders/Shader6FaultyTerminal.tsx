import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// FaultyTerminal - digit/noise grid, tuned charcoal: soft grey tint, no glitch, no scanlines

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }
`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;
uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uNoiseAmp;
uniform float uBrightness;
uniform vec2  uMouse;

float time;

float hash21(vec2 p){ p=fract(p*234.56); p+=dot(p,p+34.56); return fract(p.x*p.y); }
float noise(vec2 p){ return sin(p.x*10.0)*sin(p.y*(3.0+sin(time*0.09)))+0.2; }
mat2 rotate(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float fbm(vec2 p){
  p*=1.1; float f=0.0,amp=0.5*uNoiseAmp;
  f+=amp*noise(p); p=rotate(time*0.02)*p*2.0; amp*=0.454545;
  f+=amp*noise(p); p=rotate(time*0.02)*p*2.0; amp*=0.454545;
  f+=amp*noise(p);
  return f;
}
float pattern(vec2 p,out vec2 q,out vec2 r){
  vec2 off0=vec2(0.0),off1=vec2(1.0);
  mat2 rot01=rotate(0.1*time);
  q=vec2(fbm(p+off1),fbm(rot01*p+off1));
  r=vec2(fbm(rotate(0.1)*q+off0),fbm(q+off0));
  return fbm(p+r);
}
float digit(vec2 p){
  vec2 grid=uGridMul*15.0;
  vec2 s=floor(p*grid)/grid;
  p=p*grid;
  vec2 q,r;
  float intensity=pattern(s*0.1,q,r)*1.3-0.03;
  p=fract(p); p*=uDigitSize;
  
  // Mouse reactivity: digits close to mouse light up more
  vec2 m = uMouse * uScale;
  float dist = length(vUv * uScale - m);
  float mouseGlow = exp(-dist * 1.5) * 0.4;
  
  float px5=p.x*5.0,py5=(1.0-p.y)*5.0;
  float x=fract(px5),y=fract(py5);
  float i=floor(py5)-2.0,j=floor(px5)-2.0;
  float n=i*i+j*j,f=n*0.0625;
  float isOn=step(0.1,intensity-f + mouseGlow);
  float brightness=isOn*(0.2+y*0.8)*(0.75+x*0.25) * (1.0 + mouseGlow);
  return step(0.0,p.x)*step(p.x,1.0)*step(0.0,p.y)*step(p.y,1.0)*brightness;
}

vec3 getColor(vec2 p){
  float middle=digit(p);
  const float off=0.002;
  float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0,-off))+digit(p+vec2(off,-off))+
            digit(p+vec2(-off,0))+digit(p+vec2(0,0))+digit(p+vec2(off,0))+
            digit(p+vec2(-off,off))+digit(p+vec2(0,off))+digit(p+vec2(off,off));
  // Charcoal palette: soft grey-white digits
  return vec3(0.7)*middle + sum*0.07*vec3(0.9);
}

void main(){
  time=iTime*1.2; // FASTER ANIMATION
  vec2 p=vUv*uScale;
  vec3 col=getColor(p)*uBrightness;
  gl_FragColor=vec4(col,1.0);
}
`;

export default function Shader6FaultyTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = containerRef.current!;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime:        { value: 0 },
        iResolution:  { value: [gl.canvas.width, gl.canvas.height, 1] },
        uScale:       { value: 1.0 },
        uGridMul:     { value: new Float32Array([2, 1]) },
        uDigitSize:   { value: 1.5 },
        uNoiseAmp:    { value: 0.9 },
        uBrightness:  { value: 0.7 },
        uMouse:       { value: new Float32Array([0.5, 0.5]) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    let currentMouse = [0.5, 0.5];
    let targetMouse  = [0.5, 0.5];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      targetMouse = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height, // Flip Y for WebGL
      ];
    };
    ctn.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();
    ctn.appendChild(gl.canvas);

    const start = performance.now();
    let frame = 0;
    const loop = () => {
      program.uniforms.iTime.value = ((performance.now() - start) / 1000) * 0.8; // Also increase base time multiplier
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      (program.uniforms.uMouse.value as Float32Array)[0] = currentMouse[0];
      (program.uniforms.uMouse.value as Float32Array)[1] = currentMouse[1];
      
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      ctn.removeEventListener('mousemove', handleMouseMove);
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
