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

    // Jump scroll right when the curtain fully covers the screen (750ms)
    setTimeout(() => {
      el.scrollIntoView({ behavior: "instant" });
    }, 750);

    // Remove the wave completely once the animation finishes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1750);
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

      {/* 2. Simple Theme Curtain Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "0%", "0%", "-100%"] }}
            transition={{ 
              times: [0, 0.42, 0.52, 1],
              duration: 1.7,
              ease: [0.76, 0, 0.24, 1]
            }}
            className="fixed inset-0 z-[100] bg-[#ACB6FF] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  );
}
