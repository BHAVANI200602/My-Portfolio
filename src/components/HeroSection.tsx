import { useState, useEffect } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "motion/react";
import { PERSONAL_BIO } from "../data";
import WebGLHeroShader from "./WebGLHeroShader";

interface HeroSectionProps {
  isDived?: boolean;
}

export default function HeroSection({ isDived = false }: HeroSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // We removed the Chromatic Aberration & Lens Distortion hooks per user request

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
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden px-6 md:px-12 lg:px-16 pt-32 pb-8 z-10 bg-[#010101]"
    >
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#010101] via-[#050505] to-[#010101] z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      />
      
      {/* Interactive WebGL Shader Background */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <WebGLHeroShader />
      </div>

      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#010101] pointer-events-none z-20 transition-opacity duration-1000" 
        style={{ opacity: isRevealed ? 1 : 0 }}
      />

      {/* --- TOP CONTENT --- */}
      <div className="relative z-30 w-full max-w-sm">
        <motion.p 
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={isRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 15, filter: "blur(4px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#e1decc] opacity-80 font-sans text-sm leading-relaxed tracking-wide font-light"
        >
          {PERSONAL_BIO.aboutMe}
        </motion.p>
      </div>

      {/* --- BOTTOM CONTENT --- */}
      <div className="relative z-30 w-full flex flex-col mt-auto">
        
        {/* Massive Name */}
        <div className="w-full flex justify-center items-end leading-none overflow-hidden relative z-20 mb-3">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={isRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center relative w-full"
          >
            <div className="relative flex justify-center w-full overflow-hidden">
              <span
                className="font-anton uppercase tracking-tight select-none relative z-10 text-center whitespace-nowrap"
                style={{
                  fontSize: "clamp(2rem, 9.5vw, 16rem)",
                  lineHeight: 0.85,
                  color: "#e1decc",
                  letterSpacing: "-0.02em",
                  textShadow: "0 8px 40px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
                }}
              >
                BHAVANI SHANKAR.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Separator Line */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isRevealed ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[1px] bg-[#e1decc]/20 mb-6 origin-left"
        />

        {/* Sub-footer Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans font-medium tracking-widest text-[#474145] uppercase"
        >
          {/* Version / Tag */}
          <div className="flex-1 text-left hidden md:block">
            &rarr; V3.0
          </div>

          {/* Social Links */}
          <div className="flex-1 flex justify-center md:justify-end gap-6 text-[#e1decc] opacity-70">
            <a href={PERSONAL_BIO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">LINKEDIN</a>
            <span className="opacity-30 text-[#474145]">·</span>
            <a href={PERSONAL_BIO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">GITHUB</a>
            <span className="opacity-30 text-[#474145]">·</span>
            <a href={PERSONAL_BIO.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">LEETCODE</a>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
