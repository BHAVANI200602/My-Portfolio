import { useEffect, useRef } from "react";

export default function FooterAurora() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    function resize() {
      if (!canvas) return;
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth || 800;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight || 400;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const startTime = performance.now();

    function render(now: number) {
      if (!canvas || !ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      if (W === 0 || H === 0) {
        resize();
        animationId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (now - startTime) * 0.001;

      // Clear with transparent so only blobs show
      ctx.clearRect(0, 0, W, H);

      // ── LEFT corner blob (Navy Blue / Sand Dollar)
      // Slow pulse: radius breathes in and out, locked to bottom-left
      const leftPulse = 1.0 + Math.sin(elapsed * 0.5) * 0.18;
      const leftAlpha = 0.22 + Math.sin(elapsed * 0.4) * 0.07;
      const leftRadius = W * 0.28 * leftPulse;

      const leftGrad = ctx.createRadialGradient(
        W * 0.0, H * 0.95,  0,            // inner point: bottom-left corner
        W * 0.0, H * 0.95,  leftRadius    // outer edge
      );
      leftGrad.addColorStop(0,    `rgba(193, 8, 1, ${leftAlpha})`);       // Crimson
      leftGrad.addColorStop(0.45, `rgba(241, 96, 1, ${leftAlpha * 0.5})`); // Ember
      leftGrad.addColorStop(0.8,  `rgba(193, 8, 1, 0.04)`);               // Faded Crimson
      leftGrad.addColorStop(1,    `rgba(0, 0, 0, 0)`);

      ctx.save();
      // Clip to the left third only — never lets color bleed past ~40% of width
      ctx.beginPath();
      ctx.rect(0, 0, W * 0.42, H);
      ctx.clip();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // ── RIGHT corner blob (Steel Navy / Sand Dollar)
      const rightPulse  = 1.0 + Math.sin(elapsed * 0.37 + 1.3) * 0.2;
      const rightAlpha  = 0.20 + Math.sin(elapsed * 0.5 + 2.1) * 0.07;
      const rightRadius = W * 0.30 * rightPulse;

      const rightGrad = ctx.createRadialGradient(
        W * 1.0, H * 0.92, 0,
        W * 1.0, H * 0.92, rightRadius
      );
      rightGrad.addColorStop(0,    `rgba(241, 96, 1, ${rightAlpha})`);       // Ember
      rightGrad.addColorStop(0.4,  `rgba(217, 195, 171, ${rightAlpha * 0.5})`); // Silk
      rightGrad.addColorStop(0.8,  `rgba(193, 8, 1, 0.04)`);                 // Faded Crimson
      rightGrad.addColorStop(1,    `rgba(0, 0, 0, 0)`);

      ctx.save();
      // Clip to the right third only
      ctx.beginPath();
      ctx.rect(W * 0.58, 0, W * 0.42, H);
      ctx.clip();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = rightGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="footer-aurora-canvas"
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
