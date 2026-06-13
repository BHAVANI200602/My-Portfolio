import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "../data";
import { Github } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "motion/react";

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll position specifically across the tall active range
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Left letters (P, R, O) translate left and fade out
  const leftX = useTransform(scrollYProgress, [0, 0.4], ["0vw", "-150vw"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);

  // Right letters (E, C, T, S) translate right and fade out
  const rightX = useTransform(scrollYProgress, [0, 0.4], ["0vw", "150vw"]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);

  // Target letter 'J' scales up exponentially to flood the screen safely on all sizes
  // Smoothed transition values, increased final scale to ensure complete screen coverage
  const jScale = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.45], [1, 3, 40, 2500]);
  const jOpacity = useTransform(scrollYProgress, [0.42, 0.5], [1, 0]);

  // Text overall wrapper opacity
  const textOpacity = useTransform(scrollYProgress, [0, 0.44, 0.48], [1, 1, 0]);

  // Background smooth color morph: seamlessly shifts from deep background dark into light periwinkle canvas page
  const bgColor = useTransform(
    scrollYProgress,
    [0.38, 0.48],
    ["#070707", "#e8ddcb"]
  );

  // Project details card transition states
  const detailsOpacity = useTransform(scrollYProgress, [0.44, 0.52, 1], [0, 1, 1]);
  const detailsScale = useTransform(scrollYProgress, [0.44, 0.52, 1], [0.88, 1, 1]);
  const detailsY = useTransform(scrollYProgress, [0.44, 0.52, 1], [40, 0, 0]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];

  // Derive active project purely from scroll range [0.5, 1.0]
  useMotionValueEvent(scrollYProgress, "change", (val) => {
    if (val >= 0.5) {
      const tp = (val - 0.5) / 0.5; // normalize to 0..1
      const idx = Math.min(Math.floor(tp * PROJECTS.length), PROJECTS.length - 1);
      setActiveIndex(Math.max(0, idx));
    }
  });

  // Interactivity gate: prevent clicking card items when card is transparent
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    return scrollYProgress.onChange((val) => {
      setIsInteractive(val >= 0.47);
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      id="section-4"
      className="relative h-[350vh] md:h-[450vh] w-full bg-[#070707] scroll-mt-10"
    >
      {/* Sticky Frame viewport wrapper handles scroll-bind offsets */}
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4 md:px-8 z-10"
      >
        {/* COMPONENT 1: Word-Spreading Immersive Zoom Portal */}
        <motion.div
          style={{
            opacity: textOpacity,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 px-4"
        >
          <div className="font-anton flex items-center justify-center uppercase leading-none text-[20vw] md:text-[16vw] gap-2 md:gap-4 tracking-normal text-[var(--color-theme)] select-none w-full max-w-7xl mx-auto">
            {/* P */}
            <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">
              P
            </motion.span>
            {/* R */}
            <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">
              R
            </motion.span>
            {/* O */}
            <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">
              O
            </motion.span>
            
            {/* J (Zoom Portal) */}
            <motion.span 
              style={{ scale: jScale, opacity: jOpacity, transformOrigin: "75% 30%" }} 
              className="inline-block z-20 text-[var(--color-neon-pink)] font-bold"
            >
              J
            </motion.span>
            
            {/* E */}
            <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">
              E
            </motion.span>
            {/* C */}
            <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">
              C
            </motion.span>
            {/* T */}
            <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">
              T
            </motion.span>
            {/* S */}
            <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">
              S
            </motion.span>
          </div>
        </motion.div>

        {/* COMPONENT 2: Vertical Timeline Layout */}
        <motion.div
          style={{
            opacity: detailsOpacity,
            y: detailsY,
            pointerEvents: isInteractive ? "auto" : "none",
          }}
          className="absolute inset-0 z-20 flex flex-col md:flex-row w-full h-full"
        >
          {/* ── LEFT: Vertical timeline + big scrolling project name ── */}
          <div className="relative w-full md:w-[44%] h-[40%] md:h-full flex flex-col justify-end md:justify-center border-b md:border-b-0 md:border-r border-black/10 overflow-hidden pb-6 md:pb-0">
            <span className="hidden md:block absolute top-10 left-10 md:left-14 font-mono text-[9px] tracking-[0.35em] text-black/30 uppercase select-none">
              // Featured_Work
            </span>

            {/* Vertical line (desktop only) */}
            <div className="hidden md:block absolute left-[38px] md:left-[54px] top-20 bottom-20 w-px bg-black/12" />

            {/* Dots (desktop only) */}
            <div className="hidden md:flex absolute left-[32px] md:left-[48px] top-20 bottom-20 flex-col justify-between pointer-events-none">
              {PROJECTS.map((_, i) => (
                <div key={i} className="flex items-center justify-center w-[14px] h-[14px]">
                  <div
                    className={`rounded-full border transition-all duration-500 ${
                      i === activeIndex
                        ? "w-3 h-3 border-[var(--color-neon-pink)] bg-[var(--color-neon-pink)]/30 shadow-[0_0_8px_var(--color-neon-pink)]"
                        : "w-2 h-2 border-black/20 bg-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Name block */}
            <div className="pl-6 md:pl-24 pr-6 flex flex-col select-none relative z-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`n-${activeIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-neon-pink)] mb-2 md:mb-5 block"
                >
                  {String(activeIndex + 1).padStart(2, "0")} — {String(PROJECTS.length).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>

              {/* Big project name */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`t-${activeIndex}`}
                    initial={{ y: "80%", opacity: 0, filter: "blur(5px)" }}
                    animate={{ y: "0%",  opacity: 1, filter: "blur(0px)" }}
                    exit={{   y: "-65%", opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    className="font-anton uppercase leading-[0.88] tracking-tight text-[#1a1208]"
                    style={{ fontSize: "clamp(2.2rem, 4.6vw, 5.2rem)" }}
                  >
                    {activeProject.title}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* Subtitle */}
              <div className="overflow-hidden mt-3">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`s-${activeIndex}`}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%",  opacity: 0.5  }}
                    exit={{   y: "-80%", opacity: 0    }}
                    transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-[9px] tracking-[0.22em] text-black uppercase"
                  >
                    {activeProject.subtitle}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Year badge */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`y-${activeIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.38, delay: 0.14 }}
                  className="inline-block mt-4 md:mt-8 font-mono text-[9px] tracking-widest uppercase text-black/50 border border-black/18 px-2.5 py-1 rounded-sm w-fit"
                >
                  {activeProject.year}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ── RIGHT: Details with shadow-curtain wipe reveal ── */}
          <div className="relative w-full md:w-[56%] h-[60%] md:h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                className="absolute inset-0 flex items-start md:items-center px-6 md:px-14 pt-6 md:pt-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {/* Curtain */}
                <motion.div
                  className="absolute inset-0 bg-[#e8ddcb] z-20 origin-left"
                  initial={{ scaleX: 1 }}
                  animate={{
                    scaleX: 0,
                    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.06 },
                  }}
                  exit={{
                    scaleX: 1,
                    transition: { duration: 0.40, ease: [0.76, 0, 0.24, 1] },
                  }}
                />

                <div className="relative z-10 w-full max-w-lg">
                  <p className="font-sans text-sm md:text-[15px] text-black/60 leading-relaxed mb-6">
                    {activeProject.description}
                  </p>

                  {activeProject.bulletPoints && activeProject.bulletPoints.length > 0 && (
                    <div className="mb-6">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--color-neon-pink)] uppercase mb-3 block">
                        Highlights
                      </span>
                      <ul className="space-y-2">
                        {activeProject.bulletPoints.slice(0, 3).map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-black/55 font-sans leading-snug">
                            <span className="text-[var(--color-neon-pink)] mt-0.5 shrink-0 leading-none">›</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-7">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[8px] tracking-wider uppercase px-2.5 py-1 border border-black/12 text-black/40 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase text-black/65 border border-black/22 hover:border-black px-4 py-2.5 rounded-sm transition-all duration-300 hover:bg-black/5"
                      >
                        <Github className="w-3.5 h-3.5" />
                        Source
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase text-[var(--color-neon-pink)] border border-[var(--color-neon-pink)]/30 hover:border-[var(--color-neon-pink)] px-4 py-2.5 rounded-sm transition-all duration-300"
                      >
                        Live →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
