
import { useEffect, useRef } from 'react';
import { Box, GlobalStyles } from '@mui/material';

import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import PanToolIcon from '@mui/icons-material/PanTool';

const CosmicCursor = () => {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;

    if (!canvas || !cursor) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pointerMedia = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const particles = [];
    const pulses = [];

    let width = window.innerWidth;
    let height = window.innerHeight;

    let previous = null;
    let isDragging = false;

    let frame = null;
    let lastTime = 0;

    // ======================================
    // CANVAS SETUP
    // ======================================

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // ======================================
    // TARGET DETECTION
    // ======================================

    const isInteractive = (target) => {
      if (!(target instanceof Element)) return false;

      return Boolean(
        target.closest(
          'a, button, [role="button"], .MuiButtonBase-root, [data-cursor="hover"]'
        )
      );
    };

    const isGrabTarget = (target) => {
      if (!(target instanceof Element)) return false;

      // Prioritize buttons and form controls.
      if (
        target.closest(
          'a, button, input, textarea, select, [role="button"], [contenteditable="true"], [data-native-cursor="true"]'
        )
      ) {
        return false;
      }

      return Boolean(
        target.closest(
          '[data-cursor="grab"], [draggable="true"], .swiper, .embla__viewport, .keen-slider'
        )
      );
    };

    const useNative = (target) => {
      if (!(target instanceof Element)) return false;

      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [data-native-cursor="true"]'
        )
      ) {
        return true;
      }

      // Canvas uses its native cursor unless marked
      // as part of a draggable element.
      return Boolean(
        target.closest('canvas') &&
        !isGrabTarget(target)
      );
    };

    // ======================================
    // CURSOR POSITION
    // ======================================

    const setPosition = (x, y, grabMode = false) => {
      const offsetX = grabMode ? 15 : 3;
      const offsetY = grabMode ? 17 : 3;

      cursor.style.transform = `
        translate3d(
          ${x - offsetX}px,
          ${y - offsetY}px,
          0
        )
      `;
    };

    const updateCursorMode = (target) => {
      const grabMode =
        isDragging || isGrabTarget(target);

      cursor.classList.toggle(
        'is-grab',
        grabMode && !isDragging
      );

      cursor.classList.toggle(
        'is-grabbing',
        isDragging
      );

      cursor.classList.toggle(
        'is-hover',
        !grabMode && isInteractive(target)
      );

      return grabMode;
    };

    const hideCursor = () => {
      cursor.style.opacity = '0';
      previous = null;
      isDragging = false;

      cursor.classList.remove(
        'is-grab',
        'is-grabbing',
        'is-click',
        'is-hover'
      );
    };

    // ======================================
    // COMET TRAIL PARTICLES
    // ======================================

    const emitTrail = (x, y, oldX, oldY) => {
      const dx = x - oldX;
      const dy = y - oldY;

      const distance = Math.hypot(dx, dy);

      if (distance < 3) return;

      const nx = dx / distance;
      const ny = dy / distance;

      const count = Math.min(
        7,
        Math.max(1, Math.ceil(distance / 7))
      );

      for (let i = 0; i < count; i++) {
        const progress = (i + 0.5) / count;

        const spreadX = (Math.random() - 0.5) * 5;
        const spreadY = (Math.random() - 0.5) * 5;

        const speed = 0.8 + Math.random() * 1.5;

        particles.push({
          x: oldX + dx * progress + spreadX,
          y: oldY + dy * progress + spreadY,

          vx: -nx * speed,
          vy: -ny * speed,

          life: 0,
          maxLife: 300 + Math.random() * 350,

          size: 0.6 + Math.random() * 1.1,
        });
      }

      if (particles.length > 70) {
        particles.splice(
          0,
          particles.length - 70
        );
      }
    };

    // ======================================
    // CANVAS ANIMATION
    // ======================================

    const animate = (time) => {
      frame = null;

      const delta = lastTime
        ? Math.min(time - lastTime, 48)
        : 16;

      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // COMET PARTICLES

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life += delta;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += (p.vx * delta) / 16;
        p.y += (p.vy * delta) / 16;

        const opacity = 1 - p.life / p.maxLife;

        ctx.save();

        ctx.globalAlpha = opacity * 0.85;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';

        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 7;

        ctx.beginPath();

        ctx.moveTo(p.x, p.y);

        ctx.lineTo(
          p.x - p.vx * 5,
          p.y - p.vy * 5
        );

        ctx.stroke();
        ctx.restore();
      }

      // CLICK PULSE

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];

        pulse.life += delta;

        if (pulse.life >= 450) {
          pulses.splice(i, 1);
          continue;
        }

        const progress = pulse.life / 450;

        ctx.save();

        ctx.beginPath();

        ctx.arc(
          pulse.x,
          pulse.y,
          5 + progress * 30,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;

        ctx.globalAlpha = (1 - progress) * 0.75;

        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;

        ctx.stroke();
        ctx.restore();
      }

      if (particles.length || pulses.length) {
        frame = requestAnimationFrame(animate);
      } else {
        lastTime = 0;
      }
    };

    const startAnimation = () => {
      if (frame === null) {
        frame = requestAnimationFrame(animate);
      }
    };

    // ======================================
    // POINTER MOVE
    // ======================================

    const handleMove = (event) => {
      if (
        !pointerMedia.matches ||
        event.pointerType !== 'mouse'
      ) {
        return;
      }

      if (!isDragging && useNative(event.target)) {
        cursor.style.opacity = '0';
        previous = null;
        return;
      }

      const x = event.clientX;
      const y = event.clientY;

      cursor.style.opacity = '1';

      const grabMode = updateCursorMode(
        event.target
      );

      setPosition(x, y, grabMode);

      // Keep comet trail active in all modes.
      if (previous && !reducedMotion.matches) {
        emitTrail(
          x,
          y,
          previous.x,
          previous.y
        );

        startAnimation();
      }

      previous = { x, y };
    };

    // ======================================
    // POINTER DOWN
    // ======================================

    const handleDown = (event) => {
      if (
        !pointerMedia.matches ||
        event.pointerType !== 'mouse'
      ) {
        return;
      }

      if (useNative(event.target)) return;

      const x = event.clientX;
      const y = event.clientY;

      previous = { x, y };

      // GRABBING MODE

      if (isGrabTarget(event.target)) {
        isDragging = true;

        cursor.classList.remove(
          'is-grab',
          'is-click',
          'is-hover'
        );

        cursor.classList.add('is-grabbing');

        setPosition(x, y, true);

        return;
      }

      // NORMAL CLICK

      cursor.classList.add('is-click');

      if (!reducedMotion.matches) {
        pulses.push({
          x,
          y,
          life: 0,
        });

        startAnimation();
      }
    };

    // ======================================
    // POINTER UP / CANCEL
    // ======================================

    const handleUp = (event) => {
      if (
        event?.pointerType &&
        event.pointerType !== 'mouse'
      ) {
        return;
      }

      isDragging = false;

      cursor.classList.remove(
        'is-click',
        'is-grabbing'
      );

      if (!previous) return;

      const target = document.elementFromPoint(
        previous.x,
        previous.y
      );

      if (useNative(target)) {
        cursor.style.opacity = '0';
        return;
      }

      const grabMode = updateCursorMode(target);

      setPosition(
        previous.x,
        previous.y,
        grabMode
      );
    };

    const handleLeave = (event) => {
      if (!event.relatedTarget) {
        hideCursor();
      }
    };

    // ======================================
    // POINTER MODE
    // ======================================

    const updatePointerMode = () => {
      const enabled = pointerMedia.matches;

      document.documentElement.classList.toggle(
        'comet-cursor-active',
        enabled
      );

      if (!enabled) {
        hideCursor();
        particles.length = 0;
        pulses.length = 0;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const handleReducedMotion = () => {
      if (!reducedMotion.matches) return;

      particles.length = 0;
      pulses.length = 0;

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }

      lastTime = 0;
      ctx.clearRect(0, 0, width, height);
    };

    // ======================================
    // EVENT LISTENERS
    // ======================================

    updatePointerMode();

    pointerMedia.addEventListener(
      'change',
      updatePointerMode
    );

    reducedMotion.addEventListener(
      'change',
      handleReducedMotion
    );

    document.addEventListener(
      'pointermove',
      handleMove
    );

    document.addEventListener(
      'pointerdown',
      handleDown
    );

    window.addEventListener(
      'pointerup',
      handleUp
    );

    window.addEventListener(
      'pointercancel',
      handleUp
    );

    document.addEventListener(
      'pointerout',
      handleLeave
    );

    window.addEventListener(
      'blur',
      hideCursor
    );

    window.addEventListener(
      'resize',
      resize
    );

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      document.documentElement.classList.remove(
        'comet-cursor-active'
      );

      pointerMedia.removeEventListener(
        'change',
        updatePointerMode
      );

      reducedMotion.removeEventListener(
        'change',
        handleReducedMotion
      );

      document.removeEventListener(
        'pointermove',
        handleMove
      );

      document.removeEventListener(
        'pointerdown',
        handleDown
      );

      window.removeEventListener(
        'pointerup',
        handleUp
      );

      window.removeEventListener(
        'pointercancel',
        handleUp
      );

      document.removeEventListener(
        'pointerout',
        handleLeave
      );

      window.removeEventListener(
        'blur',
        hideCursor
      );

      window.removeEventListener(
        'resize',
        resize
      );

      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <>
      {/* ==================================
          GLOBAL CURSOR STYLES
      ================================== */}

      <GlobalStyles
        styles={{
          '@media (hover: hover) and (pointer: fine)': {
            'html.comet-cursor-active, html.comet-cursor-active body, html.comet-cursor-active body *': {
              cursor: 'none !important',
            },

            'html.comet-cursor-active canvas': {
              cursor: 'auto !important',
            },

            'html.comet-cursor-active :is([data-cursor="grab"], [draggable="true"], .swiper, .embla__viewport, .keen-slider), html.comet-cursor-active :is([data-cursor="grab"], [draggable="true"], .swiper, .embla__viewport, .keen-slider) *': {
              cursor: 'none !important',
            },

            'html.comet-cursor-active body :is(input, textarea, [contenteditable="true"])': {
              cursor: 'text !important',
            },

            'html.comet-cursor-active body :is(select, [data-native-cursor="true"], [data-native-cursor="true"] *)': {
              cursor: 'auto !important',
            },
          },
        }}
      />

      {/* ==================================
          COMET PARTICLE CANVAS
      ================================== */}

      <Box
        component="canvas"
        ref={canvasRef}
        aria-hidden="true"
        sx={{
          position: 'fixed',
          inset: 0,

          width: '100%',
          height: '100%',

          pointerEvents: 'none',

          zIndex: 99998,

          '@media (hover: none), (pointer: coarse)': {
            display: 'none',
          },
        }}
      />

      {/* ==================================
          CUSTOM CURSOR
      ================================== */}

      <Box
        ref={cursorRef}
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,

          width: 34,
          height: 38,

          pointerEvents: 'none',

          zIndex: 99999,

          opacity: 0,

          transform:
            'translate3d(-100px, -100px, 0)',

          transition: 'opacity .12s ease',

          // BASE ICON STYLE

          '& .cursor-icon': {
            position: 'absolute',
            top: 0,
            left: 0,

            width: 30,
            height: 36,

            display: 'none',

            color: '#fff',

            transformOrigin: 'center',

            transition:
              'transform .15s ease, filter .15s ease',

            filter: `
              drop-shadow(0 0 4px rgba(255,255,255,.7))
              drop-shadow(0 0 9px rgba(255,255,255,.25))
            `,
          },

          // DEFAULT ARROW

          '& .cursor-arrow': {
            display: 'block',
          },

          // ARROW HOVER

          '&.is-hover .cursor-arrow': {
            transform: 'scale(1.25)',

            filter: `
              drop-shadow(0 0 7px rgba(255,255,255,.95))
              drop-shadow(0 0 15px rgba(255,255,255,.5))
            `,
          },

          // NORMAL CLICK

          '&.is-click .cursor-arrow': {
            transform: 'scale(.85)',
          },

          // HIDE ARROW IN GRAB MODE

          '&.is-grab .cursor-arrow, &.is-grabbing .cursor-arrow': {
            display: 'none',
          },

          // HAND ICON SIZE

          '& .cursor-grab, & .cursor-grabbing': {
            width: 30,
            height: 30,
            top: 3,
          },

          // OPEN HAND

          '&.is-grab .cursor-grab': {
            display: 'block',

            filter: `
              drop-shadow(0 0 6px rgba(255,255,255,.6))
            `,
          },

          // CLOSED HAND

          '&.is-grabbing .cursor-grabbing': {
            display: 'block',

            transform: 'scale(.85)',

            filter: `
              drop-shadow(0 0 10px rgba(255,255,255,.85))
            `,
          },

          // MOBILE DISABLED

          '@media (hover: none), (pointer: coarse)': {
            display: 'none',
          },

          // ACCESSIBILITY

          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',

            '& .cursor-icon': {
              transition: 'none',
            },
          },
        }}
      >
        {/* DEFAULT COMET ARROW */}

        <svg
          className="cursor-icon cursor-arrow"
          viewBox="0 0 32 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 2.5V28L9.6 21.6L15 33L20.6 30.3L15.2 19.5L27 18.1Z"
            fill="white"
            stroke="#080808"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>

        {/* GRAB - OPEN HAND */}

        <PanToolOutlinedIcon
          className="cursor-icon cursor-grab"
        />

        {/* GRABBING - CLOSED HAND */}

        <PanToolIcon
          className="cursor-icon cursor-grabbing"
        />
      </Box>
    </>
  );
};

export default CosmicCursor;
