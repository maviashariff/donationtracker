import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CampaignList from './pages/CampaignList'
import CampaignDetails from './pages/CampaignDetails'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/campaigns" replace />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/campaigns" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
