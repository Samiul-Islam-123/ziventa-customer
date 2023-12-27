import './App.css';
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Import createTheme from @mui/material/styles

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

      Hellow World, this is dark mode :)





    </ThemeProvider>
  );
}

export default App;
