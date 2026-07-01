import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

const SOFT_WHITE = "#F0F0F0";
const BLACK = "#000000";

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

  useEffect(() => {
    if (progress < 100) return;

    const t1 = setTimeout(() => setPhase("ripple1"), 200);
    const t2 = setTimeout(() => setPhase("ripple2"), 900);
    const t3 = setTimeout(() => {
      setPhase("curtain");
      onDiveStart?.();
    }, 1700);
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
  }, [progress, onDiveStart, onDiveComplete]);

  return (
    <div 
      className="fixed inset-0 w-full h-full z-50 select-none overflow-hidden" 
      style={{ backgroundColor: phase === "counting" ? "black" : "transparent" }}
    >
      <AnimatePresence>
        {(phase === "ripple1" || phase === "ripple2") && (
          <motion.div
            key="ripple1"
            className="absolute rounded-full"
            style={{
              background: SOFT_WHITE,
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

      <AnimatePresence>
        {phase === "ripple2" && (
          <motion.div
            key="ripple2"
            className="absolute rounded-full"
            style={{
              background: BLACK,
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

      <AnimatePresence>
        {phase === "curtain" && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-30 bg-black"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
        )}
      </AnimatePresence>

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
