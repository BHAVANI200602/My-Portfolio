import { useState, useEffect } from "react";
import { Github, Linkedin, Code } from "lucide-react";
import { PERSONAL_BIO } from "../data";
import BackgroundShader from "./BackgroundShader";

interface HeroSectionProps {
  isDived?: boolean;
}

export default function HeroSection({ isDived = false }: HeroSectionProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isDived) {
      // Reveal liquid texts after a tiny delay for beautiful synchronized visual feedback
      const timer = setTimeout(() => setRevealed(true), 150);
      return () => clearTimeout(timer);
    } else {
      setRevealed(false);
    }
  }, [isDived]);

  return (
    <section
      id="section-1"
      className="relative min-h-screen w-full flex flex-col justify-center items-start overflow-hidden px-4 md:px-8 lg:px-12 pt-24 pb-16 z-10 bg-black"
    >
      {/* Deep Space Horizon Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0B0F19] to-black z-0 pointer-events-none" />
      {/* Glowing Horizon Line */}
      <div className="absolute top-[45%] left-0 w-full h-[250px] -translate-y-1/2 bg-[#ACB6FF]/20 blur-[120px] pointer-events-none z-0" />

      {/* Implements the interactive WebGL Shader Background */}
      <div className="absolute inset-0 z-10 mix-blend-screen opacity-80 pointer-events-none">
        <BackgroundShader />
      </div>

      {/* Foreground gradient to blend into next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-20" />

      <div className="relative w-full max-w-[1400px] z-30 flex flex-col items-start justify-center text-left pt-12 md:pt-20">
        
        {/* Accent Greeting */}
        <div 
          className="mb-0 sm:mb-1 transition-all duration-700 delay-100"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <p className="text-[#00E5FF] font-sans font-bold text-lg md:text-2xl tracking-tight">
            Hi, I am
          </p>
        </div>

        {/* Massive HTML Heading: "BHAVANI SHANKAR" with CSS stroke/fill animation for tight spacing */}
        <div className={`relative mb-1 sm:mb-2 w-full transition-all duration-700 ${revealed ? "opacity-100" : "opacity-0 translate-y-4"}`}>
          <div className="relative inline-block select-none leading-[0.9]">
            {/* Outline Text */}
            <h1
              className="font-anton text-[15vw] md:text-[11rem] lg:text-[13rem] tracking-[0.02em] text-transparent uppercase m-0 p-0"
              style={{ WebkitTextStroke: "2px #cbd5e1" }}
            >
              BHAVANI SHANKAR
            </h1>
            {/* Filled Text that clips up from bottom */}
            <h1
              className="font-anton text-[15vw] md:text-[11rem] lg:text-[13rem] tracking-[0.02em] text-slate-300 uppercase m-0 p-0 absolute top-0 left-0 transition-all duration-[1200ms] ease-out"
              style={{
                clipPath: revealed ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
              }}
            >
              BHAVANI SHANKAR
            </h1>
          </div>
        </div>

        {/* Premium Word-by-word Reveal Subheading */}
        <div className="max-w-4xl mt-0 md:mt-2">
          <p className="font-sans font-bold text-2xl md:text-4xl lg:text-5xl text-slate-300 tracking-tight leading-[1.1]">
            {["Developer", "learning,", "building,", "and", "understanding", "systems."].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.25em]">
                <span
                  className="inline-block transition-all duration-800"
                  style={{
                    transitionDelay: `${0.1 + i * 0.06}s`,
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "translateY(0)" : "translateY(100%)",
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </p>
        </div>

        {/* Quietly elegant professional bio */}
        <div
          className="w-full max-w-2xl mt-8 md:mt-10 text-left transition-all duration-1000 delay-500"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="text-slate-400 leading-relaxed font-sans text-sm md:text-base font-light italic">
            &ldquo;{PERSONAL_BIO.aboutMe}&rdquo;
          </p>
        </div>

        {/* Clean, high contrast Social and Profile triggers */}
        <div
          className="flex flex-wrap items-center justify-start gap-4 mt-8 transition-all duration-1000 delay-700"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(15px)",
          }}
        >
          <a
            href={PERSONAL_BIO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-900 to-black hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-neon-blue group text-white font-mono text-xs rounded transition-all duration-300 shadow-md"
          >
            <Github className="w-4 h-4 text-slate-400 group-hover:text-neon-blue transition-colors" />
            <span>GITHUB</span>
          </a>
          <a
            href={PERSONAL_BIO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-900 to-black hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-neon-pink group text-white font-mono text-xs rounded transition-all duration-300 shadow-md"
          >
            <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-neon-pink transition-colors" />
            <span>LINKEDIN</span>
          </a>
          <a
            href={PERSONAL_BIO.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-900 to-black hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-yellow-400 group text-white font-mono text-xs rounded transition-all duration-300 shadow-md"
          >
            <Code className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 transition-colors" />
            <span>LEETCODE</span>
          </a>
        </div>
      </div>

      {/* Pulsing down-scroll anchor */}
      <div 
        className="absolute bottom-8 right-6 md:right-16 lg:right-24 hidden lg:flex flex-col items-end gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ACB6FF]/40 select-none cursor-pointer hover:text-neon-pink transition-colors duration-300 z-30"
        onClick={() => {
          document.getElementById("section-2")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span>SCROLL DOWN</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#ACB6FF]/40 via-[#ACB6FF]/10 to-transparent relative overflow-hidden mr-4">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-neon-pink animate-bounce-custom" />
        </div>
      </div>

      {/* Bounce CSS override within react tag */}
      <style>{`
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(100%); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 2s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
