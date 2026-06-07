import { useState } from "react";
import { useInView } from "./useInView";
import { SKILLS } from "../data";
import { TechSkill } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Layers } from "lucide-react";

export default function SkillsSection() {
  const [sectionRef, isInView] = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Language", "Framework", "Database", "Cloud", "Data & AI", "CI/CD & Git", "Testing & Devops"];

  const filteredSkills = SKILLS.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 md:px-16 lg:px-24 border-t border-white/5 scroll-mt-10"
    >
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Liquid Title & Description */}
        <div className="lg:col-span-5 flex flex-col justify-start text-left lg:sticky lg:top-24">

          <div className={`relative mb-8 sm:mb-12 w-full max-w-sm transition-all duration-700 ${isInView ? "is-revealed" : "opacity-0"}`}>
            <h2 className="w-full relative select-none leading-none">
              <svg
                className="w-full h-auto overflow-visible"
                viewBox="0 0 500 120"
                preserveAspectRatio="xMinYMin meet"
                aria-label="SKILLS"
              >
                <text
                  className="svg-outline fill-none stroke-theme stroke-[2.5px]"
                  x="0"
                  y="85"
                  dominantBaseline="middle"
                  textAnchor="start"
                  style={{
                    fontFamily: '"Anton", sans-serif',
                    fontSize: "90px",
                    fontWeight: 900,
                    letterSpacing: "0.04em"
                  }}
                >
                  SKILLS
                </text>
                <g className="svg-fill-wrapper">
                  <text
                    className="svg-fill fill-theme"
                    style={{
                      transform: isInView ? "translateY(0)" : "translateY(100%)",
                      fontFamily: '"Anton", sans-serif',
                      fontSize: "90px",
                      fontWeight: 900,
                      letterSpacing: "0.04em"
                    }}
                    x="0"
                    y="85"
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    SKILLS
                  </text>
                </g>
              </svg>
            </h2>
          </div>

          <div className="max-w-md mt-4">
            <p className="font-spartan font-black text-lg text-theme/80 uppercase tracking-widest leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
              {["Core", "technologies,", "frameworks,", "and", "development", "tools."].map((word, i) => (
                <span
                  key={i}
                  className="inline-block transition-all duration-700"
                  style={{
                    transitionDelay: `${0.1 + i * 0.08}s`,
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "translateY(0)" : "translateY(12px)",
                    filter: isInView ? "blur(0px)" : "blur(3px)",
                  }}
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Search Input Box */}
          <div 
            className="mt-8 relative max-w-xs transition-all duration-1000 delay-500"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(15px)",
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme/40" />
            <input
              type="text"
              placeholder="Query tech index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink text-theme font-mono text-xs rounded pl-9 pr-4 py-2.5 outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Column: Interactive Tech Stack Grid */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div 
            className="flex flex-row md:flex-wrap gap-1.5 pb-2 border-b border-white/5 transition-all duration-1000 delay-300 overflow-x-auto md:overflow-x-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(10px)",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[10px] font-mono rounded-sm border transition-all duration-300 tracking-wider shrink-0 ${
                  selectedCategory === cat
                    ? "bg-neon-pink/15 text-neon-pink border-neon-pink"
                    : "bg-transparent text-theme/60 border-white/10 hover:border-white/20 hover:text-theme"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="min-h-[280px]">
            <motion.div 
              layout 
              className="flex flex-wrap gap-2.5 content-start"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => {
                  const tagTextColor = skill.textColor || "#FFFFFF";
                  return (
                    <motion.div
                      key={skill.name}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2 border border-white/10 rounded-sm font-mono text-xs font-semibold hover:border-white/30 cursor-crosshair transition-colors duration-300"
                      style={{
                        backgroundColor: skill.color,
                        color: tagTextColor,
                        boxShadow: `0 4px 12px ${skill.color}15`,
                      }}
                    >
                      {/* Decorative small visual node block to model the screenshot vibe */}
                      <span 
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{
                          backgroundColor: tagTextColor === "#000000" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"
                        }}
                      />
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {filteredSkills.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-theme/40 font-mono text-xs border border-dashed border-white/5 rounded"
              >
                No active records matching current queries
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
