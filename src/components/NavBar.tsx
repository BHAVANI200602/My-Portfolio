import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github } from "lucide-react";

const NAV_LINKS = [
  { label: "HOME", targetId: "section-1" },
  { label: "EDUCATION", targetId: "section-2" },
  { label: "SKILLS", targetId: "section-3" },
  { label: "PROJECTS", targetId: "section-4" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (targetId: string) => {
    if (isTransitioning) return;
    
    const el = document.getElementById(targetId);
    if (!el) return;

    setIsTransitioning(true);

    // Scroll to the element behind the curtain immediately
    el.scrollIntoView({ behavior: "instant" });
    
    // Close the curtain to reveal the new section
    setIsOpen(false);

    // Reset transition lock
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Wait for exit animation to finish
  };

  return (
    <>
      {/* 
        1. Top Right Floating Widgets 
        Absolute positioned so they stay at the top of the Home Section and don't drag down on scroll.
      */}
      <div className="absolute top-0 right-0 p-6 md:p-10 z-[110] flex items-center gap-4">
        
        {/* GitHub Repository Link */}
        <a
          href="https://github.com/BHAVANI200602/My-Portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center text-[#faf9f6] shadow-lg hover:scale-105 hover:bg-zinc-900 transition-all duration-300"
          aria-label="GitHub Repository"
        >
          <Github className="w-5 h-5 md:w-6 md:h-6" />
        </a>

        {/* Menu Toggle Button with morphing Hamburger / X */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center text-[#faf9f6] shadow-lg hover:scale-105 hover:bg-zinc-900 transition-all duration-300 outline-none"
          aria-label="Toggle Menu"
        >
          <div className="relative w-5 h-4 flex flex-col justify-between items-center">
            {/* Top Line */}
            <motion.span
              animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-0.5 bg-[#faf9f6] rounded-full origin-center"
            />
            {/* Middle Line */}
            <motion.span
              animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-0.5 bg-[#faf9f6] rounded-full"
            />
            {/* Bottom Line */}
            <motion.span
              animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-0.5 bg-[#faf9f6] rounded-full origin-center"
            />
          </div>
        </button>
      </div>

      {/* 2. Full-Screen Editorial Curtain Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-[#070f0f] flex flex-col justify-center pl-4 pr-8 md:pl-12 md:pr-24"
          >
            <div className="flex flex-col items-start gap-4 md:gap-8 max-w-4xl">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <button
                    onClick={() => handleNavClick(link.targetId)}
                    className="group relative text-[#f0fafa] font-anton uppercase text-5xl sm:text-7xl md:text-8xl tracking-wider text-left transition-colors hover:text-[#0aada8]"
                  >
                    {link.label}
                  </button>
                </motion.div>
              ))}
            </div>
            
            {/* Soft decorative accent */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-10 left-4 md:left-12 font-mono text-[10px] tracking-widest uppercase text-[#0aada8]/40"
            >
              // Navigation_Menu
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
