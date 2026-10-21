
import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const floatOne = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translate3d(-14px, 20px, 0) rotate(-6deg);
  }
  15% {
    opacity: 1;
  }
  35% {
    opacity: 1;
    transform: translate3d(12px, -14px, 0) rotate(-3deg);
  }
  60% {
    opacity: 0.95;
    transform: translate3d(-8px, -22px, 0) rotate(-5deg);
  }
  82% {
    opacity: 0;
    transform: translate3d(16px, 8px, 0) rotate(-2deg);
  }
`;

const floatTwo = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translate3d(18px, -15px, 0) rotate(6deg);
  }
  12% {
    opacity: 0.9;
  }
  40% {
    opacity: 1;
    transform: translate3d(-15px, 13px, 0) rotate(3deg);
  }
  65% {
    opacity: 0.9;
    transform: translate3d(12px, -18px, 0) rotate(5deg);
  }
  85% {
    opacity: 0;
    transform: translate3d(-10px, 12px, 0) rotate(7deg);
  }
`;

const floatThree = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translate3d(0, 24px, 0) rotate(4deg);
  }
  16% {
    opacity: 1;
  }
  38% {
    opacity: 1;
    transform: translate3d(-18px, -10px, 0) rotate(1deg);
  }
  63% {
    opacity: 0.85;
    transform: translate3d(14px, -20px, 0) rotate(3deg);
  }
  86% {
    opacity: 0;
    transform: translate3d(-10px, 8px, 0) rotate(5deg);
  }
`;

const animations = [floatOne, floatTwo, floatThree];

const TestimonialCard = ({
  testimonial,
  index = 0,
  floating = false,
}) => {
  const animation = animations[index % animations.length];
  const duration = 20 + (index % 3) * 4;

  const rating = Math.max(
    0,
    Math.min(5, Math.round(Number(testimonial.rating) || 0))
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',

        minHeight: {
          xs: 280,
          md: 310,
        },

        p: {
          xs: 3,
          md: 3.5,
        },

        border: '1px solid rgba(255,255,255,.3)',
        borderRadius: '22px',

        background:
          'linear-gradient(145deg, rgba(30,30,30,.95), rgba(5,5,5,.96))',

        backdropFilter: 'blur(14px)',

        boxShadow:
          '0 20px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05)',

        transition:
          'transform .35s ease, border-color .35s ease, box-shadow .35s ease',

        '&:hover': {
          transform: 'scale(1.04)',

          borderColor: 'rgba(255,255,255,.75)',

          boxShadow:
            '0 25px 70px rgba(0,0,0,.7), 0 0 25px rgba(255,255,255,.06)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 270, md: 290 },
          boxSizing: 'border-box',

          p: { xs: 3, md: 3.5 },

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 3,

          border: '1px solid rgba(255,255,255,.32)',
          borderRadius: '22px',

          background:
            'linear-gradient(145deg, rgba(28,28,28,.96), rgba(5,5,5,.94))',

          backdropFilter: 'blur(14px)',

          boxShadow: `
            0 20px 60px rgba(0,0,0,.55),
            inset 0 1px 0 rgba(255,255,255,.04)
          `,

          transition:
            'transform .35s ease, border-color .35s ease, box-shadow .35s ease',

          '&:hover': {
            transform: 'scale(1.04)',

            borderColor: 'rgba(255,255,255,.8)',

            boxShadow: `
              0 25px 70px rgba(0,0,0,.7),
              0 0 25px rgba(255,255,255,.07)
            `,
          },
        }}
      >
        {/* CARD NUMBER */}

        <Typography
          sx={{
            position: 'absolute',
            top: 22,
            right: 24,
            fontSize: 11,
            letterSpacing: 2,
            color: 'rgba(255,255,255,.4)',
          }}
        >
          {String(testimonial.id).padStart(2, '0')}
        </Typography>

        {/* STARS AND FEEDBACK */}

        <Box>
          <Typography
            sx={{
              mb: 3,
              fontSize: 14,
              letterSpacing: 3,
              color: '#fff',
            }}
          >
            {'★'.repeat(rating)}
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: 16,
                md: 16,
                lg: 18,
              },
              lineHeight: 1.6,
              fontWeight: 500,
              color: 'rgba(255,255,255,.85)',
            }}
          >
            “{testimonial.feedback}”
          </Typography>
        </Box>

        {/* CLIENT INFO */}

        <Stack spacing={0.5}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 0.3,
              color: '#fff',
            }}
          >
            {testimonial.name}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,.45)',
            }}
          >
            {[testimonial.role, testimonial.company]
              .filter(Boolean)
              .join(' • ')}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default TestimonialCard;
