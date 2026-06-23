import { useInView } from "./useInView";
import { EDUCATION } from "../data";

export default function EducationSection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section
      id="section-2"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col py-24 sm:py-32 bg-[#010101] border-t border-[#474145]/40 scroll-mt-10 overflow-hidden"
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
            WebkitTextStroke: "1px #474145",
            opacity: 0.3,
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
            color: "#e1decc",
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
            className="font-sans text-sm md:text-base text-[#e1decc]/80 max-w-[280px] tracking-widest leading-relaxed uppercase text-right"
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
        <div className="flex flex-col w-full border-t border-[#474145]">
          {EDUCATION.map((edu, idx) => {
            const delay = 0.3 + idx * 0.15;
            
            // Format dates (e.g., "2023 - Present" -> "2023", "Present")
            const dates = edu.period.split(" - ");
            const startDate = dates[0];
            const endDate = dates.length > 1 ? dates[1] : "";

            return (
              <div
                key={idx}
                className="group relative flex flex-col md:flex-row w-full pt-6 pb-12 md:pt-8 md:pb-16 border-b border-[#474145] transition-all duration-700 hover:bg-[#e70f0e]/5"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(30px)",
                  transition: `all 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
                }}
              >
                {/* 1. Year */}
                <div className="w-full md:w-[25%] mb-6 md:mb-0 md:pr-8 flex flex-col items-start justify-start pt-1">
                  <span className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#e1decc] leading-[0.85]">
                    {startDate}
                  </span>
                  {endDate && (
                    <span className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#e1decc] leading-[0.85]">
                      {endDate}
                    </span>
                  )}
                </div>

                {/* 2. Degree & Institution */}
                <div className="w-full md:w-[45%] flex flex-col pr-8 mb-6 md:mb-0 justify-start pt-2">
                  <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-[#e1decc] tracking-tight leading-none mb-4 group-hover:text-[#e70f0e] transition-colors duration-500">
                    {edu.degree}
                  </h3>
                  <div className="font-mono text-[10px] md:text-xs text-[#010101] bg-[#e1decc] self-start px-3 py-1.5 tracking-[0.2em] uppercase font-bold">
                    {edu.institution}
                  </div>
                </div>

                {/* 3. Location & Description */}
                <div className="w-full md:w-[30%] flex flex-col justify-start pt-2">
                  <div className="font-sans text-[10px] md:text-xs text-[#e1decc]/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#e1decc]/40 inline-block"></span>
                    {edu.location}
                  </div>
                  <p className="font-sans font-light text-sm md:text-base text-[#e1decc]/70 leading-relaxed max-w-sm">
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
