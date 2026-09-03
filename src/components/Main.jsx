import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Live from '../pages/Live'
import UsersPage from '../pages/UsersPage'
import SettingsPage from '../pages/Settings'
import ReportPage from './Report/ReportPage'
import ReportViewPage from './Report/ReportViewPage'

function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/LIVE" element={<Live />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/SETTINGS" element={<SettingsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/ReportView" element={<ReportViewPage />} />
      </Routes>
    </>
  )
}

export default Main
