import React from 'react'
import { Link } from 'react-router-dom'
import { IconCar, IconShield } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <div className="brand-logo" style={{ marginBottom: '16px' }}>
              <div className="brand-badge">
                <IconCar size={20} />
              </div>
              <span>ROAM<span className="brand-dot">.</span></span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '320px', marginBottom: '20px' }}>
              Roam Rentals delivers high-tier vehicle rentals with transparent daily rates, instant reservations, and reliable road support.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--teal-400)', fontSize: '0.85rem' }}>
              <IconShield size={18} />
              <span>Verified & Maintained Fleet</span>
            </div>
          </div>

          <div className="footer-col">
            <h5>The Fleet</h5>
            <ul className="footer-links">
              <li><Link to="/vehicles?type=SEDAN">Executive Sedans</Link></li>
              <li><Link to="/vehicles?type=SUV">Premium SUVs</Link></li>
              <li><Link to="/vehicles?type=HATCHBACK">City Hatchbacks</Link></li>
              <li><Link to="/vehicles?type=VAN">Touring Vans</Link></li>
              <li><Link to="/vehicles?type=TRUCK">Utility Trucks</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links">
              <li><Link to="/vehicles">All Vehicles</Link></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="/#faq">Rental FAQs</a></li>
              <li><Link to="/dashboard">Customer Portal</Link></li>
              <li><Link to="/login">Account Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Rental Policy</h5>
            <ul className="footer-links">
              <li><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Half-open booking intervals (return date exclusive)</span></li>
              <li><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Simulated payments for demonstrations</span></li>
              <li><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>24/7 Roadside Assistance</span></li>
              <li><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Zero hidden insurance fees</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Roam Rentals Inc. All rights reserved.</p>
          <p>Powered by Spring Boot 4 REST API & React 19 Frontend.</p>
        </div>
      </div>
    </footer>
  )
}
