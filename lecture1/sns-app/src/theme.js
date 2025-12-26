import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E1306C',
      light: '#FCE4EC',
      dark: '#833AB4',
    },
    secondary: {
      main: '#833AB4',
    },
    error: {
      main: '#ED4956',
    },
    success: {
      main: '#58C322',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#262626',
      secondary: '#8E8E8E',
    },
    divider: '#DBDBDB',
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 700,
    },
    h2: {
      fontSize: '18px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
    },
    button: {
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #E1306C 30%, #833AB4 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #C1275C 30%, #7331A0 90%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FAFAFA',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#DBDBDB',
            },
            '&:hover fieldset': {
              borderColor: '#E1306C',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E1306C',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 44,
        },
      },
    },
  },
});

export default theme;
