import { createTheme } from '@mui/material/styles';

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
});

export default theme;
