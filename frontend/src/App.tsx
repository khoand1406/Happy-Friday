// src/App.tsx
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import React from 'react'

const App: React.FC = () => {
  return (
    <Container sx={{ textAlign: 'center', marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Hello React + MUI + TypeScript
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Container>
  )
}

export default App