import { useEffect, useRef } from "react";
import { useInView } from "./useInView";

const skillCategories = [
  { title: "Languages",       skills: ["C", "Java", "Python", "JavaScript", "TypeScript", "HTML", "CSS", "C", "Java", "Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { title: "Frameworks",      skills: ["React", "Node.js", "Express.js", "Next.js", "Vite", "React", "Node.js", "Express.js", "Next.js", "Vite"] },
  { title: "Database",        skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { title: "Cloud",           skills: ["Azure", "Google Cloud", "Firebase", "Vercel", "Azure", "Google Cloud", "Firebase", "Vercel"] },
  { title: "Tools",           skills: ["GitHub", "Render", "Cron Jobs", "Docker", "Postman", "GitHub", "Render", "Cron Jobs", "Docker", "Postman"] },
];

/** A single row ticker — auto-scrolls left at a constant speed */
function SkillTicker({ skills, speed = 30 }: { skills: string[]; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Duplicate the array so we can loop seamlessly
  const doubled = [...skills, ...skills];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let raf: number;
    // How wide is one copy of the skill list?
    const halfWidth = track.scrollWidth / 2;

    const tick = () => {
      pos += speed / 60; // pixels per frame at 60fps
      if (pos >= halfWidth) pos -= halfWidth;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    // Outer: clip + edge fade via mask
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 88%, transparent 100%)",
      }}
    >
      {/* Moving track — contains two copies for seamless loop */}
      <div ref={trackRef} className="flex items-center gap-0 will-change-transform" style={{ width: "max-content" }}>
        {doubled.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-5 font-sans text-base md:text-lg font-light tracking-wide whitespace-nowrap"
            style={{ color: "#e1decc" }}
          >
            {skill}
            <span style={{ color: "#e70f0e", opacity: 0.6, fontSize: "0.5rem" }}>◆</span>
          </span>
        ))}
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
      className="relative w-full flex flex-col bg-[#010101] border-t border-[#474145]/40 scroll-mt-10 overflow-hidden py-0"
    >
      {/* Massive Bleeding Header — matches Education style */}
      <div className="w-full relative mb-16 sm:mb-24 flex justify-center h-[12vw] sm:h-[15vw] items-center mt-24 sm:mt-32">
        {/* Outline ghost layer */}
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
          SKILLS SKILLS SKILLS
        </h2>
        {/* Solid Bone layer */}
        <h2
          className="font-anton uppercase tracking-tight select-none whitespace-nowrap absolute z-10"
          style={{
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.8,
            color: "#e1decc",
            transform: isInView ? "translateY(0)" : "translateY(50px)",
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 1.2s",
            opacity: isInView ? 1 : 0,
          }}
        >
          SKILLS
        </h2>
      </div>

      {/* Sub-header */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex justify-end mb-16 md:mb-24">
        <p
          className="font-sans text-sm md:text-base text-[#e1decc]/80 max-w-[280px] tracking-widest leading-relaxed uppercase text-right"
          style={{
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
          }}
        >
          Core technologies and frameworks for modern development.
        </p>
      </div>

      {/* Editorial Rows — border-top matches Education */}
      <div className="flex flex-col w-full border-t border-[#474145]">
        {skillCategories.map((cat, idx) => {
          const delay = 0.3 + idx * 0.12;
          // Speed varies slightly per row for organic feel
          const speed = 22 + idx * 6;

          return (
            <div
              key={cat.title}
              className="group flex flex-col md:flex-row w-full border-b border-[#474145] transition-all duration-700 hover:bg-[#e70f0e]/5 overflow-hidden"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
                transition: `all 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
              }}
            >
              {/* LEFT — Big category name, same style as Education year */}
              <div className="flex-shrink-0 w-full md:w-[28%] px-6 md:px-12 lg:px-16 py-8 md:py-10 flex items-start justify-start border-b md:border-b-0 md:border-r border-[#474145]/60">
                <span
                  className="font-sans font-bold tracking-tighter text-[#e1decc] leading-[0.85]"
                  style={{ fontSize: "clamp(2.2rem, 4.5vw, 5rem)" }}
                >
                  {cat.title}
                </span>
              </div>

              {/* RIGHT — Horizontal rolling ticker */}
              <div className="flex-1 flex items-center py-8 md:py-10 min-w-0">
                <SkillTicker skills={cat.skills} speed={speed} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom padding */}
      <div className="h-24 sm:h-32" />
    </section>
  );
}
