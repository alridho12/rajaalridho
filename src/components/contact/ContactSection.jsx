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


const marquee = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
`;


const ContactSection = () => {
  const { t } = useLanguage();
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
              alignItems="center"
              spacing={1.5}

              sx={{
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

                InputLabelProps={{
                  sx: {
                    color:
                      'rgba(255,255,255,.45)',

                    fontSize: 11,

                    letterSpacing: 1.5,
                  },
                }}

                InputProps={{
                  sx: {
                    color: '#fff',

                    '&:before': {
                      borderColor:
                        'rgba(255,255,255,.25)',
                    },

                    '&:after': {
                      borderColor:
                        '#fff',
                    },
                  },
                }}
              />


              <TextField
                fullWidth
                variant="standard"
                label={t('contact.form.email')}

                InputLabelProps={{
                  sx: {
                    color:
                      'rgba(255,255,255,.45)',

                    fontSize: 11,

                    letterSpacing: 1.5,
                  },
                }}

                InputProps={{
                  sx: {
                    color: '#fff',

                    '&:before': {
                      borderColor:
                        'rgba(255,255,255,.25)',
                    },

                    '&:after': {
                      borderColor:
                        '#fff',
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

                InputLabelProps={{
                  sx: {
                    color:
                      'rgba(255,255,255,.45)',

                    fontSize: 11,

                    letterSpacing: 1.5,
                  },
                }}

                InputProps={{
                  sx: {
                    color: '#fff',

                    '&:before': {
                      borderColor:
                        'rgba(255,255,255,.25)',
                    },

                    '&:after': {
                      borderColor:
                        '#fff',
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
            CLIENT FEEDBACK
        ================================== */}

        <Box
          sx={{
            mt: {
              xs: 14,
              md: 20,
            },
            mb: {
              xs: 10,
              md: 14,
            },
          }}
        >

          <Stack
            direction={{
              xs: 'column',
              // md: 'row',
            }}

            justifyContent="space-between"

            alignItems={{
              xs: 'flex-start',
              // md: 'end',
            }}

            spacing={3}

            mb={6}
          >

            <Box>

              <Typography
                sx={{
                  fontSize: 11,

                  letterSpacing: 2,

                  color:
                    'rgba(255,255,255,.45)',

                  mb: 1,
                }}
              >
                {t('contact.label2')}
              </Typography>


              <Typography
                component="h3"

                sx={{
                  fontSize: {
                    xs: 38,
                    md: 58,
                  },

                  fontWeight: 900,

                  lineHeight: 1,
                  // mb: {
                  //   xs: 1,
                  //   xl:0
                  // },
                }}
              >
                CLIENT
                <br />

                FEEDBACK.
              </Typography>

            </Box>


            <Typography
              sx={{
                maxWidth: 330,

                fontSize: 13,

                lineHeight: 1.7,

                color:
                  'rgba(255,255,255,.5)',

              }}
            >
              {t('contact.subheading2')}
            </Typography>

          </Stack>


          {/* FEEDBACK GRID */}

          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: {
                xs: '1fr',
                md:
                  'repeat(3, 1fr)',
              },

              gap: 2.5,
              mt: 4,
            }}
          >

            {testimonials.map(
              (testimonial) => (

                <TestimonialCard
                  key={
                    testimonial.id
                  }

                  testimonial={
                    testimonial
                  }
                />

              )
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
