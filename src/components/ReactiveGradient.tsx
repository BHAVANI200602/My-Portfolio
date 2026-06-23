import { useEffect, useRef } from "react";

export default function ReactiveGradient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const handleMouseLeave = () => {
      // Drift back to center slowly when mouse leaves
      targetX = 50;
      targetY = 50;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      // Smooth easing (lower multiplier = slower/more lag)
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      container.style.setProperty("--mouse-x", `${currentX}%`);
      container.style.setProperty("--mouse-y", `${currentY}%`);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#000000]"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
    >
      <style>{`
        @keyframes organicSwirl1 {
          0% { transform: rotate(0deg) scale(1) translate(0, 0); }
          33% { transform: rotate(120deg) scale(1.1) translate(3%, -3%); }
          66% { transform: rotate(240deg) scale(0.9) translate(-3%, 3%); }
          100% { transform: rotate(360deg) scale(1) translate(0, 0); }
        }
        @keyframes organicSwirl2 {
          0% { transform: rotate(0deg) scale(1) translate(0, 0); }
          33% { transform: rotate(-120deg) scale(0.9) translate(-4%, 2%); }
          66% { transform: rotate(-240deg) scale(1.15) translate(4%, -2%); }
          100% { transform: rotate(-360deg) scale(1) translate(0, 0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        .reactive-core {
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            #F16001 0%,
            #C10801 35%,
            #000000 75%
          );
        }
        .reactive-highlight {
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            #D9C3AB 0%,
            transparent 25%
          );
        }
      `}</style>

      {/* 1. Base Interactive Layer - tracks mouse smoothly */}
      <div className="absolute inset-0 reactive-core opacity-90 mix-blend-screen" />

      {/* 2. Idle Background Swirls - constant organic motion */}
      <div 
        className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%] opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 40%, #C10801 0%, transparent 50%)",
          animation: "organicSwirl1 22s infinite linear",
        }}
      />
      <div 
        className="absolute w-[160%] h-[160%] -top-[30%] -left-[30%] opacity-25 mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 60%, #F16001 0%, transparent 50%)",
          animation: "organicSwirl2 30s infinite linear",
        }}
      />
      
      {/* 3. Muted Beige Highlight Layer - tracks mouse and breathes */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none reactive-highlight"
        style={{
          animation: "breathe 6s ease-in-out infinite",
        }}
      />
      
      {/* 4. Deep vignette to keep corners grounded and cinematic */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, #000000 100%)",
          opacity: 0.8
        }}
      />
    </div>
  );
}
