
import { useState } from 'react';

import { Box } from '@mui/material';

import { LanguageProvider } from './i18n/LanguageContext';

import LanguageSwitcher from './components/layout/LanguageSwitcher';
import FloatingNavbar from './components/layout/FloatingNavbar';

import SplashScreen from './components/splash/SplashScreen';

import HomeSection from './components/home/HomeSection';
import AboutSection from './components/about/AboutSection';
import ProjectsSection from './components/projects/ProjectsSection';
import ContactSection from './components/contact/ContactSection';
import CyberDodgeSection from './components/game/CyberDodgeSection';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <LanguageProvider>
      <Box>
        <HomeSection />

        <AboutSection />

        <ProjectsSection />

        <CyberDodgeSection />

        <ContactSection />

        <FloatingNavbar />

        {/* FLOATING LANGUAGE BUTTON */}
        <LanguageSwitcher />

        {/* SPLASH SCREEN */}
        {showSplash && (
          <SplashScreen
            onComplete={() => setShowSplash(false)}
          />
        )}
      </Box>
    </LanguageProvider>
  );
}

export default App;
