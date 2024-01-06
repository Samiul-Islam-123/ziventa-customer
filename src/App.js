  import './App.css';
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Import createTheme from @mui/material/styles
import NavBar from './Public/NavBar/NavBar';
import RoutesController from './Public/RoutesController';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#8bc34a'
    },
    secondary: {
      main: "#FFD700"
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <RoutesController />
    </ThemeProvider>
  );
}

export default App;
