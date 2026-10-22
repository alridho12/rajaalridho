import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import NorthEastIcon
  from '@mui/icons-material/NorthEast';

import { keyframes }
  from '@emotion/react';

import TestimonialCard
  from './TestimonialCard';

import { testimonials }
  from '../../data/testimonials';

import star
  from '../../assets/images/star.png';

import { useLanguage } from '../../i18n/LanguageContext';

import { useState } from 'react';


const marquee = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
`;

const floatA = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translate3d(-15px, 20px, 0) rotate(-5deg);
  }
  15%, 65% {
    opacity: 1;
  }
  40% {
    transform: translate3d(15px, -15px, 0) rotate(-2deg);
  }
  85% {
    opacity: 0;
    transform: translate3d(-10px, -25px, 0) rotate(-4deg);
  }
`;

const floatB = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translate3d(18px, -10px, 0) rotate(5deg);
  }
  15%, 70% {
    opacity: 1;
  }
  45% {
    transform: translate3d(-18px, 18px, 0) rotate(2deg);
  }
  88% {
    opacity: 0;
    transform: translate3d(10px, -20px, 0) rotate(6deg);
  }
`;

const floatC = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translate3d(-10px, 18px, 0) rotate(3deg);
  }
  18%, 72% {
    opacity: 1;
  }
  48% {
    transform: translate3d(20px, -15px, 0) rotate(-2deg);
  }
  90% {
    opacity: 0;
    transform: translate3d(-16px, 12px, 0) rotate(4deg);
  }
`;

const floatingAnimations = [floatA, floatB, floatC];

const floatingPositions = [
  { top: '3%', left: '8%', width: '48%', zIndex: 4 },
  { top: '22%', left: '57%', width: '42%', zIndex: 3 },
  { top: '52%', left: '1%', width: '45%', zIndex: 5 },
  { top: '59%', left: '52%', width: '47%', zIndex: 4 },
  { top: '34%', left: '29%', width: '36%', zIndex: 2 },
];



const ContactSection = () => {
  const { t } = useLanguage();

  const [activeMobileCard, setActiveMobileCard] =
    useState(null);

  return (
    <Box
      component="section"
      id="contact"

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
          xs: 5,
          md: 10,
        },
      }}
    >

      {/* STAR BACKGROUND */}

      <Box
        component="img"
        src={star}
        alt=""

        sx={{
          position: 'absolute',

          inset: 0,

          width: '100%',
          height: '100%',

          objectFit: 'cover',

          opacity: 0.18,

          pointerEvents: 'none',
        }}
      />


      {/* GLOW */}

      <Box
        sx={{
          position: 'absolute',

          width: {
            xs: 450,
            md: 800,
          },

          height: {
            xs: 450,
            md: 800,
          },

          left: '50%',
          top: 100,

          transform:
            'translateX(-50%)',

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(255,255,255,.08), transparent 65%)',

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

        {/* SECTION LABEL */}

        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            mb: 4

          }}
        >

          <Typography
            sx={{
              fontSize: 12,

              fontWeight: 800,

              letterSpacing: 2,
            }}
          >
            CONTACT ME
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
            03
          </Typography>

        </Stack>


        {/* ==================================
            CONTACT AREA
        ================================== */}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr',
              lg: '1fr 1fr',
            },

            gap: {
              xs: 8,
              md: 12,
            },

            alignItems: 'start',
          }}
        >

          {/* LEFT */}

          <Box>

            <Typography
              component="h2"

              sx={{
                fontSize: {
                  xs: '50px',
                  sm: '72px',
                  md: '100px',
                },

                fontWeight: 900,

                lineHeight: 0.82,

                letterSpacing: {
                  xs: '-2px',
                  md: '-5px',
                },
              }}
            >
              LET'S BUILD
              <br />

              YOUR
              <br />

              NEXT WEBSITE.
            </Typography>


            <Typography
              sx={{
                mt: 5,

                maxWidth: 480,

                fontSize: 15,

                lineHeight: 1.8,

                color:
                  'rgba(255,255,255,.55)',
              }}
            >
              {t('contact.subheading')}
            </Typography>


            {/* AVAILABILITY */}

            <Stack
              direction="row"
              spacing={1.5}

              sx={{
                alignItems: "center",
                mt: 5,
              }}
            >

              {/* <Box
                sx={{
                  width: 9,
                  height: 9,

                  borderRadius: '50%',

                  backgroundColor: '#fff',

                  boxShadow:
                    '0 0 15px rgba(255,255,255,.8)',
                }}
              />


              <Typography
                sx={{
                  fontSize: 11,

                  fontWeight: 800,

                  letterSpacing: 1.5,
                }}
              >
                AVAILABLE FOR FREELANCE
              </Typography> */}

            </Stack>

          </Box>


          {/* ==================================
              FORM
          ================================== */}

          <Box
            component="form"

            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              border:
                '1px solid rgba(255,255,255,.25)',

              borderRadius: '28px',

              backgroundColor:
                'rgba(255,255,255,.035)',

              backdropFilter:
                'blur(12px)',
            }}
          >

            <Typography
              sx={{
                fontSize: 12,

                fontWeight: 800,

                letterSpacing: 2,

                mb: 4,
              }}
            >
              {t('contact.form.title')}
            </Typography>


            <Stack spacing={3}>


              <TextField
                fullWidth
                variant="standard"
                label={t('contact.form.name')}
                slotProps={{
                  inputLabel: {
                    sx: {
                      color: 'rgba(255,255,255,.45)',
                      fontSize: 11,
                      letterSpacing: 1.5,

                      '&.Mui-focused': {
                        color: '#fff',
                      },
                    },
                  },

                  input: {
                    sx: {
                      color: '#fff',

                      '&:before': {
                        borderColor:
                          'rgba(255,255,255,.25)',
                      },

                      '&:hover:not(.Mui-disabled):before': {
                        borderColor:
                          'rgba(255,255,255,.5)',
                      },

                      '&:after': {
                        borderColor: '#fff',
                      },
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                variant="standard"
                label={t('contact.form.email')}
                slotProps={{
                  inputLabel: {
                    sx: {
                      color: 'rgba(255,255,255,.45)',
                      fontSize: 11,
                      letterSpacing: 1.5,

                      '&.Mui-focused': {
                        color: '#fff',
                      },
                    },
                  },

                  input: {
                    sx: {
                      color: '#fff',

                      '&:before': {
                        borderColor:
                          'rgba(255,255,255,.25)',
                      },

                      '&:hover:not(.Mui-disabled):before': {
                        borderColor:
                          'rgba(255,255,255,.5)',
                      },

                      '&:after': {
                        borderColor: '#fff',
                      },
                    },
                  },
                }}
              />


              <TextField
                fullWidth
                multiline
                minRows={4}
                variant="standard"
                label={t('contact.form.message')}
                slotProps={{
                  inputLabel: {
                    sx: {
                      color: 'rgba(255,255,255,.45)',
                      fontSize: 11,
                      letterSpacing: 1.5,

                      '&.Mui-focused': {
                        color: '#fff',
                      },
                    },
                  },

                  input: {
                    sx: {
                      color: '#fff',

                      '&:before': {
                        borderColor:
                          'rgba(255,255,255,.25)',
                      },

                      '&:hover:not(.Mui-disabled):before': {
                        borderColor:
                          'rgba(255,255,255,.5)',
                      },

                      '&:after': {
                        borderColor: '#fff',
                      },
                    },
                  },
                }}
              />



              <Button
                type="submit"

                endIcon={
                  <NorthEastIcon />
                }

                sx={{
                  mt: 2,

                  alignSelf:
                    'flex-start',

                  px: 3,
                  py: 1.5,

                  borderRadius:
                    '999px',

                  backgroundColor:
                    '#fff',

                  color: '#000',

                  fontWeight: 900,

                  fontSize: 12,

                  '&:hover': {
                    backgroundColor:
                      '#dedede',
                  },
                }}
              >
                {t('contact.form.submit')}
              </Button>

            </Stack>

          </Box>

        </Box>


        {/* ==================================
            COSMIC FLOATING CLIENT FEEDBACK
        ================================== */}

        <Box
          sx={{
            position: 'relative',
            mt: { xs: 12, md: 20 },
            mb: { xs: 10, md: 14 },
          }}
        >
          {/* HEADING */}

          <Box
            sx={{
              position: 'relative',
              zIndex: 6,
              maxWidth: 330,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: 2,
                color: 'rgba(255,255,255,.45)',
                mb: 1.5,
              }}
            >
              {t('contact.label2')}
            </Typography>

            <Typography
              component="h3"
              sx={{
                fontSize: { xs: 40, md: 58 },
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -2,
              }}
            >
              CLIENT
              <br />
              FEEDBACK.
            </Typography>

            <Typography
              sx={{
                mt: 3,
                maxWidth: 310,
                fontSize: 13,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,.5)',
              }}
            >
              {t('contact.subheading2')}
            </Typography>
          </Box>

          {/* DESKTOP FLOATING CARDS */}

          <Box
            sx={{
              position: 'relative',
              display: { xs: 'none', md: 'block' },

              width: { md: '88%', lg: '90%' },
              maxWidth: 1180,

              height: { md: 760, lg: 820 },

              ml: { md: '8%', lg: '6%' },
              mt: { md: -12, lg: 0 },

              isolation: 'isolate',

              '&::before': {
                content: '""',
                position: 'absolute',
                top: '28%',
                left: '8%',
                width: '84%',
                height: '42%',
                border: '1px solid rgba(255,255,255,.06)',
                borderRadius: '50%',
                transform: 'rotate(-12deg)',
                pointerEvents: 'none',
                zIndex: 0,
              },
            }}
          >
            {testimonials.slice(0, 5).map((testimonial, index) => {
              const position = floatingPositions[index];
              const animation =
                floatingAnimations[index % floatingAnimations.length];

              return (
                <Box
                  key={testimonial.id ?? index}
                  sx={{
                    position: 'absolute',

                    top: position.top,
                    left: position.left,
                    width: position.width,

                    zIndex: position.zIndex,

                    animation: `${animation} ${22 + (index % 3) * 4
                      }s ease-in-out infinite`,

                    animationDelay: `-${index * 5 + 3}s`,

                    willChange: 'transform, opacity',

                    '&:hover, &:focus-within': {
                      animationPlayState: 'paused',
                      zIndex: 20,
                    },

                    '@media (prefers-reduced-motion: reduce)': {
                      animation: 'none',
                      transform: 'none',
                      opacity: 1,
                    },
                  }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </Box>
              );
            })}
          </Box>



          {/* ==================================
            MOBILE FLOATING CLIENT FEEDBACK
          ================================== */}

          <Box
            sx={{
              display: {
                xs: 'block',
                md: 'none',
              },

              position: 'relative',

              mt: 5,


              height: {
                xs: 1350,
                sm: 1450,
              },



              width: '100%',

              isolation: 'isolate',

              '&::before': {
                content: '""',
                position: 'absolute',
                top: '12%',
                left: '5%',
                width: '90%',
                height: '75%',
                border:
                  '1px solid rgba(255,255,255,.07)',
                borderRadius: '50%',
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
              },
            }}
          >
            {testimonials.slice(0, 4).map(
              (testimonial, index) => {

                const positions = [
                  {
                    top: '2%',
                    left: '2%',
                    rotate: '-4deg',
                  },
                  {
                    top: '27%',
                    left: '9%',
                    rotate: '4deg',
                  },
                  {
                    top: '52%',
                    left: '3%',
                    rotate: '-3deg',
                  },
                  {
                    top: '77%',
                    left: '8%',
                    rotate: '3deg',
                  },
                ];


                const position = positions[index];

                const isActive =
                  activeMobileCard === index;

                return (
                  <Box
                    key={testimonial.id ?? index}
                    tabIndex={0}
                    onMouseEnter={() =>
                      setActiveMobileCard(index)
                    }
                    onMouseLeave={() =>
                      setActiveMobileCard(null)
                    }
                    onFocus={() =>
                      setActiveMobileCard(index)
                    }
                    onBlur={() =>
                      setActiveMobileCard(null)
                    }
                    onPointerDown={() =>
                      setActiveMobileCard(index)
                    }
                    sx={{
                      position: 'absolute',

                      top: position.top,
                      left: position.left,

                      width: '88%',
                      maxWidth: 360,

                      zIndex: isActive
                        ? 100
                        : index + 1,

                      transform: isActive
                        ? 'rotate(0deg) scale(1.03)'
                        : `rotate(${position.rotate})`,

                      transformOrigin: 'center',

                      transition:
                        'transform .35s ease, box-shadow .35s ease',

                      cursor: 'pointer',

                      outline: 'none',

                      '&:focus-visible': {
                        outline:
                          '2px solid rgba(114,246,255,.75)',
                        outlineOffset: 4,
                      },

                      '&:hover': {
                        boxShadow:
                          '0 25px 70px rgba(0,0,0,.65)',
                      },
                    }}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                    />
                  </Box>
                );
              }
            )}
          </Box>


        </Box>


      </Container>


      {/* ==================================
          BIG MARQUEE
      ================================== */}

      <Box
        sx={{
          position: 'relative',

          zIndex: 3,

          overflow: 'hidden',

          mt: {
            xs: 14,
            md: 20,
          },

          py: 4,

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

            animation:
              `${marquee} 22s linear infinite`,
          }}
        >

          {[1, 2].map((group) => (

            <Box
              key={group}

              sx={{
                display: 'flex',
              }}
            >

              {[
                "LET'S TALK",
                'START A PROJECT',
                'WORK TOGETHER',
                'SAY HELLO',
              ].map((text) => (

                <Typography
                  key={
                    `${group}-${text}`
                  }

                  sx={{
                    flexShrink: 0,

                    mx: {
                      xs: 4,
                      md: 7,
                    },

                    fontSize: {
                      xs: '50px',
                      md: '90px',
                    },

                    fontWeight: 900,

                    lineHeight: 1,

                    whiteSpace:
                      'nowrap',
                  }}
                >
                  {text}

                  <Box
                    component="span"

                    sx={{
                      ml: {
                        xs: 8,
                        md: 12,
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

    </Box>
  );
};

export default ContactSection;
