import {
  Box,
  ButtonBase,
  Divider,
  Paper,
} from '@mui/material';

import { navigationItems } from '../../data/navigation';

const FloatingNavbar = () => {

  const scrollToSection = (target) => {

    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

  };

  return (
    <Box
      sx={{
        position: 'fixed',

        bottom: {
          xs: 16,
          md: 28,
        },

        left: '50%',

        transform: 'translateX(-50%)',

        zIndex: 9999,

        width: {
          xs: 'calc(100% - 32px)',
          sm: 'auto',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{

          px: {
            xs: 1,
            md: 1.5,
          },

          py: {
            xs: 1,
            md: 1.5,
          },

          borderRadius: '999px',

          backgroundColor:
            'rgba(255,255,255,0.88)',

          backdropFilter:
            'blur(15px)',

          boxShadow:
            '0px 10px 30px rgba(0,0,0,0.15)',
        }}
      >

        <Box
          sx={{
            border: '1px solid #111',
            p: {
              xs: 0.5,
              md: 2,
            },
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
          }}
        >

          {navigationItems.map((item, index) => (

            <Box
              key={item.target}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
              }}
            >

              <ButtonBase
                onClick={() =>
                  scrollToSection(
                    item.target
                  )
                }

                sx={{
                  px: {
                    xs: 1.2,
                    md: 2.3,
                  },

                  py: 0.9,

                  borderRadius: '999px',

                  whiteSpace: 'nowrap',

                  fontSize: {
                    xs: '10.5px',
                    md: '12px',
                  },

                  fontWeight: 800,

                  color: '#111',

                  transition:
                    '0.25s ease',

                  '&:hover': {
                    backgroundColor:
                      'rgba(0,0,0,0.07)',
                  },
                }}
              >
                {item.label}
              </ButtonBase>


              {index <
                navigationItems.length - 1 && (

                  <Divider
                    orientation="vertical"
                    flexItem

                    sx={{
                      mx: 0.5,

                      borderColor:
                        '#111',
                    }}
                  />

                )}

            </Box>

          ))}
        </Box>


      </Paper>

    </Box>
  );
};

export default FloatingNavbar;
