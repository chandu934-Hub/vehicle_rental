import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatError, money } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import ReviewModal from '../components/ReviewModal.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import {
  IconCar,
  IconCalendar,
  IconClock,
  IconCheck,
  IconStar,
  IconArrowRight,
  IconCreditCard
} from '../components/Icons.jsx'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  // Modals state
  const [reviewBooking, setReviewBooking] = useState(null)
  const [payBooking, setPayBooking] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/bookings')
      setBookings(res.data)

      // Fetch payment status for each booking
      const paymentMap = {}
      await Promise.all(
        res.data.map(async (b) => {
          try {
            const pRes = await api.get(`/api/bookings/${b.id}/payment`)
            paymentMap[b.id] = pRes.data
          } catch {
            paymentMap[b.id] = null
          }
        })
      )
      setPayments(paymentMap)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return
    try {
      await api.delete(`/api/bookings/${id}`)
      loadData()
    } catch (err) {
      alert(formatError(err))
    }
  }

  // Split bookings by status
  const activeBookings = bookings.filter(b => ['CONFIRMED', 'PENDING'].includes(b.status))
  const pastBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status))

  // Metrics
  const totalSpent = bookings
    .filter(b => b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && payments[b.id]))
    .reduce((sum, b) => sum + Number(b.totalPrice), 0)

  const displayedBookings = activeTab === 'active' ? activeBookings : pastBookings

  return (
    <div className="page-container">
      {/* Dashboard Profile Header */}
      <div className="dashboard-header">
        <div className="dashboard-user-meta">
          <div className="user-avatar-circle">
            {(user?.fullName || user?.email)?.charAt(0).toUpperCase() || 'R'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="role-pill customer">{user?.role}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Active Member</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
              {user?.fullName || user?.email}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              {user?.fullName ? `${user.email}${user.phoneNumber ? ' • 📞 ' + user.phoneNumber : ''}` : 'Welcome back to your Roam journey center.'}
            </p>
          </div>
        </div>

        <div>
          <Link to="/vehicles" className="btn btn-primary btn-sm">
            Reserve New Ride <IconArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid-row">
        <div className="stat-metric-card">
          <small>Total Bookings</small>
          <strong>{bookings.length}</strong>
        </div>
        <div className="stat-metric-card">
          <small>Active & Confirmed</small>
          <strong style={{ color: 'var(--emerald-500)' }}>{activeBookings.length}</strong>
        </div>
        <div className="stat-metric-card">
          <small>Completed Trips</small>
          <strong style={{ color: 'var(--blue-500)' }}>
            {bookings.filter(b => b.status === 'COMPLETED').length}
          </strong>
        </div>
        <div className="stat-metric-card">
          <small>Settled Value</small>
          <strong style={{ color: 'var(--navy-900)' }}>{money(totalSpent)}</strong>
        </div>
      </div>

      {error && <div className="alert-box alert-error">{error}</div>}

      {/* Tabs */}
      <div className="trips-tab-bar">
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active & Upcoming Trips ({activeBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Trip History & Past Journeys ({pastBookings.length})
        </button>
      </div>

      {/* Booking List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Retrieving reservation history...
        </div>
      ) : displayedBookings.length ? (
        <div>
          {displayedBookings.map(b => {
            const payment = payments[b.id]
            const isPaid = payment && payment.status === 'SUCCESS'

            return (
              <article key={b.id} className="trip-card">
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Reservation #{b.id}
                  </span>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy-900)', marginTop: '4px' }}>
                    {b.startDate}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    until {b.endDate}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '6px' }}>
                    {b.vehicleName}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`trip-status-pill ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                    {isPaid ? (
                      <span className="role-pill customer" style={{ fontSize: '0.7rem' }}>
                        ✓ Paid ({payment.method})
                      </span>
                    ) : b.status === 'CONFIRMED' ? (
                      <span className="role-pill admin" style={{ fontSize: '0.7rem' }}>
                        Unpaid
                      </span>
                    ) : null}
                  </div>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Total Cost</small>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy-900)' }}>
                    {money(b.totalPrice)}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Link to={`/bookings/${b.id}`} className="btn btn-outline btn-sm">
                    Details
                  </Link>

                  {b.status === 'CONFIRMED' && !isPaid && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setPayBooking(b)}
                    >
                      <IconCreditCard size={15} /> Pay Now
                    </button>
                  )}

                  {b.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setReviewBooking(b)}
                    >
                      <IconStar size={14} /> Leave Review
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '70px 20px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
            <IconCalendar size={48} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
            {activeTab === 'active' ? 'No active journeys scheduled' : 'No past rental history'}
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
            {activeTab === 'active'
              ? 'Your journal is quiet. Find your dream vehicle in our fleet and embark on your next adventure!'
              : 'Completed trips and cancellation records will appear here.'}
          </p>
          <Link to="/vehicles" className="btn btn-primary btn-sm">
            Explore Available Vehicles ↗
          </Link>
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null)
            alert('Thank you! Your verified review has been published.')
            loadData()
          }}
        />
      )}

      {/* Payment Modal */}
      {payBooking && (
        <PaymentModal
          booking={payBooking}
          onClose={() => setPayBooking(null)}
          onSuccess={() => {
            loadData()
          }}
        />
      )}
    </div>
  )
}
