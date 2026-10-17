import { Box, Typography } from '@mui/material';
import { useLanguage } from '../../i18n/LanguageContext';


const StatusBadge = () => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        background: '#eee',
        color: '#000',
        borderRadius: '999px',
        px: 1,
        py: 1,
      }}
    >
      <Box
        sx={{
          border: '1px solid #111',
          borderRadius: '999px',
          p: {
            xs: 1,
            md: 1.5,
          },
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            backgroundColor: '#000',
          }}
        />

        <Typography
          sx={{
            fontSize: {
              xs: 12,
              md: 14,
            },
            fontWeight: 800,
          }}
        >
          {t('home.availability')}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatusBadge;
