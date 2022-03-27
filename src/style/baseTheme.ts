// Third party
import { createTheme } from '@mui/material/styles'

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#4FC1F1'
    },
    secondary: {
      main: '#EA526F'
    }
  },
  typography: {
    allVariants: {
      color: 'white'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#61DAFB'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C3741'
        }
      }
    }
  }
})

export default baseTheme
