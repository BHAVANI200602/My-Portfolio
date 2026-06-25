/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Preloader from "./components/Preloader";
import HeroSection from "./components/HeroSection";
import EducationSection from "./components/EducationSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import FooterSection from "./components/FooterSection";
import NavBar from "./components/NavBar";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import TimelineScrollbar from "./components/TimelineScrollbar";
import { motion, useScroll, useTransform } from "motion/react";

export default function App() {
  const [isDived, setIsDived] = useState(false);
  const [preloaderMounted, setPreloaderMounted] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { scrollY } = useScroll();
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1000;
  
  // Animate over the first 100vh of scroll
  const heroScale = useTransform(scrollY, [0, windowHeight], [1, 0.85]);
  const heroOpacity = useTransform(scrollY, [0, windowHeight], [1, 0.2]);
  const heroBlur = useTransform(scrollY, [0, windowHeight], ["blur(0px)", "blur(8px)"]);

  return (
    <SmoothScroll>
      <CustomCursor />
      <TimelineScrollbar />
      {/* Intro sequence pre-loader phase */}
      {preloaderMounted && (
        <Preloader
          onDiveStart={() => setIsDived(true)}
          onDiveComplete={() => setPreloaderMounted(false)}
        />
      )}

      {/* Navigation Bar */}
      <div
        style={{
          opacity: isDived ? 1 : 0,
          visibility: isDived ? "visible" : "hidden",
          pointerEvents: isDived ? "auto" : "none",
          transition: "opacity 1s ease-in-out",
        }}
      >
        <NavBar />
      </div>

      {/* Main Portfolio Framework */}
      <div
        className="w-full relative min-h-screen flex flex-col justify-between bg-[#010101] text-[var(--color-theme)] transition-opacity duration-1000 ease-in-out select-none"
        style={{
          opacity: isDived ? 1 : 0,
          visibility: isDived ? "visible" : "hidden",
          pointerEvents: isDived ? "auto" : "none",
        }}
      >
        <main className="w-full flex-grow flex flex-col relative">
          {/* Sticky Hero Container — stays pinned and recedes */}
          <motion.div 
            className="sticky top-0 h-screen w-full z-0 overflow-hidden bg-[#000000]"
            style={{ 
              scale: heroScale, 
              opacity: heroOpacity, 
              filter: heroBlur,
              transformOrigin: "center center"
            }}
          >
            <HeroSection isDived={isDived} />
          </motion.div>

          {/* Solid content block that slides over the Hero */}
          <div className="relative z-10 w-full bg-[#010101] flex flex-col items-center border-t border-[#e1decc]/5 shadow-[0_-30px_60px_rgba(1,1,1,0.8)] pt-8">
            <EducationSection />
            <SkillsSection />
            <ProjectsSection />
          </div>
        </main>

        <FooterSection scrollToTop={scrollToTop} />
      </div>
    </SmoothScroll>
  );
}
