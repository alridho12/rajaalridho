
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

// ==========================================
// CONFIGURATION
// ==========================================

const STAR_COUNT = 220;
const MOBILE_STAR_COUNT = 120;

const MIN_DEPTH = 0.3;
const DEPTH_RANGE = 3.4;

const MAX_STREAK_LENGTH = 150;

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);


// ==========================================
// GENERATE STARS
// ==========================================

const createStars = () => {
  return Array.from(
    { length: STAR_COUNT },
    () => {
      const z =
        MIN_DEPTH +
        Math.random() * DEPTH_RANGE;

      return {
        x: (Math.random() * 2 - 1) * z,
        y: (Math.random() * 2 - 1) * z,
        z,

        size: 0.5 + Math.random() * 1.3,

        brightness:
          0.35 + Math.random() * 0.65,
      };
    }
  );
};


// ==========================================
// STAR WARP COMPONENT
// ==========================================

const StarWarpCanvas = ({ progress = 0 }) => {
  const canvasRef = useRef(null);
  const starsRef = useRef(null);

  const progressRef = useRef(progress);
  const drawRef = useRef(() => {});

  if (starsRef.current === null) {
    starsRef.current = createStars();
  }


  // ========================================
  // CANVAS SETUP
  // ========================================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;


    // ======================================
    // PROJECT 3D STAR TO 2D
    // ======================================

    const project = (x, y, z) => {
      return {
        x:
          width / 2 +
          (x / z) * width * 0.5,

        y:
          height / 2 +
          (y / z) * height * 0.5,
      };
    };


    // ======================================
    // DRAW STARS
    // ======================================

    const draw = () => {
      if (!width || !height) return;

      const p = clamp(progressRef.current);

      ctx.clearRect(0, 0, width, height);

      // Warp increases as the user scrolls.
      const warp = reducedMotion
        ? 0
        : clamp((p - 0.06) / 0.52);

      // Fade after reaching high speed.
      const fade =
        1 - clamp((p - 0.52) / 0.35);

      // Simulate forward movement through space.
      const travel = reducedMotion
        ? 0
        : p * DEPTH_RANGE;

      const count =
        width < 600
          ? MOBILE_STAR_COUNT
          : STAR_COUNT;

      ctx.lineCap = 'round';

      starsRef.current
        .slice(0, count)
        .forEach((star) => {

          // Move star toward the camera.
          // Wrap it to the far distance
          // when it passes the camera.

          const rawDepth =
            star.z - travel - MIN_DEPTH;

          const wrappedDepth =
            (
              (rawDepth % DEPTH_RANGE) +
              DEPTH_RANGE
            ) % DEPTH_RANGE;

          const z =
            MIN_DEPTH + wrappedDepth;


          // Current star position
          const head = project(
            star.x,
            star.y,
            z
          );

          // Skip stars outside viewport
          if (
            head.x < -40 ||
            head.x > width + 40 ||
            head.y < -40 ||
            head.y > height + 40
          ) {
            return;
          }


          const alpha =
            star.brightness * fade;

          if (alpha <= 0.005) return;


          // ==================================
          // STRETCHED STAR TRAIL
          // ==================================

          if (warp > 0.01) {
            const tailDepth =
              z + warp * (0.18 + warp * 0.65);

            const tail = project(
              star.x,
              star.y,
              tailDepth
            );


            // Limit excessive trail length

            const dx = head.x - tail.x;
            const dy = head.y - tail.y;

            const distance =
              Math.hypot(dx, dy);

            const maxLength =
              MAX_STREAK_LENGTH * warp;

            const factor =
              distance > 0
                ? Math.min(
                    1,
                    maxLength / distance
                  )
                : 0;

            const tailX =
              head.x - dx * factor;

            const tailY =
              head.y - dy * factor;


            // Gradient: transparent tail,
            // bright star head

            const gradient =
              ctx.createLinearGradient(
                tailX,
                tailY,
                head.x,
                head.y
              );

            gradient.addColorStop(
              0,
              'rgba(255,255,255,0)'
            );

            gradient.addColorStop(
              1,
              `rgba(255,255,255,${alpha})`
            );


            ctx.beginPath();

            ctx.moveTo(tailX, tailY);
            ctx.lineTo(head.x, head.y);

            ctx.strokeStyle = gradient;

            ctx.lineWidth =
              0.6 + warp * star.size;

            ctx.stroke();
          }


          // ==================================
          // STAR HEAD
          // ==================================

          ctx.beginPath();

          ctx.arc(
            head.x,
            head.y,
            star.size * (1 + warp * 0.3),
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            `rgba(255,255,255,${alpha})`;

          ctx.fill();
        });
    };


    drawRef.current = draw;


    // ======================================
    // RESPONSIVE CANVAS
    // ======================================

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        Math.round(width * dpr);

      canvas.height =
        Math.round(height * dpr);

      ctx.setTransform(
        dpr, 0, 0, dpr, 0, 0
      );

      draw();
    };


    resize();

    let observer;

    if (window.ResizeObserver) {
      observer = new ResizeObserver(resize);

      observer.observe(
        canvas.parentElement
      );
    } else {
      window.addEventListener(
        'resize',
        resize
      );
    }


    return () => {
      observer?.disconnect();

      window.removeEventListener(
        'resize',
        resize
      );

      drawRef.current = () => {};
    };
  }, []);


  // ========================================
  // UPDATE WHEN SCROLL CHANGES
  // ========================================

  useEffect(() => {
    progressRef.current = progress;

    drawRef.current();
  }, [progress]);


  // ========================================
  // RENDER
  // ========================================

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden="true"
      sx={{
        position: 'absolute',

        inset: 0,

        width: '100%',
        height: '100%',

        zIndex: 2,

        pointerEvents: 'none',

        userSelect: 'none',
      }}
    />
  );
};

export default StarWarpCanvas;
