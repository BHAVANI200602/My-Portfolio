import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionTemplate } from "motion/react";
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

      {/* Bottom vignette — dynamic height: shorter on mobile so it doesn't swallow the screen, taller on desktop */}
      <div className="absolute inset-x-0 bottom-0 h-40 md:h-[45vh] bg-gradient-to-t from-[#030014] via-[#030014]/60 md:via-[#030014]/80 to-transparent pointer-events-none z-10" />

      {/* ── EDITORIAL BADGE — Top Left ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-24 md:top-32 left-6 md:left-12 lg:left-16 z-20 pointer-events-none"
      >
        <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-[var(--color-text)] tracking-tight leading-none">
          Design &<br />Engineering
        </h1>
      </motion.div>

      {/* ── INTRO SENTENCE — centered ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6 md:px-12"
      >
        <p className="font-sans text-[var(--color-text)] text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-5xl text-center leading-[1.3]">
          <span className="font-bold text-[var(--color-text)] text-4xl md:text-6xl lg:text-7xl block mb-2">Hello,</span>
          I'm Bhavani Shankar, aspiring developer, building code with an eye for design.
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
            <a href={PERSONAL_BIO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#B5FF47] transition-colors">LINKEDIN</a>
          </MagneticWrapper>
          <span className="text-[#E5D9FF]/30">·</span>
          <MagneticWrapper strength={0.3}>
            <a href={PERSONAL_BIO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#B5FF47] transition-colors">GITHUB</a>
          </MagneticWrapper>
          <span className="text-[#E5D9FF]/30">·</span>
          <MagneticWrapper strength={0.3}>
            <a href={PERSONAL_BIO.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-[#B5FF47] transition-colors">LEETCODE</a>
          </MagneticWrapper>
        </div>
      </motion.div>
    </section>
  );
}
