// src/App.tsx
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/Dashboard'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element= {<LoginPage />} path='/'></Route>
        <Route element= {<LoginPage />} path='/login'></Route>
        <Route element= {<DashboardPage />} path='/dashboard'></Route>
        <Route element= {<></>} path='/Admin/Dashboard'></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App