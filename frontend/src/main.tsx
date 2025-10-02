// src/main.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <App />
      </UserProvider>
      
    </ThemeProvider>
  </React.StrictMode>,
)
