import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { PERSONAL_BIO } from "../data";
import WebGLHeroShader from "./WebGLHeroShader";

interface HeroSectionProps {
  isDived?: boolean;
}

/**
 * Scales text to exactly fill its parent width.
 * Uses a hidden fixed-position span for measurement so
 * overflow:hidden on any ancestor never interferes.
 */
function FitText({ text }: { text: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fit = () => {
      const wrapper = wrapperRef.current;
      const visible = visibleRef.current;
      const measure = measureRef.current;
      if (!wrapper || !visible || !measure) return;

      const wrapperWidth = wrapper.offsetWidth;
      if (wrapperWidth === 0) return;

      // Measure natural width at 100px in a fixed (unclipped) span
      measure.style.fontSize = "100px";
      const naturalWidth = measure.offsetWidth;
      if (naturalWidth === 0) return;

      const scale = wrapperWidth / naturalWidth;
      visible.style.fontSize = `${scale * 100}px`;
    };

    // Fire after fonts are guaranteed loaded
    document.fonts.ready.then(fit);

    const ro = new ResizeObserver(fit);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [text]);

  const sharedStyle: React.CSSProperties = {
    fontFamily: "'Anton', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",
    lineHeight: 0.85,
    fontWeight: 400,
  };

  return (
    <div ref={wrapperRef} className="w-full overflow-hidden">
      {/* Off-screen measurement clone — never visible, never clipped */}
      <span
        ref={measureRef}
        aria-hidden
        style={{
          ...sharedStyle,
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden",
          fontSize: "100px",
          display: "block",
        }}
      >
        {text}
      </span>

      {/* The actual rendered text */}
      <span
        ref={visibleRef}
        style={{
          ...sharedStyle,
          display: "block",
          textAlign: "center",
          color: "#e1decc",
          userSelect: "none",
          fontSize: "10px", // tiny default until fit() runs
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function HeroSection({ isDived = false }: HeroSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);

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
      className="relative w-full overflow-hidden bg-[#000000]"
      style={{ height: "100svh" }}
    >
      {/* ── SHADER BACKGROUND ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <WebGLHeroShader />
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#010101] to-transparent pointer-events-none z-10" />

      {/* ── BIO — top-left ── */}
      <motion.p
        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
        animate={isRevealed
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 15, filter: "blur(4px)" }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-28 left-6 md:left-12 lg:left-16 z-20 max-w-[240px] text-[#e1decc]/80 font-sans text-sm leading-relaxed tracking-wide font-light"
      >
        {PERSONAL_BIO.aboutMe}
      </motion.p>

      {/* ── MASSIVE NAME — centered, just above footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        animate={isRevealed
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 40, filter: "blur(12px)" }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 z-20"
        /* sits just above the footer bar — footer ~48px tall */
        style={{ bottom: "52px" }}
      >
        <FitText text="BHAVANI SHANKAR" />
      </motion.div>

      {/* ── FOOTER BAR — absolute bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 z-30 flex justify-center md:justify-between items-center px-6 md:px-12 lg:px-16 h-12 border-t border-[#e1decc]/10 text-xs font-sans font-medium tracking-widest uppercase"
      >
        <span className="text-[#474145] hidden md:block">&rarr; V3.0</span>
        <div className="flex gap-6 text-[#e1decc]/70">
          <a href={PERSONAL_BIO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">LINKEDIN</a>
          <span className="text-[#474145]/40">·</span>
          <a href={PERSONAL_BIO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">GITHUB</a>
          <span className="text-[#474145]/40">·</span>
          <a href={PERSONAL_BIO.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-[#e70f0e] transition-colors">LEETCODE</a>
        </div>
      </motion.div>
    </section>
  );
}
