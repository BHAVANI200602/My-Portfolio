import { useEffect, useState } from "react";

export default function DashedScrollLine() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollable = documentHeight - windowHeight;
      if (scrollable > 0) {
        // Start filling the line slightly after leaving the exact top to feel responsive
        const pct = Math.min((scrollY / scrollable) * 100, 100);
        setScrollProgress(pct);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 right-[6vw] md:right-[12vw] w-[1px] h-screen z-10 pointer-events-none transition-colors duration-800">
      <div
        id="dashed-line-anim"
        className="w-full h-full text-inherit opacity-45"
        style={{
          backgroundImage: "linear-gradient(to bottom, currentColor 50%, transparent 50%)",
          backgroundSize: "2px 16px",
          backgroundRepeat: "repeat-y",
          clipPath: `inset(0 0 ${100 - scrollProgress}% 0)`,
        }}
      />
    </div>
  );
}
