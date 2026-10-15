import {
  Box,
  Stack,
  Typography,
} from '@mui/material';

const TestimonialCard = ({
  testimonial,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',

        minHeight: {
          xs: 280,
          md: 320,
        },

        p: {
          xs: 3,
          md: 4,
        },

        border:
          '1px solid rgba(255,255,255,.25)',

        borderRadius: '24px',

        background:
          'linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.015))',

        backdropFilter: 'blur(10px)',

        overflow: 'hidden',

        transition:
          'transform .35s ease, border-color .35s ease, background .35s ease',

        '&:hover': {
          transform:
            'translateY(-8px)',

          borderColor:
            'rgba(255,255,255,.65)',

          background:
            'linear-gradient(145deg, rgba(255,255,255,.1), rgba(255,255,255,.025))',
        },
      }}
    >

      {/* NUMBER */}

      <Typography
        sx={{
          position: 'absolute',

          top: 22,
          right: 26,

          fontSize: 11,

          letterSpacing: 2,

          color:
            'rgba(255,255,255,.3)',
        }}
      >
        0{testimonial.id}
      </Typography>


      {/* STAR RATING */}

      <Typography
        sx={{
          fontSize: 13,

          letterSpacing: 3,

          mb: 4,
        }}
      >
        {'★'.repeat(
          testimonial.rating
        )}
      </Typography>


      {/* QUOTE */}

      <Typography
        sx={{
          fontSize: {
            xs: 17,
            md: 20,
          },

          lineHeight: 1.6,

          fontWeight: 500,

          color:
            'rgba(255,255,255,.85)',
        }}
      >
        “{testimonial.feedback}”
      </Typography>


      {/* CLIENT */}

      <Stack
        sx={{
          position: 'absolute',

          left: {
            xs: 24,
            md: 32,
          },

          bottom: {
            xs: 24,
            md: 30,
          },
        }}
      >

        <Typography
          sx={{
            fontSize: 13,

            fontWeight: 900,

            letterSpacing: 1,
          }}
        >
          {testimonial.name}
        </Typography>


        <Typography
          sx={{
            mt: 0.5,

            fontSize: 11,

            color:
              'rgba(255,255,255,.45)',
          }}
        >
          {testimonial.role}
          {' • '}
          {testimonial.company}
        </Typography>

      </Stack>

    </Box>
  );
};

export default TestimonialCard;
