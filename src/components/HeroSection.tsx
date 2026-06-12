import { useState, useEffect } from "react";
import { Github, Linkedin, Code } from "lucide-react";
import { PERSONAL_BIO } from "../data";
import BackgroundShader from "./BackgroundShader";

interface HeroSectionProps {
  isDived?: boolean;
}

export default function HeroSection({ isDived = false }: HeroSectionProps) {
  // Phase 1: Name and greeting revealed on black screen
  const [nameRevealed, setNameRevealed] = useState(false);
  // Phase 2: Background and the rest of the text revealed
  const [backgroundRevealed, setBackgroundRevealed] = useState(false);

  useEffect(() => {
    if (isDived) {
      // 1. Immediately reveal name and greeting
      const timer1 = setTimeout(() => setNameRevealed(true), 150);
      
      // 2. Reveal background and rest of content after a delay
      const timer2 = setTimeout(() => setBackgroundRevealed(true), 1200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setNameRevealed(false);
      setBackgroundRevealed(false);
    }
  }, [isDived]);

  return (
    <section
      id="section-1"
      className="relative min-h-screen w-full flex flex-col justify-end items-start overflow-hidden px-4 md:px-8 lg:px-12 pt-24 pb-20 md:pb-28 z-10 bg-black"
    >
      {/* Background elements - Only show when backgroundRevealed is true */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0B0F19] to-black z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: backgroundRevealed ? 1 : 0 }}
      />
      <div 
        className="absolute top-[45%] left-0 w-full h-[250px] -translate-y-1/2 bg-[#ACB6FF]/20 blur-[120px] pointer-events-none z-0 transition-opacity duration-1000"
        style={{ opacity: backgroundRevealed ? 1 : 0 }}
      />
      
      {/* Implements the interactive WebGL Shader Background */}
      <div 
        className="absolute inset-0 z-10 mix-blend-screen opacity-80 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: backgroundRevealed ? 1 : 0 }}
      >
        <BackgroundShader />
      </div>

      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-20 transition-opacity duration-1000" 
        style={{ opacity: backgroundRevealed ? 1 : 0 }}
      />

      {/* Subtle shooting stars in the distant top-right horizon */}
      {backgroundRevealed && <ShootingStars />}

      {/* All text content wrapper - static layout at bottom left */}
      <div className="relative w-full max-w-5xl z-30 flex flex-col items-start text-left px-0 gap-0">

        {/* — Magazine layout block — */}
        <div className="flex flex-col gap-0 w-full">
          
          {/* Label: Hi, I am */}
          <div
            className="overflow-hidden"
            style={{ opacity: nameRevealed ? 1 : 0, transition: "opacity 0.6s ease" }}
          >
            <span
              className="inline-block font-sans font-bold text-sm md:text-base tracking-[0.18em] text-[#00E5FF] transition-transform duration-700 mb-1"
              style={{ transform: nameRevealed ? "translateY(0)" : "translateY(100%)" }}
            >
              Hi, I am
            </span>
          </div>

          {/* Main Name — Anton, word-by-word slide-up */}
          <h1
            className="font-anton text-[13vw] sm:text-[10vw] md:text-[7rem] lg:text-[8.5rem] leading-[0.9] tracking-[0.01em] text-slate-300 m-0 p-0 flex flex-wrap"
            aria-label="Bhavani Shankar"
          >
            {["Bhavani", "Shankar"].map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pr-[0.18em] pb-1">
                <span
                  className="inline-block transition-all duration-700"
                  style={{
                    transitionDelay: nameRevealed ? `${0.1 + i * 0.12}s` : "0s",
                    opacity: nameRevealed ? 1 : 0,
                    transform: nameRevealed ? "translateY(0)" : "translateY(100%)",
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Thin separator line */}
          <div
            className="w-12 h-[1.5px] bg-[#ACB6FF]/30 mt-2 mb-2 md:mt-3 md:mb-3 transition-all duration-1000"
            style={{
              opacity: backgroundRevealed ? 1 : 0,
              transform: backgroundRevealed ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
            }}
          />

          {/* Subheading — word-by-word slide-up */}
          <div className="max-w-3xl">
            <p className="font-sans font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-300 tracking-tight leading-[1.1] flex flex-wrap">
              {["Developer", "learning,", "building,", "and", "understanding", "systems."].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-0.5 pr-[0.25em]">
                  <span
                    className="inline-block transition-all duration-700"
                    style={{
                      transitionDelay: backgroundRevealed ? `${0.2 + i * 0.06}s` : "0s",
                      opacity: backgroundRevealed ? 1 : 0,
                      transform: backgroundRevealed ? "translateY(0)" : "translateY(100%)",
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>

        </div>

        {/* Quietly elegant professional bio */}
        <div
          className="w-full max-w-2xl mt-5 md:mt-6 text-left transition-all duration-1000 delay-500"
          style={{
            opacity: backgroundRevealed ? 1 : 0,
            transform: backgroundRevealed ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="text-slate-400 leading-relaxed font-sans text-sm md:text-base font-light italic">
            &ldquo;{PERSONAL_BIO.aboutMe}&rdquo;
          </p>
        </div>

        {/* Social links */}
        <div
          className="flex flex-wrap items-center justify-start gap-4 mt-5 md:mt-6 transition-all duration-1000 delay-700"
          style={{
            opacity: backgroundRevealed ? 1 : 0,
            transform: backgroundRevealed ? "translateY(0)" : "translateY(15px)",
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

      </div>{/* end text content wrapper */}

      {/* Pulsing down-scroll anchor */}
      <div 
        className="absolute bottom-8 right-6 md:right-16 lg:right-24 hidden lg:flex flex-col items-end gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ACB6FF]/40 select-none cursor-pointer hover:text-neon-pink transition-colors duration-300 z-30 transition-opacity"
        style={{ opacity: backgroundRevealed ? 1 : 0 }}
        onClick={() => {
          document.getElementById("section-2")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span>SCROLL DOWN</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#ACB6FF]/40 via-[#ACB6FF]/10 to-transparent relative overflow-hidden mr-4">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-neon-pink animate-bounce-custom" />
        </div>
      </div>

      {/* Bounce and Shooting Star CSS overrides within react tag */}
      <style>{`
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(100%); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 2s infinite ease-in-out;
        }

        /* Shooting Star Animations */
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
            width: 0;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(-40vw) translateY(40vw) rotate(-45deg);
            opacity: 0;
            width: 15vw;
          }
        }
        .animate-shooting-star {
          animation: shooting-star linear infinite;
        }
      `}</style>
    </section>
  );
}

// Sub-component for rendering scattered dynamic shooting stars
function ShootingStars() {
  const [stars, setStars] = useState<Array<{ id: number; top: number; right: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Dynamically generate a set of stars with randomized parameters
    // so they feel organic and spread nicely on both mobile and desktop.
    const generateStars = () => {
      // 4 stars to keep it neat and not overwhelming
      const newStars = Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        // Keep them constrained to the upper right quadrant dynamically
        top: Math.random() * 35, 
        right: Math.random() * 40,
        // Stagger delays so they don't all fire at once
        delay: Math.random() * 6,
        // Varying speeds
        duration: 4 + Math.random() * 4,
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute top-0 right-0 w-full md:w-2/3 lg:w-1/2 h-1/2 pointer-events-none z-10 overflow-hidden opacity-60">
      {stars.map((star) => (
        <div 
          key={star.id}
          className="absolute h-[1px] animate-shooting-star"
          style={{
            top: `${star.top}%`,
            right: `${star.right}%`,
            background: "linear-gradient(90deg, #ACB6FF, transparent)",
            boxShadow: "0 0 8px #ACB6FF",
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
}
