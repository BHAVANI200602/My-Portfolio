import { useEffect, useRef } from "react";

/**
 * SnakeCanvas
 *
 * Modern minimalist snake animation on a dark background.
 * - Massive cell size
 * - Single bright dot head with a glowing trail
 * - Snake moves up/down by column (zig-zag)
 * - Trail color cycles based on the current column
 */
export default function SnakeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // "Very big" editorial cells
    const CELL = 120;
    const HEAD_COLOR = "#ffffff";
    const TRAIL_LENGTH = 35;
    const SPEED_MS = 80;

    // Theme colors for trail cycling (RGB arrays for easy interpolation)
    const THEME_COLORS = [
      [181, 255, 71], // Laser Banana
      [169, 135, 255], // Princess Lilac
      [255, 55, 68], // Animator's Blood
    ];

    let cols = 0;
    let rows = 0;
    let hamPath: [number, number, number[]][] = []; // [col, row, color]
    let pathIdx = 0;
    let trail: [number, number, number[]][] = [];
    let rafId: number;
    let lastTime = 0;
    let running = true;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols = Math.ceil(canvas.width / CELL);
      rows = Math.ceil(canvas.height / CELL);
      buildHamPath();
      trail = [];
      pathIdx = 0;
    }

    // Build a column-alternating Hamiltonian path (top->down, right, up, right...)
    function buildHamPath() {
      hamPath = [];
      for (let c = 0; c < cols; c++) {
        const color = THEME_COLORS[c % THEME_COLORS.length];
        if (c % 2 === 0) {
          // Even columns go Top -> Down
          for (let r = 0; r < rows; r++) hamPath.push([c, r, color]);
        } else {
          // Odd columns go Bottom -> Up
          for (let r = rows - 1; r >= 0; r--) hamPath.push([c, r, color]);
        }
      }
    }

    function draw(now: number) {
      if (!canvas || !running) return;
      rafId = requestAnimationFrame(draw);

      if (now - lastTime < SPEED_MS) return;
      lastTime = now;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      // Fade previous frame (creates soft motion blur/dark background)
      ctx.fillStyle = "rgba(3, 0, 20, 0.25)";
      ctx.fillRect(0, 0, W, H);

      if (hamPath.length === 0) return;

      // Advance snake head
      const currentPos = hamPath[pathIdx % hamPath.length];
      trail.unshift(currentPos);
      if (trail.length > TRAIL_LENGTH) trail.pop();
      pathIdx++;

      // Draw trail segments
      trail.forEach(([c, r, color], i) => {
        const frac = 1 - i / TRAIL_LENGTH;
        const x = c * CELL + CELL / 2;
        const y = r * CELL + CELL / 2;

        if (i === 0) {
          // Head — bright white with glow
          ctx.save();
          ctx.shadowColor = HEAD_COLOR;
          ctx.shadowBlur = 30;
          ctx.fillStyle = HEAD_COLOR;
          ctx.beginPath();
          ctx.arc(x, y, CELL * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Trail — shrinks and shifts from white to the column's color
          const radius = CELL * 0.1 * frac;
          
          // Interpolate white (255,255,255) -> column color
          const r255 = Math.round(255 + (color[0] - 255) * (1 - frac));
          const g255 = Math.round(255 + (color[1] - 255) * (1 - frac));
          const b255 = Math.round(255 + (color[2] - 255) * (1 - frac));
          const rgbString = `rgb(${r255},${g255},${b255})`;

          ctx.save();
          ctx.globalAlpha = frac * 0.9;
          ctx.shadowColor = rgbString;
          ctx.shadowBlur = 20 * frac;
          ctx.fillStyle = rgbString;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(radius, 1), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
