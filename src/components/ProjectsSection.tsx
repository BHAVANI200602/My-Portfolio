import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "../data";
import { Github, ExternalLink, FolderDot, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

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
    ["#070707", "#ACB6FF"]
  );

  // Project details card transition states
  const detailsOpacity = useTransform(scrollYProgress, [0.44, 0.52, 1], [0, 1, 1]);
  const detailsScale = useTransform(scrollYProgress, [0.44, 0.52, 1], [0.88, 1, 1]);
  const detailsY = useTransform(scrollYProgress, [0.44, 0.52, 1], [40, 0, 0]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("browser-agent");
  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

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
      className="relative h-[250vh] md:h-[300vh] w-full bg-[#070707] scroll-mt-10"
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
              className="inline-block z-20 text-[#ACB6FF] font-bold"
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

        {/* COMPONENT 2: Detailed Case-Study Card View */}
        <motion.div
          style={{
            opacity: detailsOpacity,
            scale: detailsScale,
            y: detailsY,
            pointerEvents: isInteractive ? "auto" : "none",
          }}
          className="relative w-full max-w-6xl px-2 sm:px-4 md:px-8 z-20"
        >
          <div className="bg-white border-2 border-black rounded shadow-[8px_8px_0px_#000000] p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-stretch max-h-[90vh] md:max-h-[700px] md:min-h-[550px] overflow-y-auto">
            
            {/* INDEX LIST COLUMN */}
            <div className="md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/10 pb-6 md:pb-0 pr-0 md:pr-8 shrink-0">
              <div>
                <div className="text-[10px] flex justify-between items-center font-mono text-black/50 uppercase tracking-widest mb-4">
                  <span>INDEX_OF_WORKS</span>
                  <span className="md:hidden text-[9px] text-[#D476FF] tracking-normal font-sans animate-pulse">Swipe &raquo;</span>
                </div>
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2.5 md:pb-0 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {PROJECTS.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={`group flex items-center justify-between p-3 rounded-sm border text-left transition-all duration-300 font-mono w-[220px] sm:w-[260px] md:w-full shrink-0 snap-start ${
                        selectedProjectId === proj.id
                          ? "bg-black text-[#ACB6FF] border-black shadow-[3px_3px_0_#D476FF]"
                          : "bg-transparent text-black/65 border-black/10 hover:border-black hover:text-black hover:bg-black/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden w-full">
                        <FolderDot
                          className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                            selectedProjectId === proj.id
                              ? "text-neon-pink animate-pulse"
                              : "text-black/30 group-hover:text-black"
                          }`}
                        />
                        <div className="flex flex-col overflow-hidden w-full">
                          <span className="text-xs font-bold uppercase tracking-wider truncate">
                            {proj.title}
                          </span>
                          <span className="text-[9px] opacity-65 tracking-normal truncate">
                            {proj.subtitle}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden md:block pt-6 border-t border-black/5 font-mono text-[9px] text-zinc-400 leading-normal uppercase">
                &raquo; Click the indexes above to inspect each system case study dynamically
              </div>
            </div>

            {/* DETAILS PREVIEW COLUMN */}
            <div className="md:w-2/3 flex flex-col justify-between pt-4 md:pt-0">
              <div>
                {/* Year Indicator & Links Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <span className="px-2.5 py-1 bg-black text-[#ACB6FF] font-mono text-[9px] tracking-widest uppercase rounded-sm">
                    RELEASE: {activeProject.year}
                  </span>

                  <div className="flex items-center space-x-2">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 border border-black text-black hover:bg-black hover:text-[#ACB6FF] rounded transition-all shadow-sm"
                        title="Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Typography details */}
                <div className="mb-4">
                  <h3 className="font-anton uppercase text-2xl md:text-3xl text-black tracking-wider leading-none">
                    {activeProject.title}
                  </h3>
                  <p className="font-mono text-[10px] text-neon-pink font-semibold uppercase tracking-wider mt-1">
                    // {activeProject.subtitle}
                  </p>
                </div>

                {/* Honest description (no jargon) */}
                <p className="text-black/85 text-xs md:text-sm font-sans font-light leading-relaxed mb-6 border-l border-black/20 pl-3">
                  {activeProject.description}
                </p>

                {/* Core points */}
                <div className="space-y-2.5 mb-6">
                  <h4 className="font-display font-bold text-[10px] uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black/10 pb-1 mb-2">
                    <Sparkles className="w-3 h-3 text-neon-pink" />
                    <span>Highlights & Capabilities</span>
                  </h4>
                  <ul className="space-y-1.5 font-sans text-xs text-black/80">
                    {activeProject.bulletPoints.map((pt, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="font-mono text-neon-pink font-semibold select-none">
                          &rsaquo;
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies tags bar */}
              <div>
                <div className="flex flex-wrap gap-1">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-black/5 text-black border border-black/15 font-mono text-[9px] uppercase font-semibold rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
