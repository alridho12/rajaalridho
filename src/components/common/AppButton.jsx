import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AppButton = ({
  children,
  variant = 'filled',
  showArrow = false,
  sx,
  ...props
}) => {
  const filled = variant === 'filled';

  return (
    <Button
      {...props}
      endIcon={
        showArrow
          ? <ArrowForwardIcon />
          : null
      }
      sx={{
        px: 3.2,
        py: {
          xs: 1.2,
          md: 1.5,
        },

        borderRadius: '15px',

        fontWeight: 800,

        color: filled
          ? '#000'
          : '#fff',

        backgroundColor: filled
          ? '#fff'
          : 'transparent',

        border: '1px solid white',

        '&:hover': {
          backgroundColor: filled
            ? '#e7e7e7'
            : 'rgba(255,255,255,0.1)',
        },

        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
