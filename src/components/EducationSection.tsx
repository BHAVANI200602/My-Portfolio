import { useInView } from "./useInView";
import { EDUCATION } from "../data";
import { GraduationCap, MapPin, Calendar } from "lucide-react";

export default function EducationSection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section
      id="section-2"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 md:px-16 lg:px-24 border-t border-white/5 scroll-mt-10"
    >
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left column: SVG Liquid Title & Description */}
        <div className="lg:col-span-5 flex flex-col justify-start text-left lg:sticky lg:top-24">
          <div className={`relative mb-8 sm:mb-12 w-full max-w-sm transition-all duration-700 ${isInView ? "is-revealed" : "opacity-0"}`}>
            <h2 className="w-full relative select-none leading-none">
              <svg
                className="w-full h-auto overflow-visible"
                viewBox="0 0 550 120"
                preserveAspectRatio="xMinYMin meet"
                aria-label="EDUCATION"
              >
                <text
                  className="svg-outline fill-none stroke-theme stroke-[2.5px]"
                  x="0"
                  y="85"
                  dominantBaseline="middle"
                  textAnchor="start"
                  style={{
                    fontFamily: '"Anton", sans-serif',
                    fontSize: "90px",
                    fontWeight: 400,
                    letterSpacing: "0.04em"
                  }}
                >
                  EDUCATION
                </text>
                <g className="svg-fill-wrapper">
                  <text
                    className="svg-fill fill-theme"
                    style={{
                      transform: isInView ? "translateY(0)" : "translateY(100%)",
                      fontFamily: '"Anton", sans-serif',
                      fontSize: "90px",
                      fontWeight: 400,
                      letterSpacing: "0.04em"
                    }}
                    x="0"
                    y="85"
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    EDUCATION
                  </text>
                </g>
              </svg>
            </h2>
          </div>

          <div className="max-w-md mt-4">
            <p className="font-sans font-bold text-xl md:text-2xl text-[var(--color-neon-blue)]/80 tracking-tight leading-[1.15] flex flex-wrap gap-x-[0.3em] gap-y-1">
              {["Academic", "background", "and", "educational", "studies."].map((word, i) => (
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

        {/* Right column: High-Tech Timeline */}
        <div className="lg:col-span-7 flex flex-col space-y-12 relative before:absolute before:left-3.5 sm:before:left-4 md:before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
          {EDUCATION.map((edu, idx) => {
            const delay = 0.2 + idx * 0.15;
            return (
              <div
                key={idx}
                className="relative pl-8 sm:pl-12 md:pl-16 group transition-all duration-700"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(25px)",
                  transitionDelay: `${delay}s`,
                }}
              >
                {/* Timeline node icon */}
                <div className="absolute left-0 sm:left-1 md:left-3 top-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-zinc-950 border border-white/10 group-hover:border-neon-blue flex items-center justify-center transition-colors duration-300 z-10 shadow-lg">
                  <GraduationCap className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-neon-blue" />
                </div>

                <div className="bg-zinc-950/40 hover:bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded p-5 sm:p-6 md:p-8 transition-all duration-300 shadow-xl group/card relative overflow-hidden">
                  {/* Subtle hover accent corner glows */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/5 rounded-full blur-2xl group-hover/card:opacity-100 opacity-0 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-zinc-900 border border-white/10 font-mono text-[10px] tracking-widest text-[var(--color-neon-blue)]/80">
                      <Calendar className="w-3 h-3 text-neon-pink" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-[var(--color-neon-blue)]/60 font-mono">
                      <MapPin className="w-3 h-3 text-[var(--color-neon-blue)]/40" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-lg md:text-xl text-[var(--color-neon-blue)] tracking-tight leading-tight mb-1 transition-colors duration-300 group-hover:text-neon-pink">
                    {edu.degree}
                  </h3>
                  <div className="text-sm font-medium text-neon-blue uppercase tracking-widest mb-4">
                    {edu.institution}
                  </div>

                  <p className="text-sm text-theme/75 leading-relaxed font-light font-sans pr-4">
                    {edu.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
