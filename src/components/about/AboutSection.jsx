import { Box } from '@mui/material';

import SkillsSection from './SkillsSection';
import AboutInfoSection from './AboutInfoSection';

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"

      sx={{
        backgroundColor: '#000',
      }}
    >

      {/* About profile nanti di sini */}

      <AboutInfoSection />


      <SkillsSection />

    </Box>
  );
};

export default AboutSection;
