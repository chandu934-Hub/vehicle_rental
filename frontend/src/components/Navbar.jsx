import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { IconCar, IconUser } from './Icons.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-badge">
            <IconCar size={22} />
          </div>
          <span>ROAM<span className="brand-dot">.</span></span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/vehicles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Fleet
          </NavLink>
          <a href="/#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="/#faq" className="nav-link">
            FAQs
          </a>
          {user?.role === 'CUSTOMER' && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Trips
            </NavLink>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Control Room
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="user-badge" title={user.fullName ? `${user.fullName} (${user.email})` : user.email}>
                <IconUser size={16} />
                <span>{user.fullName || user.email}</span>
                <span className={`role-pill ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Roam ↗
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
