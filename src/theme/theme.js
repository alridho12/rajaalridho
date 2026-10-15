import { createTheme } from '@mui/material/styles';
import ethnocentricFont from '../assets/fonts/Ethnocentric-Regular.otf';

const theme = createTheme({
  palette: {
    mode: 'dark',

    background: {
      default: '#000000',
      paper: '#ffffff',
    },

    primary: {
      main: '#ffffff',
    },

    text: {
      primary: '#ffffff',
    },
  },

  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',

    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
                @font-face {
                    font-family: 'Ethnocentric';
                    src: url(${ethnocentricFont}) format('opentype'); /* Menggunakan opentype untuk berkas .otf */
                    font-weight: normal;
                    font-style: normal;
                }
            `,
    },
  },
});

export default theme;
