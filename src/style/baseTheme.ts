// Third party
import { createTheme } from '@mui/material/styles'

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#61DAFB'
    },
    secondary: {
      main: '#EA526F'
    }
  },
  typography: {
    allVariants: {
      color: 'white'
    }
  }
})

export default baseTheme
