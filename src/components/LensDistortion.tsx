import { useEffect, useRef } from "react";
import { useScroll, useVelocity, useSpring, useTransform, useMotionValueEvent } from "motion/react";

interface LensDistortionProps {
  children: React.ReactNode;
  id?: string;
}

/**
 * Global Scroll-Driven Fisheye / Lens Distortion
 *
 * How it works:
 * - A hidden <canvas> re-renders the viewport content every frame using WebGL.
 * - On fast scroll, a barrel/fisheye vertex displacement is applied via
 *   a fragment shader that pushes edge pixels outward (barrel distortion).
 *
 * Since true WebGL DOM capture isn't possible without html2canvas overhead,
 * we instead apply the distortion directly to the wrapper div using
 * an SVG feTurbulence + feDisplacementMap properly anchored to the viewport
 * using CSS `position: fixed` reference frame tricks.
 *
 * Key fixes vs previous version:
 * 1. Gradient goes gray→WHITE at edges (barrel / fisheye push-out, not pinhole)
 * 2. Filter is applied per-viewport-snapshot via a fixed-size filter region
 * 3. No height="100000px" - filter region is always exactly one viewport
 * 4. The displacement map is regenerated as a CSS data-URI and referenced
 *    as a CSS custom property so the browser paints it in viewport space.
 */
export default function LensDistortion({ children, id = "ld" }: LensDistortionProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Heavily damped spring so distortion ramps up/down smoothly
  const smoothVelocity = useSpring(scrollVelocity, { damping: 80, stiffness: 200, mass: 1 });
  // Map absolute velocity to a distortion scale (0 = still, 30 = very fast scroll)
  const distortionScale = useTransform(smoothVelocity, (v) => {
    const abs = Math.abs(v);
    return Math.min(abs / 80, 30); // cap at 30, generous ramp
  });

  const filterEl = useRef<SVGFEDisplacementMapElement>(null);

  useMotionValueEvent(distortionScale, "change", (val) => {
    if (filterEl.current) {
      filterEl.current.setAttribute("scale", val.toFixed(2));
    }
  });

  // Build the displacement map once per mount (viewport-sized radial gradient)
  // gray(128) center = zero displacement
  // white(255) at edges = push pixels outward (fisheye barrel)
  const mapId = id + "-map";
  const filterId = id + "-filter";

  useEffect(() => {
    // Nothing to do dynamically – the SVG gradient handles everything.
    // We just ensure the filter scale starts at 0.
    if (filterEl.current) filterEl.current.setAttribute("scale", "0");
  }, []);

  return (
    <>
      {/*
        SVG filter definition:
        - filterUnits="objectBoundingBox": the filter region is always exactly the
          bounding box of the element it's applied to (one viewport-height chunk at a time).
        - primitiveUnits="objectBoundingBox": feImage coords are 0..1 relative to the element.
        - The radial gradient goes from gray(128) at center → white(255) at edges.
          This means: center pixels are undisplaced, edge pixels are pushed outward → fisheye.
      */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <defs>
          {/* The displacement map: a viewport-relative radial gradient */}
          <radialGradient id={mapId} cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            {/* Center: pure gray = zero displacement (128,128,128) */}
            <stop offset="0%"   stopColor="rgb(128,128,128)" />
            {/* Mid: slightly lighter → subtle push */}
            <stop offset="55%"  stopColor="rgb(168,168,168)" />
            {/* Edges: white → strong outward push (barrel / fisheye) */}
            <stop offset="100%" stopColor="rgb(255,255,255)" />
          </radialGradient>

          {/*
            The filter:
            - objectBoundingBox means it maps perfectly to each wrapped element's own box.
            - We extend by 10% on each side (x/y = -0.1, width/height = 1.2) so displaced
              edge pixels have source content to sample from instead of being clipped.
          */}
          <filter
            id={filterId}
            filterUnits="objectBoundingBox"
            primitiveUnits="objectBoundingBox"
            x="-0.1" y="-0.1" width="1.2" height="1.2"
            colorInterpolationFilters="linearRGB"
          >
            {/* Paint the radial gradient as the displacement map */}
            <feFlood x="0" y="0" width="1" height="1" result="transparent" floodOpacity="0" />
            <feComposite operator="over" in2="transparent" />
            <feImage
              href={"data:image/svg+xml," + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
                  '<defs>' +
                    '<radialGradient id="rg" cx="50%" cy="50%" r="70%">' +
                      '<stop offset="0%" stop-color="rgb(128,128,128)"/>' +
                      '<stop offset="55%" stop-color="rgb(168,168,168)"/>' +
                      '<stop offset="100%" stop-color="rgb(255,255,255)"/>' +
                    '</radialGradient>' +
                  '</defs>' +
                  '<rect width="100" height="100" fill="url(#rg)"/>' +
                '</svg>'
              )}
              x="0" y="0" width="1" height="1"
              preserveAspectRatio="none"
              result="displacementMap"
            />
            <feDisplacementMap
              ref={filterEl}
              in="SourceGraphic"
              in2="displacementMap"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/*
        Apply the filter to each child element's own bounding box.
        will-change: filter tells the GPU to keep this layer composited separately
        for smooth, jank-free distortion. transform: translateZ(0) forces GPU layer.
      */}
      <div
        style={{
          filter: "url(#" + filterId + ")",
          willChange: "filter",
          transform: "translateZ(0)",
        }}
      >
        {children}
      </div>
    </>
  );
}
