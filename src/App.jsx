import { Box } from '@mui/material';

import FloatingNavbar from './components/layout/FloatingNavbar';

import { useState } from 'react';
import SplashScreen from './components/splash/SplashScreen';

import HomeSection from './components/home/HomeSection';
import AboutSection from './components/about/AboutSection';
import ProjectsSection from './components/projects/ProjectsSection';
import ContactSection from './components/contact/ContactSection';
import CyberDodgeSection from './components/game/CyberDodgeSection';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <Box>
      <HomeSection />

      <AboutSection />

      <ProjectsSection />

      <CyberDodgeSection />

      <ContactSection />

      <FloatingNavbar />

      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
        />
      )}
    </Box>
  );
}

export default App;
