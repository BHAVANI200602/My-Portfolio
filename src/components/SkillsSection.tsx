import { useInView } from "./useInView";
import { motion } from "motion/react";

export default function SkillsSection() {
  const [sectionRef, isInView] = useInView();

  const skillCategories = [
    {
      title: "Languages",
      skills: ["C", "Java", "Python", "JavaScript", "HTML", "CSS"],
    },
    {
      title: "Frameworks",
      skills: ["React", "Node.js", "Express.js"],
    },
    {
      title: "Database",
      skills: ["Postgres", "MySQL", "MongoDB"],
    },
    {
      title: "Cloud",
      skills: ["Azure", "Google Cloud"],
    },
    {
      title: "Hosting & Tools",
      skills: ["Vercel", "Render", "Cron Jobs", "GitHub"],
    },
  ];

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 md:px-16 lg:px-24 border-t border-white/5 scroll-mt-10"
    >
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Liquid Title & Description */}
        <div className="lg:col-span-5 flex flex-col justify-start text-left lg:sticky lg:top-24">
          <div className={`relative mb-8 sm:mb-12 w-full max-w-sm transition-all duration-700 ${isInView ? "is-revealed" : "opacity-0"}`}>
            <h2 className="w-full relative select-none leading-none">
              <svg
                className="w-full h-auto overflow-visible"
                viewBox="0 0 500 120"
                preserveAspectRatio="xMinYMin meet"
                aria-label="SKILLS"
              >
                <text
                  className="svg-outline fill-none stroke-theme stroke-[2.5px]"
                  x="0"
                  y="85"
                  dominantBaseline="middle"
                  textAnchor="start"
                  style={{
                    fontFamily: '"Anton", sans-serif',
                    fontSize: "110px",
                    fontWeight: 400,
                    letterSpacing: "0.02em"
                  }}
                >
                  SKILLS
                </text>
                <g className="svg-fill-wrapper">
                  <text
                    className="svg-fill fill-theme"
                    style={{
                      transform: isInView ? "translateY(0)" : "translateY(100%)",
                      fontFamily: '"Anton", sans-serif',
                      fontSize: "110px",
                      fontWeight: 400,
                      letterSpacing: "0.02em"
                    }}
                    x="0"
                    y="85"
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    SKILLS
                  </text>
                </g>
              </svg>
            </h2>
          </div>

          <div className="max-w-md mt-4">
            <p className="font-sans font-medium text-xl md:text-2xl text-theme/80 tracking-tight leading-[1.15] flex flex-wrap gap-x-[0.3em] gap-y-1">
              {["Core", "technologies", "and", "frameworks", "for", "modern", "development."].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-0.5">
                  <span
                    className="inline-block transition-all duration-700"
                    style={{
                      transitionDelay: `${0.1 + i * 0.08}s`,
                      opacity: isInView ? 1 : 0,
                      transform: isInView ? "translateY(0)" : "translateY(100%)",
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Right Column: Editorial Skills List */}
        <div className="lg:col-span-7 flex flex-col space-y-12 lg:pl-10 mt-10 lg:mt-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col md:flex-row gap-2 md:gap-8 items-start border-b border-white/5 pb-8"
            >
              {/* Category Label (Muted Terracotta / Theme) */}
              <div className="w-40 shrink-0">
                <span className="font-mono text-sm tracking-[0.2em] text-[var(--color-neon-pink)] uppercase">
                  {category.title}
                </span>
              </div>

              {/* Skills List (Soft White / Sans Serif) */}
              <div className="flex-1 flex flex-wrap gap-x-3 gap-y-1 mt-2 md:mt-0">
                {category.skills.map((skill, sIdx) => (
                  <span key={skill} className="flex items-center text-slate-200 font-sans text-lg md:text-xl font-light tracking-wide">
                    {skill}
                    {sIdx !== category.skills.length - 1 && (
                      <span className="ml-3 opacity-30 text-[var(--color-theme)]">·</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
