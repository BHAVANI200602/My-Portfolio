import { useEffect, useRef, useState } from "react";

/**
 * Two-layer custom cursor:
 * - A small fast dot (follows mouse exactly via direct style mutation)
 * - A larger ring that lags behind with CSS transitions
 *
 * Uses direct DOM mutation (no React state for position) so there is
 * zero jitter and zero render lag. State is only used for the hover flag.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  // Track ring position in a ref for the raf loop
  const ring = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    // Move the small dot exactly with the mouse
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Dot snaps instantly
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      if (!visible) setVisible(true);
    };

    // Lerp loop for the ring
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // Hover detection
    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const clickable = el.closest("a, button, [role='button'], input, select, textarea, label");
      setIsHovering(!!clickable);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Small fast dot — centered via -50% -50% translate in addition to mouse position */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-white mix-blend-difference"
        style={{
          width: isHovering ? "8px" : "6px",
          height: isHovering ? "8px" : "6px",
          marginLeft: isHovering ? "-4px" : "-3px",
          marginTop: isHovering ? "-4px" : "-3px",
          opacity: visible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, margin 0.2s, opacity 0.3s",
        }}
      />

      {/* Lagging ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full mix-blend-difference"
        style={{
          width: isHovering ? "44px" : "36px",
          height: isHovering ? "44px" : "36px",
          marginLeft: isHovering ? "-22px" : "-18px",
          marginTop: isHovering ? "-22px" : "-18px",
          border: "1.5px solid rgba(255,255,255,0.75)",
          backgroundColor: isHovering ? "rgba(255,255,255,0.08)" : "transparent",
          opacity: visible ? 1 : 0,
          transition: "width 0.25s ease, height 0.25s ease, margin 0.25s ease, background-color 0.25s ease, opacity 0.3s",
        }}
      />
    </>
  );
}
