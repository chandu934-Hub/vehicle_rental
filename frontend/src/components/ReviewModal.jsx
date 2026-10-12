import React, { useState } from 'react'
import { api, formatError } from '../lib/api.js'
import { IconStar, IconX } from './Icons.jsx'

export default function ReviewModal({ booking, onClose, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post(`/api/bookings/${booking.id}/review`, { rating, comment })
      onSuccess()
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Review Trip #{booking.id}</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
              How was your experience driving the <b>{booking.vehicleName}</b>?
            </p>

            {error && <div className="alert-box alert-error">{error}</div>}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Overall Rating</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= rating ? '#F59E0B' : '#CBD5E1',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <IconStar size={28} filled={star <= rating} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review (Optional)</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Share your thoughts on vehicle comfort, performance, and condition..."
                value={comment}
                maxLength="1000"
                onChange={e => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
