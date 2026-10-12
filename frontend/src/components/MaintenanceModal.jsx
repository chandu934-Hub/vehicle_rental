import React, { useState } from 'react'
import { api, formatError } from '../lib/api.js'
import { IconX } from './Icons.jsx'

const maintenanceStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export default function MaintenanceModal({ vehicles = [], onClose, onSuccess }) {
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    startDate: '',
    endDate: '',
    status: 'SCHEDULED',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/api/admin/maintenance', {
        vehicleId: Number(form.vehicleId),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        description: form.description
      })
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
          <h3>Schedule Maintenance</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gap: '16px' }}>
            {error && <div className="alert-box alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Vehicle to Service</label>
              <select
                required
                className="form-select"
                value={form.vehicleId}
                onChange={e => setForm({ ...form, vehicleId: e.target.value })}
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  required
                  type="date"
                  className="form-input"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  required
                  type="date"
                  className="form-input"
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Maintenance Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                {maintenanceStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Service Description</label>
              <textarea
                required
                rows="3"
                placeholder="e.g. Brake pad inspection, routine 20,000 km oil change and tire rotation..."
                className="form-input"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Scheduling...' : 'Lock Schedule ↗'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
