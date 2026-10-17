
import {
  Box,
  Button,
  Portal,
} from '@mui/material';

import { useLanguage } from '../../i18n/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Portal>
      <Box
        role="group"
        aria-label="Select language"
        sx={{
          position: 'fixed',

          // Di bawah AVAILABLE FOR FREELANCE
          top: {
            xs: 85,
            md: 115,
          },

           right: {
            xs: 16,
            md: 120,
          },

          // Di atas konten, di bawah splash
          zIndex: 19000,

          display: 'flex',
          alignItems: 'center',

          p: '4px',

          border:
            '1px solid rgba(255,255,255,.45)',

          borderRadius: '999px',

          backgroundColor:
            'rgba(10,10,10,.92)',

          backdropFilter: 'blur(16px)',

          boxShadow:
            '0 8px 30px rgba(0,0,0,.6)',
        }}
      >
        {[
          { code: 'en', label: 'EN' },
          { code: 'id', label: 'ID' },
        ].map((item) => {
          const active = language === item.code;

          return (
            <Button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              aria-label={
                item.code === 'en'
                  ? 'Switch to English'
                  : 'Ganti ke Bahasa Indonesia'
              }
              aria-pressed={active}
              disableRipple
              sx={{
                minWidth: 43,
                height: 34,

                px: 1.5,

                borderRadius: '999px',

                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1,

                color: active
                  ? '#000'
                  : '#fff',

                backgroundColor: active
                  ? '#fff'
                  : 'transparent',

                transition: 'all .25s ease',

                '&:hover': {
                  backgroundColor: active
                    ? '#fff'
                    : 'rgba(255,255,255,.15)',
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </Portal>
  );
};

export default LanguageSwitcher;
