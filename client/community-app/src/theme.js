import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9c27b0', //purple
    },
    secondary: {
      main: '#9c27b0', 
    },
    background: {
      default: '#f5f5f5', //form?
      paper: '#f4f3ee', //light beige paper
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;