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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

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

  const btnBase =
    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-105";

  const btnClosed = `${btnBase} bg-black border-white/15 text-white-soft hover:bg-white/[0.06] hover:border-white/35 hover:text-white`;

  const btnOpen = `${btnBase} bg-black border-black text-white-soft hover:bg-grey-400 hover:border-grey-400 hover:text-black`;

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
                className={`w-full h-0.5 rounded-full origin-center ${isOpen ? "bg-white-soft" : "bg-white-soft"}`}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-0.5 rounded-full bg-white-soft"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-full h-0.5 rounded-full origin-center ${isOpen ? "bg-white-soft" : "bg-white-soft"}`}
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
            className="fixed inset-0 z-[100] bg-white-soft flex flex-col justify-center pl-4 pr-8 md:pl-12 md:pr-24"
          >
            <div className="flex flex-col items-start gap-2 md:gap-4 max-w-5xl w-full">
              {NAV_LINKS.map((link, i) => {
                const isHovered = hoveredLink === link.label;

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    className="w-full overflow-hidden"
                    onMouseEnter={() => setHoveredLink(link.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <button
                      onClick={() => handleNavClick(link.targetId)}
                      className="group relative w-full text-left py-1 md:py-2"
                    >
                      {/* Black fill sweeps in on hover — white menu, black text inverts */}
                      <span
                        className="absolute inset-0 bg-black origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                        }}
                      />

                      <span
                        className={`relative z-10 block font-anton uppercase tracking-normal transition-colors duration-300
                          text-5xl sm:text-7xl md:text-8xl leading-[0.95]
                          ${isHovered ? "text-white-soft" : "text-black"}`}
                      >
                        {link.label}
                      </span>

                      {/* Grey index label on hover */}
                      <span
                        className={`relative z-10 font-mono text-[9px] tracking-[0.3em] uppercase mt-1 block transition-colors duration-300
                          ${isHovered ? "text-white/40" : "text-grey-300"}`}
                      >
                        0{i + 1} — Navigate
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
