// src/App.tsx
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element= {<LoginPage></LoginPage>} path='/'></Route>
        <Route element= {<LoginPage></LoginPage>} path='/login'></Route>
        <Route element= {<></>} path='/Admin/Dashboard'></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App