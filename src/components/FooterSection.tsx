import { useState, useRef } from "react";
import { ArrowUp, Mail, Github, Linkedin, Code2, Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import MagneticWrapper from "./MagneticWrapper";
import { PERSONAL_BIO } from "../data";

interface FooterSectionProps {
  scrollToTop: () => void;
}

export default function FooterSection({ scrollToTop }: FooterSectionProps) {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { email, github, linkedin, leetcode } = PERSONAL_BIO;

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative w-full bg-black border-t border-white/10 pt-28 pb-32 overflow-hidden z-20"
    >
      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="mb-14 flex flex-col items-center"
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white-soft tracking-tight leading-[1.15] max-w-xl">
            Let's build systems that lower the barrier to complex operations.
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          className="w-full max-w-3xl flex flex-col items-center gap-12 mb-16"
        >
          <div className="flex flex-col items-center gap-3 max-w-full">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 select-none">
              direct communication channel
            </span>
            <div className="relative group flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 max-w-full overflow-hidden">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 shrink-0" />
              <a
                href={`mailto:${email}`}
                className="font-mono text-xs sm:text-sm md:text-base text-white-soft/80 hover:text-white-soft transition-colors truncate max-w-[170px] xs:max-w-none"
              >
                {email}
              </a>
              <button
                onClick={copyEmail}
                className="ml-1 sm:ml-2 p-1 text-white/40 hover:text-white-soft transition-colors shrink-0"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-white/70" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 border border-white/20 text-white-soft font-mono text-[10px] uppercase tracking-widest rounded shadow-sm">
                  Copied!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 font-sans">
            <MagneticWrapper strength={0.4}>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/60 hover:text-white-soft hover:border-white/25 bg-white/[0.03] transition-all duration-300 scale-100 hover:scale-110"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
            </MagneticWrapper>

            <MagneticWrapper strength={0.4}>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/60 hover:text-white-soft hover:border-white/25 bg-white/[0.03] transition-all duration-300 scale-100 hover:scale-110"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </MagneticWrapper>

            <MagneticWrapper strength={0.4}>
              <a
                href={leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/60 hover:text-white-soft hover:border-white/25 bg-white/[0.03] transition-all duration-300 scale-100 hover:scale-110"
                title="LeetCode Profile"
              >
                <Code2 className="w-5 h-5" />
              </a>
            </MagneticWrapper>
          </div>

          <div className="flex flex-col items-center gap-2">
            <MagneticWrapper strength={0.4}>
              <button
                onClick={scrollToTop}
                className="group flex items-center justify-center w-14 h-14 rounded-full border border-white/20 hover:border-white/40 bg-transparent text-white/60 hover:text-white-soft transition-all duration-500 scale-100 hover:scale-105 active:scale-95"
                title="Scroll to Top"
              >
                <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </MagneticWrapper>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 transition-colors mt-1 select-none">
              scroll to top
            </span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none leading-none z-0">
        <motion.div
          initial={{ opacity: 0, y: 80, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <h2 className="font-display font-bold text-[19vw] md:text-[18.5vw] lg:text-[18vw] uppercase text-center text-white/[0.06] leading-none tracking-tighter translate-y-[15%] select-none">
            BHAVANI SHANKAR
          </h2>
        </motion.div>
      </div>
    </footer>
  );
}
