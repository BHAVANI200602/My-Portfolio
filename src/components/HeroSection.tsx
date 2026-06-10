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
      className="relative min-h-screen w-full flex flex-col justify-center items-start overflow-hidden px-6 md:px-16 lg:px-24 pt-24 pb-16 z-10 bg-black"
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

      <div className="relative w-full max-w-[1200px] z-30 flex flex-col items-start justify-center text-left pt-12 md:pt-20">
        
        {/* Accent Greeting */}
        <div 
          className="mb-4 sm:mb-6 transition-all duration-700 delay-100"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <p className="text-[#00E5FF] font-mono text-sm md:text-lg tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
            Hi, I am
          </p>
        </div>

        {/* Liquid Heading: "BHAVANI SHANKAR" aligned to the side */}
        <div className={`relative mb-8 sm:mb-12 w-full max-w-4xl transition-all duration-700 ${revealed ? "is-revealed" : "opacity-0 translate-y-4"}`}>
          <div className="w-full relative select-none leading-none">
            <svg
              className="w-full h-auto overflow-visible"
              viewBox="0 0 800 130"
              preserveAspectRatio="xMinYMid meet"
              aria-label="BHAVANI SHANKAR"
            >
              <text
                className="svg-outline fill-none stroke-white stroke-[2.5px]"
                x="0"
                y="95"
                dominantBaseline="middle"
                textAnchor="start"
                style={{
                  fontFamily: '"Anton", sans-serif',
                  fontSize: "92px",
                  fontWeight: 900,
                  letterSpacing: "0.01em"
                }}
              >
                BHAVANI SHANKAR
              </text>
              <g className="svg-fill-wrapper" style={{ filter: "drop-shadow(0px 0px 15px rgba(255, 255, 255, 0.4))" }}>
                <text
                  className="svg-fill fill-white"
                  style={{
                    transform: revealed ? "translateY(0)" : "translateY(100%)",
                    fontFamily: '"Anton", sans-serif',
                    fontSize: "92px",
                    fontWeight: 900,
                    letterSpacing: "0.01em"
                  }}
                  x="0"
                  y="95"
                  dominantBaseline="middle"
                  textAnchor="start"
                >
                  BHAVANI SHANKAR
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Premium Word-by-word Reveal Subheading */}
        <div className="max-w-3xl mt-2 sm:mt-6 md:mt-8">
          <p className="font-spartan font-black text-lg md:text-2xl lg:text-3xl text-slate-300 uppercase tracking-wide leading-relaxed flex flex-wrap justify-start gap-x-3 gap-y-1">
            {["DEVELOPER", "LEARNING,", "BUILDING,", "AND", "UNDERSTANDING", "SYSTEMS."].map((word, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-800"
                style={{
                  transitionDelay: `${0.1 + i * 0.08}s`,
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0) scale(1)" : "translateY(15px) scale(0.95)",
                  filter: revealed ? "blur(0px)" : "blur(4px)",
                }}
              >
                {word}
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
