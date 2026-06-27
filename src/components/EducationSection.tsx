import { useInView } from "./useInView";
import { EDUCATION } from "../data";
import TextReveal from "./TextReveal";

export default function EducationSection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section
      id="section-2"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col py-24 sm:py-32 bg-black border-t border-white/10 scroll-mt-10 overflow-hidden"
    >
      <div className="w-full relative mb-16 sm:mb-24 flex justify-center h-[12vw] sm:h-[15vw] items-center">
        <h2
          className="font-display font-bold uppercase tracking-tight select-none whitespace-nowrap absolute"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.8,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
            opacity: 0.6,
            transform: isInView ? "translateY(0)" : "translateY(50px)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s",
          }}
        >
          EDUCATION EDUCATION EDUCATION
        </h2>

        <h2
          className="font-display font-bold uppercase tracking-tight select-none whitespace-nowrap absolute z-10 text-white-soft"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.8,
            transform: isInView ? "translateY(0)" : "translateY(50px)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 1.2s",
            opacity: isInView ? 1 : 0,
          }}
        >
          EDUCATION
        </h2>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col">
        <div className="flex justify-end w-full mb-16 md:mb-24">
          <p
            className="font-sans text-sm md:text-base text-white/50 max-w-[280px] tracking-widest leading-relaxed uppercase text-right"
            style={{
              transform: isInView ? "translateY(0)" : "translateY(20px)",
              opacity: isInView ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
            }}
          >
            Academic background and educational studies.
          </p>
        </div>

        <div className="flex flex-col w-full border-t border-white/10">
          {EDUCATION.map((edu, idx) => {
            const delay = 0.3 + idx * 0.15;
            const dates = edu.period.split(" - ");
            const startDate = dates[0];
            const endDate = dates.length > 1 ? dates[1] : "";

            return (
              <div
                key={idx}
                className="group relative flex flex-col md:flex-row w-full pt-6 pb-12 md:pt-8 md:pb-16 border-b border-white/10 transition-all duration-700 hover:bg-white/[0.02]"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(30px)",
                  transition: `all 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
                }}
              >
                <div className="w-full md:w-[25%] mb-6 md:mb-0 md:pr-8 flex flex-col items-start justify-start pt-1">
                  <span className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white-soft leading-[0.85]">
                    {startDate}
                  </span>
                  {endDate && (
                    <span className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white/40 leading-[0.85]">
                      {endDate}
                    </span>
                  )}
                </div>

                <div className="w-full md:w-[45%] flex flex-col pr-8 mb-6 md:mb-0 justify-start pt-2">
                  <h3 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white-soft tracking-tight leading-none mb-4 group-hover:text-white transition-colors duration-500">
                    {edu.degree}
                  </h3>
                  <div className="font-mono text-[10px] md:text-xs text-white-soft bg-white/10 border border-white/15 self-start px-3 py-1.5 tracking-[0.2em] uppercase font-bold">
                    {edu.institution}
                  </div>
                </div>

                <div className="w-full md:w-[30%] flex flex-col justify-start pt-2">
                  <div className="font-sans text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/30 inline-block" />
                    {edu.location}
                  </div>
                  <p className="font-sans font-light text-sm md:text-base text-white/60 leading-relaxed max-w-sm">
                    <TextReveal delay={0.2}>{edu.description}</TextReveal>
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
