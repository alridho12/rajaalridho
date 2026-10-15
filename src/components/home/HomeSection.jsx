import {
  Box,
  Container,
} from '@mui/material';

import HeroContent from './HeroContent';
import HeroArtwork from './HeroArtwork';

import StatusBadge from './StatusBadge';

const HomeSection = () => {
  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >

      {/* STATUS BADGE */}
      <Box
        sx={{
          position: 'absolute',

          top: {
            xs: 20,
            md: 46,
          },

          right: {
            xs: 16,
            md: 120,
          },

          zIndex: 20,
        }}
      >
        <StatusBadge />
      </Box>


      {/* HERO CONTENT */}
      <Container
        maxWidth="xxl"
        sx={{
          position: 'relative',
          zIndex: 10,
          px:{
            xs: 4,
            md: 15,
          },
          top: {
          xs: -60,
          md: -80,
          lg: -80,
          xl: -105,

        },
        }}
      >
        <HeroContent />
      </Container>


      <HeroArtwork />

    </Box>
  );
};

export default HomeSection;
