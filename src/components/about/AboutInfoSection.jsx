
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { keyframes } from '@emotion/react';

import {
  motion,
  useReducedMotion,
} from 'framer-motion';

import star from '../../assets/images/star.png';
import profile from '../../assets/images/profile-about.png';
import { useLanguage } from '../../i18n/LanguageContext';

// ==========================================
// MARQUEE
// ==========================================

const marquee = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
`;

// ==========================================
// FLOAT PORTRAIT
// ==========================================

const floating = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
`;

// ==========================================
// SLOW ORBIT ROTATION
// ==========================================

const orbitRotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

// ==========================================
// BACKGROUND GLOW
// ==========================================

const glowPulse = keyframes`
  0%, 100% {
    opacity: 0.45;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.15);
  }
`;

const technologies = [
  'REACT',
  'LARAVEL',
  'UI / UX',
  'MOBILE',
  'CREATIVE DEV',
];

const marqueeTexts = [
  'RAJA AL RIDHO',
  'WEB DEVELOPER',
  'UI / UX DESIGNER',
  'CREATIVE DEVELOPER',
];

// ==========================================
// COMPONENT
// ==========================================

const AboutInfoSection = () => {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();

  // ==========================================
  // INFORMATION DATA
  // ==========================================

  const infoItems = [
    {
      number: '01',
      title: 'WEB DEVELOPMENT',
      description:
        t('about.services.webDescription'),
    },
    {
      number: '02',
      title: 'MOBILE DEVELOPMENT',
      description:
        t('about.services.mobileDescription'),
    },
    {
      number: '03',
      title: 'UI / UX DESIGN',
      description:
        t('about.services.uiDescription'),
    },
    {
      number: '04',
      title: 'CREATIVE DEVELOPMENT',
      description:
        t('about.services.creativeDescription'),
    },
  ];

  // ========================================
  // REUSABLE SCROLL REVEAL
  // ========================================

  const reveal = (
    direction = 'up',
    delay = 0,
    blur = false
  ) => {
    const offsets = {
      up: { x: 0, y: 55 },
      left: { x: -65, y: 0 },
      right: { x: 65, y: 0 },
    };

    return {
      initial: {
        opacity: 0,
        x: reducedMotion
          ? 0
          : offsets[direction].x,
        y: reducedMotion
          ? 0
          : offsets[direction].y,
        filter:
          blur && !reducedMotion
            ? 'blur(12px)'
            : 'blur(0px)',
      },

      whileInView: {
        opacity: 1,
        x: 0,
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
        ease: [0.22, 1, 0.36, 1],
      },
    };
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        overflow: 'hidden',

        py: {
          xs: 12,
          md: 16,
        },
      }}
    >
      {/* =====================================
          STAR BACKGROUND
      ====================================== */}

      <Box
        component="img"
        src={star}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.28,
          pointerEvents: 'none',
        }}
      />

      {/* =====================================
          CINEMATIC BACKGROUND GLOW
      ====================================== */}

      <Box
        sx={{
          position: 'absolute',

          width: {
            xs: 400,
            md: 600,
          },

          height: {
            xs: 400,
            md: 600,
          },

          left: '50%',
          top: '45%',

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 68%)',

          animation: reducedMotion
            ? 'none'
            : `${glowPulse} 8s ease-in-out infinite`,

          transform:
            'translate(-50%, -50%)',

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
            TOP LABEL REVEAL
        ====================================== */}

        <Stack
          component={motion.div}
          {...reveal('up', 0.05)}
          direction="row"
          alignItems="center"
          spacing={2}
          mb={3}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            ABOUT ME
          </Typography>

          <Box
            sx={{
              width: 60,
              height: '1px',
              backgroundColor:
                'rgba(255,255,255,.5)',
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              color: 'rgba(255,255,255,.55)',
              letterSpacing: 2,
            }}
          >
            01
          </Typography>
        </Stack>

        {/* =====================================
            MAIN TITLE CINEMATIC REVEAL
        ====================================== */}

        <Typography
          component="h2"
          sx={{
            maxWidth: 920,

            fontSize: {
              xs: '42px',
              sm: '58px',
              md: '76px',
            },

            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-2px',

            mb: {
              xs: 8,
              md: 11,
            },
          }}
        >
          <Box
            component={motion.span}
            {...reveal('up', 0.12, true)}
            sx={{
              display: 'block',
            }}
          >
            {t('about.title1')}
          </Box>

          <Box
            component={motion.span}
            {...reveal('up', 0.28, true)}
            sx={{
              display: 'block',
              mt: 1,
            }}
          >
            {t('about.title2')}
          </Box>
        </Typography>

        {/* =====================================
            MAIN ABOUT GRID
        ====================================== */}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr 1fr',
            },

            alignItems: 'center',

            gap: {
              xs: 7,
              md: 6,
            },
          }}
        >
          {/* ==================================
              LEFT INFORMATION REVEAL
          ================================== */}

          <Box
            component={motion.div}
            {...reveal('left', 0.1)}
          >
            <Typography
              sx={{
                display: 'flex',
                flexDirection: 'column',

                alignItems: {
                  xs: 'flex-start',
                  md: 'flex-end',
                },

                textAlign: {
                  xs: 'left',
                  md: 'right',
                },

                fontSize: {
                  xs: 58,
                  md: 84,
                },

                fontWeight: 900,
                lineHeight: 0.8,
              }}
            >
              3+
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 2,
                mt: 2,

                textAlign: {
                  xs: 'left',
                  md: 'right',
                },
              }}
            >
              {t('about.years1')}
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 2,

                textAlign: {
                  xs: 'left',
                  md: 'right',
                },
              }}
            >
              {t('about.years2')}
            </Typography>

            <Box
              sx={{
                width: 90,
                height: 1,

                backgroundColor:
                  'rgba(255,255,255,.45)',

                my: 4,
                ml: {
                  xs: 0,
                  md: 'auto',
                },
              }}
            />

            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.7,

                color:
                  'rgba(255,255,255,.65)',

                textAlign: {
                  xs: 'left',
                  md: 'right',
                },
              }}
            >
              {t('about.description')}
            </Typography>
          </Box>

          {/* ==================================
              PORTRAIT CINEMATIC REVEAL
          ================================== */}

          <Box
            component={motion.div}
            initial={{
              opacity: 0,
              scale: reducedMotion ? 1 : 0.78,
              y: reducedMotion ? 0 : 75,
              filter: reducedMotion
                ? 'blur(0px)'
                : 'blur(14px)',
            }}

            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
            }}

            viewport={{
              once: false,
              amount: 0.2,
            }}

            transition={{
              duration: reducedMotion ? 0.2 : 1.25,
              delay: reducedMotion ? 0 : 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}

            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* ROTATING ORBIT */}

            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',

                transform:
                  'translate(-50%, -50%)',

                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 330,
                    md: 470,
                  },

                  height: {
                    xs: 330,
                    md: 470,
                  },

                  border:
                    '1px dashed rgba(255,255,255,.3)',

                  borderRadius: '50%',

                  animation: reducedMotion
                    ? 'none'
                    : `${orbitRotate} 90s linear infinite`,
                }}
              />
            </Box>

            {/* SMALL PLANET */}

            <Box
              component={motion.div}
              initial={{
                opacity: 0,
                scale: 0,
              }}

              whileInView={{
                opacity: 1,
                scale: 1,
              }}

              viewport={{
                once: false,
                amount: 0.2,
              }}

              transition={{
                duration: 0.65,
                delay: reducedMotion ? 0 : 0.7,
                ease: 'backOut',
              }}

              sx={{
                position: 'absolute',

                top: '12%',

                right: {
                  xs: '5%',
                  md: '10%',
                },

                width: 18,
                height: 18,

                borderRadius: '50%',
                backgroundColor: '#fff',

                boxShadow:
                  '0 0 20px rgba(255,255,255,.5)',

                zIndex: 2,
              }}
            />

            {/* ==================================
                FLOATING PORTRAIT
            ================================== */}

            <Box
              sx={{
                position: 'relative',

                width: {
                  xs: 270,
                  md: 370,
                },

                height: {
                  xs: 360,
                  md: 490,
                },

                overflow: 'hidden',

                animation: reducedMotion
                  ? 'none'
                  : `${floating} 5s ease-in-out infinite`,
              }}
            >
              <Box
                component="img"
                src={profile}
                alt="Raja Al Ridho"

                sx={{
                  width: '100%',
                  height: '100%',

                  objectFit: 'cover',

                  filter:
                    'grayscale(1) contrast(1.1)',

                  objectPosition: 'center top',

                  maskImage:
                    'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.5) 45%, #000 75%, #000 100%)',

                  WebkitMaskImage:
                    'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.5) 45%, #000 75%, #000 100%)',
                }}
              />
            </Box>

            {/* ==================================
                FLOATING LABEL
            ================================== */}

            <Box
              component={motion.div}
              initial={{
                opacity: 0,
                y: 25,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: false,
                amount: 0.2,
              }}

              transition={{
                duration: 0.7,
                delay: reducedMotion ? 0 : 0.65,
              }}

              sx={{
                position: 'absolute',

                bottom: 35,

                left: {
                  xs: 10,
                  md: -20,
                },

                px: 2,
                py: 1,

                border:
                  '1px solid rgba(255,255,255,.45)',

                borderRadius: '999px',

                backgroundColor:
                  'rgba(0,0,0,.7)',

                backdropFilter: 'blur(10px)',

                zIndex: 5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                DESIGN × DEVELOPMENT
              </Typography>
            </Box>
          </Box>

          {/* ==================================
              RIGHT INFORMATION REVEAL
          ================================== */}

          <Box
            component={motion.div}
            {...reveal('right', 0.2)}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,

                color:
                  'rgba(255,255,255,.5)',

                letterSpacing: 1.5,
                mb: 2,
              }}
            >
              {t('about.whatIDo')}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  md: 32,
                },

                fontWeight: 800,
                lineHeight: 1.15,
                mb: 4,
              }}
            >
              {t('about.code')}
              <br />
              {t('about.design')}
              <br />
              {t('about.create')}
            </Typography>

            {/* STAGGERED TECH BADGES */}

            <Stack spacing={1.5}>
              {technologies.map((item, index) => (
                <Box
                  component={motion.div}
                  key={item}

                  initial={{
                    opacity: 0,
                    x: reducedMotion ? 0 : 25,
                  }}

                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}

                  viewport={{
                    once: false,
                    amount: 0.2,
                  }}

                  transition={{
                    duration: reducedMotion
                      ? 0.2
                      : 0.6,

                    delay: reducedMotion
                      ? 0
                      : 0.25 + index * 0.1,

                    ease: [0.22, 1, 0.36, 1],
                  }}

                  whileHover={
                    reducedMotion
                      ? undefined
                      : {
                        x: 6,
                        scale: 1.04,
                      }
                  }

                  sx={{
                    display: 'inline-flex',
                    width: 'fit-content',

                    px: 1.8,
                    py: 0.8,

                    border:
                      '1px solid rgba(255,255,255,.35)',

                    borderRadius: '999px',

                    cursor: 'default',

                    transition:
                      'border-color 0.3s ease, background-color 0.3s ease',

                    '&:hover': {
                      borderColor: '#fff',

                      backgroundColor:
                        'rgba(255,255,255,.08)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* =====================================
          NAME MARQUEE REVEAL
      ====================================== */}

      <Box
        component={motion.div}
        {...reveal('up', 0.05)}

        sx={{
          position: 'relative',
          zIndex: 3,
          overflow: 'hidden',

          mt: {
            xs: 11,
            md: 15,
          },

          py: 3,

          borderTop:
            '1px solid rgba(255,255,255,.15)',

          borderBottom:
            '1px solid rgba(255,255,255,.15)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',

            animation: reducedMotion
              ? 'none'
              : `${marquee} 24s linear infinite`,
          }}
        >
          {[1, 2].map((group) => (
            <Box
              key={group}
              sx={{
                display: 'flex',
              }}
            >
              {marqueeTexts.map((text) => (
                <Typography
                  key={`${group}-${text}`}

                  sx={{
                    flexShrink: 0,

                    mx: {
                      xs: 3,
                      md: 6,
                    },

                    fontSize: {
                      xs: 28,
                      md: 48,
                    },

                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text}

                  <Box
                    component="span"
                    sx={{
                      ml: {
                        xs: 6,
                        md: 10,
                      },

                      color:
                        'rgba(255,255,255,.25)',
                    }}
                  >
                    ✦
                  </Box>
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* =====================================
          DETAIL LIST REVEAL
      ====================================== */}

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 3,

          mt: {
            xs: 9,
            md: 12,
          },
        }}
      >
        {infoItems.map((item, index) => (
          <Box
            component={motion.div}
            key={item.number}

            {...reveal('up', index * 0.08)}
          >
            <Box
              sx={{
                display: 'grid',

                gridTemplateColumns: {
                  xs: '45px 1fr',
                  md: '80px 280px 1fr',
                },

                gap: {
                  xs: 2,
                  md: 5,
                },

                alignItems: 'center',
                py: 3,

                transition:
                  'background-color 0.3s ease',

                '&:hover': {
                  backgroundColor:
                    'rgba(255,255,255,.025)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color:
                    'rgba(255,255,255,.45)',
                }}
              >
                {item.number}
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: 14,
                    md: 16,
                  },

                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  gridColumn: {
                    xs: '2',
                    md: 'auto',
                  },

                  maxWidth: 500,

                  fontSize: 13,
                  lineHeight: 1.7,

                  color:
                    'rgba(255,255,255,.55)',
                }}
              >
                {item.description}
              </Typography>
            </Box>

            {index < infoItems.length - 1 && (
              <Divider
                sx={{
                  borderColor:
                    'rgba(255,255,255,.13)',
                }}
              />
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
};

export default AboutInfoSection;
