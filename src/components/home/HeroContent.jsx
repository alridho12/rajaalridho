import {
  Box,
  Stack,
  Typography,
} from '@mui/material';

import AppButton from '../common/AppButton';

const HeroContent = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        position: 'relative',
        zIndex: 10,

      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: 12,
            md: 15,
          },
          fontWeight: 700,
          mb: 1,
        }}
      >
        UI/UX DESIGNER • WEB & MOBILE DEVELOPER
      </Typography>

      <Typography
        component="h1"
        sx={{
          fontSize: {
            xs: '30px',
            md: '52px',
            lg: '52px',
          },
          lineHeight: 0.95,
          fontWeight: 900,
          maxWidth: 700,
        }}
      >
        I DESIGN AND BUILD{" "}
        <Box
          component="br"
          sx={{
            display: {
              xs: 'none',
              sm: 'inline'
            }
          }}
        />
        MODERN WEBSITES{" "}
        <Box
          component="br"
          sx={{
            display: {
              xs: 'none',
              sm: 'inline'
            }
          }}
        />
        THAT STAND OUT.
      </Typography>


      <Typography
        sx={{
          maxWidth: 480,
          my: 2.5,

          fontSize: {
            xs: 14,
            md: 16,
          },

          lineHeight: 1.5,

          color: 'rgba(255,255,255,.85)',
        }}
      >
        Distinctive websites and mobile products
        designed to look great and work even better.
      </Typography>

      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={{
          xs: 1.5,
          sm: 2,
        }}
        mt={4}
        sx={{
          alignItems: {
            xs: 'flex-start',
            sm: 'initial',
          },
        }}
      >
        <AppButton
          sx={{
            fontSize: {
              xs: 12,
              md: 14,
            },
          }}
        >
          VIEW MY PROJECTS
        </AppButton>

        <AppButton
          variant="outline"
          showArrow
          sx={{
            fontSize: {
              xs: 12,
              md: 14,
            },
          }}
        >
          LET'S WORK TOGETHER
        </AppButton>
      </Stack>
    </Box>
  );
};

export default HeroContent;
