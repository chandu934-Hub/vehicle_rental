import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api, formatError } from '../lib/api.js'
import {
  IconCar,
  IconLock,
  IconMail,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconShield,
  IconUser,
  IconPhone
} from '../components/Icons.jsx'

export default function AuthPage({ register = false }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = register ? '/api/auth/register' : '/api/auth/login'
      const payload = register
        ? {
            fullName: form.fullName.trim(),
            phoneNumber: form.phoneNumber.trim(),
            email: form.email.trim(),
            password: form.password
          }
        : {
            email: form.email.trim(),
            password: form.password
          }
      const res = await api.post(endpoint, payload)
      login(res.data)
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email, password) => {
    setForm({ fullName: '', phoneNumber: '', email, password })
    setError('')
  }

  return (
    <div className="auth-wrapper">
      {/* Left Pane: Automotive Branding */}
      <div className="auth-hero-pane">
        <Link to="/" className="brand-logo" style={{ color: '#FFFFFF' }}>
          <div className="brand-badge">
            <IconCar size={22} />
          </div>
          <span>ROAM<span className="brand-dot">.</span></span>
        </Link>

        <div>
          <span className="role-pill customer" style={{ marginBottom: '16px', display: 'inline-block' }}>
            {register ? 'JOIN THE ROAM FAMILY' : 'DRIVER ACCESS PORTAL'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
            {register ? (
              <>The open highway <br /><span style={{ color: 'var(--teal-400)' }}>awaits you.</span></>
            ) : (
              <>Pick up right <br /><span style={{ color: 'var(--teal-400)' }}>where you left off.</span></>
            )}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '420px' }}>
            Access verified fleet inventory, view upcoming itineraries, and manage rental reservations seamlessly.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
          <IconShield size={16} /> 256-bit Encrypted JWT Session Authentication
        </div>
      </div>

      {/* Right Pane: Form */}
      <div className="auth-form-pane">
        <h1 className="auth-title">
          {register ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="auth-sub">
          {register
            ? 'Sign up in seconds to reserve exceptional rental vehicles.'
            : 'Enter your credentials to manage your trips and bookings.'}
        </p>

        {/* Demo Credentials Helper Box (Login Only) */}
        {!register && (
          <div className="demo-pills-box">
            <div className="demo-pills-title">Quick Demo Logins (Click to autofill)</div>
            <div className="demo-buttons-row">
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('customer@roamrentals.com', 'Customer@12345')}
              >
                Demo Customer
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('admin@roamrentals.com', 'Admin@12345')}
              >
                Demo Admin
              </button>
            </div>
          </div>
        )}

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
          {register && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Chandu Kumar"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <IconUser size={18} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    value={form.phoneNumber}
                    onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <IconPhone size={18} />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                required
                type="email"
                placeholder="name@example.com"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <IconMail size={18} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrap">
              <input
                required
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                className="form-input"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <IconLock size={18} />
              </div>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : register ? 'Create Account ↗' : 'Sign In ↗'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          {register ? (
            <>
              Already have a Roam account?{' '}
              <Link to="/login" style={{ color: 'var(--teal-600)', fontWeight: 700 }}>
                Sign In
              </Link>
            </>
          ) : (
            <>
              New to Roam Rentals?{' '}
              <Link to="/register" style={{ color: 'var(--teal-600)', fontWeight: 700 }}>
                Join Roam
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
