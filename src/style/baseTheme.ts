// Third party
import { createTheme } from '@mui/material/styles'

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#1976D2'
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
    }
  }
})

export default baseTheme
