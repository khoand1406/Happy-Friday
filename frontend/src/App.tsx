import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPage'
import { MembersPage } from './pages/MemberPage'
import DepartmentDetail from './pages/ListEmployee'
import { ProfilePage } from './pages/ProfilePage'
import { ForgetPassword } from './pages/ForgetPassword'
import { AdminDashboard } from './pages/AdminDashboard'
import DualCalendarLayout from './layout/Calender'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import AdminProjectDetail from './pages/AdminProjectDetail'

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
        <Route element= {<DualCalendarLayout/>} path='/calendar'></Route>
        <Route element= {<ForgetPassword />} path='/forgot-password'></Route>
        <Route element= {<AdminDashboard />} path='/Admin/Dashboard'></Route>
        <Route element= {<AdminProjectDetail />} path='/admin/projects/:id'></Route>
        <Route element= {<ProjectList />} path='/projects'></Route>
        <Route element= {<ProjectDetail />} path='/projects/:id'></Route>

    </Routes>
    </BrowserRouter>
    
  )
}

export default App