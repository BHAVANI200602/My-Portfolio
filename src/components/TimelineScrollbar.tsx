import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const SECTIONS = [
  { id: "section-1", label: "HOME" },
  { id: "section-2", label: "EDUCATION" },
  { id: "section-3", label: "SKILLS" },
  { id: "section-4", label: "PROJECTS" },
  { id: "footer", label: "CONTACT" },
];

export default function TimelineScrollbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(total > 0 ? scrolled / total : 0);
    };

    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", handler, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((section, i) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleDotClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-[500] flex-col items-center select-none"
      style={{ height: "60vh" }}
    >
      {/* Track */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />

      {/* Progress — simple white line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-px origin-top bg-white-soft"
        style={{ height: `${scrollProgress * 100}%` }}
      />

      <div className="relative w-full h-full flex flex-col justify-between items-center">
        {SECTIONS.map((section, i) => {
          const isPast = i < activeIndex;
          const isActive = i === activeIndex;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={section.id}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-6 font-mono text-[9px] tracking-[0.25em] uppercase whitespace-nowrap pointer-events-none text-white-soft"
              >
                {section.label}
              </motion.span>

              <button
                onClick={() => handleDotClick(section.id)}
                className="relative flex items-center justify-center"
                aria-label={`Scroll to ${section.label}`}
                style={{ width: 20, height: 20 }}
              >
                <span
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive || isHovered ? 5 : 3,
                    height: isActive || isHovered ? 5 : 3,
                    backgroundColor: isActive
                      ? "#F0F0F0"
                      : isPast
                        ? "rgba(240,240,240,0.5)"
                        : "rgba(255,255,255,0.2)",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
