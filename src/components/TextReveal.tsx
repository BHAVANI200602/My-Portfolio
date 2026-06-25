import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * Splits text into words and reveals them one by one only when the
 * element scrolls into the viewport.
 *
 * Uses a manual IntersectionObserver (NOT whileInView) so we have full
 * control over the threshold and rootMargin — ensuring it never triggers
 * early (e.g. on page load when the element is off-screen).
 */
export default function TextReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.2,
}: {
  children: string;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect(); // fire once
        }
      },
      {
        // Only fire when 20% of the element is inside the viewport
        threshold,
        // Pull the trigger line 60px above the bottom edge of the viewport
        // so animation starts just as the element appears, not before
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const words = children.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 18, opacity: 0, filter: "blur(4px)" }}
          animate={
            triggered
              ? { y: 0, opacity: 1, filter: "blur(0px)" }
              : { y: 18, opacity: 0, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + i * 0.035,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
