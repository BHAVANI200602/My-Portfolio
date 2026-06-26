import { useInView } from "./useInView";
import { EDUCATION } from "../data";
import TextReveal from "./TextReveal";

export default function EducationSection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section
      id="section-2"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col py-24 sm:py-32 bg-[#561CFF] border-t border-[#B5FF47]/20 scroll-mt-10 overflow-hidden"
    >
      {/* Massive Bleeding Header */}
      <div className="w-full relative mb-16 sm:mb-24 flex justify-center h-[12vw] sm:h-[15vw] items-center">
        {/* Outline shadow layer */}
        <h2 
          className="font-anton uppercase tracking-tight select-none whitespace-nowrap absolute"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.8,
            color: "transparent",
            WebkitTextStroke: "2px rgba(181,255,71,0.3)",
            opacity: 0.5,
            transform: isInView ? "translateY(0)" : "translateY(50px)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s",
          }}
        >
          EDUCATION EDUCATION EDUCATION
        </h2>
        
        {/* Solid white layer */}
        <h2 
          className="font-anton uppercase tracking-tight select-none whitespace-nowrap absolute z-10"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.8,
            color: "#B5FF47",
            transform: isInView ? "translateY(0)" : "translateY(50px)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 1.2s",
            opacity: isInView ? 1 : 0
          }}
        >
          EDUCATION
        </h2>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col">
        {/* Editorial Sub-header */}
        <div className="flex justify-end w-full mb-16 md:mb-24">
          <p 
            className="font-sans text-sm md:text-base text-white/60 max-w-[280px] tracking-widest leading-relaxed uppercase text-right"
            style={{
              transform: isInView ? "translateY(0)" : "translateY(20px)",
              opacity: isInView ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s"
            }}
          >
            Academic background and educational studies.
          </p>
        </div>

        {/* Horizontal Rows */}
        <div className="flex flex-col w-full border-t border-[#B5FF47]/30">
          {EDUCATION.map((edu, idx) => {
            const delay = 0.3 + idx * 0.15;
            
            // Format dates (e.g., "2023 - Present" -> "2023", "Present")
            const dates = edu.period.split(" - ");
            const startDate = dates[0];
            const endDate = dates.length > 1 ? dates[1] : "";

            return (
              <div
                key={idx}
                className="group relative flex flex-col md:flex-row w-full pt-6 pb-12 md:pt-8 md:pb-16 border-b border-[#B5FF47]/20 transition-all duration-700 hover:bg-[#B5FF47]/10"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(30px)",
                  transition: `all 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
                }}
              >
                {/* 1. Year */}
                <div className="w-full md:w-[25%] mb-6 md:mb-0 md:pr-8 flex flex-col items-start justify-start pt-1">
                  <span className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white leading-[0.85]">
                    {startDate}
                  </span>
                  {endDate && (
                    <span className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white leading-[0.85]">
                      {endDate}
                    </span>
                  )}
                </div>

                {/* 2. Degree & Institution */}
                <div className="w-full md:w-[45%] flex flex-col pr-8 mb-6 md:mb-0 justify-start pt-2">
                  <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white tracking-tight leading-none mb-4 group-hover:text-[#B5FF47] transition-colors duration-500">
                    {edu.degree}
                  </h3>
                  <div className="font-mono text-[10px] md:text-xs text-[#561CFF] bg-[#B5FF47] self-start px-3 py-1.5 tracking-[0.2em] uppercase font-bold">
                    {edu.institution}
                  </div>
                </div>

                {/* 3. Location & Description */}
                <div className="w-full md:w-[30%] flex flex-col justify-start pt-2">
                  <div className="font-sans text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-white/40 inline-block"></span>
                    {edu.location}
                  </div>
                  <p className="font-sans font-light text-sm md:text-base text-white/70 leading-relaxed max-w-sm">
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
