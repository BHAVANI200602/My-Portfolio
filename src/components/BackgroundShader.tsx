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
        // Main body: Bone (#e1decc) — warm off-white, dominant aurora color
        const mix = (Math.sin(cycle * 0.6) + 1) / 2;
        const r = Math.round(225 + mix * (235 - 225));
        const g = Math.round(222 + mix * (230 - 222));
        const b = Math.round(204 + mix * (215 - 204));
        return `${r}, ${g}, ${b}`;
      } else {
        // Edge accent: Ku Crimson (#e70f0e) — only bleeds at outer edges
        const mix = (Math.cos(cycle * 0.82) + 1) / 2;
        const r = Math.round(231 + mix * (200 - 231));
        const g = Math.round(15 + mix * (10 - 15));
        const b = Math.round(14 + mix * (10 - 14));
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

      // Very subtle Bone warmth in the center — should barely be noticeable on its own
      const baseGrad = ctx.createRadialGradient(width * 0.62, height * 0.35, 0, width * 0.62, height * 0.35, width * 0.7);
      baseGrad.addColorStop(0,   "rgba(225, 222, 204, 0.06)"); // dim Bone warmth
      baseGrad.addColorStop(0.5, "rgba(225, 222, 204, 0.02)");
      baseGrad.addColorStop(1,   "rgba(1, 1, 1, 0)");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Very subtle Crimson heat — bottom right corner only
      const rightEdge = ctx.createRadialGradient(width * 0.9, height * 0.75, 0, width * 0.9, height * 0.75, width * 0.5);
      rightEdge.addColorStop(0,   "rgba(231, 15, 14, 0.1)");
      rightEdge.addColorStop(0.5, "rgba(231, 15, 14, 0.03)");
      rightEdge.addColorStop(1,   "rgba(231, 15, 14, 0)");
      ctx.fillStyle = rightEdge;
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

          // Smooth bell-curve bias: aurora peaks around 60-70% from left, fades both edges
          // This avoids the harsh "all light on right" look
          const peakX = 0.65;
          const rightBias = Math.exp(-Math.pow((clampedNormX - peakX) / 0.45, 2)); // gaussian bell
          
          const edgeFade = 0.72 + 0.28 * sideFactor; 
          const segmentSwell = (0.62 + Math.cos(clampedNormX * 1.4 + seconds * 0.16 + layerIdx) * 0.28) * waveActivity + 0.95 * (1.0 - waveActivity);
          // Reduced base alpha — strands are translucent wisps, not solid bands
          const baseAlpha = edgeFade * segmentSwell * (0.22 + Math.abs(pleatOsc) * 0.32 * waveActivity + 0.12 * (1.0 - waveActivity)) * (1.0 - layerIdx * 0.18);
          
          const targetAlpha = baseAlpha * rightBias;

          if (targetAlpha <= 0.01) continue;

          const slantInward = -(clampedNormX - 0.5) * 110 * sideFactor;
          const waveTilt = Math.sin(clampedNormX * 2.8 + seconds * 0.35) * 60 * waveActivity;
          
          const topX = x + (slantInward + waveTilt) * waveActivity;

          // INVERTED ORIGIN: Draw from top to bottom
          const grad = ctx.createLinearGradient(x, 0, topX, height - dynamicTopY);

          const colorPrimary = getDynamicColor(seconds, clampedNormX, layerIdx, "primary");
          const colorSecondary = getDynamicColor(seconds, clampedNormX, layerIdx, "secondary");

          // Bone is the dominant body color — fills center of each strand
          // Crimson bleeds only at the very outer tips of each strand
          grad.addColorStop(0,    "rgba(225, 222, 204, 0)");                              // transparent top
          grad.addColorStop(0.06, `rgba(${colorPrimary}, ${targetAlpha * 0.4})`);        // Bone ramp in
          grad.addColorStop(0.3,  `rgba(${colorPrimary}, ${targetAlpha * 1.4})`);        // Bone peak — bright
          grad.addColorStop(0.6,  `rgba(${colorPrimary}, ${targetAlpha * 1.2})`);        // Bone sustain
          grad.addColorStop(0.82, `rgba(${colorSecondary}, ${targetAlpha * 0.6})`);      // Crimson creeps in at edge
          grad.addColorStop(1,    `rgba(${colorSecondary}, 0)`);                         // Crimson fades out

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = step + 1.2;
          ctx.moveTo(x, 0); // Origin at top
          ctx.lineTo(topX, height - dynamicTopY); // Drawn down towards computed wave peak
          ctx.stroke();
        }
      });

      ctx.globalCompositeOperation = "source-over";

      // ── DARK VIGNETTE ─────────────────────────────────────────────────────────
      // Drawn AFTER aurora strands in normal blend mode so it crushes the edges
      // back to deep black and prevents any flat, overexposed look.

      // Radial: corners get fully black, center stays clear
      const vignette = ctx.createRadialGradient(
        width * 0.5, height * 0.45, Math.min(width, height) * 0.12,
        width * 0.5, height * 0.45, Math.max(width, height) * 0.9
      );
      vignette.addColorStop(0,    "rgba(0,0,0,0)");
      vignette.addColorStop(0.45, "rgba(0,0,0,0)");
      vignette.addColorStop(0.75, "rgba(0,0,0,0.35)");
      vignette.addColorStop(1,    "rgba(0,0,0,0.82)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Extra crush along the very bottom — aurora should never reach the footer
      const bottomCrush = ctx.createLinearGradient(0, height * 0.6, 0, height);
      bottomCrush.addColorStop(0, "rgba(0,0,0,0)");
      bottomCrush.addColorStop(1, "rgba(0,0,0,0.92)");
      ctx.fillStyle = bottomCrush;
      ctx.fillRect(0, 0, width, height);

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
