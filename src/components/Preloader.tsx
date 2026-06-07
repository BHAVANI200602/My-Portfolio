import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onDiveStart?: () => void;
  onDiveComplete: () => void;
}

export default function Preloader({ onDiveStart, onDiveComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDiving, setIsDiving] = useState(false);

  useEffect(() => {
    // Disable body overflow during preloading
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 4) + 2;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return next;
      });
    }, 28);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDive = () => {
    setIsDiving(true);
    
    // Trigger onDiveStart when the screen is fully filled with beige (around 750ms into the transition)
    setTimeout(() => {
      if (onDiveStart) {
        onDiveStart();
      }
    }, 750);

    // Complete the entire sequence and unmount when the curtain lifts completely (1700ms)
    setTimeout(() => {
      document.body.style.overflow = "auto";
      onDiveComplete();
    }, 1750);
  };

  return (
    <div className="fixed inset-0 w-full h-full z-50 select-none overflow-hidden flex flex-col items-center justify-center bg-transparent">
      
      {/* 1. Underlying Solid Black Base Layer: fades out while covered by the curtain */}
      <motion.div 
        className="absolute inset-0 bg-[#000000] z-10"
        animate={isDiving ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.65, ease: "easeInOut" }}
      />

      {/* 2. Immersive Periwinkle Curtain: sweeps from bottom -> fills screen -> lifts to top */}
      <motion.div 
        className="absolute inset-0 bg-[#ACB6FF] z-30"
        initial={{ y: "100%" }}
        animate={isDiving ? { y: ["100%", "0%", "0%", "-100%"] } : { y: "100%" }}
        transition={
          isDiving 
            ? {
                times: [0, 0.42, 0.52, 1],
                duration: 1.7,
                ease: [0.76, 0, 0.24, 1],
              }
            : { duration: 0 }
        }
      />

      {/* 3. Preloader UI & Clickable Triggers Container */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center w-full max-w-xl"
        animate={isDiving ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="text-center px-4"
            >
              <h2
                className="font-anton tracking-widest text-[5.5rem] md:text-[9rem] leading-none transition-all duration-100 uppercase"
                style={{
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  WebkitTextStroke: "2px #ACB6FF",
                  backgroundImage: "linear-gradient(to top, #ACB6FF 50%, transparent 50%)",
                  backgroundSize: "100% 200%",
                  backgroundPosition: `0% ${progress}%`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {progress}%
              </h2>
              <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#ACB6FF]/40">
                Calibrating Systems Architect Portfolio
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dive-button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center cursor-pointer px-4 w-full"
              onClick={handleDive}
            >
              <button
                className="relative group border-none bg-transparent outline-none cursor-pointer p-0 w-full"
                disabled={isDiving}
              >
                {/* Visual glow ring */}
                {!isDiving && (
                  <div className="absolute -inset-4 rounded-full bg-[#ACB6FF]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
                )}

                {/* Elegant Solid Text with Letter Spacing Transition */}
                <div className="font-anton select-none text-[5.0rem] md:text-[7.5rem] uppercase leading-none text-center inline-block text-[#ACB6FF] tracking-wider transition-colors duration-500 group-hover:text-[#D476FF]">
                  DIVE IN
                </div>

                {/* Status instruction tag */}
                <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[#ACB6FF]/60">
                  Click to establish link
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
