import {
  Box,
  Stack,
  Typography,
} from '@mui/material';

import AppButton from '../common/AppButton';
import { useLanguage } from '../../i18n/LanguageContext';


const HeroContent = () => {
  const { t } = useLanguage();

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
        {t('home.role')}
      </Typography>

      <Typography
        component="h1"
        sx={{
          fontSize: {
            xs: '30px',
            sm: '40px',
            md: '52px',
            lg: '40px',
            xl: '52px',
          },
          lineHeight: 0.95,
          fontWeight: 900,
          maxWidth: 700,
        }}
      >
        {t('home.heading1')}
        <Box
          component="br"
          sx={{
            display: {
              xs: 'none',
              sm: 'inline'
            }
          }}
        />
        {t('home.heading2')}
        <Box
          component="br"
          sx={{
            display: {
              xs: 'none',
              sm: 'inline'
            }
          }}
        />
        {t('home.heading3')}
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
        {t('home.description')}
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
          {t('home.availability')}
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
          {t('home.btn2')}
        </AppButton>
      </Stack>
    </Box>
  );
};

export default HeroContent;
