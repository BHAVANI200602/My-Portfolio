import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

export default function Preloader({ onDiveStart, onDiveComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "white" | "black" | "curtain">("counting");
  // Guard so the sequence only ever fires ONCE even if props recreate
  const started = useRef(false);

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

  // Sequence — guarded by ref so it fires exactly once when progress hits 100
  useEffect(() => {
    if (progress < 100 || started.current) return;
    started.current = true;

    const t1 = setTimeout(() => setPhase("white"),  300);   // white fills in
    const t2 = setTimeout(() => setPhase("black"),  1500);  // black fills over white
    const t3 = setTimeout(() => {                           // curtain lifts
      setPhase("curtain");
      onDiveStart?.();
    }, 2700);
    const t4 = setTimeout(() => {                           // preloader unmounts
      document.body.style.overflow = "auto";
      onDiveComplete();
    }, 4400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps
  // ^ intentionally omitting onDiveStart/onDiveComplete — guarded by ref above

  return (
    <div
      className="fixed inset-0 w-full h-full z-[200] select-none overflow-hidden"
      // During curtain phase, wrapper must be transparent so the site is visible beneath
      style={{ background: phase === "curtain" ? "transparent" : "#000" }}
    >
      {/* White circle expands to fill screen */}
      <AnimatePresence>
        {(phase === "white" || phase === "black") && (
          <motion.div
            key="white-circle"
            className="absolute rounded-full bg-white"
            style={{
              left: "50%", top: "50%",
              translateX: "-50%", translateY: "-50%",
              width: "10vw", height: "10vw",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 35 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Black circle expands over white */}
      <AnimatePresence>
        {phase === "black" && (
          <motion.div
            key="black-circle"
            className="absolute rounded-full bg-black"
            style={{
              left: "50%", top: "50%",
              translateX: "-50%", translateY: "-50%",
              width: "10vw", height: "10vw",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 35 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Black curtain slides upward to reveal portfolio beneath */}
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
