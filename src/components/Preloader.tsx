import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

export default function Preloader({ onDiveStart, onDiveComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "white" | "black" | "curtain">("counting");

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

  useEffect(() => {
    if (progress < 100) return;

    // Step 1: White circle expands
    const t1 = setTimeout(() => setPhase("white"), 300);
    // Step 2: Black circle expands over white
    const t2 = setTimeout(() => setPhase("black"), 1500);
    // Step 3: Black curtain lifts to reveal portfolio
    const t3 = setTimeout(() => {
      setPhase("curtain");
      onDiveStart?.();
    }, 2700);
    // Done — unmount
    const t4 = setTimeout(() => {
      document.body.style.overflow = "auto";
      onDiveComplete();
    }, 4400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [progress, onDiveStart, onDiveComplete]);

  return (
    <div className="fixed inset-0 w-full h-full z-[200] select-none overflow-hidden bg-black">

      {/* Phase 2 — White circle slowly fills the entire screen */}
      <AnimatePresence>
        {(phase === "white" || phase === "black") && (
          <motion.div
            key="white-circle"
            className="absolute rounded-full bg-white"
            style={{
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "10vw",
              height: "10vw",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 35 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Phase 3 — Black circle fills over the white */}
      <AnimatePresence>
        {phase === "black" && (
          <motion.div
            key="black-circle"
            className="absolute rounded-full bg-black"
            style={{
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "10vw",
              height: "10vw",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 35 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Phase 4 — Black curtain slides up to reveal site */}
      <AnimatePresence>
        {phase === "curtain" && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-30 bg-black"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
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
