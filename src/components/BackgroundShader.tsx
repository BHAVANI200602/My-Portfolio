import { useEffect, useRef } from "react";

interface AuroraLayer {
  frequencyMultiplier: number;
  speed: number;
  pleatFreq: number;
  pleatSpeed: number;
  heightCenter: number;   
  heightSides: number;    
  amplitude: number;      
}

export default function BackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const mouse = { targetX: 0, targetY: 0, easeX: 0, easeY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || window.innerWidth || 800;
      const displayHeight = rect.height || window.innerHeight || 600;
      mouse.targetX = (e.clientX - rect.left - displayWidth / 2) / (displayWidth / 2);
      mouse.targetY = (e.clientY - rect.top - displayHeight / 2) / (displayHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    function resize() {
      if (!canvas) return;
      const displayWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth || 800;
      const displayHeight = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight || 600;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    }

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    function getDynamicColor(time: number, normX: number, layerIdx: number, part: "primary" | "secondary") {
      const cycle = time * 0.18 + normX * 1.0 + layerIdx * 1.4;

      if (part === "primary") {
        // Ku Crimson (#e70f0e) morphing to Purple Taupe (#474145)
        const mix = (Math.sin(cycle) + 1) / 2;
        const r = Math.round(231 + mix * (71 - 231));
        const g = Math.round(15 + mix * (65 - 15));
        const b = Math.round(14 + mix * (69 - 14));
        return `${r}, ${g}, ${b}`;
      } else {
        // Black (#010101) morphing to Purple Taupe (#474145)
        const mix = (Math.cos(cycle * 0.82) + 1) / 2;
        const r = Math.round(1 + mix * (71 - 1));
        const g = Math.round(1 + mix * (65 - 1));
        const b = Math.round(1 + mix * (69 - 1));
        return `${r}, ${g}, ${b}`;
      }
    }

    const layers: AuroraLayer[] = [
      {
        frequencyMultiplier: 0.65,
        speed: 0.12,
        pleatFreq: 0.006,
        pleatSpeed: 0.28,
        heightCenter: 0.8,   
        heightSides: 0.1,    
        amplitude: 0.5,      
      },
      {
        frequencyMultiplier: 0.95,
        speed: 0.18,
        pleatFreq: 0.010,
        pleatSpeed: 0.45,
        heightCenter: 0.9,
        heightSides: 0.2,
        amplitude: 0.45,
      },
      {
        frequencyMultiplier: 1.4,
        speed: 0.25,
        pleatFreq: 0.015,
        pleatSpeed: 0.65,
        heightCenter: 0.7,
        heightSides: 0.15,
        amplitude: 0.6,
      }
    ];

    const startTime = performance.now();

    function render(now: number) {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) {
        resize();
        animationId = requestAnimationFrame(render);
        return;
      }

      mouse.easeX += (mouse.targetX - mouse.easeX) * 0.035;
      mouse.easeY += (mouse.targetY - mouse.easeY) * 0.035;

      const elapsed = now - startTime;
      const seconds = elapsed * 0.001;

      ctx.fillStyle = "#010101";
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient backlight from top right
      const baseGrad = ctx.createRadialGradient(width, 0, 0, width, 0, width * 0.8);
      baseGrad.addColorStop(0, "rgba(231, 15, 14, 0.18)"); // Ku Crimson
      baseGrad.addColorStop(0.5, "rgba(71, 65, 69, 0.05)"); // Purple Taupe
      baseGrad.addColorStop(1, "rgba(1, 1, 1, 0)"); // Black
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";

      const breathing = 1.0 + Math.sin(seconds * 0.55) * 0.15;

      layers.forEach((layer, layerIdx) => {
        const step = 4;
        const padding = 15;

        for (let x = -padding; x < width + padding; x += step) {
          const normX = x / width;
          const clampedNormX = Math.max(0, Math.min(1, normX));

          const sideFactor = Math.pow(Math.abs(clampedNormX - 0.5) * 2, 2.0); 
          const waveActivity = Math.max(0, 1.0 - Math.pow(Math.abs(clampedNormX - 0.5) * 2, 1.6)); 

          const baseSideY = height * layer.heightSides;
          const baseCenterY = height * layer.heightCenter;
          const staticProfileY = baseCenterY - (baseCenterY - baseSideY) * sideFactor;

          const w1 = Math.sin(clampedNormX * 2.0 * layer.frequencyMultiplier + seconds * layer.speed * 1.4);
          const w2 = Math.cos(clampedNormX * 3.8 * layer.frequencyMultiplier - seconds * layer.speed * 0.9);
          const w3 = Math.sin(clampedNormX * 6.8 * layer.frequencyMultiplier + seconds * layer.speed * 2.3);
          
          const waveCombined = (w1 * 0.48 + w2 * 0.36 + w3 * 0.16);

          const waveSwell = 0.85 + 0.35 * Math.sin(seconds * 0.4 + layerIdx * 1.6);
          const activeAmplitude = height * layer.amplitude * waveSwell * breathing * waveActivity;

          const mouseVerticalOffset = mouse.easeY * 120 * waveActivity;

          const targetY = staticProfileY - waveCombined * activeAmplitude + mouseVerticalOffset;

          const pleatAngle = x * layer.pleatFreq - seconds * layer.pleatSpeed;
          const pleatOsc = Math.sin(pleatAngle) * Math.cos(pleatAngle * 0.42) * Math.sin(pleatAngle * 1.6);
          
          const dynamicTopY = targetY + pleatOsc * 40 * (0.45 * waveActivity);

          // Bias the aurora heavily towards the top right. Fade out on the left side.
          const rightBias = Math.pow(clampedNormX, 0.8); // 0 on left edge, 1 on right edge
          
          const edgeFade = 0.72 + 0.28 * sideFactor; 
          const segmentSwell = (0.62 + Math.cos(clampedNormX * 1.4 + seconds * 0.16 + layerIdx) * 0.28) * waveActivity + 0.95 * (1.0 - waveActivity);
          const baseAlpha = edgeFade * segmentSwell * (0.35 + Math.abs(pleatOsc) * 0.45 * waveActivity + 0.2 * (1.0 - waveActivity)) * (1.15 - layerIdx * 0.22);
          
          const targetAlpha = baseAlpha * rightBias;

          if (targetAlpha <= 0.01) continue;

          const slantInward = -(clampedNormX - 0.5) * 110 * sideFactor;
          const waveTilt = Math.sin(clampedNormX * 2.8 + seconds * 0.35) * 60 * waveActivity;
          
          const topX = x + (slantInward + waveTilt) * waveActivity;

          // INVERTED ORIGIN: Draw from top to bottom
          const grad = ctx.createLinearGradient(x, 0, topX, height - dynamicTopY);

          const colorPrimary = getDynamicColor(seconds, clampedNormX, layerIdx, "primary");
          const colorSecondary = getDynamicColor(seconds, clampedNormX, layerIdx, "secondary");

          grad.addColorStop(0, "rgba(7, 7, 7, 0)"); 
          grad.addColorStop(0.18, `rgba(${colorSecondary}, ${targetAlpha * 0.22})`);
          grad.addColorStop(0.48, `rgba(${colorSecondary}, ${targetAlpha * 0.88})`);
          grad.addColorStop(0.72, `rgba(${colorPrimary}, ${targetAlpha * 1.2})`);
          grad.addColorStop(0.92, `rgba(${colorPrimary}, ${targetAlpha * 0.4})`);
          grad.addColorStop(1, "rgba(7, 7, 7, 0)"); 

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = step + 1.2;
          ctx.moveTo(x, 0); // Origin at top
          ctx.lineTo(topX, height - dynamicTopY); // Drawn down towards computed wave peak
          ctx.stroke();
        }
      });

      ctx.globalCompositeOperation = "source-over";
      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cinematic-aurora-canvas"
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none opacity-100 bg-transparent"
      style={{ display: "block" }}
    />
  );
}
