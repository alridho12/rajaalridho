
import { useEffect, useState } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { keyframes } from '@emotion/react';

import { Lottie } from 'lottie-react';

import ShootingStars from './ShootingStars';

import ufoAnimation from '../../assets/lottie/ufo.json';
import moon from '../../assets/images/moon-splash.png';

const LOADING_DURATION = 3200;

// ==========================================
// CINEMATIC ANIMATIONS
// ==========================================

const moonReveal = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
    filter: grayscale(1) brightness(0.2) blur(12px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: grayscale(1) brightness(0.7) contrast(1.3);
  }
`;

const textReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const orbitReveal = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const orbitGlow = keyframes`
  0%, 100% {
    opacity: 0.65;
  }

  50% {
    opacity: 1;
  }
`;

const ufoFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(-4deg);
  }

  50% {
    transform: translateY(-12px) rotate(3deg);
  }
`;

const flarePulse = keyframes`
  0%, 100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(0.8);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

// ==========================================
// SPLASH SCREEN
// ==========================================

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  // ========================================
  // LOADING
  // ========================================

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    let frameId;
    let finishTimer;

    const startTime = performance.now();

    const updateLoading = (now) => {
      const ratio = Math.min(
        (now - startTime) / LOADING_DURATION,
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

  // ========================================
  // EXIT ANIMATION
  // ========================================

  useEffect(() => {
    if (!isLeaving) return;

    const timer = window.setTimeout(() => {
      onComplete?.();
    }, 650);

    return () => clearTimeout(timer);
  }, [isLeaving, onComplete]);

  // ========================================
  // SHARED ORBIT STYLE
  // ========================================

  const orbitStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',

    width: '98%',
    height: '52%',

    border: '2px solid rgba(255,255,255,.85)',
    borderRadius: '50%',

    transform:
      'translate(-50%, -50%) rotate(-13deg)',

    boxShadow:
      '0 0 12px rgba(255,255,255,.4)',

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

        overflow: 'hidden',
        zIndex: 20000,

        opacity: isLeaving ? 0 : 1,

        transform: isLeaving
          ? 'scale(1.035)'
          : 'scale(1)',

        transition:
          'opacity 650ms ease, transform 650ms ease',

        '@media (prefers-reduced-motion: reduce)': {
          '& .splash-motion': {
            animation: 'none',
          },
        },
      }}
    >
      {/* =====================================
          STARFIELD
      ====================================== */}

      <ShootingStars />

      {/* SOFT BACKGROUND GLOW */}

      <Box
        sx={{
          position: 'absolute',

          left: '50%',
          top: '45%',

          transform: 'translate(-50%, -50%)',

          width: {
            xs: 420,
            md: 900,
          },

          height: {
            xs: 420,
            md: 900,
          },

          background:
            'radial-gradient(circle, rgba(255,255,255,.055), transparent 65%)',

          pointerEvents: 'none',
        }}
      />

      {/* =====================================
          MAIN SPACE COMPOSITION
      ====================================== */}

      <Box
        sx={{
          position: 'absolute',

          left: '50%',

          top: {
            xs: '44%',
            md: '46%',
          },

          transform: 'translate(-50%, -50%)',

          width: {
            xs: '96vw',
            md: 'min(94vw, 1080px)',
          },

          height: {
            xs: 'min(82vw, 380px)',
            sm: 520,
            md: 620,
          },

          maxWidth: '100%',
        }}
      >
        {/* ==================================
            ORBIT BEHIND MOON
        ================================== */}

        <Box
          className="splash-motion"
          sx={{
            position: 'absolute',
            inset: 0,

            zIndex: 1,

            animation:
              `${orbitReveal} 1.4s ease .2s both`,
          }}
        >
          <Box sx={orbitStyle} />
        </Box>

        {/* ==================================
            MOON
        ================================== */}

        <Box
          component="img"
          className="splash-motion"

          src={moon}
          alt="Monochrome moon"

          sx={{
            position: 'absolute',

            left: '50%',
            top: '50%',

            width: {
              xs: '68%',
              sm: 420,
              md: 570,
            },

            maxWidth: 570,

            aspectRatio: '1',
            objectFit: 'contain',

            transform: 'translate(-50%, -50%)',

            filter:
              'grayscale(1) brightness(.7) contrast(1.3)',

            animation:
              `${moonReveal} 1.6s cubic-bezier(.22,1,.36,1) both`,

            pointerEvents: 'none',

            zIndex: 2,
          }}
        />

        {/* DARK CENTER FOR TEXT READABILITY */}

        <Box
          sx={{
            position: 'absolute',

            left: '50%',
            top: '54%',

            transform: 'translate(-50%, -50%)',

            width: '85%',
            height: '50%',

            background:
              'radial-gradient(ellipse, rgba(0,0,0,.72), rgba(0,0,0,.35) 50%, transparent 78%)',

            pointerEvents: 'none',

            zIndex: 3,
          }}
        />

        {/* ==================================
            ORBIT IN FRONT OF MOON
        ================================== */}

        <Box
          className="splash-motion"

          sx={{
            position: 'absolute',
            inset: 0,

            zIndex: 4,

            animation:
              `${orbitReveal} 1.4s ease .35s both`,
          }}
        >
          <Box
            sx={{
              ...orbitStyle,

              clipPath: 'inset(50% 0 0 0)',

              borderColor: '#fff',

              boxShadow:
                '0 0 15px rgba(255,255,255,.55)',
            }}
          />
        </Box>

        {/* ==================================
            ORBIT LIGHT FLARE
        ================================== */}

        <Box
          className="splash-motion"

          sx={{
            position: 'absolute',

            right: '1%',
            top: '47%',

            width: 8,
            height: 8,

            borderRadius: '50%',
            backgroundColor: '#fff',

            boxShadow: `
              0 0 12px 5px rgba(255,255,255,.75),
              0 0 30px 10px rgba(255,255,255,.25)
            `,

            animation:
              `${flarePulse} 3s ease-in-out infinite`,

            zIndex: 5,

            pointerEvents: 'none',

            '&::before': {
              content: '""',

              position: 'absolute',

              left: '50%',
              top: '50%',

              transform: 'translate(-50%, -50%)',

              width: 80,
              height: 1,

              background:
                'linear-gradient(90deg, transparent, #fff, transparent)',
            },

            '&::after': {
              content: '""',

              position: 'absolute',

              left: '50%',
              top: '50%',

              transform: 'translate(-50%, -50%)',

              width: 1,
              height: 70,

              background:
                'linear-gradient(180deg, transparent, #fff, transparent)',
            },
          }}
        />

        {/* ==================================
            UFO LOTTIE
        ================================== */}

        <Box
          className="splash-motion"

          sx={{
            position: 'absolute',

            top: {
              xs: '4%',
              md: '12%',
            },

            right: {
              xs: '2%',
              md: '9%',
            },

            width: {
              xs: 90,
              sm: 135,
              md: 170,
            },

            aspectRatio: '1',

            zIndex: 6,

            pointerEvents: 'none',

            animation:
              `${ufoFloat} 4s ease-in-out infinite`,
          }}
        >
          <Lottie
            animationData={ufoAnimation}
            autoplay
            loop

            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>

        {/* ==================================
            ORBIT TYPOGRAPHY
        ================================== */}

        <Box
          sx={{
            position: 'absolute',

            left: '50%',
            top: '54%',

            transform: 'translate(-50%, -50%)',

            width: '100%',

            px: {
              xs: 1,
              md: 3,
            },

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            textAlign: 'center',

            zIndex: 8,
          }}
        >
          {/* MAIN TITLE */}

          <Typography
            component="h1"
            className="splash-motion"

            sx={{
              fontFamily: 'Ethnocentric',

              fontSize: {
                xs: 'clamp(22px, 6.7vw, 45px)',
                sm: 'clamp(40px, 6vw, 64px)',
                md: 'clamp(60px, 5.2vw, 82px)',
              },

              fontWeight: 400,

              lineHeight: 1.15,

              letterSpacing: '-0.055em',

              whiteSpace: 'nowrap',

              color: '#fff',

              textShadow: `
                0 3px 12px #000,
                0 0 25px rgba(255,255,255,.2)
              `,

              animation:
                `${textReveal} 1s cubic-bezier(.22,1,.36,1) .3s both`,
            }}
          >
            RAJA AL RIDHO
          </Typography>

          {/* ==================================
              WELCOME ORBIT LABEL
          ================================== */}

          <Box
            className="splash-motion"

            sx={{
              position: 'relative',

              mt: {
                xs: 1.2,
                md: 2,
              },

              px: {
                xs: 2,
                md: 4,
              },

              py: {
                xs: 0.8,
                md: 1.2,
              },

              maxWidth: '94%',

              borderTop:
                '1px solid rgba(255,255,255,.6)',

              borderBottom:
                '1px solid rgba(255,255,255,.6)',

              backgroundColor:
                'rgba(0,0,0,.88)',

              backdropFilter: 'blur(8px)',

              boxShadow:
                '0 0 18px rgba(0,0,0,.8)',

              animation:
                `${textReveal} .9s cubic-bezier(.22,1,.36,1) .65s both`,

              '&::before, &::after': {
                content: '""',

                position: 'absolute',

                top: '50%',

                width: {
                  xs: 10,
                  md: 24,
                },

                height: 1,

                backgroundColor:
                  'rgba(255,255,255,.7)',
              },

              '&::before': {
                left: {
                  xs: -12,
                  md: -26,
                },
              },

              '&::after': {
                right: {
                  xs: -12,
                  md: -26,
                },
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',

                fontSize: {
                  xs: 'clamp(7px, 2vw, 10px)',
                  md: 12,
                },

                fontWeight: 700,

                letterSpacing: {
                  xs: '0.1em',
                  md: '0.28em',
                },

                color: '#fff',

                whiteSpace: 'nowrap',
              }}
            >
              BEYOND CODE & DESIGN
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* =====================================
          CIRCULAR LOADING
      ====================================== */}

      <Box
        sx={{
          position: 'absolute',

          left: '50%',

          bottom: {
            xs: '11%',
            md: '7%',
          },

          transform: 'translateX(-50%)',

          width: {
            xs: 76,
            md: 88,
          },

          height: {
            xs: 76,
            md: 88,
          },

          borderRadius: '50%',

          background: `
            conic-gradient(
              #fff ${progress * 3.6}deg,
              rgba(255,255,255,.15) 0deg
            )
          `,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          boxShadow:
            '0 0 18px rgba(255,255,255,.08)',

          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: '93%',
            height: '93%',

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

              fontSize: 12,
              fontWeight: 700,

              letterSpacing: 1.5,

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
