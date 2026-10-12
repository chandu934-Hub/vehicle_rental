import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, formatError, money } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { getVehicleImage } from '../lib/vehicleImages.js'
import {
  IconShield,
  IconStar,
  IconClock
} from '../components/Icons.jsx'

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [vehicle, setVehicle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Booking form state
  const [dates, setDates] = useState({
    startDate: '',
    endDate: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([
      api.get(`/api/vehicles/${id}`).then(res => res.data),
      api.get(`/api/vehicles/${id}/reviews`).then(res => res.data).catch(() => [])
    ])
      .then(([vehicleData, reviewsData]) => {
        setVehicle(vehicleData)
        setReviews(reviewsData)
      })
      .catch(err => setError(formatError(err)))
      .finally(() => setLoading(false))
  }, [id])

  // Calculate rental days & total price
  const rentalDays = (() => {
    if (!dates.startDate || !dates.endDate) return 0
    const start = new Date(dates.startDate)
    const end = new Date(dates.endDate)
    const diffTime = end - start
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  })()

  const calculatedTotal = vehicle && rentalDays > 0
    ? (Number(vehicle.dailyRate) * rentalDays).toFixed(2)
    : '0.00'

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!dates.startDate || !dates.endDate) {
      setBookingError('Please select both pick-up and return dates.')
      return
    }
    if (rentalDays <= 0) {
      setBookingError('Return date must be strictly after the pick-up date.')
      return
    }

    setBookingLoading(true)
    setBookingError('')
    try {
      const res = await api.post('/api/bookings', {
        vehicleId: vehicle.id,
        startDate: dates.startDate,
        endDate: dates.endDate
      })
      navigate(`/bookings/${res.data.id}`)
    } catch (err) {
      setBookingError(formatError(err))
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        Loading vehicle specifications and telemetry...
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '60px auto' }}>
        <div className="alert-box alert-error">
          {error || 'Vehicle could not be loaded.'}
        </div>
        <Link to="/vehicles" className="btn btn-outline btn-sm">
          ← Return to Fleet
        </Link>
      </div>
    )
  }

  const imageUrl = getVehicleImage(vehicle)
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="page-container">
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/vehicles" style={{ color: 'var(--teal-600)', fontWeight: 600 }}>Fleet</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{vehicle.make} {vehicle.model}</span>
      </div>

      <div className="detail-grid">
        {/* Left Column: Visual & Specs */}
        <div>
          <div className="detail-gallery">
            <img
              src={imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="detail-main-img"
            />
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '32px', marginTop: '30px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="role-pill customer">{vehicle.type}</span>
              <span className={`vehicle-status-badge ${vehicle.status.toLowerCase()}`} style={{ position: 'static' }}>
                {vehicle.status}
              </span>
              {averageRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '0.9rem', fontWeight: 700 }}>
                  <IconStar size={16} /> {averageRating} ({reviews.length} reviews)
                </div>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {vehicle.make} {vehicle.model}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
              Model Year {vehicle.year} · Registration Plate: <b>{vehicle.registrationNumber}</b>
            </p>

            <div className="detail-specs-grid">
              <div className="spec-tile">
                <small>Vehicle Category</small>
                <strong>{vehicle.type}</strong>
              </div>
              <div className="spec-tile">
                <small>Registration</small>
                <strong>{vehicle.registrationNumber}</strong>
              </div>
              <div className="spec-tile">
                <small>Manufacturing Year</small>
                <strong>{vehicle.year}</strong>
              </div>
              <div className="spec-tile">
                <small>Fleet Availability</small>
                <strong style={{ color: vehicle.status === 'AVAILABLE' ? 'var(--emerald-500)' : 'var(--rose-500)' }}>
                  {vehicle.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconShield size={18} style={{ color: 'var(--teal-600)' }} /> Complete Maintenance Verified
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconClock size={18} style={{ color: 'var(--teal-600)' }} /> Instant Booking Confirmation
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Card */}
        <div>
          <div className="booking-card">
            <div className="booking-price-header">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Daily Rental Rate
                </span>
                <div className="booking-rate-num">
                  {money(vehicle.dailyRate)}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                per rental day
              </span>
            </div>

            {bookingError && <div className="alert-box alert-error">{bookingError}</div>}

            <form onSubmit={handleBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Pick-up Date</label>
                  <input
                    required
                    type="date"
                    className="form-input"
                    value={dates.startDate}
                    onChange={e => setDates({ ...dates, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Return Date</label>
                  <input
                    required
                    type="date"
                    className="form-input"
                    value={dates.endDate}
                    onChange={e => setDates({ ...dates, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Daily Rate</span>
                  <span>{money(vehicle.dailyRate)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Rental Days</span>
                  <span>{rentalDays} days</span>
                </div>
                <div className="breakdown-row" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  <span>*Half-open interval (return day exclusive)</span>
                </div>
                <div className="breakdown-row total">
                  <span>Total Estimated Cost</span>
                  <span>{money(calculatedTotal)}</span>
                </div>
              </div>

              {user ? (
                user.role === 'CUSTOMER' ? (
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    disabled={vehicle.status !== 'AVAILABLE' || bookingLoading || rentalDays <= 0}
                  >
                    {bookingLoading
                      ? 'Confirming Reservation...'
                      : vehicle.status === 'AVAILABLE'
                        ? 'Reserve This Vehicle ↗'
                        : 'Vehicle Currently Unavailable'}
                  </button>
                ) : (
                  <div className="alert-box alert-info" style={{ textAlign: 'center', fontSize: '0.88rem' }}>
                    Admin accounts cannot book personal rentals. Sign in as a Customer to reserve.
                  </div>
                )
              ) : (
                <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
                  Sign In To Reserve ↗
                </Link>
              )}
            </form>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Free cancellation available until pick-up.
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section style={{ marginTop: '70px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <span className="section-tag">Driver Feedback</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Verified Customer Reviews
            </h2>
          </div>
          {reviews.length > 0 && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>

        {reviews.length ? (
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="stars-row">
                  {[...Array(review.rating)].map((_, i) => <IconStar key={i} size={18} />)}
                </div>
                <p className="review-comment">
                  "{review.comment || 'No written comment provided.'}"
                </p>
                <div className="review-author">
                  Trip #{review.bookingId} Driver · {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Verified Renter'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <p>No customer reviews have been submitted for this vehicle yet.</p>
            <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
              Complete your journey and be the first to share your driving experience!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
