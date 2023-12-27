import './App.css';
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Import createTheme from @mui/material/styles
import NavBar from './Public/NavBar/NavBar';

const theme = createTheme({
  palette: {
    mode: "dark", 
    primary : {
      main : '#333333'
    },
    secondary : {
      main : "#FFD700"
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <NavBar />

    



    </ThemeProvider>
  );
}

export default App;
