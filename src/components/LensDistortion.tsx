import { useEffect, useRef } from "react";
import { useScroll, useVelocity, useSpring } from "motion/react";

/**
 * BarrelLens — Scroll-driven fisheye overlay
 *
 * A position:fixed canvas that paints curved dark edges OVER the page content.
 * Zero impact on DOM layout or scrolling performance.
 *
 * Effect: as scroll velocity increases, each of the 4 viewport edges develops
 * an inward quadratic bezier curve, exactly mimicking CRT barrel distortion.
 * Theme color (Ku Crimson) is used for subtle edge chromatic fringing.
 */
export default function BarrelLens() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Heavy damping = slow ramp up/down = feels physical
  const smoothVel = useSpring(scrollVelocity, { damping: 55, stiffness: 140, mass: 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let intensity = 0; // 0..1

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const vel = Math.abs(smoothVel.get());
      // Map velocity to 0..1 intensity. Ramps up quickly, capped at 1.
      const target = Math.min(vel / 1200, 1);
      // Manual lerp for an extra buttery feel
      intensity += (target - intensity) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (intensity > 0.004) {
        const w = canvas.width;
        const h = canvas.height;
        // Max bend in pixels at full intensity
        const bend = intensity * 70;
        const a = intensity; // alpha shorthand

        // ── TOP EDGE ──────────────────────────────────────────────────
        // The center of the top edge bows downward; corners stay anchored.
        {
          const grad = ctx.createLinearGradient(0, 0, 0, bend * 3);
          grad.addColorStop(0, `rgba(0,0,0,${a * 0.9})`);
          grad.addColorStop(0.6, `rgba(0,0,0,${a * 0.3})`);
          grad.addColorStop(1, `rgba(0,0,0,0)`);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          // Outer curve: center bows down
          ctx.quadraticCurveTo(w / 2, bend, w, 0);
          // Inner curve: slightly less pronounced
          ctx.lineTo(w, bend * 2);
          ctx.quadraticCurveTo(w / 2, bend * 2.6, 0, bend * 2);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          // Ku Crimson color fringe at the very edge for theme tie-in
          const fringe = ctx.createLinearGradient(0, 0, 0, bend * 0.8);
          fringe.addColorStop(0, `rgba(231,15,14,${a * 0.35})`);
          fringe.addColorStop(1, `rgba(231,15,14,0)`);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(w / 2, bend * 0.6, w, 0);
          ctx.lineTo(w, bend * 0.4);
          ctx.quadraticCurveTo(w / 2, bend * 0.9, 0, bend * 0.4);
          ctx.closePath();
          ctx.fillStyle = fringe;
          ctx.fill();
        }

        // ── BOTTOM EDGE ───────────────────────────────────────────────
        {
          const grad = ctx.createLinearGradient(0, h, 0, h - bend * 3);
          grad.addColorStop(0, `rgba(0,0,0,${a * 0.9})`);
          grad.addColorStop(0.6, `rgba(0,0,0,${a * 0.3})`);
          grad.addColorStop(1, `rgba(0,0,0,0)`);

          ctx.beginPath();
          ctx.moveTo(0, h);
          ctx.quadraticCurveTo(w / 2, h - bend, w, h);
          ctx.lineTo(w, h - bend * 2);
          ctx.quadraticCurveTo(w / 2, h - bend * 2.6, 0, h - bend * 2);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          const fringe = ctx.createLinearGradient(0, h, 0, h - bend * 0.8);
          fringe.addColorStop(0, `rgba(231,15,14,${a * 0.35})`);
          fringe.addColorStop(1, `rgba(231,15,14,0)`);
          ctx.beginPath();
          ctx.moveTo(0, h);
          ctx.quadraticCurveTo(w / 2, h - bend * 0.6, w, h);
          ctx.lineTo(w, h - bend * 0.4);
          ctx.quadraticCurveTo(w / 2, h - bend * 0.9, 0, h - bend * 0.4);
          ctx.closePath();
          ctx.fillStyle = fringe;
          ctx.fill();
        }

        // ── LEFT EDGE ─────────────────────────────────────────────────
        {
          const grad = ctx.createLinearGradient(0, 0, bend * 3, 0);
          grad.addColorStop(0, `rgba(0,0,0,${a * 0.75})`);
          grad.addColorStop(0.6, `rgba(0,0,0,${a * 0.2})`);
          grad.addColorStop(1, `rgba(0,0,0,0)`);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(bend, h / 2, 0, h);
          ctx.lineTo(bend * 2, h);
          ctx.quadraticCurveTo(bend * 2.6, h / 2, bend * 2, 0);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // ── RIGHT EDGE ────────────────────────────────────────────────
        {
          const grad = ctx.createLinearGradient(w, 0, w - bend * 3, 0);
          grad.addColorStop(0, `rgba(0,0,0,${a * 0.75})`);
          grad.addColorStop(0.6, `rgba(0,0,0,${a * 0.2})`);
          grad.addColorStop(1, `rgba(0,0,0,0)`);

          ctx.beginPath();
          ctx.moveTo(w, 0);
          ctx.quadraticCurveTo(w - bend, h / 2, w, h);
          ctx.lineTo(w - bend * 2, h);
          ctx.quadraticCurveTo(w - bend * 2.6, h / 2, w - bend * 2, 0);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // ── CORNER VIGNETTE ───────────────────────────────────────────
        // Radial gradient to smoothly darken corners and blend the 4 edge strips
        const cg = ctx.createRadialGradient(
          w / 2, h / 2, Math.min(w, h) * 0.28,
          w / 2, h / 2, Math.max(w, h) * 0.78
        );
        cg.addColorStop(0, `rgba(0,0,0,0)`);
        cg.addColorStop(0.65, `rgba(0,0,0,0)`);
        cg.addColorStop(1, `rgba(0,0,0,${a * 0.55})`);
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [smoothVel]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
