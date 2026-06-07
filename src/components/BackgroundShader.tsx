import { useEffect, useRef } from "react";

interface AuroraLayer {
  frequencyMultiplier: number;
  speed: number;
  pleatFreq: number;
  pleatSpeed: number;
  heightCenter: number;   // Normal Y position in the center (0 to 1)
  heightSides: number;    // Normal Y position at the sides (0 to 1)
  amplitude: number;      // Max height of the waves in the middle
}

export default function BackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Smooth interactive mouse coordinates with fluid ease-interpolation
    const mouse = { targetX: 0, targetY: 0, easeX: 0, easeY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || window.innerWidth || 800;
      const displayHeight = rect.height || window.innerHeight || 600;
      mouse.targetX = (e.clientX - rect.left - displayWidth / 2) / (displayWidth / 2);
      mouse.targetY = (e.clientY - rect.top - displayHeight / 2) / (displayHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Responsive Canvas resizing
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

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Dynamic, smooth-shifting color loops matching our beautiful font theme:
    // - Theme Periwinkle: "172, 182, 255" (#ACB6FF)
    // - Accent Violet: "192, 132, 252" (#C084FC)
    // - Neon Pink-Magenta: "212, 118, 255" (#D476FF)
    // - Royal Blue/Indigo: "99, 102, 241" (#6366F1)
    function getDynamicColor(time: number, normX: number, layerIdx: number, part: "primary" | "secondary") {
      const cycle = time * 0.18 + normX * 1.0 + layerIdx * 1.4;

      if (part === "primary") {
        // Morph gracefully between bright Neon Pink (#D476FF) and Periwinkle (#ACB6FF)
        const mix = (Math.sin(cycle) + 1) / 2;
        const r = Math.round(172 + mix * 40);
        const g = Math.round(182 - mix * 64);
        const b = Math.round(255);
        return `${r}, ${g}, ${b}`;
      } else {
        // Morph gracefully between Accent Violet (#C084FC) and Royal Blue
        const mix = (Math.cos(cycle * 0.82) + 1) / 2;
        const r = Math.round(99 + mix * 93);
        const g = Math.round(102 + mix * 30);
        const b = Math.round(241 + mix * 14);
        return `${r}, ${g}, ${b}`;
      }
    }

    // Three layered wave curtains with distinct speeds and densities
    const layers: AuroraLayer[] = [
      {
        frequencyMultiplier: 0.65,
        speed: 0.12,
        pleatFreq: 0.006,
        pleatSpeed: 0.28,
        heightCenter: 0.62,   // Slumped low in the middle
        heightSides: 0.02,    // Constantly high up near top on borders (Climbs all the way up!)
        amplitude: 0.38,      // Wave amplitude in the center
      },
      {
        frequencyMultiplier: 0.95,
        speed: 0.18,
        pleatFreq: 0.010,
        pleatSpeed: 0.45,
        heightCenter: 0.68,
        heightSides: 0.08,
        amplitude: 0.44,
      },
      {
        frequencyMultiplier: 1.35,
        speed: 0.24,
        pleatFreq: 0.015,
        pleatSpeed: 0.68,
        heightCenter: 0.74,
        heightSides: 0.14,
        amplitude: 0.50,
      }
    ];

    const startTime = performance.now();

    // Main render frame loop
    function render(now: number) {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) {
        resize();
        animationId = requestAnimationFrame(render);
        return;
      }

      // Smooth modern ease-damped mouse offsets
      mouse.easeX += (mouse.targetX - mouse.easeX) * 0.035;
      mouse.easeY += (mouse.targetY - mouse.easeY) * 0.035;

      const elapsed = now - startTime;
      const seconds = elapsed * 0.001;

      // 1. Clear with deep space opaque black background (#070707)
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, width, height);

      // 2. Setup soft ambient backlighting
      const baseGrad = ctx.createLinearGradient(0, height * 0.1, 0, height);
      baseGrad.addColorStop(0, "rgba(7, 7, 7, 0)");
      baseGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.015)");
      baseGrad.addColorStop(0.8, "rgba(172, 182, 255, 0.04)");
      baseGrad.addColorStop(1, "rgba(212, 118, 255, 0.07)");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Set blending mode to screen for radiant volumetric additions
      ctx.globalCompositeOperation = "screen";

      // Global slow organic breathing multiplier
      const breathing = 1.0 + Math.sin(seconds * 0.55) * 0.15;

      layers.forEach((layer, layerIdx) => {
        // Horizontal resolution step representation
        const step = 4;

        // Loop slightly beyond edges to ensure total bleed attachment on left/right borders
        const padding = 15;

        for (let x = -padding; x < width + padding; x += step) {
          const normX = x / width;
          const clampedNormX = Math.max(0, Math.min(1, normX));

          // Side-climbing profile factor where middle is 0 and sides are 1
          const sideFactor = Math.pow(Math.abs(clampedNormX - 0.5) * 2, 2.0); // ranges from 0 to 1
          
          // Wave activity factor: waves only undulate in the middle, and go to 0 at the side edges
          const waveActivity = Math.max(0, 1.0 - Math.pow(Math.abs(clampedNormX - 0.5) * 2, 1.6)); // 1 in middle, 0 at borders

          // Base parabolic Y-coordinate profile (smooth static canopy curve)
          const baseSideY = height * layer.heightSides;
          const baseCenterY = height * layer.heightCenter;
          const staticProfileY = baseCenterY - (baseCenterY - baseSideY) * sideFactor;

          // A. Multi-frequency wave equations rendering liquid fluid flowing motion in the center
          const w1 = Math.sin(clampedNormX * 2.0 * layer.frequencyMultiplier + seconds * layer.speed * 1.4);
          const w2 = Math.cos(clampedNormX * 3.8 * layer.frequencyMultiplier - seconds * layer.speed * 0.9);
          const w3 = Math.sin(clampedNormX * 6.8 * layer.frequencyMultiplier + seconds * layer.speed * 2.3);
          
          const waveCombined = (w1 * 0.48 + w2 * 0.36 + w3 * 0.16);

          // SWELL: grow/decay wave scale over time
          const waveSwell = 0.85 + 0.35 * Math.sin(seconds * 0.4 + layerIdx * 1.6);
          const activeAmplitude = height * layer.amplitude * waveSwell * breathing * waveActivity;

          // B. Interactive mouse vertical influence - only affects the undulating middle!
          const mouseVerticalOffset = mouse.easeY * -220 * waveActivity;

          // Compute finalized top wave peak (y-axis coordinate)
          const targetY = staticProfileY - waveCombined * activeAmplitude + mouseVerticalOffset;

          // C. Shimmering curtain folds (vertical peak pleating rays)
          const pleatAngle = x * layer.pleatFreq - seconds * layer.pleatSpeed;
          const pleatOsc = Math.sin(pleatAngle) * Math.cos(pleatAngle * 0.42) * Math.sin(pleatAngle * 1.6);
          
          // Pleating detail: lock to 0 amplitude at the borders to eliminate oscillation
          const dynamicTopY = targetY + pleatOsc * 40 * (0.45 * waveActivity);

          // D. Volumetric alpha calculations
          // Opacity is maximum (1.0) on the left/right edges to highlight borders perpetually, and breaths in the middle
          const edgeFade = 0.72 + 0.28 * sideFactor; // Minimum 72% opacity, climbing up to 100% on left and right bounds
          const segmentSwell = (0.62 + Math.cos(clampedNormX * 1.4 + seconds * 0.16 + layerIdx) * 0.28) * waveActivity + 0.95 * (1.0 - waveActivity);
          const targetAlpha = edgeFade * segmentSwell * (0.35 + Math.abs(pleatOsc) * 0.45 * waveActivity + 0.2 * (1.0 - waveActivity)) * (1.15 - layerIdx * 0.22);

          if (targetAlpha <= 0.01) continue;

          // E. Ribbon folding slanting (the canopy leans inward slightly for depth)
          const slantInward = -(clampedNormX - 0.5) * 110 * sideFactor;
          const waveTilt = Math.sin(clampedNormX * 2.8 + seconds * 0.35) * 60 * waveActivity;
          
          // Clamp slanting offsets to 0 at the side borders to keep the edges perfectly straight & attached!
          const topX = x + (slantInward + waveTilt) * waveActivity;

          // F. High-precision Linear Gradients
          // Black at base, intense volumetric glow at middle peak, fading at tip
          const grad = ctx.createLinearGradient(x, height, topX, dynamicTopY);

          // Dynamic colors computed for this column matching typography colors
          const colorPrimary = getDynamicColor(seconds, clampedNormX, layerIdx, "primary");
          const colorSecondary = getDynamicColor(seconds, clampedNormX, layerIdx, "secondary");

          grad.addColorStop(0, "rgba(7, 7, 7, 0)"); // Base layer is fully transparent black
          grad.addColorStop(0.18, `rgba(${colorSecondary}, ${targetAlpha * 0.22})`);
          grad.addColorStop(0.48, `rgba(${colorSecondary}, ${targetAlpha * 0.88})`);
          grad.addColorStop(0.72, `rgba(${colorPrimary}, ${targetAlpha * 1.2})`);
          grad.addColorStop(0.92, `rgba(${colorPrimary}, ${targetAlpha * 0.4})`);
          grad.addColorStop(1, "rgba(7, 7, 7, 0)"); // Fades out beautifully right at the top

          // Draw vertical column representing the beautiful glowing curtain folds
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = step + 1.2;
          ctx.moveTo(x, height);
          ctx.lineTo(topX, dynamicTopY);
          ctx.stroke();
        }
      });

      // Restore normal blending operations
      ctx.globalCompositeOperation = "source-over";

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    // Free resources safely
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
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none opacity-100 bg-[#070707]"
      style={{ display: "block" }}
    />
  );
}
