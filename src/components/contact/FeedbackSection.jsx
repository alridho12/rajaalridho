
import { Box, Typography } from '@mui/material';
import TestimonialCard from './TestimonialCard';

const cardPositions = [
  {
    top: '3%',
    left: '17%',
    width: '41%',
    zIndex: 4,
  },
  {
    top: '20%',
    left: '61%',
    width: '38%',
    zIndex: 3,
  },
  {
    top: '55%',
    left: '8%',
    width: '40%',
    zIndex: 5,
  },
  {
    top: '56%',
    left: '54%',
    width: '43%',
    zIndex: 3,
  },
  {
    top: '32%',
    left: '0%',
    width: '33%',
    zIndex: 2,
  },
];

const FeedbackSection = ({ testimonials = [] }) => {
  return (
    <Box
      component="section"
      id="feedback"
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        bgcolor: '#030303',
        color: '#fff',
        py: { xs: 9, md: 12 },
      }}
    >
      {/* STAR BACKGROUND */}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',

          backgroundImage: `
            radial-gradient(
              circle,
              rgba(255,255,255,.5) 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle,
              rgba(255,255,255,.3) 1px,
              transparent 1.5px
            )
          `,

          backgroundSize: '130px 140px, 190px 210px',
          backgroundPosition: '0 0, 60px 80px',
          opacity: 0.28,
        }}
      />

      {/* SUBTLE ORBIT LINE */}

      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '-12%',
          width: '85%',
          height: 360,

          border: '1px solid rgba(255,255,255,.09)',
          borderRadius: '50%',

          transform: 'rotate(-15deg)',

          pointerEvents: 'none',
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 2.5, md: 6 },
          position: 'relative',
        }}
      >
        {/* SECTION HEADING */}

        <Box
          sx={{
            position: 'relative',
            zIndex: 6,
            maxWidth: 330,
            mb: { xs: 5, md: 0 },
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: 3,
              color: 'rgba(255,255,255,.5)',
              mb: 2,
            }}
          >
            WHAT THEY SAY
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 43, md: 58 },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -2,
              mb: 3,
            }}
          >
            CLIENT
            <br />
            FEEDBACK.
          </Typography>

          <Typography
            sx={{
              maxWidth: 290,
              fontSize: 13,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,.5)',
            }}
          >
            Feedback from people I've had the opportunity
            to collaborate and build digital products with.
          </Typography>
        </Box>

        {/* DESKTOP FLOATING CARDS */}

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },

            position: 'relative',

            width: '75%',
            height: 780,

            ml: 'auto',
            mt: -160,
          }}
        >
          {testimonials.slice(0, 5).map((testimonial, index) => {
            const position = cardPositions[index];

            return (
              <Box
                key={testimonial.id ?? index}
                sx={{
                  position: 'absolute',

                  top: position.top,
                  left: position.left,
                  width: position.width,

                  zIndex: position.zIndex,

                  '&:hover, &:focus-within': {
                    zIndex: 20,
                  },
                }}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  index={index}
                  floating
                />
              </Box>
            );
          })}
        </Box>

        {/* MOBILE: SWIPEABLE CARDS */}

        <Box
          role="region"
          aria-label="Client testimonials"
          tabIndex={0}
          sx={{
            display: { xs: 'flex', md: 'none' },

            gap: 2,
            overflowX: 'auto',

            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',

            pb: 3,

            '&::-webkit-scrollbar': {
              height: 3,
            },

            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,.35)',
              borderRadius: 10,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Box
              key={testimonial.id ?? index}
              sx={{
                flex: '0 0 86%',
                maxWidth: 360,
                scrollSnapAlign: 'start',
              }}
            >
              <TestimonialCard
                testimonial={testimonial}
                index={index}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackSection;
