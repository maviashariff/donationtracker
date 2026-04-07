import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-white text-blue-700 shadow-sm'
        : 'text-white hover:bg-blue-700'
    }`

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/campaigns" className="flex items-center gap-2.5">
            <div className="bg-white rounded-full p-1.5 shadow">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block tracking-tight">
              DonateTrack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/campaigns" className={linkClass('/campaigns')}>
              Campaigns
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard" className={linkClass('/dashboard')}>
                My Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className={linkClass('/admin')}>
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="text-right">
                  <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-blue-200 text-xs mt-0.5 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-white border border-white/40 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 pb-4 space-y-1">
          <Link to="/campaigns" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white text-sm rounded-md hover:bg-blue-700">
            Campaigns
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white text-sm rounded-md hover:bg-blue-700">
              My Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white text-sm rounded-md hover:bg-blue-700">
              Admin Panel
            </Link>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-300 text-sm rounded-md hover:bg-blue-700">
              Logout ({user?.name})
            </button>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 border border-white/30 text-white text-sm rounded-md">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 bg-white text-blue-700 text-sm rounded-md font-medium">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
