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
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <WebGLHeroShader />
      </div>

      {/* Architectural grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1' /%3E%3Cpath d='M -4 0 L 4 0 M 0 -4 L 0 4' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='1' /%3E%3C/svg%3E")`,
          backgroundSize: "25vw 25vh",
          backgroundPosition: "0 0",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-40 md:h-[45vh] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

      {/* Editorial grid — aligns copy to grid intersections */}
      <div className="absolute inset-0 z-20 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 grid-rows-6 pointer-events-none px-6 md:px-12 lg:px-16 py-8 md:py-12">

        {/* Top left — editorial quote */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-3 md:col-span-4 lg:col-span-5 row-start-1 self-start pt-16 md:pt-20 lg:pt-24"
        >
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-white/40 block mb-3">
            Discipline
          </span>
          <p className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white-soft tracking-tight leading-[0.95]">
            Art<span className="text-white/40 font-normal">+</span>computing
          </p>
        </motion.div>

        {/* Bottom left — intro */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-4 md:col-span-6 lg:col-span-7 row-start-5 md:row-start-6 self-end pb-16 md:pb-20 lg:pb-24"
        >
          <p className="font-sans text-lg md:text-2xl lg:text-[1.75rem] text-white/60 font-light leading-[1.55] tracking-tight max-w-2xl lg:max-w-3xl">
            <span className="font-display font-bold text-white-soft text-2xl md:text-4xl lg:text-5xl block mb-3 md:mb-4 tracking-tight leading-[1.05]">
              Hello,
            </span>
            im{" "}
            <span className="font-display font-bold text-white-soft">Bhavani Shankar</span>
            , aspiring developer, building code that some times just works
          </p>
        </motion.div>
      </div>
    </section>
  );
}
