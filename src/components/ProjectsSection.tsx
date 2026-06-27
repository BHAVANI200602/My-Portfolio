import { useRef } from "react";
import { PROJECTS } from "../data";
import { Github } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import TextReveal from "./TextReveal";

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.8], ["0vw", "-150vw"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.8], ["0vw", "150vw"]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 1, 0]);
  const jScale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [1, 3, 40, 2500]);
  const jOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <section id="section-4" className="w-full bg-black">
      <div ref={containerRef} className="relative h-[150vh] w-full">
        <motion.div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4 md:px-8 z-10 bg-black">
          <motion.div
            style={{ opacity: textOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 px-4"
          >
            <div className="font-display font-bold flex items-center justify-center uppercase leading-none text-[20vw] md:text-[16vw] gap-2 md:gap-4 tracking-tight text-white-soft w-full max-w-7xl mx-auto">
              <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">P</motion.span>
              <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">R</motion.span>
              <motion.span style={{ x: leftX, opacity: leftOpacity }} className="inline-block origin-center">O</motion.span>
              <motion.span style={{ scale: jScale, opacity: jOpacity, transformOrigin: "75% 30%" }} className="inline-block z-20">J</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">E</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">C</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">T</motion.span>
              <motion.span style={{ x: rightX, opacity: rightOpacity }} className="inline-block origin-center">S</motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-20 w-full bg-black">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-32 flex flex-col gap-32">
          {PROJECTS.map((project, idx) => (
            <div key={project.id} className="flex flex-col md:flex-row w-full gap-8 md:gap-16 items-start border-t border-white/10 pt-12">
              <div className="w-full md:w-[45%] flex flex-col">
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-4 uppercase">
                  {String(idx + 1).padStart(2, "0")} — {String(PROJECTS.length).padStart(2, "0")}
                </span>
                <h2 className="font-display font-bold uppercase leading-[0.85] tracking-tight text-white-soft text-6xl md:text-7xl lg:text-[7rem]">
                  {project.title}
                </h2>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mt-4">
                  {project.subtitle}
                </p>
                <span className="inline-block mt-8 font-mono text-[10px] tracking-widest uppercase text-white/40 border border-white/10 px-3 py-1.5 rounded-sm w-fit">
                  {project.year}
                </span>
              </div>

              <div className="w-full md:w-[55%] flex flex-col justify-center">
                <p className="font-sans font-light text-sm md:text-base text-white/60 leading-relaxed mb-8 max-w-lg">
                  <TextReveal delay={0.2}>{project.description}</TextReveal>
                </p>

                {project.bulletPoints.length > 0 && (
                  <div className="mb-8">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase mb-4 block">
                      Highlights
                    </span>
                    <ul className="space-y-3">
                      {project.bulletPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] text-white-soft font-sans font-medium leading-snug">
                          <span className="text-white/40 mt-0.5 shrink-0 leading-none font-bold">›</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/70 font-semibold rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase font-semibold text-white-soft border border-white/20 hover:bg-white hover:text-black px-5 py-3 rounded-sm transition-all duration-300"
                    >
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
