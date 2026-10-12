import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, formatError, money } from '../lib/api.js'
import PaymentModal from '../components/PaymentModal.jsx'
import {
  IconArrowRight,
  IconCreditCard
} from '../components/Icons.jsx'

export default function BookingDetailPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPayModal, setShowPayModal] = useState(false)

  const loadBooking = async () => {
    setLoading(true)
    setError('')
    try {
      const bRes = await api.get(`/api/bookings/${id}`)
      setBooking(bRes.data)

      try {
        const pRes = await api.get(`/api/bookings/${id}/payment`)
        setPayment(pRes.data)
      } catch {
        setPayment(null)
      }
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooking()
  }, [id])

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        Loading itinerary details...
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '60px auto' }}>
        <div className="alert-box alert-error">{error || 'Booking not found.'}</div>
        <Link to="/dashboard" className="btn btn-outline btn-sm">
          ← Return to My Trips
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag" style={{ margin: 0 }}>Reservation Voucher</span>
            <span className={`trip-status-pill ${booking.status.toLowerCase()}`}>
              {booking.status}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Trip #{booking.id} — {booking.vehicleName}
          </h1>
        </div>

        <Link to="/dashboard" className="btn btn-outline btn-sm">
          ← Back to Trips
        </Link>
      </div>

      {/* Main Itinerary Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '24px' }}>
          Schedule & Timeline
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center', padding: '24px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '28px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Collection Date
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '4px' }}>
              {booking.startDate}
            </div>
            <small style={{ color: 'var(--text-muted)' }}>From 10:00 AM dispatch</small>
          </div>

          <div style={{ color: 'var(--teal-600)', padding: '0 10px' }}>
            <IconArrowRight size={28} />
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Return Date (Exclusive)
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '4px' }}>
              {booking.endDate}
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Before 10:00 AM return</small>
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Reserved Vehicle</span>
            <span style={{ fontWeight: 700 }}>{booking.vehicleName}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Calculation Rule</span>
            <span style={{ fontSize: '0.88rem' }}>Half-open interval (return day exclusive)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '16px', borderTop: '1px dashed var(--border-medium)' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Reservation Amount</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {money(booking.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment & Settlement Panel */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Payment Record & Settlement
          </h3>
          {payment ? (
            <span className="role-pill customer">
              ✓ Settled ({payment.status})
            </span>
          ) : (
            <span className="role-pill admin">
              Pending Settlement
            </span>
          )}
        </div>

        {payment ? (
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.92rem' }}>
              <div>
                <small style={{ display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Reference</small>
                <strong>PAY-{payment.id}</strong>
              </div>
              <div>
                <small style={{ display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Method</small>
                <strong>{payment.method}</strong>
              </div>
              <div>
                <small style={{ display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Amount Paid</small>
                <strong style={{ color: 'var(--emerald-500)', fontSize: '1.1rem' }}>{money(payment.amount)}</strong>
              </div>
              <div>
                <small style={{ display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Settled On</small>
                <span>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'Confirmed'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
              This reservation has not been settled yet. Complete your simulated payment to guarantee vehicle dispatch.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowPayModal(true)}
            >
              <IconCreditCard size={18} /> Complete Payment ({money(booking.totalPrice)}) ↗
            </button>
          </div>
        )}
      </div>

      {showPayModal && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPayModal(false)}
          onSuccess={() => {
            setShowPayModal(false)
            loadBooking()
          }}
        />
      )}
    </div>
  )
}
