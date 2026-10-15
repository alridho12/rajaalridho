
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';

import NorthEastIcon from '@mui/icons-material/NorthEast';

import {
  motion,
  useReducedMotion,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const ProjectCard = ({ project, index }) => {
  const isRight = index % 2 !== 0;
  const reducedMotion = useReducedMotion();

  // ==========================================
  // CARD CINEMATIC REVEAL
  // ==========================================

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: reducedMotion
        ? 0
        : isRight
          ? 75
          : -75,
      y: reducedMotion ? 0 : 40,
    },

    visible: {
      opacity: 1,
      x: 0,
      y: 0,

      transition: {
        duration: reducedMotion ? 0.2 : 0.9,
        ease: EASE,

        staggerChildren: reducedMotion
          ? 0
          : 0.13,

        delayChildren: reducedMotion
          ? 0
          : 0.1,
      },
    },
  };

  // ==========================================
  // IMAGE REVEAL
  // ==========================================

  const imageVariants = {
    hidden: {
      opacity: 0,

      y: reducedMotion ? 0 : 45,

      clipPath: reducedMotion
        ? 'inset(0 0 0% 0)'
        : 'inset(0 0 100% 0)',
    },

    visible: {
      opacity: 1,
      y: 0,

      clipPath: 'inset(0 0 0% 0)',

      transition: {
        duration: reducedMotion ? 0.2 : 1.15,
        ease: EASE,
      },
    },
  };

  // ==========================================
  // TEXT REVEAL
  // ==========================================

  const textVariants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 30,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: reducedMotion ? 0.2 : 0.7,
        ease: EASE,
      },
    },
  };

  // ==========================================
  // TAGS STAGGER
  // ==========================================

  const tagsVariants = {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: reducedMotion
          ? 0
          : 0.07,
      },
    },
  };

  return (
    <Box
      component={motion.article}

      initial="hidden"
      whileInView="visible"

      viewport={{
        once: false,
        amount: 0.12,
      }}

      variants={cardVariants}

      sx={{
        width: {
          xs: '100%',
          md: '78%',
        },

        ml: {
          xs: 0,
          md: isRight ? 'auto' : 0,
        },

        mb: {
          xs: 10,
          md: 18,
        },
      }}
    >
      {/* =====================================
          PROJECT NUMBER
      ====================================== */}

      <Stack
        component={motion.div}
        variants={textVariants}

        direction="row"
        alignItems="center"
        spacing={2}
        mb={2}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
            color: 'rgba(255,255,255,.5)',
          }}
        >
          {project.id}
        </Typography>

        <Box
          sx={{
            width: 45,
            height: '1px',
            backgroundColor:
              'rgba(255,255,255,.35)',
          }}
        />

        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 2,
            color: 'rgba(255,255,255,.4)',
          }}
        >
          {project.year}
        </Typography>
      </Stack>

      {/* =====================================
          CINEMATIC IMAGE REVEAL
      ====================================== */}

      <Box
        component={motion.a}

        href={project.link}

        variants={imageVariants}

        sx={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',

          borderRadius: {
            xs: '18px',
            md: '28px',
          },

          border:
            '1px solid rgba(255,255,255,.3)',

          backgroundColor: '#111',

          cursor: 'pointer',

          '&:hover img': {
            transform: 'scale(1.055)',
            filter: 'grayscale(0)',
          },

          '&:hover .project-arrow': {
            transform:
              'translate(4px,-4px)',
          },

          '&:hover .project-overlay': {
            opacity: 0.12,
          },

          '&:hover .project-shine': {
            transform:
              'translateX(450%) skewX(-20deg)',
          },
        }}
      >
        {/* IMAGE */}

        <Box
          component="img"
          src={project.image}
          alt={project.title}

          sx={{
            width: '100%',

            aspectRatio: {
              xs: '4 / 3',
              md: '16 / 9',
            },

            display: 'block',
            objectFit: 'cover',

            filter: 'grayscale(.8)',

            transition:
              'transform .8s cubic-bezier(.22,1,.36,1), filter .6s ease',
          }}
        />

        {/* DARK OVERLAY */}

        <Box
          className="project-overlay"

          sx={{
            position: 'absolute',
            inset: 0,

            backgroundColor: '#000',
            opacity: 0.32,

            transition:
              'opacity .5s ease',

            pointerEvents: 'none',
          }}
        />

        {/* CINEMATIC LIGHT SWEEP */}

        <Box
          className="project-shine"

          sx={{
            position: 'absolute',

            top: '-30%',
            left: '-25%',

            width: '35%',
            height: '160%',

            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent)',

            transform:
              'translateX(-120%) skewX(-20deg)',

            transition:
              'transform 1.1s cubic-bezier(.22,1,.36,1)',

            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* TOP RIGHT ARROW */}

        <Box
          sx={{
            position: 'absolute',

            top: {
              xs: 15,
              md: 22,
            },

            right: {
              xs: 15,
              md: 22,
            },

            width: {
              xs: 45,
              md: 58,
            },

            height: {
              xs: 45,
              md: 58,
            },

            borderRadius: '50%',

            backgroundColor: '#fff',
            color: '#000',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            zIndex: 3,
          }}
        >
          <NorthEastIcon
            className="project-arrow"

            sx={{
              fontSize: {
                xs: 20,
                md: 26,
              },

              transition:
                'transform .3s ease',
            }}
          />
        </Box>
      </Box>

      {/* =====================================
          PROJECT INFO
      ====================================== */}

      <Box sx={{ mt: 3 }}>
        {/* STAGGERED TAGS */}

        <Stack
          component={motion.div}
          variants={tagsVariants}

          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          mb={2}
        >
          {project.tags.map((tag) => (
            <Box
              component={motion.div}
              key={tag}
              variants={textVariants}

              sx={{
                px: 1.6,
                py: 0.65,

                border:
                  '1px solid rgba(255,255,255,.35)',

                borderRadius: '999px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                }}
              >
                {tag}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* PROJECT TITLE */}

        <Typography
          component={motion.h3}
          variants={textVariants}

          sx={{
            fontSize: {
              xs: 32,
              md: 48,
            },

            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          {project.title}
        </Typography>

        {/* PROJECT SUBTITLE */}

        <Typography
          component={motion.p}
          variants={textVariants}

          sx={{
            mt: 1.2,

            fontSize: {
              xs: 13,
              md: 15,
            },

            color:
              'rgba(255,255,255,.55)',
          }}
        >
          {project.subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectCard;
