import {
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { keyframes } from '@emotion/react';

import SkillIcon from './SkillIcon';

import { skills } from '../../data/skills';

import sun from '../../assets/images/sun.png';


// ==========================================
// ORBIT ANIMATION
// ==========================================

const rotateClockwise = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const rotateCounterClockwise = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`;


const SkillOrbit = () => {

  const theme = useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down('md')
    );


  const outerRadius =
    isMobile ? 180 : 335;

  const innerRadius =
    isMobile ? 118 : 225;


  const outerSkills =
    skills.filter(
      (skill) =>
        skill.orbit === 'outer'
    );

  const innerSkills =
    skills.filter(
      (skill) =>
        skill.orbit === 'inner'
    );


  return (
    <Box
      sx={{
        position: 'relative',

        width: {
          xs: 380,
          md: 700,
        },

        height: {
          xs: 380,
          md: 700,
        },

        mx: 'auto',
      }}
    >

      {/* ====================================
          OUTER ORBIT LINE
      ==================================== */}

      <Box
        sx={{
          position: 'absolute',

          inset: 0,

          border:
            '2px dashed rgba(255,255,255,0.8)',

          borderRadius: '50%',

          zIndex: 1,
        }}
      />


      {/* ====================================
          INNER ORBIT LINE
      ==================================== */}

      <Box
        sx={{
          position: 'absolute',

          left: '50%',
          top: '50%',

          transform:
            'translate(-50%, -50%)',

          width: '65%',
          height: '65%',

          border:
            '2px dashed rgba(255,255,255,0.8)',

          borderRadius: '50%',

          zIndex: 1,
        }}
      />


      {/* ====================================
          SUN
      ==================================== */}

      <Box
        component="img"
        src={sun}
        alt="Sun"

        sx={{
          position: 'absolute',

          left: '50%',
          top: '50%',

          transform:
            'translate(-50%, -50%)',

          width: '64%',

          zIndex: 2,

          pointerEvents: 'none',
        }}
      />


      {/* ====================================
          OUTER SKILL ORBIT
      ==================================== */}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          transformOrigin: 'center center',
          pointerEvents: 'none',
          animation:
            `${rotateClockwise} 60s linear infinite`,
        }}
      >

        {outerSkills.map(
          (skill) => (

            <SkillIcon
              key={skill.name}

              skill={skill}

              radius={outerRadius}

              counterDirection="counterClockwise"

              duration={60}
            />

          )
        )}

      </Box>


      {/* ====================================
          INNER SKILL ORBIT
      ==================================== */}

      <Box
        sx={{
          position: 'absolute',

          inset: 0,

          zIndex: 4,

          transformOrigin: 'center center',

          pointerEvents: 'none',

          animation:
            `${rotateCounterClockwise} 48s linear infinite`,
        }}
      >

        {innerSkills.map(
          (skill) => (

            <SkillIcon
              key={skill.name}

              skill={skill}

              radius={innerRadius}

              counterDirection="clockwise"

              duration={48}
            />

          )
        )}

      </Box>

    </Box>
  );
};

export default SkillOrbit;
