import React, { useState } from 'react'
import { api, formatError } from '../lib/api.js'
import { IconX } from './Icons.jsx'

const vehicleTypes = ['SEDAN', 'SUV', 'HATCHBACK', 'VAN', 'TRUCK']
const vehicleStatuses = ['AVAILABLE', 'UNAVAILABLE']

export default function VehicleModal({ vehicle, onClose, onSuccess }) {
  const isEdit = Boolean(vehicle && vehicle.id)
  const [form, setForm] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    registrationNumber: vehicle?.registrationNumber || '',
    type: vehicle?.type || 'SEDAN',
    status: vehicle?.status || 'AVAILABLE',
    dailyRate: vehicle?.dailyRate || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        dailyRate: Number(form.dailyRate)
      }
      if (isEdit) {
        await api.put(`/api/admin/vehicles/${vehicle.id}`, payload)
      } else {
        await api.post('/api/admin/vehicles', payload)
      }
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
          <h3>{isEdit ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gap: '16px' }}>
            {error && <div className="alert-box alert-error">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Make</label>
                <input
                  required
                  placeholder="e.g. BMW, Tesla"
                  className="form-input"
                  value={form.make}
                  onChange={e => setForm({ ...form, make: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Model</label>
                <input
                  required
                  placeholder="e.g. Model 3, RAV4"
                  className="form-input"
                  value={form.model}
                  onChange={e => setForm({ ...form, model: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input
                  required
                  type="number"
                  min="1900"
                  max="2100"
                  className="form-input"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Plate</label>
                <input
                  required
                  placeholder="e.g. MH-02-CD-5678"
                  className="form-input"
                  value={form.registrationNumber}
                  onChange={e => setForm({ ...form, registrationNumber: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Body Type</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  {vehicleStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Rental Rate (₹)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 4500.00"
                className="form-input"
                value={form.dailyRate}
                onChange={e => setForm({ ...form, dailyRate: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Register Vehicle ↗'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
