import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { PERSONAL_BIO } from "../data";
import WebGLHeroShader from "./WebGLHeroShader";

interface HeroSectionProps {
  isDived?: boolean;
}

/** Scales its children to exactly fill the parent width */
function FitText({ children, className }: { children: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;
      // Reset to a known size, measure, then scale
      text.style.fontSize = "100px";
      const naturalWidth = text.scrollWidth;
      const containerWidth = container.offsetWidth;
      const newSize = (containerWidth / naturalWidth) * 100;
      text.style.fontSize = `${newSize}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <span
        ref={textRef}
        className={`font-anton uppercase whitespace-nowrap select-none leading-none block ${className ?? ""}`}
      >
        {children}
      </span>
    </div>
  );
}

export default function HeroSection({ isDived = false }: HeroSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isDived) {
      const timer = setTimeout(() => setIsRevealed(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
    }
  }, [isDived]);

  return (
    <section
      id="section-1"
      className="relative h-screen w-full overflow-hidden bg-[#000000] flex flex-col"
    >
      {/* ── SHADER BACKGROUND ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <WebGLHeroShader />
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#010101] to-transparent pointer-events-none z-10" />

      {/* ── BIO — top-left ── */}
      <motion.p
        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
        animate={isRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 15, filter: "blur(4px)" }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mt-32 ml-6 md:ml-12 lg:ml-16 max-w-[240px] text-[#e1decc]/80 font-sans text-sm leading-relaxed tracking-wide font-light flex-shrink-0"
      >
        {PERSONAL_BIO.aboutMe}
      </motion.p>

      {/* ── SPACER pushes name to bottom ── */}
      <div className="flex-1" />

      {/* ── MASSIVE NAME — fills full width, sits above footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        animate={isRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(12px)" }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 w-full px-2"
        style={{ marginBottom: "0.25rem" }}
      >
        <FitText className="text-[#e1decc]">
          BHAVANI SHANKAR.
        </FitText>
      </motion.div>

      {/* ── FOOTER BAR — pinned below name ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-30 flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 border-t border-[#e1decc]/10 text-xs font-sans font-medium tracking-widest uppercase flex-shrink-0"
      >
        <span className="text-[#474145] hidden md:block">&rarr; V3.0</span>
        <div className="flex gap-6 text-[#e1decc]/70">
          <a href={PERSONAL_BIO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">LINKEDIN</a>
          <span className="text-[#474145]/40">·</span>
          <a href={PERSONAL_BIO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">GITHUB</a>
          <span className="text-[#474145]/40">·</span>
          <a href={PERSONAL_BIO.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">LEETCODE</a>
        </div>
      </motion.div>
    </section>
  );
}
