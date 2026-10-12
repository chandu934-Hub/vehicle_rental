import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Pages
import HomePage from './pages/HomePage.jsx'
import FleetPage from './pages/FleetPage.jsx'
import VehicleDetailPage from './pages/VehicleDetailPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import BookingDetailPage from './pages/BookingDetailPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function Guard({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  }
  return children
}

export default function RoamApp() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<FleetPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage register />} />

          {/* Customer Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <Guard role="CUSTOMER">
                <DashboardPage />
              </Guard>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <Guard>
                <BookingDetailPage />
              </Guard>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <Guard role="ADMIN">
                <AdminPage />
              </Guard>
            }
          />
          <Route
            path="/admin/:section"
            element={
              <Guard role="ADMIN">
                <AdminPage />
              </Guard>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
