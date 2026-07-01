import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

export default function Preloader({ onDiveStart, onDiveComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "expand" | "curtain">("counting");

  // Count up to 100
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1;
        const next = prev + increment;
        if (next >= 100) { clearInterval(interval); return 100; }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Once at 100 → one slow expand → curtain slides off
  useEffect(() => {
    if (progress < 100) return;

    // Brief pause, then start the single white circle expand
    const t1 = setTimeout(() => setPhase("expand"), 300);
    // After expand settles, trigger curtain + notify parent
    const t2 = setTimeout(() => {
      setPhase("curtain");
      onDiveStart?.();
    }, 1600);
    // Curtain done — unmount preloader
    const t3 = setTimeout(() => {
      document.body.style.overflow = "auto";
      onDiveComplete();
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [progress, onDiveStart, onDiveComplete]);

  return (
    <div
      className="fixed inset-0 w-full h-full z-[200] select-none overflow-hidden"
      style={{ background: phase === "counting" || phase === "expand" ? "#000" : "transparent" }}
    >
      {/* Single white circle — expands slowly to fill screen */}
      <AnimatePresence>
        {phase === "expand" && (
          <motion.div
            key="circle"
            className="absolute rounded-full bg-white"
            style={{
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "12vw",
              height: "12vw",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 30, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Black curtain slides up to reveal portfolio */}
      <AnimatePresence>
        {phase === "curtain" && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-30 bg-black"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Progress counter */}
      <AnimatePresence>
        {phase === "counting" && (
          <motion.div
            key="counter"
            className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <span
              className="font-anton tabular-nums leading-none text-white"
              style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)" }}
            >
              {String(progress).padStart(3, "0")}%
            </span>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-right text-white/40">
              Loading
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
