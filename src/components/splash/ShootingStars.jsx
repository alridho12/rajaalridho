
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ShootingStars = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frameId;
    let lastTime = 0;
    let spawnTimer = 0;

    let stars = [];
    let meteors = [];

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.2,
        opacity: Math.random() * 0.7 + 0.25,
      }));
    };

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 1.2,
        y: Math.random() * height * 0.65,
        length: 70 + Math.random() * 110,
        speed: 300 + Math.random() * 230,
        age: 0,
      });
    };

    const animate = (timestamp) => {
      const delta = lastTime
        ? Math.min((timestamp - lastTime) / 1000, 0.05)
        : 0;

      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      // Static scattered stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(
          star.x,
          star.y,
          star.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
      });

      // Periodically spawn shooting stars
      spawnTimer += delta;

      if (spawnTimer > 0.75) {
        createMeteor();
        spawnTimer = 0;
      }

      // Move and draw shooting stars
      meteors = meteors.filter((meteor) => {
        meteor.age += delta;
        meteor.x -= meteor.speed * delta;
        meteor.y += meteor.speed * 0.42 * delta;

        const alpha = Math.max(
          0,
          Math.min(1, meteor.age * 5) *
          Math.min(1, (1.3 - meteor.age) * 4)
        );

        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x + meteor.length,
          meteor.y - meteor.length * 0.42
        );

        gradient.addColorStop(
          0,
          `rgba(255,255,255,${alpha})`
        );
        gradient.addColorStop(
          1,
          'rgba(255,255,255,0)'
        );

        ctx.beginPath();

        ctx.moveTo(
          meteor.x + meteor.length,
          meteor.y - meteor.length * 0.42
        );

        ctx.lineTo(meteor.x, meteor.y);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Bright meteor head
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        return meteor.age < 1.3;
      });

      frameId = requestAnimationFrame(animate);
    };

    resize();

    window.addEventListener('resize', resize);

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ShootingStars;
