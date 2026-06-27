import { useEffect, useRef } from "react";
import { useInView } from "./useInView";

const skillCategories = [
  { title: "Languages", skills: ["C", "Java", "Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { title: "Frameworks", skills: ["React", "Node.js", "Express.js", "Next.js", "Vite"] },
  { title: "Database", skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { title: "Cloud", skills: ["Azure", "Google Cloud", "Firebase", "Vercel"] },
  { title: "Tools", skills: ["GitHub", "Render", "Cron Jobs", "Docker", "Postman"] },
];

function SkillTicker({ skills, speed = 28 }: { skills: string[]; speed?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const measure = measureRef.current;
    if (!container || !track || !measure) return;

    let raf: number;
    let pos = 0;

    const init = () => {
      const oneWidth = measure.scrollWidth;
      container.style.width = `${oneWidth}px`;
      container.style.maxWidth = "100%";

      const tick = () => {
        pos += speed / 60;
        if (pos >= oneWidth) pos -= oneWidth;
        track.style.transform = `translateX(-${pos}px)`;
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(() => requestAnimationFrame(init));
    return () => cancelAnimationFrame(raf);
  }, [speed, skills]);

  const renderSkills = (suffix: string) =>
    skills.map((skill, i) => (
      <span
        key={`${suffix}-${i}`}
        className="inline-flex items-center gap-5 font-sans text-base md:text-lg font-light tracking-wide whitespace-nowrap text-white-soft"
        style={{ paddingRight: "2.5rem" }}
      >
        {skill}
        <span className="text-white/25 text-[0.45rem]">◆</span>
      </span>
    ));

  return (
    <div
      ref={containerRef}
      className="overflow-hidden flex-shrink-0"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: "absolute", visibility: "hidden", display: "flex", width: "max-content" }}
      >
        {renderSkills("m")}
      </div>
      <div ref={trackRef} className="flex will-change-transform" style={{ width: "max-content" }}>
        {renderSkills("a")}
        {renderSkills("b")}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative w-full flex flex-col bg-black border-t border-white/10 scroll-mt-10 overflow-hidden py-0"
    >
      <div className="w-full relative mb-16 sm:mb-24 flex justify-center h-[12vw] sm:h-[15vw] items-center mt-24 sm:mt-32">
        <h2
          className="font-anton uppercase tracking-tight select-none whitespace-nowrap absolute"
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
          SKILLS SKILLS SKILLS
        </h2>
        <h2
          className="font-anton uppercase tracking-tight select-none whitespace-nowrap absolute z-10 text-white-soft"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.8,
            transform: isInView ? "translateY(0)" : "translateY(50px)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 1.2s",
            opacity: isInView ? 1 : 0,
          }}
        >
          SKILLS
        </h2>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex justify-end mb-16 md:mb-24">
        <p
          className="font-sans text-sm md:text-base text-white/50 max-w-[280px] tracking-widest leading-relaxed uppercase text-right"
          style={{
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
          }}
        >
          Core technologies and frameworks for modern development.
        </p>
      </div>

      <div className="flex flex-col w-full border-t border-white/10">
        {skillCategories.map((cat, idx) => {
          const delay = 0.3 + idx * 0.12;
          const speed = 20 + cat.skills.length * 2.5;

          return (
            <div
              key={cat.title}
              className="group flex flex-col md:flex-row w-full border-b border-white/10 transition-all duration-700 hover:bg-white/[0.02] overflow-hidden"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
                transition: `all 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
              }}
            >
              <div className="flex-shrink-0 w-full md:w-[35%] lg:w-[30%] px-6 md:px-8 lg:px-16 py-8 md:py-10 flex items-center justify-start border-b md:border-b-0 md:border-r border-white/10">
                <span
                  className="font-display font-bold tracking-tighter text-white-soft leading-[0.85]"
                  style={{ fontSize: "clamp(1.8rem, 3.8vw, 5rem)" }}
                >
                  {cat.title}
                </span>
              </div>

              <div className="flex-1 flex items-center py-8 md:py-10 px-4 min-w-0 overflow-hidden">
                <SkillTicker skills={cat.skills} speed={speed} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-24 sm:h-32" />
    </section>
  );
}
