import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── GLSL ─────────────────────────────────────────────────────────────────────
const vertexShader = `
uniform float uTime;
uniform float uSpeed;
uniform float uScale;

// Classic Perlin Noise (3D)
vec4 permute4(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt4(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec3 fade3(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0=floor(P),Pi1=Pi0+1.0;
  Pi0=mod(Pi0,289.0);Pi1=mod(Pi1,289.0);
  vec3 Pf0=fract(P),Pf1=Pf0-1.0;
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz,iz1=Pi1.zzzz;
  vec4 ixy=permute4(permute4(ix)+iy);
  vec4 ixy0=permute4(ixy+iz0),ixy1=permute4(ixy+iz1);
  vec4 gx0=ixy0/7.0,gy0=fract(floor(gx0)/7.0)-0.5;
  gx0=fract(gx0);vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.0));gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);
  vec4 gx1=ixy1/7.0,gy1=fract(floor(gx1)/7.0)-0.5;
  gx1=fract(gx1);vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.0));gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0=taylorInvSqrt4(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
  vec4 norm1=taylorInvSqrt4(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
  float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)),n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz)),n111=dot(g111,Pf1);
  vec3 fxyz=fade3(Pf0);
  vec4 nz=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fxyz.z);
  vec2 nyz=mix(nz.xy,nz.zw,fxyz.y);
  return 2.2*mix(nyz.x,nyz.y,fxyz.x);
}

varying float vEdge;
varying vec3  vNormal;

void main() {
  vec3 pos = position;
  // Displace Z using Perlin noise — time-driven scroll
  vec3 noiseCoord = vec3(pos.x * 0.0, pos.y - uv.y, pos.z + uTime * uSpeed * 3.0) * uScale;
  float disp = cnoise(noiseCoord);
  pos.z += disp;

  // Compute normal for shading
  float eps = 0.01;
  float dx = cnoise(noiseCoord + vec3(eps, 0, 0)) - disp;
  float dy = cnoise(noiseCoord + vec3(0, -eps, 0)) - disp;
  vNormal = normalize(vec3(-dx / eps, dy / eps, 1.0));

  // How close to left/right edge of each beam
  vEdge = 1.0 - abs(uv.x * 2.0 - 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying float vEdge;
varying vec3  vNormal;

uniform float uNoiseIntensity;
uniform vec2 uMouse;

float random(vec2 st){ return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123); }

void main() {
  // Directional light from upper-right, influenced by mouse
  vec3 lightDir = normalize(vec3(0.3 + (uMouse.x - 0.5), 0.5 + (uMouse.y - 0.5), 1.0));
  float diff = max(dot(vNormal, lightDir), 0.0);

  // Edge fade — beams are black at the seams
  float brightness = vEdge * (0.1 + diff * 0.7);

  // Subtle noise dither
  float rnd = random(gl_FragCoord.xy);
  brightness -= rnd / 15.0 * uNoiseIntensity;

  vec3 col = vec3(brightness);
  
  // Make it brighter
  col *= 1.3;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// ── Geometry ─────────────────────────────────────────────────────────────────
function createStackedPlanes(n: number, w: number, h: number, segs: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const totalVerts = n * (segs + 1) * 2;
  const positions = new Float32Array(totalVerts * 3);
  const uvs       = new Float32Array(totalVerts * 2);
  const indices   = new Uint32Array(n * segs * 6);
  let vi = 0, ii = 0, ui = 0;
  const xBase = -(n * w) / 2;
  for (let i = 0; i < n; i++) {
    const xL = xBase + i * w;
    const xR = xL + w;
    const uvXL = Math.random() * 300;
    const uvXR = uvXL + 1;
    const uvYO = Math.random() * 300;
    for (let j = 0; j <= segs; j++) {
      const y   = h * (j / segs - 0.5);
      const uvY = j / segs + uvYO;
      positions.set([xL, y, 0, xR, y, 0], vi * 3);
      uvs.set([uvXL, uvY, uvXR, uvY], ui);
      if (j < segs) {
        const a = vi, b = vi+1, c = vi+2, d = vi+3;
        indices.set([a, b, c, c, b, d], ii); ii += 6;
      }
      vi += 2; ui += 4;
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv',       new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Shader3Beams() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;

    // Scene
    const scene    = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    const camera   = new THREE.PerspectiveCamera(30, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
    mount.appendChild(renderer.domElement);

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:          { value: 0 },
        uSpeed:         { value: 2.0 },
        uScale:         { value: 0.15 },
        uNoiseIntensity: { value: 1.5 },
        uMouse:         { value: new THREE.Vector2(0.5, 0.5) }
      },
    });

    // Mesh — beams, slightly rotated for drama. Increased size to make sure it covers screen
    const geo  = createStackedPlanes(24, 2, 30, 100);
    const mesh = new THREE.Mesh(geo, material);
    mesh.rotation.z = Math.PI / 12; // 15° tilt
    scene.add(mesh);

    // Ambient
    scene.add(new THREE.AmbientLight('#888888', 0.8));

    // Mouse tracking
    let currentMouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      material.uniforms.uTime.value += clock.getDelta() * 0.1;
      
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
      material.uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
      
      // slightly tilt mesh based on mouse
      mesh.rotation.y = (currentMouse.x - 0.5) * 0.2;
      mesh.rotation.x = (currentMouse.y - 0.5) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
}
