import { createTheme } from '@mui/material/styles';

/**
 * 포트폴리오 테마 설정
 * 컬러 팔레트: 스타벅스 봄 시즌 (라일락 퍼플 계열)
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#9B7BB8',
      light: '#C4A8D8',
      dark: '#7B5BA0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E84B5B',
      light: '#F8A5A5',
      dark: '#D43F4F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDF0F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D2D2D',
      secondary: '#6B6B6B',
    },
    divider: '#F0E0E0',
    custom: {
      bgSecondary: '#FCE4E8',
      bgTertiary: '#FFF5F5',
      textHeading: '#8B2332',
      textMuted: '#9B9B9B',
      accent: '#8B6914',
      cherryBlossom: '#F5C6D0',
      petal: '#FADCE3',
      cream: '#F5E6D3',
      shadow: 'rgba(155, 123, 184, 0.15)',
      shadowHover: 'rgba(155, 123, 184, 0.25)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#8B2332',
    },
    h2: {
      fontWeight: 600,
      color: '#8B2332',
    },
    h3: {
      fontWeight: 600,
      color: '#8B2332',
    },
    h4: {
      fontWeight: 500,
      color: '#8B2332',
    },
    h5: {
      fontWeight: 500,
      color: '#8B2332',
    },
    h6: {
      fontWeight: 500,
      color: '#8B2332',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        containedPrimary: {
          boxShadow: '0 4px 12px rgba(155, 123, 184, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(155, 123, 184, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(155, 123, 184, 0.15)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(155, 123, 184, 0.25)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(155, 123, 184, 0.15)',
        },
      },
    },
  },
  spacing: 8,
});

export default theme;
