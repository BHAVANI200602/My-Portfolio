import { useRef } from "react";
import { PROJECTS } from "../data";
import { Github } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import TextReveal from "./TextReveal";

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll for the J zoom phase (0 to 1) inside a 150vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Left letters (P, R, O)
  const leftX = useTransform(scrollYProgress, [0, 0.8], ["0vw", "-150vw"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 1, 0]);

  // Right letters (E, C, T, S)
  const rightX = useTransform(scrollYProgress, [0, 0.8], ["0vw", "150vw"]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 1, 0]);

  // Target letter 'J' scales up exponentially
  const jScale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [1, 3, 40, 2500]);
  const jOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);



  return (
    <section id="section-4" className="w-full bg-[#111111]">
      {/* Zoom Phase Container */}
      <div ref={containerRef} className="relative h-[150vh] w-full">
        <motion.div
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4 md:px-8 z-10 bg-[#111111]"
        >
          <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 px-4">
            <div className="font-anton flex items-center justify-center uppercase leading-none text-[20vw] md:text-[16vw] gap-2 md:gap-4 tracking-normal text-[var(--color-theme)] w-full max-w-7xl mx-auto">
              <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">P</motion.span>
              <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">R</motion.span>
              <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">O</motion.span>
              
              <motion.span style={{ scale: jScale, opacity: jOpacity, transformOrigin: "75% 30%" }} className="inline-block z-20 text-[#F5F5F5] font-bold">J</motion.span>
              
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">E</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">C</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">T</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">S</motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stacked Projects List (Normal Scrolling after J-zoom) */}
      <div className="relative z-20 w-full bg-[#111111]">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-32 flex flex-col gap-32">
            {PROJECTS.map((project, idx) => (
              <div key={project.id} className="flex flex-col md:flex-row w-full gap-8 md:gap-16 items-start border-t border-white/10 pt-12">
                {/* Left Side: Massive Project Name */}
                <div className="w-full md:w-[45%] flex flex-col">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 mb-4 uppercase">
                    {String(idx + 1).padStart(2, "0")} — {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                  <h2 className="font-anton uppercase leading-[0.85] tracking-tight text-white text-6xl md:text-7xl lg:text-[7rem]">
                    {project.title}
                  </h2>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mt-4">
                    {project.subtitle}
                  </p>
                  <span className="inline-block mt-8 font-mono text-[10px] tracking-widest uppercase text-white/50 border border-white/10 px-3 py-1.5 rounded-sm w-fit">
                    {project.year}
                  </span>
                </div>

                {/* Right Side: Info */}
                <div className="w-full md:w-[55%] flex flex-col justify-center">
                  <p className="font-sans font-light text-sm md:text-base text-white/70 leading-relaxed mb-8 max-w-lg">
                    <TextReveal delay={0.2}>{project.description}</TextReveal>
                  </p>

                  {project.bulletPoints && project.bulletPoints.length > 0 && (
                    <div className="mb-8">
                      <span className="font-mono text-[10px] tracking-[0.3em] text-white uppercase mb-4 block">
                        Highlights
                      </span>
                      <ul className="space-y-3">
                        {project.bulletPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-white font-sans font-medium leading-snug">
                            <span className="text-white mt-0.5 shrink-0 leading-none font-bold">›</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white font-semibold rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase font-semibold text-white border-2 border-white/10 hover:border-white/10 hover:bg-[#000000] hover:text-[#F5F5F5] px-5 py-3 rounded-sm transition-all duration-300">
                        <Github className="w-4 h-4" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
