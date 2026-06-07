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

export default function FooterAurora() {
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
      const displayHeight = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight || 400;

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
      const cycle = time * 0.16 + normX * 0.8 + layerIdx * 1.5;

      if (part === "primary") {
        const mix = (Math.sin(cycle) + 1) / 2;
        const r = Math.round(172 + mix * 40);
        const g = Math.round(182 - mix * 64);
        const b = Math.round(255);
        return `${r}, ${g}, ${b}`;
      } else {
        const mix = (Math.cos(cycle * 0.8) + 1) / 2;
        const r = Math.round(99 + mix * 93);
        const g = Math.round(102 + mix * 30);
        const b = Math.round(241 + mix * 14);
        return `${r}, ${g}, ${b}`;
      }
    }

    // Three layered wave curtains customized to rise beautifully from the footer bottom
    // Setting heights so the wave is prominently visible behind the colossal footer signature text
    const layers: AuroraLayer[] = [
      {
        frequencyMultiplier: 0.7,
        speed: 0.14,
        pleatFreq: 0.007,
        pleatSpeed: 0.3,
        heightCenter: 0.35,   // Center of the wave is taller (extends higher up, close to top of canvas)
        heightSides: 0.04,    // Sides climb almost to the very top (almost 0 on Y-coor)
        amplitude: 0.45,      // Taller amplitude for footer majesty
      },
      {
        frequencyMultiplier: 1.0,
        speed: 0.20,
        pleatFreq: 0.011,
        pleatSpeed: 0.48,
        heightCenter: 0.42,
        heightSides: 0.09,
        amplitude: 0.52,
      },
      {
        frequencyMultiplier: 1.4,
        speed: 0.26,
        pleatFreq: 0.016,
        pleatSpeed: 0.72,
        heightCenter: 0.48,
        heightSides: 0.15,
        amplitude: 0.58,
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

      // Smooth interactive mouse offsets
      mouse.easeX += (mouse.targetX - mouse.easeX) * 0.04;
      mouse.easeY += (mouse.targetY - mouse.easeY) * 0.04;

      const elapsed = now - startTime;
      const seconds = elapsed * 0.001;

      // Opaque deep background matching #070707
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, width, height);

      // Blending mode screen for glowing volumetric adds
      ctx.globalCompositeOperation = "screen";

      // Slowly breathe
      const breathing = 1.0 + Math.sin(seconds * 0.6) * 0.12;

      layers.forEach((layer, layerIdx) => {
        const step = 4;
        const padding = 15;

        for (let x = -padding; x < width + padding; x += step) {
          const normX = x / width;
          const clampedNormX = Math.max(0, Math.min(1, normX));

          // Side-climbing profile factor where middle is 0 and sides are 1
          const sideFactor = Math.pow(Math.abs(clampedNormX - 0.5) * 2, 2.0);
          
          // Wave activity factor: waves undulate mostly in the middle
          const waveActivity = Math.max(0, 1.0 - Math.pow(Math.abs(clampedNormX - 0.5) * 2, 1.6));

          // Base parabolic Y-coordinate profile (flowing canopy curve)
          const baseSideY = height * layer.heightSides;
          const baseCenterY = height * layer.heightCenter;
          const staticProfileY = baseCenterY - (baseCenterY - baseSideY) * sideFactor;

          // A. Combined wavy oscillations
          const w1 = Math.sin(clampedNormX * 2.2 * layer.frequencyMultiplier + seconds * layer.speed * 1.3);
          const w2 = Math.cos(clampedNormX * 4.0 * layer.frequencyMultiplier - seconds * layer.speed * 0.95);
          const w3 = Math.sin(clampedNormX * 7.0 * layer.frequencyMultiplier + seconds * layer.speed * 2.2);
          
          const waveCombined = (w1 * 0.5 + w2 * 0.35 + w3 * 0.15);

          // Wave scale swell
          const waveSwell = 0.85 + 0.3 * Math.sin(seconds * 0.45 + layerIdx * 1.5);
          const activeAmplitude = height * layer.amplitude * waveSwell * breathing * waveActivity;

          // B. Hover / mouse vertical move effect ("alive and waves up and down with move movement")
          const mouseVerticalOffset = mouse.easeY * -150 * waveActivity;

          // Target Y position (higher up)
          const targetY = staticProfileY - waveCombined * activeAmplitude + mouseVerticalOffset;

          // C. Pleating detail waves
          const pleatAngle = x * layer.pleatFreq - seconds * layer.pleatSpeed;
          const pleatOsc = Math.sin(pleatAngle) * Math.cos(pleatAngle * 0.4) * Math.sin(pleatAngle * 1.5);
          
          const dynamicTopY = targetY + pleatOsc * 35 * (0.45 * waveActivity);

          // D. Opacity calculation
          const edgeFade = 0.7 + 0.3 * sideFactor;
          const segmentSwell = (0.6 + Math.cos(clampedNormX * 1.4 + seconds * 0.15 + layerIdx) * 0.25) * waveActivity + 0.9 * (1.0 - waveActivity);
          const targetAlpha = edgeFade * segmentSwell * (0.35 + Math.abs(pleatOsc) * 0.45 * waveActivity + 0.25 * (1.0 - waveActivity)) * (1.2 - layerIdx * 0.25);

          if (targetAlpha <= 0.01) continue;

          // E. Ribbon folding offsets
          const slantInward = -(clampedNormX - 0.5) * 90 * sideFactor;
          const waveTilt = Math.sin(clampedNormX * 2.6 + seconds * 0.3) * 50 * waveActivity;
          const topX = x + (slantInward + waveTilt) * waveActivity;

          // F. High-precision radiant Gradients
          const grad = ctx.createLinearGradient(x, height, topX, dynamicTopY);

          // Dynamic matching colors
          const colorPrimary = getDynamicColor(seconds, clampedNormX, layerIdx, "primary");
          const colorSecondary = getDynamicColor(seconds, clampedNormX, layerIdx, "secondary");

          grad.addColorStop(0, "rgba(7, 7, 7, 0)");
          grad.addColorStop(0.2, `rgba(${colorSecondary}, ${targetAlpha * 0.2})`);
          grad.addColorStop(0.5, `rgba(${colorSecondary}, ${targetAlpha * 0.85})`);
          grad.addColorStop(0.75, `rgba(${colorPrimary}, ${targetAlpha * 1.15})`);
          grad.addColorStop(0.92, `rgba(${colorPrimary}, ${targetAlpha * 0.35})`);
          grad.addColorStop(1, "rgba(7, 7, 7, 0)");

          // Stroke vertical line representing full volumetric neon curtains
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = step + 1.2;
          ctx.moveTo(x, height);
          ctx.lineTo(topX, dynamicTopY);
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
      id="footer-aurora-canvas"
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-90"
      style={{ display: "block" }}
    />
  );
}
