import { createTheme } from '@mui/material/styles';

const BMW_BLUE = '#0066B1';
const BMW_WHITE = '#FFFFFF';
const BMW_DARK = '#1C1C1E';
const SILVER = '#C0C0C0';
const LIGHT_GRAY = '#F5F5F7';
const ACCENT_RED = '#E4002B';

const theme = createTheme({
  palette: {
    primary: { main: BMW_BLUE, contrastText: BMW_WHITE },
    secondary: { main: SILVER, contrastText: BMW_DARK },
    error: { main: ACCENT_RED },
    background: { default: BMW_WHITE, paper: LIGHT_GRAY },
    text: { primary: BMW_DARK, secondary: '#525252' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '0.02em' },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 }
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, fontWeight: 600, textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: BMW_WHITE, color: BMW_DARK } } }
  }
});

export default theme;


