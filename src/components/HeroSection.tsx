import { useState, useEffect } from "react";
import { motion } from "motion/react";
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
    }
    setIsRevealed(false);
  }, [isDived]);

  return (
    <section
      id="section-1"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100svh" }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          opacity: isRevealed ? 1 : 0,
          filter: isRevealed ? "blur(0px)" : "blur(24px)",
          transform: isRevealed ? "scale(1)" : "scale(1.05)",
          transition: "opacity 1.5s ease-out, filter 2s ease-out, transform 2s ease-out"
        }}
      >
        <WebGLHeroShader />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1' /%3E%3Cpath d='M -4 0 L 4 0 M 0 -4 L 0 4' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='1' /%3E%3C/svg%3E")`,
          backgroundSize: "25vw 25vh",
          backgroundPosition: "0 0",
        }}
      />

      {/* Bottom ambient light — soft glow + depth fade */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-[5]"
        style={{
          height: "55vh",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(240,240,240,0.07) 0%, rgba(240,240,240,0.02) 40%, transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-[6]" />

      {/* Art+computing — mobile: upper-left (unchanged feel); desktop: tiny corner tag */}
      {/* Art+computing — mobile: upper-left (unchanged feel); desktop: tiny corner tag */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 pointer-events-none
          top-[4.5rem] left-5
          sm:top-20 sm:left-6
          md:top-7 md:left-7
          lg:top-8 lg:left-8"
      >
        <span className="font-mono text-[8px] md:text-[7px] tracking-[0.35em] uppercase text-white/35 block mb-1 md:mb-0.5">
          Discipline
        </span>
        <p className="font-anton uppercase text-white-soft/90 leading-none
          text-2xl sm:text-3xl
          md:text-sm md:text-white/50
          lg:text-xs lg:tracking-[0.12em]">
          Art<span className="font-sans font-light normal-case text-white/30 md:text-[10px]">+</span>computing
        </p>
      </motion.div>

      {/* Editorial name — bottom, edge-to-edge */}
      {/* Editorial name — bottom, edge-to-edge */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-0 z-20 pointer-events-none
          px-2 sm:px-3 md:px-4 lg:px-5
          pb-6 sm:pb-8 md:pb-10 lg:pb-12"
      >
        <h1
          className="font-anton uppercase text-white-soft text-center leading-[0.82] tracking-[-0.01em] w-full select-none"
          style={{ fontSize: "clamp(2.8rem, 13.5vw, 12rem)" }}
        >
          Bhavani Shankar
        </h1>
      </motion.div>
    </section>
  );
}
