
import { useEffect, useState } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { Lottie } from 'lottie-react';

import ShootingStars from './ShootingStars';

import ufoAnimation from '../../assets/lottie/ufo.json';

import moon from '../../assets/images/moon-splash.png';

const LOADING_DURATION = 3200;

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  // ==========================================
  // JAVASCRIPT LOADING
  // ==========================================

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    let frameId;
    let finishTimer;

    const startTime = performance.now();

    const updateLoading = (now) => {
      const elapsed = now - startTime;

      const ratio = Math.min(
        elapsed / LOADING_DURATION,
        1
      );

      setProgress(Math.round(ratio * 100));

      if (ratio < 1) {
        frameId = requestAnimationFrame(updateLoading);
      } else {
        finishTimer = window.setTimeout(() => {
          setIsLeaving(true);
        }, 350);
      }
    };

    frameId = requestAnimationFrame(updateLoading);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(finishTimer);

      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // ==========================================
  // EXIT SPLASH
  // ==========================================

  useEffect(() => {
    if (!isLeaving) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 650);

    return () => clearTimeout(timer);
  }, [isLeaving, onComplete]);

  // ==========================================
  // STYLES
  // ==========================================

  const ringStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '95%',
    height: '49%',
    border: '2px solid rgba(255,255,255,0.7)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) rotate(-13deg)',
    boxShadow: '0 0 12px rgba(255,255,255,0.17)',
    pointerEvents: 'none',
  };

  return (
    <Box
      role="status"
      aria-label="Loading portfolio"
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100dvh',
        backgroundColor: '#000',
        color: '#fff',
        zIndex: 20000,
        overflow: 'hidden',

        opacity: isLeaving ? 0 : 1,
        transform: isLeaving
          ? 'scale(1.035)'
          : 'scale(1)',

        transition:
          'opacity 650ms ease, transform 650ms ease',
      }}
    >
      {/* =====================================
          STARFIELD AND SHOOTING STARS
      ====================================== */}

      <ShootingStars />

      {/* =====================================
          MOON AND ORBIT COMPOSITION
      ====================================== */}

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: {
            xs: '45%',
            md: '46%',
          },
          transform: 'translate(-50%, -50%)',

          width: {
            xs: '96vw',
            md: 960,
          },

          height: {
            xs: 350,
            md: 570,
          },

          maxWidth: '100%',
        }}
      >
        {/* ORBIT BEHIND MOON */}

        <Box
          sx={{
            ...ringStyle,
            zIndex: 2,
          }}
        />

        {/* MOON */}
        <Box
          component="img"
          src={moon}
          alt="Monochrome Moon"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',

            width: {
              xs: 245,
              sm: 350,
              md: 500,
            },

            aspectRatio: '1',
            objectFit: 'contain',
            filter: 'grayscale(1)',

            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* ORBIT IN FRONT OF MOON */}

        <Box
          sx={{
            ...ringStyle,
            zIndex: 4,

            clipPath: 'inset(51% 0 0 0)',

            borderColor: '#fff',

            boxShadow:
              '0 0 16px rgba(255,255,255,.35)',
          }}
        />

        {/* =====================================
            UFO LOTTIE
        ====================================== */}

        <Box
          sx={{
            position: 'absolute',

            top: {
              xs: '12%',
              md: '12%',
            },

            right: {
              xs: '1%',
              md: '10%',
            },

            width: {
              xs: 95,
              sm: 125,
              md: 170,
            },

            aspectRatio: '1',

            zIndex: 6,

            pointerEvents: 'none',

            animation:
              'ufoFloating 4s ease-in-out infinite',

            '@keyframes ufoFloating': {
              '0%, 100%': {
                transform:
                  'translateY(0px) rotate(-4deg)',
              },

              '50%': {
                transform:
                  'translateY(-14px) rotate(4deg)',
              },
            },

            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          <Lottie
            src={ufoAnimation}
            autoplay
            loop
          />
        </Box>

        {/* =====================================
            CENTER TYPOGRAPHY
        ====================================== */}

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            transform: 'translate(-50%, -50%)',

            width: '100%',
            textAlign: 'center',

            zIndex: 8,

            px: 1,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily:
                '"Arial Black", Impact, sans-serif',

              fontWeight: 900,

              fontSize:
                'clamp(28px, 7.2vw, 105px)',

              lineHeight: 1,

              letterSpacing: '-0.04em',

              color: '#fff',

              whiteSpace: 'nowrap',

              textShadow:
                '0px 5px 16px rgba(0,0,0,.85)',
            }}
          >
            RAJA AL RIDHO
          </Typography>

          <Typography
            sx={{
              mt: 1,

              fontFamily: 'monospace',

              fontSize: {
                xs: 9,
                sm: 12,
                md: 16,
              },

              letterSpacing: {
                xs: '0.2em',
                md: '0.5em',
              },

              color: 'rgba(255,255,255,.9)',

              textShadow:
                '0 2px 10px #000',
            }}
          >
            FROM IDEA TO INTERFACE
          </Typography>
        </Box>
      </Box>

      {/* =====================================
          JAVASCRIPT CIRCULAR LOADING
      ====================================== */}

      <Box
        sx={{
          position: 'absolute',

          left: '50%',

          bottom: {
            xs: '12%',
            md: '8%',
          },

          transform: 'translateX(-50%)',

          width: 88,
          height: 88,

          borderRadius: '50%',

          background: `
            conic-gradient(
              #ffffff ${progress * 3.6}deg,
              rgba(255,255,255,.17) 0deg
            )
          `,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          zIndex: 10,

          boxShadow:
            '0 0 18px rgba(255,255,255,.06)',
        }}
      >
        <Box
          sx={{
            width: 82,
            height: 82,

            borderRadius: '50%',

            backgroundColor: '#030303',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            sx={{
              fontFamily: 'monospace',

              fontSize: 13,

              letterSpacing: 2,

              fontWeight: 700,

              color: '#fff',
            }}
          >
            {progress}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SplashScreen;
