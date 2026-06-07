import { useState } from "react";
import { ArrowUp, Mail, Github, Linkedin, Code2, Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import FooterAurora from "./FooterAurora";

interface FooterSectionProps {
  scrollToTop: () => void;
}

export default function FooterSection({ scrollToTop }: FooterSectionProps) {
  const [copied, setCopied] = useState(false);
  const email = "ratgrey73@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative w-full bg-[#070707] border-t border-white/5 pt-28 pb-32 overflow-hidden z-20">
      {/* Match hero aurora at the bottom background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <FooterAurora />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070707]/40 to-[#070707] pointer-events-none" />
      </div>

      {/* Radiant atmospheric background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[300px] bg-gradient-to-b from-[#ACB6FF]/5 to-transparent rounded-full blur-[80px] pointer-events-none z-10" />

      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center z-10">
        
        {/* Dynamic Entry: Header & Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="mb-14 flex flex-col items-center"
        >
          <span className="font-mono text-[10px] tracking-[0.4em] text-[#D476FF] uppercase mb-4 block select-none">
            // JOIN_THE_NETWORK
          </span>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-[#ACB6FF] tracking-tight max-w-xl">
            Let's build systems that lower the barrier to complex operations.
          </h3>
        </motion.div>

        {/* Dynamic Entry: Main Contact Details & Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          className="w-full max-w-3xl flex flex-col items-center gap-12 mb-16"
        >
          {/* Interactive Copiable Email Element */}
          <div className="flex flex-col items-center gap-3 max-w-full">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#ACB6FF]/50 select-none">
              direct communication channel
            </span>
            <div className="relative group flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-[#ACB6FF]/40 rounded-full transition-all duration-300 max-w-full overflow-hidden">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ACB6FF] shrink-0" />
              <a
                href={`mailto:${email}`}
                className="font-mono text-xs sm:text-sm md:text-base text-white/90 hover:text-[#ACB6FF] transition-colors truncate max-w-[170px] xs:max-w-none"
              >
                {email}
              </a>
              <button
                onClick={copyEmail}
                className="ml-1 sm:ml-2 p-1 text-white/40 hover:text-white transition-colors shrink-0"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase tracking-widest rounded shadow-sm">
                  Copied!
                </span>
              )}
            </div>
          </div>

          {/* Social Icons row: circular button design with matching color theme */}
          <div className="flex items-center gap-6 font-sans">
            {/* Github */}
            <a
              href="https://github.com/BHAVANI200602"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/70 hover:text-[#D476FF] hover:border-[#D476FF] hover:shadow-[0_0_15px_rgba(212,118,255,0.2)] bg-neutral-900/30 transition-all duration-300 scale-100 hover:scale-110"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/bhavani-02-24-2006-shankar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/70 hover:text-[#00E5FF] hover:border-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] bg-neutral-900/30 transition-all duration-300 scale-100 hover:scale-110"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/GV2023006238/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/70 hover:text-[#C084FC] hover:border-[#C084FC] hover:shadow-[0_0_15px_rgba(192,132,252,0.2)] bg-neutral-900/30 transition-all duration-300 scale-100 hover:scale-110"
              title="LeetCode Profile"
            >
              <Code2 className="w-5 h-5" />
            </a>
          </div>

          {/* Upward Scroll-to-Top circular anchor */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={scrollToTop}
              className="group flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#ACB6FF] hover:border-[#D476FF] bg-transparent text-[#ACB6FF] hover:text-[#D476FF] hover:shadow-[0_0_20px_rgba(212,118,255,0.35)] transition-all duration-500 scale-100 hover:scale-105 active:scale-95"
              title="Scroll to Top"
            >
              <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#ACB6FF]/40 group-hover:text-[#ACB6FF] transition-colors mt-1 select-none">
              scroll to top
            </span>
          </div>
        </motion.div>

      </div>

      {/* Massive display header: "BHAVANI SHANKAR" standing on the bottom border with responsive scaling and matching gradient theme */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none leading-none z-0">
        <motion.div
          initial={{ opacity: 0, y: 80, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <h2 className="font-anton text-[19vw] md:text-[18.5vw] lg:text-[18vw] uppercase text-center text-transparent bg-clip-text bg-gradient-to-t from-white/35 via-[#ACB6FF]/20 to-[#D476FF]/5 font-black leading-none tracking-tighter translate-y-[15%] select-none drop-shadow-[0_0_25px_rgba(172,182,255,0.15)]">
            BHAVANI SHANKAR
          </h2>
        </motion.div>
      </div>
    </footer>
  );
}
