import { useState, useRef } from "react";
import { ArrowUp, Mail, Github, Linkedin, Code2 } from "lucide-react";
import { motion } from "motion/react";
import MagneticWrapper from "./MagneticWrapper";
import { PERSONAL_BIO } from "../data";

interface FooterSectionProps {
  scrollToTop: () => void;
}

export default function FooterSection({ scrollToTop }: FooterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { email, github, linkedin, leetcode } = PERSONAL_BIO;

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative w-full bg-black border-t border-white/10 pt-20 pb-32 overflow-hidden z-20"
    >
      {/* Quote */}
      <div className="w-full px-6 md:px-12 lg:px-20 mb-16">
        <motion.h3
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="font-display font-bold text-2xl md:text-3xl text-white-soft tracking-tight leading-[1.2] max-w-lg"
        >
          Let's build systems that lower the barrier to complex operations.
        </motion.h3>
      </div>

      {/* Editorial link list — full width */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        className="w-full border-t border-white/10"
      >
        <FooterLink label="Email"    icon={Mail}    href={`mailto:${email}`} />
        <FooterLink label="LinkedIn" icon={Linkedin} href={linkedin} />
        <FooterLink label="GitHub"   icon={Github}   href={github} />
        <FooterLink label="LeetCode" icon={Code2}    href={leetcode} />
      </motion.div>

      {/* Scroll-to-top — pinned bottom-right */}
      <div className="w-full px-6 md:px-12 lg:px-20 mt-12 flex justify-end items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 select-none">
          scroll to top
        </span>
        <MagneticWrapper strength={0.4}>
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all duration-300"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </MagneticWrapper>
      </div>

      {/* Background watermark name */}
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

function FooterLink({ label, icon: Icon, href }: { label: string; icon: any; href: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full text-left py-5 md:py-7 border-b border-white/10 block overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sweep fill */}
      <span
        className="absolute inset-0 bg-white origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: isHovered ? "scaleX(1)" : "scaleX(0)" }}
      />
      <div className="relative z-10 flex items-center gap-6 md:gap-10 px-6 md:px-12 lg:px-20">
        <Icon
          className={`w-7 h-7 md:w-9 md:h-9 transition-colors duration-300 shrink-0 ${
            isHovered ? "text-black" : "text-white/35"
          }`}
          strokeWidth={1.5}
        />
        <span
          className={`font-anton uppercase tracking-normal transition-colors duration-300
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9]
            ${isHovered ? "text-black" : "text-white-soft"}`}
        >
          {label}
        </span>
      </div>
    </a>
  );
}
