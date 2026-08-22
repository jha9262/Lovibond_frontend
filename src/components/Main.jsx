import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Live from '../pages/Live'

import SettingsPage from '../pages/Settings'

function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/LIVE" element={<Live />} />
        <Route path="/SETTINGS" element={<SettingsPage />} />
      </Routes>
    </>
  )
}

export default Main
