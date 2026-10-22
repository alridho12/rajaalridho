import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Lottie } from 'lottie-react';
import { motion } from 'framer-motion';

import alien from '../../assets/videos/alien.mp4';
import star from '../../assets/images/star.png';
import land from '../../assets/images/land.png';
import astronautAnimation from '../../assets/lottie/astronaut.json';
import ufoAnimation from '../../assets/lottie/ufo.json';

const SENSITIVITY = 0.8;

const HeroArtwork = () => {
  const videoRef = useRef(null);

  const prevXRef = useRef(null);
  const targetTimeRef = useRef(0);

  const isSeekingRef = useRef(false);

  // ==========================================
  // SEEK VIDEO
  // ==========================================
  const seekToTarget = () => {
    const video = videoRef.current;

    if (!video) return;

    const duration = video.duration;

    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const target = Math.max(
      0,
      Math.min(targetTimeRef.current, duration)
    );

    // Hindari seek yang sebenarnya tidak perlu
    if (Math.abs(video.currentTime - target) < 0.001) {
      return;
    }

    isSeekingRef.current = true;

    video.currentTime = target;
  };

  // ==========================================
  // MOUSE MOVEMENT
  // ==========================================
  useEffect(() => {
    const handleMouseMove = (event) => {
      const video = videoRef.current;

      if (!video) return;

      const duration = video.duration;

      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const currentX = event.clientX;

      // Mouse pertama hanya untuk menyimpan posisi awal
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;

      prevXRef.current = currentX;

      // Rumus:
      // delta mouse / lebar layar
      // × sensitivity
      // × durasi video
      const timeOffset =
        (delta / window.innerWidth) *
        SENSITIVITY *
        duration;

      const nextTarget =
        targetTimeRef.current + timeOffset;

      // Clamp agar tidak melewati awal / akhir video
      targetTimeRef.current = Math.max(
        0,
        Math.min(nextTarget, duration)
      );

      // Jangan melakukan seek baru
      // selama seek sebelumnya belum selesai
      if (!isSeekingRef.current) {
        seekToTarget();
      }
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  // ==========================================
  // VIDEO METADATA READY
  // ==========================================
  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    // Pastikan video berhenti
    video.pause();

    targetTimeRef.current = video.currentTime;
  };

  // ==========================================
  // SEEK FINISHED
  // ==========================================
  const handleSeeked = () => {
    const video = videoRef.current;

    if (!video) return;

    isSeekingRef.current = false;

    const difference = Math.abs(
      video.currentTime - targetTimeRef.current
    );

    // Selama proses seek, mouse mungkin sudah bergerak
    // lagi. Kalau target berubah, lakukan seek berikutnya.
    if (difference > 0.001) {
      seekToTarget();
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,

        width: '100%',
        height: '100%',

        overflow: 'hidden',

        pointerEvents: 'auto',

        zIndex: 1,
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

          zIndex: 1,
        }}
      />

      {/* =====================================
          ALIEN INTERACTIVE VIDEO
      ====================================== */}
      <Box
        ref={videoRef}
        component="video"
        src={alien}

        muted
        playsInline
        preload="auto"

        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}

        sx={{
          position: 'absolute',

          // PERBAIKAN: Membuat posisi horizontal berada di tengah untuk mobile
          left: {
            xs: '75%',      // Dorong ke tengah (50% dari lebar layar) saat mobile
            md: '50%',
            lg: 'auto',
            xl: 'auto',     // Reset ke default saat desktop
          },
          right: {
            xs: 'auto',     // Nonaktifkan right saat mobile
            md: 'auto',
            lg: '6%',      // Kembali ke posisi kanan asli saat desktop
            xl: '21%',      // Kembali ke posisi kanan asli saat desktop
          },
          transform: {
            xs: 'translateX(-50%)', // Geser kembali setengah lebar video agar presisi di tengah
            md: 'translateX(-50%)',            // Matikan transform saat desktop
            lg: 'none',      // Kembalikan ke posisi default saat desktop
            xl: 'none',      // Kembalikan ke posisi default saat desktop
          },

          bottom: {
            xs: '6%',
            sm: '12%',
            md: '10%',
            lg: '24%',
            xl: '24%',
          },

          width: {
            xs: '215px',
            sm: '336px',
            md: '353px',
            lg: '390px',
            xl: '440px',
          },

          height: 'auto',

          objectFit: 'contain',

          zIndex: 2,
        }}
      />

      {/* =====================================
          LAND / MOON FOREGROUND
      ====================================== */}
      <Box
        component="img"
        src={land}
        alt="Moon land"
        sx={{
          position: 'absolute',

          left: 0,
          bottom: {
            xs: -20,
            md: -40,
            xl: -130
          },

          width: '100%',

          objectFit: 'cover',

          zIndex: 3,
        }}
      />
      {/* =====================================
          UFO LOTTIE
      ====================================== */}
      <Box
        component={motion.div}
        drag
        dragMomentum={false}
        dragElastic={0.2}
        dragSnapToOrigin // ✨ Otomatis kembali ke posisi asal secara native saat dilepas
        dragTransition={{
          type: 'spring',
          stiffness: 35,
          damping: 12,
          mass: 1.2,
        }}
        data-cursor="grab"

        // Menggunakan state visual bawaan Framer Motion untuk mengubah kursor
        whileHover={{ cursor: 'grab' }}
        whileTap={{ scale: 1.05, cursor: 'grabbing' }}

        // Menggunakan sistem Variant untuk memisahkan animasi Mengambang vs Sedang Ditarik
        variants={{
          floating: {
            y: [0, -12, 0],
            rotate: [-2, 2, -2],
            transition: {
              duration: 5,
              ease: 'easeInOut',
              repeat: Infinity,
            }
          },
          dragged: {
            y: 0,
            rotate: 0,
            transition: { duration: 0.1 }
          }
        }}
        animate="floating"   // Mainkan animasi mengambang secara default
        whileDrag="dragged"  // Otomatis matikan efek mengambang saat mulai diseret/di-drag

        sx={{
          position: 'absolute',
          top: {
            xs: '2%',
            md: '10%',
            lg: '13%',
          },
          left: {
            xs: '5%',
            md: '10%',
            lg: '44%',
          },
          width: {
            xs: 90,
            md: 250,
            lg: 250,
          },
          zIndex: 5,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <Lottie
          src={ufoAnimation}
          autoplay
          loop
          style={{
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      {/* =====================================
          ASTRONAUT LOTTIE
      ====================================== */}
      <Box
        component={motion.div}
        drag
        dragMomentum={false}
        dragElastic={0.2}
        dragSnapToOrigin // ✨ Fitur otomatis Framer Motion untuk kembali ke posisi asal saat dilepas
        dragTransition={{
          type: 'spring',
          stiffness: 35,
          damping: 12,
          mass: 1.2,
        }}
        data-cursor="grab"

        // Menggunakan internal state hover/tap bawaan framer motion untuk kursor
        whileHover={{ cursor: 'grab' }}
        whileTap={{ scale: 1.05, cursor: 'grabbing' }}

        // Kita buat sistem Variant untuk memisahkan kondisi Mengambang vs Sedang Ditarik
        variants={{
          floating: {
            y: [0, -18, 0],
            rotate: [-4, 4, -4],
            transition: {
              duration: 4,
              ease: 'easeInOut',
              repeat: Infinity,
            }
          },
          dragged: {
            y: 0,
            rotate: 0,
            transition: { duration: 0.1 }
          }
        }}
        // Saat pertama kali muncul dan selama tidak ditarik, mainkan animasi 'floating'
        animate="floating"
        // Saat mulai di-drag, otomatis ubah animasi internal menjadi 'dragged' (mematikan efek floating)
        whileDrag="dragged"

        sx={{
          position: 'absolute',
          top: {
            xs: '70%',
            md: '72%',
            lg: '74%',
            xl: '70%',
          },
          left: {
            xs: '18%',
            sm: '18%',
            md: '77%',
            lg: '85%',
          },
          width: {
            xs: 65,
            md: 150,
            lg: 150,
          },
          zIndex: 4,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <Lottie
          src={astronautAnimation}
          autoplay
          loop
          style={{
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroArtwork;
