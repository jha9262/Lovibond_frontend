import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import Main from './components/Main'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute><Main /></ProtectedRoute>} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'font-bold uppercase tracking-wider text-sm',
            style: {
              background: '#111827',
              color: '#ffffff',
              border: '2px solid #374151',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
            },
            success: {
              icon: <CheckCircle className="text-orange-500 w-5 h-5" />,
              style: { borderLeft: '4px solid #f97316' },
            },
            error: {
              icon: <AlertTriangle className="text-red-500 w-5 h-5" />,
              style: { borderLeft: '4px solid #ef4444' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  )
}

export default App
