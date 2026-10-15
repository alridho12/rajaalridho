
import {
  Box,
  Container,
  Stack,
  Typography,
} from '@mui/material';

import { useRef } from 'react';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import ProjectCard from './ProjectCard';

import { projects } from '../../data/projects';

import star from '../../assets/images/star.png';

const EASE = [0.22, 1, 0.36, 1];

const ProjectsSection = () => {
  const sectionRef = useRef(null);

  const reducedMotion = useReducedMotion();

  // ==========================================
  // BACKGROUND STAR PARALLAX
  // ==========================================

  const { scrollYProgress } = useScroll({
    target: sectionRef,

    offset: [
      'start end',
      'end start',
    ],
  });

  const starY = useTransform(
    scrollYProgress,
    [0, 1],
    [-50, 50]
  );

  // ==========================================
  // REUSABLE CINEMATIC REVEAL
  // ==========================================

  const reveal = (delay = 0, y = 50) => ({
    initial: {
      opacity: 0,

      y: reducedMotion ? 0 : y,

      filter: reducedMotion
        ? 'blur(0px)'
        : 'blur(10px)',
    },

    whileInView: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },

    viewport: {
      once: false,
      amount: 0.2,
    },

    transition: {
      duration: reducedMotion ? 0.2 : 0.95,

      delay: reducedMotion ? 0 : delay,

      ease: EASE,
    },
  });

  return (
    <Box
      ref={sectionRef}
      component="section"
      id="projects"

      sx={{
        position: 'relative',
        minHeight: '100vh',

        backgroundColor: '#000',
        color: '#fff',

        overflow: 'hidden',

        pt: {
          xs: 0,
          md: 10,
        },

        pb: {
          xs: 0,
          md: 0,
        },
      }}
    >
      {/* =====================================
          PARALLAX STAR BACKGROUND
      ====================================== */}

      <Box
        component={motion.img}

        src={star}
        alt=""
        aria-hidden="true"

        style={{
          y: reducedMotion ? 0 : starY,
        }}

        sx={{
          position: 'absolute',

          top: -60,
          left: 0,

          width: '100%',
          height: 'calc(100% + 120px)',

          objectFit: 'cover',

          opacity: 0.18,

          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* =====================================
          BACKGROUND GLOW
      ====================================== */}

      <Box
        sx={{
          position: 'absolute',

          width: {
            xs: 400,
            md: 800,
          },

          height: {
            xs: 400,
            md: 800,
          },

          top: 0,
          left: '50%',

          transform: 'translateX(-50%)',

          background:
            'radial-gradient(circle, rgba(255,255,255,.07), transparent 65%)',

          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="xl"

        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* =====================================
            SECTION LABEL REVEAL
        ====================================== */}

        <Stack
          component={motion.div}

          {...reveal(0.05, 25)}

          direction="row"
          alignItems="center"
          spacing={2}
          mb={4}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            PROJECTS
          </Typography>

          <Box
            sx={{
              width: 60,
              height: '1px',

              backgroundColor:
                'rgba(255,255,255,.45)',
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: 2,

              color:
                'rgba(255,255,255,.45)',
            }}
          >
            02
          </Typography>
        </Stack>

        {/* =====================================
            HEADER
        ====================================== */}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md: '1.6fr .8fr',
            },

            gap: {
              xs: 3,
              md: 10,
            },

            alignItems: 'end',

            mb: {
              xs: 10,
              md: 16,
            },
          }}
        >
          {/* MAIN TITLE */}

          <Typography
            component={motion.h2}

            {...reveal(0.12, 75)}

            sx={{
              fontSize: {
                xs: '56px',
                sm: '72px',
                md: '110px',
              },

              fontWeight: 900,

              lineHeight: 0.78,

              letterSpacing: {
                xs: '-2px',
                md: '-5px',
              },
            }}
          >
            SELECTED
            <br />
            PROJECTS.
          </Typography>

          {/* DESCRIPTION */}

          <Typography
            component={motion.p}

            {...reveal(0.28, 40)}

            sx={{
              maxWidth: 350,

              pb: {
                md: 1,
              },

              fontSize: 14,
              lineHeight: 1.7,

              color:
                'rgba(255,255,255,.55)',
            }}
          >
            A selection of digital
            products, interfaces and
            development work where design
            and technology meet.
          </Typography>
        </Box>

        {/* =====================================
            CINEMATIC PROJECT LIST
        ====================================== */}

        <Box>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
