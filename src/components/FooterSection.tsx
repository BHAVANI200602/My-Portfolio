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
          className="w-full max-w-4xl flex flex-col items-start mb-20 border-t border-white/10"
        >
          <FooterLink label="Email" icon={Mail} href={`mailto:${email}`} />
          <FooterLink label="LinkedIn" icon={Linkedin} href={linkedin} />
          <FooterLink label="GitHub" icon={Github} href={github} />
          <FooterLink label="LeetCode" icon={Code2} href={leetcode} />
        </motion.div>
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
          <h2 className="font-anton uppercase text-[19vw] md:text-[18.5vw] lg:text-[18vw] text-center text-white/[0.06] leading-none tracking-tighter translate-y-[15%] select-none">
            BHAVANI SHANKAR
          </h2>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ label, icon: Icon, href }: { label: string, icon: any, href: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full text-left py-6 md:py-8 border-b border-white/10 block overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="absolute inset-0 bg-white origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: isHovered ? "scaleX(1)" : "scaleX(0)" }}
      />
      <div className="relative z-10 flex items-center gap-6 md:gap-10 px-4 md:px-8">
        <Icon className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-300 ${isHovered ? "text-black" : "text-white/40"}`} strokeWidth={1.5} />
        <span
          className={`font-anton uppercase tracking-normal transition-colors duration-300
            text-4xl sm:text-5xl md:text-7xl leading-[0.9]
            ${isHovered ? "text-black" : "text-white-soft"}`}
        >
          {label}
        </span>
      </div>
    </a>
  );
}
