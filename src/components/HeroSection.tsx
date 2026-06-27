import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PERSONAL_BIO } from "../data";
import WebGLHeroShader from "./WebGLHeroShader";
import MagneticWrapper from "./MagneticWrapper";

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
      className="relative w-full overflow-hidden bg-[#000000]"
      style={{ height: "100svh" }}
    >
      {/* ── SHADER BACKGROUND ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <WebGLHeroShader />
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 md:h-[45vh] bg-gradient-to-t from-[#030014] via-[#030014]/60 md:via-[#030014]/80 to-transparent pointer-events-none z-10" />

      {/* ── EDITORIAL BADGE — Top Left ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-24 md:top-32 left-6 md:left-12 lg:left-16 z-20 pointer-events-none"
      >
        <h1 className="font-sans font-extrabold text-5xl md:text-7xl lg:text-[6rem] text-[var(--color-text)] tracking-tighter leading-[0.9]">
          Design &<br />Engineering
        </h1>
      </motion.div>

      {/* ── INTRO SENTENCE — Bottom Left ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-20 md:bottom-28 lg:bottom-32 left-6 md:left-12 lg:left-16 z-20 pointer-events-none"
      >
        <p className="font-sans text-[var(--color-text)] text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight max-w-4xl lg:max-w-6xl text-left leading-[1.1] md:leading-[1.1]">
          <span className="font-bold text-[var(--color-text)] text-6xl md:text-[7rem] lg:text-[9rem] tracking-tighter block mb-2 md:mb-4 leading-[0.8]">
            Hello,
          </span>
          <span className="opacity-80">I'm </span>
          <span className="font-anton uppercase text-[var(--color-theme)] tracking-normal text-4xl md:text-6xl lg:text-[5rem] mx-2 align-baseline">
            Bhavani Shankar
          </span>
          <span className="opacity-80">, aspiring developer, building code with an eye for design.</span>
        </p>
      </motion.div>

      {/* ── FOOTER BAR — absolute bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 z-30 flex justify-center md:justify-between items-center px-6 md:px-12 lg:px-16 h-12 border-t border-[#E5D9FF]/10 text-[10px] md:text-xs font-sans font-medium tracking-widest uppercase"
      >
        <span className="text-[#E5D9FF]/50 hidden md:block">&rarr; V3.0</span>
        <div className="flex justify-center w-full md:w-auto gap-4 md:gap-6 text-[#E5D9FF]">
          <MagneticWrapper strength={0.3}>
            <a href={PERSONAL_BIO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F5] transition-colors">LINKEDIN</a>
          </MagneticWrapper>
          <span className="text-[#E5D9FF]/30">·</span>
          <MagneticWrapper strength={0.3}>
            <a href={PERSONAL_BIO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F5] transition-colors">GITHUB</a>
          </MagneticWrapper>
          <span className="text-[#E5D9FF]/30">·</span>
          <MagneticWrapper strength={0.3}>
            <a href={PERSONAL_BIO.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F5] transition-colors">LEETCODE</a>
          </MagneticWrapper>
        </div>
      </motion.div>
    </section>
  );
}
