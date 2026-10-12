import React, { useState } from 'react'
import { api, formatError, money } from '../lib/api.js'
import { IconCheck, IconShield, IconX } from './Icons.jsx'

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const [method, setMethod] = useState('CARD')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)

  const handlePay = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post(`/api/bookings/${booking.id}/payment`, { method })
      setReceipt(res.data)
      if (onSuccess) onSuccess(res.data)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Checkout & Payment</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <IconX size={18} />
          </button>
        </div>

        {receipt ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#D1FAE5',
              color: '#059669',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <IconCheck size={36} />
            </div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px' }}>
              Payment Confirmed!
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Your reservation for <b>{booking.vehicleName}</b> is locked and confirmed.
            </p>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference</span>
                <span style={{ fontWeight: 700 }}>PAY-{receipt.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Channel</span>
                <span style={{ fontWeight: 700 }}>{receipt.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount Settled</span>
                <span style={{ fontWeight: 800, color: 'var(--navy-900)' }}>{money(receipt.amount)}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onClose}>
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay}>
            <div className="modal-body">
              {/* Honest Simulation Notice */}
              <div className="alert-box alert-info" style={{ fontSize: '0.82rem', marginBottom: '20px' }}>
                <IconShield size={18} style={{ flexShrink: 0 }} />
                <span>
                  <b>Simulation Engine:</b> Roam Rentals processes mock transactions safely for demonstration without charging live financial cards.
                </span>
              </div>

              {error && <div className="alert-box alert-error">{error}</div>}

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Trip Reservation #{booking.id}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0' }}>
                  {booking.vehicleName}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {booking.startDate} &nbsp;→&nbsp; {booking.endDate} (return exclusive)
                </div>
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span>Total Due:</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {money(booking.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Select Payment Method</label>
                <select
                  className="form-select"
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                >
                  <option value="CARD">Credit / Debit Card (Simulated)</option>
                  <option value="UPI">UPI Instant Pay (Simulated)</option>
                  <option value="NET_BANKING">Net Banking (Simulated)</option>
                  <option value="CASH">Cash on Vehicle Collection</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Verifying...' : `Confirm & Pay ${money(booking.totalPrice)} ↗`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
