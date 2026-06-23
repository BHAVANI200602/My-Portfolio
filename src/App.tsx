/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Preloader from "./components/Preloader";
import DashedScrollLine from "./components/DashedScrollLine";
import HeroSection from "./components/HeroSection";
import EducationSection from "./components/EducationSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import FooterSection from "./components/FooterSection";
import NavBar from "./components/NavBar";
import BarrelLens from "./components/LensDistortion";

export default function App() {
  const [isDived, setIsDived] = useState(false);
  const [preloaderMounted, setPreloaderMounted] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Intro sequence pre-loader phase */}
      {preloaderMounted && (
        <Preloader
          onDiveStart={() => setIsDived(true)}
          onDiveComplete={() => setPreloaderMounted(false)}
        />
      )}

      {/* Global barrel lens overlay — position:fixed canvas, paints curved edges on scroll */}
      {isDived && <BarrelLens />}

      {/* Navigation Bar */}
      <div 
        style={{
          opacity: isDived ? 1 : 0,
          visibility: isDived ? "visible" : "hidden",
          pointerEvents: isDived ? "auto" : "none",
          transition: "opacity 1s ease-in-out"
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
        {/* Tracking dash indicator vector */}
        <DashedScrollLine />

        {/* Section index layouts — no filter wrappers, barrel lens is a global overlay */}
        <main className="w-full flex-grow flex flex-col items-center">
          <HeroSection isDived={isDived} />
          <EducationSection />
          <SkillsSection />
          <ProjectsSection />
        </main>

        <FooterSection scrollToTop={scrollToTop} />
      </div>
    </>
  );
}
