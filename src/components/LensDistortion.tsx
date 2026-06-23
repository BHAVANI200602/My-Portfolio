/**
 * ScrollBlur — Bottom-of-viewport blur overlay
 *
 * A position:fixed frosted strip at the bottom of the screen.
 * Content approaching from below appears blurred/foggy.
 * As you scroll it up into the clear zone it snaps into focus.
 *
 * Uses backdrop-filter with a gradient mask so the blur
 * fades smoothly from full at the very bottom to none at mid-screen.
 */
export default function ScrollBlur() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "12vh",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        // Gradient mask: opaque at bottom (full blur) → transparent at top (no blur)
        maskImage:
          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 100%)",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
