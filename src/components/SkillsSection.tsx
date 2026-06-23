import { useInView } from "./useInView";
import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

export default function SkillsSection() {
  const [sectionRef, isInView] = useInView();
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dotPositions, setDotPositions] = useState<number[]>([]);

  const skillCategories = [
    { title: "Languages",       skills: ["C", "Java", "Python", "JavaScript", "HTML", "CSS"] },
    { title: "Frameworks",      skills: ["React", "Node.js", "Express.js"] },
    { title: "Database",        skills: ["Postgres", "MySQL", "MongoDB"] },
    { title: "Cloud",           skills: ["Azure", "Google Cloud"] },
    { title: "Hosting & Tools", skills: ["Vercel", "Render", "Cron Jobs", "GitHub"] },
  ];

  // Measure each row's offsetTop relative to the container so dots sit exactly beside each row
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
      const positions = rowRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        // centre of the first line of the row
        return rect.top + window.scrollY - containerTop + 12;
      });
      setDotPositions(positions);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const totalHeight =
    dotPositions.length > 0
      ? dotPositions[dotPositions.length - 1] + 12
      : 0;

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 md:px-16 lg:px-24 border-t border-white/5 scroll-mt-10"
    >
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col justify-start text-left lg:sticky lg:top-24">
          <div className={`relative mb-8 sm:mb-12 w-full max-w-sm transition-all duration-700 ${isInView ? "is-revealed" : "opacity-0"}`}>
            <h2 className="w-full relative select-none leading-none">
              <svg className="w-full h-auto overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="xMinYMin meet" aria-label="SKILLS">
                <text className="svg-outline fill-none stroke-theme stroke-[2.5px]" x="0" y="85" dominantBaseline="middle" textAnchor="start"
                  style={{ fontFamily: '"Anton", sans-serif', fontSize: "110px", fontWeight: 400, letterSpacing: "0.02em" }}>
                  SKILLS
                </text>
                <g className="svg-fill-wrapper">
                  <text className="svg-fill fill-theme" x="0" y="85" dominantBaseline="middle" textAnchor="start"
                    style={{ transform: isInView ? "translateY(0)" : "translateY(100%)", fontFamily: '"Anton", sans-serif', fontSize: "110px", fontWeight: 400, letterSpacing: "0.02em" }}>
                    SKILLS
                  </text>
                </g>
              </svg>
            </h2>
          </div>

          <div className="max-w-md mt-4">
            <p className="font-sans font-medium text-xl md:text-2xl text-[var(--color-neon-blue)]/80 tracking-tight leading-[1.15] flex flex-wrap gap-x-[0.3em] gap-y-1">
              {["Core", "technologies", "and", "frameworks", "for", "modern", "development."].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-0.5">
                  <span className="inline-block transition-all duration-700"
                    style={{ transitionDelay: `${0.1 + i * 0.08}s`, opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0)" : "translateY(100%)" }}>
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Right Column: Timeline + Skills */}
        <div className="lg:col-span-7 flex flex-row gap-0 lg:pl-10 mt-6 lg:mt-4">

          {/* Vertical Timeline (hidden on mobile) */}
          <div className="hidden md:block relative shrink-0 w-10 mr-2" ref={containerRef} style={{ minHeight: totalHeight }}>
            {/* The continuous line */}
            <motion.div
              className="absolute left-[18px] top-0 w-px bg-white/10 origin-top"
              style={{ height: totalHeight || "100%" }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* One dot per category at the measured position */}
            {dotPositions.map((topPx, i) => (
              <motion.div
                key={i}
                className="absolute left-[12px]"
                style={{ top: topPx }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.35, delay: 0.55 + i * 0.1 }}
              >
                {/* Outer ring */}
                <div className="w-3.5 h-3.5 rounded-full border border-[var(--color-neon-pink)] bg-[#010101] flex items-center justify-center">
                  {/* Inner filled dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-pink)] opacity-80" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Category Rows */}
          <div className="flex-1 flex flex-col">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                ref={(el) => { rowRefs.current[index] = el; }}
                initial={{ opacity: 0, x: 14 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
                transition={{ duration: 0.7, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row gap-1 md:gap-6 items-start pb-5 ${
                  index !== skillCategories.length - 1 ? "border-b border-white/5 mb-5" : ""
                }`}
              >
                {/* Category Label */}
                <div className="w-36 shrink-0 pt-0.5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-neon-pink)] uppercase">
                    {category.title}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex-1 flex flex-wrap gap-x-2.5 gap-y-0.5">
                  {category.skills.map((skill, sIdx) => (
                    <span key={skill} className="flex items-center text-slate-200 font-sans text-base md:text-lg font-light tracking-wide">
                      {skill}
                      {sIdx !== category.skills.length - 1 && (
                        <span className="ml-2.5 opacity-25 text-[var(--color-theme)]">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
