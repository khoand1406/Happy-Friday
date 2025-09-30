import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPage'
import { MembersPage } from './pages/MemberPage'
import DepartmentDetail from './pages/ListEmployee'
import { ProfilePage } from './pages/ProfilePage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element= {<LoginPage />} path='/'></Route>
        <Route element= {<LoginPage />} path='/login'></Route>
        <Route element= {<DashboardPage />} path='/dashboard'></Route>
        <Route element= {<MembersPage></MembersPage>} path='/members'></Route>
        <Route element= {<DepartmentDetail></DepartmentDetail>} path='/departments/:id'></Route>
        <Route element= {<ProfilePage />} path='/profile'></Route>
        <Route element= {<></>} path='/Admin/Dashboard'></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App