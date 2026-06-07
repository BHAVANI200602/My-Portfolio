import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, options || { threshold: 0.15, rootMargin: "0px 0px -100px 0px" });

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [options]);

  return [ref, isInView] as const;
}
