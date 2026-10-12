import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, formatError, money } from '../lib/api.js'
import VehicleModal from '../components/VehicleModal.jsx'
import MaintenanceModal from '../components/MaintenanceModal.jsx'
import {
  IconCar,
  IconCalendar,
  IconUser,
  IconWrench,
  IconClock,
  IconPlus,
  IconTrash,
  IconEdit
} from '../components/Icons.jsx'

const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function AdminPage() {
  const { section = 'dashboard' } = useParams()
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modals state
  const [vehicleModalData, setVehicleModalData] = useState(null) // null = closed, {} = add, vehicle = edit
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)

  const loadCurrentSection = async () => {
    setLoading(true)
    setError('')
    try {
      if (section === 'dashboard') {
        const [dashRes, bookRes] = await Promise.all([
          api.get('/api/admin/dashboard'),
          api.get('/api/admin/bookings')
        ])
        setDashboard(dashRes.data)
        setBookings(bookRes.data)
      } else if (section === 'vehicles') {
        const res = await api.get('/api/admin/vehicles')
        setVehicles(res.data)
      } else if (section === 'bookings') {
        const res = await api.get('/api/admin/bookings')
        setBookings(res.data)
      } else if (section === 'maintenance') {
        const [mRes, vRes] = await Promise.all([
          api.get('/api/admin/maintenance'),
          api.get('/api/admin/vehicles')
        ])
        setMaintenance(mRes.data)
        setVehicles(vRes.data)
      } else if (section === 'users') {
        const res = await api.get('/api/admin/users')
        setUsers(res.data)
      }
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCurrentSection()
  }, [section])

  // Vehicle Delete
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from the fleet?')) return
    try {
      await api.delete(`/api/admin/vehicles/${id}`)
      loadCurrentSection()
    } catch (err) {
      alert(formatError(err))
    }
  }

  // Booking Status Update
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/bookings/${id}/status`, null, { params: { status } })
      loadCurrentSection()
    } catch (err) {
      alert(formatError(err))
    }
  }

  // Maintenance Delete
  const handleDeleteMaintenance = async (id) => {
    if (!window.confirm('Delete this maintenance record?')) return
    try {
      await api.delete(`/api/admin/maintenance/${id}`)
      loadCurrentSection()
    } catch (err) {
      alert(formatError(err))
    }
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
          <span className="section-tag" style={{ color: 'var(--teal-400)', fontSize: '0.75rem', marginBottom: '4px' }}>
            OPERATIONS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
            Control Room
          </h2>
        </div>

        <nav>
          <button
            className={`admin-nav-item ${section === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconClock size={18} /> Overview KPI
          </button>

          <button
            className={`admin-nav-item ${section === 'vehicles' ? 'active' : ''}`}
            onClick={() => navigate('/admin/vehicles')}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconCar size={18} /> Fleet Inventory
          </button>

          <button
            className={`admin-nav-item ${section === 'bookings' ? 'active' : ''}`}
            onClick={() => navigate('/admin/bookings')}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconCalendar size={18} /> Customer Bookings
          </button>

          <button
            className={`admin-nav-item ${section === 'maintenance' ? 'active' : ''}`}
            onClick={() => navigate('/admin/maintenance')}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconWrench size={18} /> Maintenance
          </button>

          <button
            className={`admin-nav-item ${section === 'users' ? 'active' : ''}`}
            onClick={() => navigate('/admin/users')}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconUser size={18} /> Registered Users
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content-pane">
        {error && <div className="alert-box alert-error">{error}</div>}

        {/* 1. OVERVIEW DASHBOARD */}
        {section === 'dashboard' && (
          <div>
            <div className="admin-top-bar">
              <div>
                <span className="section-tag">Telemetry</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Operations Overview
                </h1>
              </div>
            </div>

            {loading || !dashboard ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading operations telemetry...</p>
            ) : (
              <>
                <div className="stats-grid-row">
                  <div className="stat-metric-card">
                    <small>Total Fleet Vehicles</small>
                    <strong style={{ color: 'var(--teal-600)' }}>{dashboard.vehicles}</strong>
                  </div>

                  <div className="stat-metric-card">
                    <small>Registered Accounts</small>
                    <strong style={{ color: 'var(--navy-900)' }}>{dashboard.users}</strong>
                  </div>

                  <div className="stat-metric-card">
                    <small>Confirmed Bookings</small>
                    <strong style={{ color: 'var(--emerald-500)' }}>{dashboard.confirmedBookings}</strong>
                  </div>

                  <div className="stat-metric-card">
                    <small>Completed Trips</small>
                    <strong style={{ color: 'var(--blue-500)' }}>{dashboard.completedBookings}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '36px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                      Recent Customer Reservations
                    </h3>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/bookings')}>
                      View All Bookings →
                    </button>
                  </div>

                  <div className="data-table-card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Vehicle</th>
                          <th>Schedule</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id}>
                            <td><b>#{b.id}</b></td>
                            <td>{b.vehicleName}</td>
                            <td>{b.startDate} → {b.endDate}</td>
                            <td>{money(b.totalPrice)}</td>
                            <td>
                              <span className={`trip-status-pill ${b.status.toLowerCase()}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 2. FLEET INVENTORY */}
        {section === 'vehicles' && (
          <div>
            <div className="admin-top-bar">
              <div>
                <span className="section-tag">Inventory</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Fleet Vehicle Management
                </h1>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setVehicleModalData({})}
              >
                <IconPlus size={16} /> Add New Vehicle
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading fleet list...</p>
            ) : (
              <div className="data-table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Make & Model</th>
                      <th>Plate</th>
                      <th>Category</th>
                      <th>Daily Rate</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.id}>
                        <td><b>#{v.id}</b></td>
                        <td>
                          <strong>{v.make} {v.model}</strong>
                          <small style={{ display: 'block', color: 'var(--text-muted)' }}>Year {v.year}</small>
                        </td>
                        <td><code>{v.registrationNumber}</code></td>
                        <td><span className="role-pill customer">{v.type}</span></td>
                        <td><strong>{money(v.dailyRate)}</strong></td>
                        <td>
                          <span className={`vehicle-status-badge ${v.status.toLowerCase()}`} style={{ position: 'static' }}>
                            {v.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ marginRight: '8px' }}
                            onClick={() => setVehicleModalData(v)}
                          >
                            <IconEdit size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteVehicle(v.id)}
                          >
                            <IconTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. BOOKINGS OVERSIGHT */}
        {section === 'bookings' && (
          <div>
            <div className="admin-top-bar">
              <div>
                <span className="section-tag">Reservations</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  All Customer Bookings
                </h1>
              </div>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading reservations...</p>
            ) : (
              <div className="data-table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vehicle</th>
                      <th>Timeline</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><b>#{b.id}</b></td>
                        <td><strong>{b.vehicleName}</strong></td>
                        <td>
                          {b.startDate} → {b.endDate}
                          <small style={{ display: 'block', color: 'var(--text-muted)' }}>Half-open interval</small>
                        </td>
                        <td><strong>{money(b.totalPrice)}</strong></td>
                        <td>
                          <span className={`trip-status-pill ${b.status.toLowerCase()}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={b.status}
                            onChange={e => handleUpdateBookingStatus(b.id, e.target.value)}
                          >
                            {bookingStatuses.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. MAINTENANCE SCHEDULE */}
        {section === 'maintenance' && (
          <div>
            <div className="admin-top-bar">
              <div>
                <span className="section-tag">Servicing</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Vehicle Maintenance Schedule
                </h1>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowMaintenanceModal(true)}
              >
                <IconPlus size={16} /> Schedule Maintenance
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading maintenance schedules...</p>
            ) : maintenance.length ? (
              <div className="data-table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vehicle ID</th>
                      <th>Schedule Dates</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map(m => (
                      <tr key={m.id}>
                        <td><b>#{m.id}</b></td>
                        <td>Vehicle #{m.vehicleId}</td>
                        <td>{m.startDate} → {m.endDate}</td>
                        <td style={{ maxWidth: '300px' }}>{m.description}</td>
                        <td>
                          <span className={`trip-status-pill ${m.status === 'COMPLETED' ? 'completed' : m.status === 'CANCELLED' ? 'cancelled' : 'confirmed'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMaintenance(m.id)}
                          >
                            <IconTrash size={14} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', background: '#FFFFFF', borderRadius: 'var(--radius-lg)' }}>
                <h3>No maintenance records scheduled</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                  All vehicles are currently operating within nominal service parameters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 5. USER DIRECTORY */}
        {section === 'users' && (
          <div>
            <div className="admin-top-bar">
              <div>
                <span className="section-tag">Accounts</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Registered Drivers & Admins
                </h1>
              </div>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
            ) : (
              <div className="data-table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Account ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Mobile Number</th>
                      <th>Role & Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td><b>#{u.id}</b></td>
                        <td><strong>{u.fullName || '—'}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phoneNumber ? <code>{u.phoneNumber}</code> : '—'}</td>
                        <td>
                          <span className={`role-pill ${u.role?.toLowerCase()}`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Vehicle Modal */}
      {vehicleModalData && (
        <VehicleModal
          vehicle={vehicleModalData.id ? vehicleModalData : null}
          onClose={() => setVehicleModalData(null)}
          onSuccess={() => {
            setVehicleModalData(null)
            loadCurrentSection()
          }}
        />
      )}

      {/* Schedule Maintenance Modal */}
      {showMaintenanceModal && (
        <MaintenanceModal
          vehicles={vehicles}
          onClose={() => setShowMaintenanceModal(false)}
          onSuccess={() => {
            setShowMaintenanceModal(false)
            loadCurrentSection()
          }}
        />
      )}
    </div>
  )
}
