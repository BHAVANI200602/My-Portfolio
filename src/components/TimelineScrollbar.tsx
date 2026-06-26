import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const SECTIONS = [
  { id: "section-1", label: "HOME" },
  { id: "section-2", label: "EDUCATION" },
  { id: "section-3", label: "SKILLS" },
  { id: "section-4", label: "PROJECTS" },
  { id: "footer",    label: "CONTACT" },
];

export default function TimelineScrollbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rafRef = useRef<number>(0);

  // Track scroll progress (0–1)
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(total > 0 ? scrolled / total : 0);
    };

    // Use rAF to avoid jank
    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", handler, { passive: true });
    onScroll(); // run once on mount
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Track which section is active with IntersectionObserver
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

  // Click a dot → scroll to section
  const handleDotClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-[500] flex-col items-center select-none"
      style={{ height: "60vh" }}
    >
      {/* Background track line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-[#E5D9FF]/10" />

      {/* Filled progress line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] origin-top"
        style={{
          height: `${scrollProgress * 100}%`,
          background: "linear-gradient(to bottom, #C10801, #F16001, #A987FF)",
        }}
      />

      {/* Dots + Labels */}
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
              {/* Section label — appears on hover to the left */}
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-6 font-mono text-[9px] tracking-[0.25em] uppercase whitespace-nowrap pointer-events-none"
                style={{
                  color: "#E5D9FF",
                  opacity: isHovered ? 1 : 0,
                }}
              >
                {section.label}
              </motion.span>

              {/* Dot */}
              <button
                onClick={() => handleDotClick(section.id)}
                className="relative flex items-center justify-center"
                aria-label={`Scroll to ${section.label}`}
                style={{ width: 20, height: 20 }}
              >
                {/* Core dot */}
                <span
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 5 : isHovered ? 5 : 3,
                    height: isActive ? 5 : isHovered ? 5 : 3,
                    backgroundColor: isActive
                      ? "#E5D9FF"
                      : isPast
                      ? "#A987FF"
                      : "#2A1E5C",
                    boxShadow: "none",
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
