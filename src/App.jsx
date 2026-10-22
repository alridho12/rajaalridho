
import { useState } from 'react';

import { Box, GlobalStyles } from '@mui/material';

import { LanguageProvider } from './i18n/LanguageContext';

import LanguageSwitcher from './components/layout/LanguageSwitcher';
import FloatingNavbar from './components/layout/FloatingNavbar';

import SplashScreen from './components/splash/SplashScreen';

import HomeSection from './components/home/HomeSection';
import AboutSection from './components/about/AboutSection';
import ProjectsSection from './components/projects/ProjectsSection';
import ContactSection from './components/contact/ContactSection';
import CyberDodgeSection from './components/game/CyberDodgeSection';
import VisitorGlobeSection from './components/globe/VisitorGlobeSection';
import CosmicCursor from './components/layout/CosmicCursor';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <LanguageProvider>

      {/* COSMIC GLOW SCROLLBAR */}
      <GlobalStyles
        styles={{
          html: {
            backgroundColor: '#000',
          },

          body: {
            margin: 0,
            backgroundColor: '#000',
          },

          /* CHROME, EDGE & SAFARI */

          'html::-webkit-scrollbar': {
            width: '8px',
          },

          'html::-webkit-scrollbar-track': {
            backgroundColor: '#000',
          },

          'html::-webkit-scrollbar-thumb': {
            backgroundColor: '#d9d9d9',

            borderRadius: '999px',

            border: '2px solid #000',

            boxShadow: `
              0 0 6px rgba(255,255,255,.65),
              0 0 12px rgba(255,255,255,.3)
            `,
          },

          'html::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#fff',

            boxShadow: `
              0 0 8px rgba(255,255,255,.9),
              0 0 18px rgba(255,255,255,.55)
            `,
          },

          'html::-webkit-scrollbar-corner': {
            backgroundColor: '#000',
          },

          /* FIREFOX FALLBACK */

          '@supports (-moz-appearance: none)': {
            html: {
              scrollbarWidth: 'thin',
              scrollbarColor: '#d9d9d9 #000',
            },
          },

          /* MOBILE */

          '@media (max-width: 600px)': {
            'html::-webkit-scrollbar': {
              width: '4px',
            },
          },
        }}
      />

      <Box
        sx={{
          backgroundColor: '#000',
          minHeight: '100vh',
        }}
      >
        <HomeSection />

        <AboutSection />

        <ProjectsSection />

        <CyberDodgeSection />

        <VisitorGlobeSection />

        <ContactSection />

        <FloatingNavbar />

        {/* FLOATING LANGUAGE BUTTON */}
        <LanguageSwitcher />

        <CosmicCursor />

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
