import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform, useMotionValueEvent } from "motion/react";

interface LensDistortionProps {
  children: React.ReactNode;
  disabled?: boolean;
  id?: string;
}

export default function LensDistortion({ children, disabled = false, id = "lens-distortion" }: LensDistortionProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityAbs = useTransform(smoothVelocity, (v) => Math.abs(v));
  
  // Scale the distortion intensity based on scroll velocity.
  // 0 velocity = 0 distortion. Fast scroll = up to 60 displacement scale.
  const scale = useTransform(velocityAbs, [0, 3000], [0, 60]);

  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const mapRef = useRef<SVGFEImageElement>(null);

  useMotionValueEvent(scale, "change", (latest) => {
    if (disabled) {
      if (filterRef.current) filterRef.current.setAttribute("scale", "0");
      return;
    }
    if (filterRef.current) {
      filterRef.current.setAttribute("scale", latest.toString());
    }
  });

  const [svgUrl, setSvgUrl] = useState("");

  // Create the displacement map image based on viewport size
  useEffect(() => {
    const updateMap = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const mapSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
          <defs>
            <radialGradient id="rg-${id}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgb(128,128,128)"/>
              <stop offset="100%" stop-color="rgb(0,0,0)"/>
            </radialGradient>
          </defs>
          <rect width="${w}" height="${h}" fill="url(#rg-${id})"/>
        </svg>
      `;
      const encoded = "data:image/svg+xml;base64," + btoa(mapSvg);
      setSvgUrl(encoded);
    };

    updateMap();
    window.addEventListener("resize", updateMap);
    return () => window.removeEventListener("resize", updateMap);
  }, [id]);

  useMotionValueEvent(scrollY, "change", (y) => {
    // Keep the displacement map fixed to the viewport by moving the feImage down by scrollY
    if (mapRef.current) {
      mapRef.current.setAttribute("y", y.toString());
    }
  });

  return (
    <>
      <svg style={{ width: 0, height: 0, position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100000px">
            {svgUrl && (
              <feImage 
                ref={mapRef}
                href={svgUrl} 
                result="map" 
                x="0" 
                y="0" 
                width={typeof window !== 'undefined' ? window.innerWidth : 1000} 
                height={typeof window !== 'undefined' ? window.innerHeight : 1000}
                preserveAspectRatio="none"
              />
            )}
            <feDisplacementMap 
              ref={filterRef}
              in="SourceGraphic" 
              in2="map" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
      
      <div style={{ filter: disabled ? "none" : ("url(#" + id + ")"), transform: "translateZ(0)" }}>
        {children}
      </div>
    </>
  );
}
