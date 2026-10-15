import { Box, Typography, } from '@mui/material';
import { useEffect, useRef, useState, } from 'react';
import { motion, } from 'framer-motion';

import SkillOrbit from './SkillOrbit';
import star from '../../assets/images/star.png';
import StarWarpCanvas from './StarWarpCanvas';

const clamp = (value, min = 0, max = 1) => {
  return Math.min(Math.max(value, min), max);
};

const SkillsSection = () => {

  const sectionRef = useRef(null);

  const [scrollProgress, setScrollProgress] =
    useState(0);


  useEffect(() => {

    let frameId = null;

    const updateScroll = () => {

      const section =
        sectionRef.current;

      if (!section) return;

      // setScrollProgress(1);


      const rect =
        section.getBoundingClientRect();

      const scrollableDistance =
        section.offsetHeight -
        window.innerHeight;

      if (scrollableDistance <= 0) {
        return;
      }

      /*
        Saat section pertama masuk:
        progress = 0

        Saat sudah scroll sampai bawah:
        progress = 1
      */

      const progress =
        clamp(
          -rect.top /
          scrollableDistance
        );

      setScrollProgress(progress);
    };


    const handleScroll = () => {

      if (frameId) {
        cancelAnimationFrame(
          frameId
        );
      }

      frameId =
        requestAnimationFrame(
          updateScroll
        );
    };


    updateScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      handleScroll
    );


    return () => {

      if (frameId) {
        cancelAnimationFrame(
          frameId
        );
      }

      window.removeEventListener(
        'scroll',
        handleScroll
      );

      window.removeEventListener(
        'resize',
        handleScroll
      );
    };

  }, []);


  // ==========================================
  // ZOOM PROGRESS
  // ==========================================

  /*
    0% - 15%
    hanya bintang

    15% - 70%
    orbit mulai zoom

    70% - 100%
    orbit sudah ukuran normal
  */

  const zoomProgress =
    clamp(
      (scrollProgress - 0.15) /
      0.55
    );


  /*
    ukuran awal 12%
    ukuran akhir 100%
  */

  const easedZoom =
    1 -
    Math.pow(
      1 - zoomProgress,
      3
    );

  const orbitScale =
    0.08 +
    easedZoom * 0.92;


  // ==========================================
  // OPACITY
  // ==========================================

  const orbitOpacity =
    clamp(
      (scrollProgress - 0.17) /
      0.25
    );


  // Title muncul sedikit lebih cepat
  const titleProgress =
    clamp(
      (scrollProgress - 0.08) /
      0.25
    );


  const titleTranslateY =
    30 -
    titleProgress * 30;


  return (
    <Box
      ref={sectionRef}

      component="section"

      sx={{
        position: 'relative',

        height: {
          xs: '180vh',
          md: '210vh',
        },

        backgroundColor: '#000',

        color: '#fff',
      }}
    >

      {/* =====================================
          STICKY VIEWPORT
      ====================================== */}

      <Box
        sx={{
          position: 'sticky',

          top: 0,

          width: '100%',
          height: {
            xs: '85vh',
            md: '100vh',
          },

          overflow: 'hidden',

          display: 'flex',

          flexDirection: 'column',

          alignItems: 'center',

          justifyContent: 'center',
        }}
      >


        {/* =====================================
            STAR BACKGROUND
        ====================================== */}

        <Box
          component="img"
          src={star}
          alt="Star background"

          sx={{
            position: 'absolute',

            inset: 0,

            width: '100%',
            height: '100%',

            objectFit: 'cover',

            zIndex: 0,

            pointerEvents: 'none',

            userSelect: 'none',
          }}
        />


        {/* Optional dark overlay */}

        <Box
          sx={{
            position: 'absolute',

            inset: 0,

            background:
              'rgba(0,0,0,0.15)',

            zIndex: 1,

            pointerEvents: 'none',
          }}
        />

        {/* =====================================
    CINEMATIC STAR WARP
====================================== */}

        <StarWarpCanvas
          progress={scrollProgress}
        />


        {/* =====================================
            TITLE
        ====================================== */}

        <Box
          sx={{
            position: 'absolute',

            top: {
              xs: '8%',
              md: '6%',
            },

            zIndex: 10,

            textAlign: 'center',

            opacity:
              titleProgress,

            transform: `
              translateY(
                ${titleTranslateY}px
              )
            `,

            willChange:
              'transform, opacity',
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: 16,
                md: 24,
              },

              fontWeight: 800,

              letterSpacing: 1.5,

              mb: 0.5,
            }}
          >
            MY SKILLS
          </Typography>


          <Typography
            component="h2"

            sx={{
              fontSize: {
                xs: 27,
                md: 40,
              },

              fontWeight: 900,

              lineHeight: 1.1,

              textAlign: 'center',
            }}
          >
            WEB DEVELOPMENT & DESIGN
          </Typography>

        </Box>


        {/* =====================================
            ZOOMING SKILL ORBIT
        ====================================== */}

        <Box
          sx={{
            position: 'relative',

            zIndex: 5,

            opacity:
              orbitOpacity,

            transform: `
              scale(${orbitScale})
            `,

            transformOrigin:
              'center center',

            willChange:
              'transform, opacity',

            mt: {
              xs: 5,
              md: 10,
            },
          }}
        >

          <SkillOrbit />

        </Box>


        {/* =====================================
            OPTIONAL SCROLL HINT
        ====================================== */}

        <Typography
          component={motion.div} // 1. Ubah elemen menjadi motion component
          animate={{
            y: [0, -10, 0], // Efek melayang naik turun sejauh 10px
          }}
          transition={{
            duration: 3,          // Durasi satu siklus melayang (3 detik)
            ease: "easeInOut",    // Transisi halus saat berbalik arah
            repeat: Infinity,     // Mengulang animasi selamanya
          }}
          sx={{
            position: 'absolute',

            // 2. Kunci utama untuk menaruh elemen tepat di tengah layar secara vertikal & horizontal
            top: '50%',
            // left: '50%',
            // transform: 'translate(-50%, -50%)',

            zIndex: 10,
            fontSize: '24px', // Terkunci di 11px
            letterSpacing: 2,
            textAlign: 'center',
            whiteSpace: 'nowrap', // Mencegah teks patah menjadi 2 baris saat di tengah

            opacity: 1 - clamp(scrollProgress / 0.15),
            color: 'rgba(255,255,255,.65)',
            transition: 'opacity .15s linear',
          }}
        >
          SCROLL TO EXPLORE
        </Typography>

      </Box>

    </Box>
  );
};

export default SkillsSection;
