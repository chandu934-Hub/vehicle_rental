import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, formatError } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import VehicleModal from '../components/VehicleModal.jsx'
import { IconSearch, IconFilter, IconX, IconPlus } from '../components/Icons.jsx'

const vehicleTypes = ['ALL', 'SEDAN', 'SUV', 'HATCHBACK', 'VAN', 'TRUCK']

export default function FleetPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('make') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [sortBy, setSortBy] = useState('price-asc')

  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)

  const loadVehicles = () => {
    setLoading(true)
    setError('')
    api.get('/api/vehicles')
      .then(res => setVehicles(res.data))
      .catch(err => setError(formatError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  // Sync with searchParams if navigated from Home hero
  useEffect(() => {
    const makeParam = searchParams.get('make')
    const typeParam = searchParams.get('type')
    if (makeParam) setSearchQuery(makeParam)
    if (typeParam) setSelectedType(typeParam.toUpperCase())
  }, [searchParams])

  // Filter and sort client-side
  const filteredVehicles = useMemo(() => {
    let list = [...vehicles]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(v =>
        (v.make || '').toLowerCase().includes(q) ||
        (v.model || '').toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedType !== 'ALL') {
      list = list.filter(v => v.type === selectedType)
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      list = list.filter(v => v.status === selectedStatus)
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.dailyRate) - Number(b.dailyRate)
      if (sortBy === 'price-desc') return Number(b.dailyRate) - Number(a.dailyRate)
      if (sortBy === 'year-desc') return Number(b.year) - Number(a.year)
      if (sortBy === 'make-asc') return (a.make || '').localeCompare(b.make || '')
      return 0
    })

    return list
  }, [vehicles, searchQuery, selectedType, selectedStatus, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedType('ALL')
    setSelectedStatus('ALL')
    setSortBy('price-asc')
    setSearchParams({})
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-tag">Explore Fleet</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
            Discover Exceptional Vehicles
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '6px' }}>
            Filter by category, brand, or availability to find your preferred journey partner.
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            className="btn btn-primary btn-md"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <IconPlus size={18} /> Add New Vehicle
          </button>
        )}
      </div>

      {/* Filter and Control Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1.4fr auto', gap: '14px', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by make or model..."
              style={{ paddingLeft: '38px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <IconSearch size={18} />
            </div>
          </div>

          {/* Type filter */}
          <select
            className="form-select"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            {vehicleTypes.map(t => (
              <option key={t} value={t}>{t === 'ALL' ? 'All Categories' : t}</option>
            ))}
          </select>

          {/* Availability filter */}
          <select
            className="form-select"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Any Availability</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>

          {/* Sort selector */}
          <select
            className="form-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="make-asc">Brand: A to Z</option>
          </select>

          {/* Reset button */}
          {(searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              className="btn btn-outline btn-sm"
              style={{ height: '44px' }}
              onClick={clearFilters}
              title="Reset all filters"
            >
              <IconX size={16} /> Reset
            </button>
          )}
        </div>

        {/* Quick category pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {vehicleTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                background: selectedType === t ? 'var(--navy-900)' : '#F8FAFC',
                color: selectedType === t ? '#FFFFFF' : 'var(--text-main)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {t === 'ALL' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert-box alert-error">{error}</div>}

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
          Showing <b>{filteredVehicles.length}</b> vehicles
        </span>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          Loading the Roam fleet...
        </div>
      ) : filteredVehicles.length ? (
        <div className="vehicle-grid">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
            <IconFilter size={48} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
            No vehicles match your active criteria
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
            Try expanding your search query, selecting "All Categories", or checking "Any Availability".
          </p>
          <button className="btn btn-primary btn-sm" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {showAddModal && (
        <VehicleModal
          vehicle={null}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            loadVehicles()
          }}
        />
      )}
    </div>
  )
}
