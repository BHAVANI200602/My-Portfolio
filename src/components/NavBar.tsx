import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "HOME", targetId: "section-1" },
  { label: "EDUCATION", targetId: "section-2" },
  { label: "SKILLS", targetId: "section-3" },
  { label: "PROJECTS", targetId: "section-4" },
];

export default function NavBar() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavClick = (targetId: string) => {
    if (isTransitioning) return;
    
    // Check if we are already at the target section to avoid redundant transition
    const el = document.getElementById(targetId);
    if (!el) return;

    setIsTransitioning(true);

    // After the aurora wave covers the screen (700ms), scroll instantly
    setTimeout(() => {
      el.scrollIntoView({ behavior: "instant" });
    }, 700);

    // Remove the wave
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <>
      {/* 1. The Fixed Nav Bar - using mix-blend-difference so it's always readable */}
      <nav className="fixed top-0 left-0 w-full z-[80] pt-8 pb-4 px-4 mix-blend-difference pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 md:gap-14 pointer-events-auto">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.targetId)}
              className="relative group text-white/90 hover:text-white font-sans font-bold text-[11px] md:text-sm tracking-[0.25em] uppercase transition-colors outline-none"
            >
              <span className="relative z-10">{link.label}</span>
              {/* Soft glow on hover underneath the text */}
              <div className="absolute inset-0 bg-[#ACB6FF]/0 group-hover:bg-[#ACB6FF]/60 blur-md rounded-full transition-all duration-300 pointer-events-none" />
            </button>
          ))}
        </div>
      </nav>

      {/* 2. The Aurora Transition Wave */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "0%", "0%", "-100%"] }}
            transition={{ 
              duration: 1.5, 
              times: [0, 0.45, 0.55, 1], 
              ease: [0.76, 0, 0.24, 1] 
            }}
            className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-[#070707] overflow-hidden"
          >
            {/* The Aurora mist layers */}
            <div 
              className="absolute inset-0 opacity-80 mix-blend-screen" 
              style={{
                backgroundImage: "radial-gradient(circle at 50% 150%, #ACB6FF 0%, transparent 60%), radial-gradient(circle at 80% -50%, #D476FF 0%, transparent 60%), radial-gradient(circle at -20% 50%, #00E5FF 0%, transparent 50%)",
                filter: "blur(60px)"
              }}
            />
            
            <div 
              className="absolute inset-0 opacity-50 mix-blend-screen" 
              style={{
                backgroundImage: "radial-gradient(circle at 50% 50%, #ACB6FF 0%, transparent 40%)",
                filter: "blur(40px)"
              }}
            />

            {/* Loading / Teleporting UI inside the wave */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#ACB6FF]/20 border-t-[#ACB6FF] animate-spin" />
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ACB6FF]/80 animate-pulse">
                Establishing Link
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
