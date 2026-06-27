import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github } from "lucide-react";
import MagneticWrapper from "./MagneticWrapper";

const NAV_LINKS = [
  { label: "HOME", targetId: "section-1" },
  { label: "EDUCATION", targetId: "section-2" },
  { label: "SKILLS", targetId: "section-3" },
  { label: "PROJECTS", targetId: "section-4" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (targetId: string) => {
    if (isTransitioning) return;

    const el = document.getElementById(targetId);
    if (!el) return;

    setIsTransitioning(true);
    el.scrollIntoView({ behavior: "instant" });
    setIsOpen(false);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const btnBase = "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-105";
  const btnClosed = `${btnBase} bg-black border-white/15 text-white-soft hover:border-white/30`;
  const btnOpen = `${btnBase} bg-white-soft border-white-soft text-black hover:bg-black hover:text-white-soft hover:border-white/30`;

  return (
    <>
      <div className="absolute top-0 right-0 p-6 md:p-10 z-[110] flex items-center gap-4">
        <MagneticWrapper strength={0.4}>
          <a
            href="https://github.com/BHAVANI200602/My-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className={isOpen ? btnOpen : btnClosed}
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </MagneticWrapper>

        <MagneticWrapper strength={0.4}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={isOpen ? btnOpen : btnClosed}
            aria-label="Toggle Menu"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between items-center">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-full h-0.5 rounded-full origin-center ${isOpen ? "bg-black" : "bg-white-soft"}`}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-full h-0.5 rounded-full ${isOpen ? "bg-black" : "bg-white-soft"}`}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-full h-0.5 rounded-full origin-center ${isOpen ? "bg-black" : "bg-white-soft"}`}
              />
            </div>
          </button>
        </MagneticWrapper>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-black flex flex-col justify-center pl-4 pr-8 md:pl-12 md:pr-24"
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
                    className="group relative text-white-soft font-display font-bold uppercase text-5xl sm:text-7xl md:text-8xl tracking-tight text-left transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
