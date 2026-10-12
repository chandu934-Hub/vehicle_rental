import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { money } from '../lib/api.js'
import { getVehicleImage } from '../lib/vehicleImages.js'
import { IconCar, IconArrowRight } from './Icons.jsx'

export default function VehicleCard({ vehicle }) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = getVehicleImage(vehicle)

  return (
    <article className="vehicle-card">
      <div className="vehicle-card-media">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="vehicle-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#1E293B', color: '#94A3B8' }}>
            <IconCar size={48} />
          </div>
        )}
        <span className={`vehicle-status-badge ${vehicle.status.toLowerCase()}`}>
          {vehicle.status}
        </span>
        <span className="vehicle-type-tag">
          {vehicle.type}
        </span>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-card-header">
          <h3 className="vehicle-title">{vehicle.make} {vehicle.model}</h3>
        </div>
        <div className="vehicle-reg">
          {vehicle.year} · {vehicle.registrationNumber}
        </div>

        <div className="vehicle-specs-row">
          <div className="spec-item">
            <IconCar size={16} />
            <span>{vehicle.type}</span>
          </div>
          <div className="spec-item">
            <span>Model {vehicle.year}</span>
          </div>
        </div>

        <div className="vehicle-card-footer">
          <div className="price-box">
            <span className="price-amount">{money(vehicle.dailyRate)}</span>
            <span className="price-sub">per day (excl. return)</span>
          </div>

          <Link
            to={`/vehicles/${vehicle.id}`}
            className="btn btn-primary btn-sm"
          >
            Details <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}
