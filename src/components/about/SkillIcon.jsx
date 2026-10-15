import {
  Box,
  Tooltip,
} from '@mui/material';

import { keyframes } from '@emotion/react';


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


const SkillIcon = ({
  skill,
  radius,
  counterDirection,
  duration,
}) => {

  const angle =
    (skill.angle * Math.PI) / 180;


  const x =
    Math.cos(angle) * radius;

  const y =
    Math.sin(angle) * radius;


  const counterAnimation =
    counterDirection === 'clockwise'
      ? rotateClockwise
      : rotateCounterClockwise;


  return (
    <Tooltip
      title={skill.name}
      arrow
    >

      {/* POSITION ICON ON ORBIT */}

      <Box
        sx={{
          position: 'absolute',

          left: '50%',
          top: '50%',

          transform: `
            translate(-50%, -50%)
            translate(${x}px, ${y}px)
          `,

          zIndex: 10,
          pointerEvents: 'auto',
        }}
      >

        {/* COUNTER ROTATION */}

        <Box
          sx={{
            animation:
              `${counterAnimation} ${duration}s linear infinite`,
          }}
        >

          {/* ICON */}

          <Box
            sx={{
              width: {
                xs: 42,
                md: 52,
              },

              height: {
                xs: 42,
                md: 52,
              },

              borderRadius: '50%',

              backgroundColor: '#fff',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              cursor: 'pointer',

              transition:
                'transform 0.25s ease, box-shadow 0.25s ease',

              '&:hover': {
                transform:
                  'scale(1.2)',

                boxShadow:
                  '0 0 25px rgba(255,255,255,0.5)',
              },
            }}
          >

            <Box
              component="img"

              src={skill.icon}

              alt={skill.name}

              sx={{
                width: '62%',
                height: '62%',

                objectFit: 'contain',

                userSelect: 'none',

                pointerEvents: 'none',
              }}
            />

          </Box>

        </Box>

      </Box>

    </Tooltip>
  );
};

export default SkillIcon;
