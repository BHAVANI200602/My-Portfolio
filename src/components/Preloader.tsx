import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

// Two alternating ripple colors
const RIPPLE_1 = "#0aada8"; // Aqua Teal
const RIPPLE_2 = "#f0fafa"; // Ice White

export default function Preloader({ onDiveStart, onDiveComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "ripple1" | "ripple2" | "curtain">("counting");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 4) + 2;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 28);

    return () => clearInterval(interval);
  }, []);

  // When progress hits 100, kick off the ripple sequence
  useEffect(() => {
    if (progress < 100) return;

    // Small pause at 100%, then ripple 1
    const t1 = setTimeout(() => setPhase("ripple1"), 200);
    // Ripple 2 follows ripple 1
    const t2 = setTimeout(() => setPhase("ripple2"), 900);
    // Curtain lift
    const t3 = setTimeout(() => {
      setPhase("curtain");
      if (onDiveStart) onDiveStart();
    }, 1700);
    // Unmount
    const t4 = setTimeout(() => {
      document.body.style.overflow = "auto";
      onDiveComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [progress]);

  return (
    <div className="fixed inset-0 w-full h-full z-50 select-none overflow-hidden bg-[#070707]">

      {/* ── RIPPLE CIRCLE 1 (Teal) ── */}
      <AnimatePresence>
        {(phase === "ripple1" || phase === "ripple2" || phase === "curtain") && (
          <motion.div
            key="ripple1"
            className="absolute rounded-full"
            style={{
              background: RIPPLE_1,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "10vw",
              height: "10vw",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 30, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── RIPPLE CIRCLE 2 (Ice White) — follows teal ── */}
      <AnimatePresence>
        {(phase === "ripple2" || phase === "curtain") && (
          <motion.div
            key="ripple2"
            className="absolute rounded-full"
            style={{
              background: RIPPLE_2,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "10vw",
              height: "10vw",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 30, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── CURTAIN LIFT (teal panel sweeps up to reveal site) ── */}
      <AnimatePresence>
        {phase === "curtain" && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-30"
            style={{ backgroundColor: RIPPLE_1 }}
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* ── PROGRESS COUNTER — bottom right corner ── */}
      <AnimatePresence>
        {phase === "counting" && (
          <motion.div
            key="counter"
            className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <span
              className="font-anton tabular-nums leading-none"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "1.5px #0aada8",
                backgroundImage: "linear-gradient(to top, #0aada8 50%, transparent 50%)",
                backgroundSize: "100% 200%",
                backgroundPosition: `0% ${progress}%`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {String(progress).padStart(3, "0")}%
            </span>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-[#0aada8]/40 text-right">
              Loading
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
