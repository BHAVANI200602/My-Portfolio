import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PERSONAL_BIO } from "../data";
import WebGLHeroShader from "./WebGLHeroShader";

interface HeroSectionProps {
  isDived?: boolean;
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
      className="relative h-screen w-full overflow-hidden bg-[#000000]"
    >
      {/* ── SHADER BACKGROUND (full bleed, z-0) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <WebGLHeroShader />
      </div>

      {/* Bottom fade so the page transition is smooth */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#010101] to-transparent pointer-events-none z-10"
        style={{ opacity: isRevealed ? 1 : 0 }}
      />

      {/* ── BIO — top-left corner ── */}
      <motion.p
        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
        animate={isRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 15, filter: "blur(4px)" }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-32 left-6 md:left-12 lg:left-16 z-20 max-w-[260px] text-[#e1decc]/80 font-sans text-sm leading-relaxed tracking-wide font-light"
      >
        {PERSONAL_BIO.aboutMe}
      </motion.p>

      {/* ── MASSIVE NAME — absolutely centered over the shader ── */}
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(16px)" }}
        animate={isRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(16px)" }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-16 z-20 flex items-end justify-center px-2"
      >
        <span
          className="font-anton uppercase select-none text-center whitespace-nowrap"
          style={{
            /* Scale from 3rem (very small screen) up to fill 100vw */
            fontSize: "clamp(3rem, 16vw, 22rem)",
            lineHeight: 0.85,
            color: "#e1decc",
            letterSpacing: "-0.03em",
            textShadow:
              "0 0 80px rgba(0,0,0,0.9), 0 8px 40px rgba(0,0,0,0.8), 0 2px 0 rgba(0,0,0,0.6)",
            display: "block",
          }}
        >
          BHAVANI SHANKAR.
        </span>
      </motion.div>

      {/* ── FOOTER BAR — pinned to very bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 z-30 flex justify-between items-center px-6 md:px-12 lg:px-16 pb-6 text-xs font-sans font-medium tracking-widest uppercase"
      >
        {/* Version */}
        <span className="text-[#474145] hidden md:block">&rarr; V3.0</span>

        {/* Social Links */}
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
