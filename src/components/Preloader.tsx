import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

// Sequence: Ku Crimson floods the screen, then black wipes over it.
// The curtain that lifts away is black — matching the actual page behind it.
const RIPPLE_CRIMSON = "#B5FF47"; // Ku Crimson
const RIPPLE_BLACK   = "#030014"; // Ink Black — same as the page bg
const TEXT_COLOR     = "#E5D9FF"; // Bone

export default function Preloader({ onDiveStart, onDiveComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "ripple1" | "ripple2" | "curtain">("counting");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // When progress hits 100, kick off the ripple sequence
  useEffect(() => {
    if (progress < 100) return;

    // Small pause at 100%, then crimson floods in
    const t1 = setTimeout(() => setPhase("ripple1"), 200);
    // Black ripple follows — covers the crimson
    const t2 = setTimeout(() => setPhase("ripple2"), 900);
    // Black curtain lifts to reveal the page
    const t3 = setTimeout(() => {
      setPhase("curtain");
      if (onDiveStart) onDiveStart();
    }, 1700);
    // Unmount preloader
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
    <div className="fixed inset-0 w-full h-full z-50 select-none overflow-hidden bg-[#030014]">

      {/* ── RIPPLE 1: Ku Crimson floods in from center ── */}
      <AnimatePresence>
        {(phase === "ripple1" || phase === "ripple2" || phase === "curtain") && (
          <motion.div
            key="ripple1"
            className="absolute rounded-full"
            style={{
              background: RIPPLE_CRIMSON,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "10vw",
              height: "10vw",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 32, opacity: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── RIPPLE 2: Black wipes over the crimson ── */}
      <AnimatePresence>
        {(phase === "ripple2" || phase === "curtain") && (
          <motion.div
            key="ripple2"
            className="absolute rounded-full"
            style={{
              background: RIPPLE_BLACK,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "10vw",
              height: "10vw",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 32, opacity: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── CURTAIN: Black slides UP — reveals the page beneath ── */}
      <AnimatePresence>
        {phase === "curtain" && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-30"
            style={{ backgroundColor: RIPPLE_BLACK }}
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* ── PROGRESS COUNTER — bottom right ── */}
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
                WebkitTextStroke: `1.5px ${TEXT_COLOR}`,
                backgroundImage: `linear-gradient(to top, ${RIPPLE_CRIMSON} 50%, ${TEXT_COLOR} 50%)`,
                backgroundSize: "100% 200%",
                backgroundPosition: `0% ${progress}%`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {String(progress).padStart(3, "0")}%
            </span>
            <div
              className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-right"
              style={{ color: `${TEXT_COLOR}99` }}
            >
              Loading
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
