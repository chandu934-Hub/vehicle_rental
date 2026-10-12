import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, money } from '../lib/api.js'
import VehicleCard from '../components/VehicleCard.jsx'
import {
  IconCar,
  IconShield,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconStar,
  IconChevronDown
} from '../components/Icons.jsx'

const categories = ['ALL', 'SEDAN', 'SUV', 'HATCHBACK', 'VAN', 'TRUCK']

const faqs = [
  {
    q: 'How does the booking date calculation work?',
    a: 'Roam Rentals uses half-open date intervals, which is standard in automotive rentals. Your reservation start date is the collection day, and your return date is exclusive. For instance, reserving from Oct 15 to Oct 18 equals exactly 3 rental days.'
  },
  {
    q: 'Are the payment transactions live or simulated?',
    a: 'Payment transactions in Roam Rentals are currently processed through our secure simulation engine. You can select Card, UPI, Net Banking, or Cash to test real reservation confirmations safely without transmitting live payment funds.'
  },
  {
    q: 'Can I cancel an active booking?',
    a: 'Yes! Customers can cancel any Confirmed reservation directly from their "My Trips" dashboard. Once cancelled, the vehicle immediately becomes available again for fellow drivers.'
  },
  {
    q: 'What are the requirements to rent a vehicle?',
    a: 'Renters must possess a valid driver’s license, be at least 21 years old, and complete account registration with a verified email address.'
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [openFaq, setOpenFaq] = useState(null)

  // Search filter state in hero
  const [heroSearch, setHeroSearch] = useState({
    make: '',
    type: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    api.get('/api/vehicles')
      .then(res => setVehicles(res.data))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false))
  }, [])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroSearch.make) params.set('make', heroSearch.make)
    if (heroSearch.type) params.set('type', heroSearch.type)
    navigate(`/vehicles?${params.toString()}`)
  }

  const filteredVehicles = activeCategory === 'ALL'
    ? vehicles
    : vehicles.filter(v => v.type === activeCategory)

  const featuredFleet = filteredVehicles.slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-container">
          <div className="hero-header">
            <div className="hero-pill">
              <IconCar size={16} /> Premium Automotive Rentals
            </div>
            <h1 className="hero-title">
              Your Journey. <br />
              <span className="hero-gradient-text">Your Rules.</span>
            </h1>
            <p className="hero-subtitle">
              Drive exceptional vehicles for spontaneous escapes, milestone celebrations, and long scenic detours. Transparent pricing with zero hidden fees.
            </p>
          </div>

          {/* Quick Search Panel */}
          <div className="search-panel">
            <form className="search-form" onSubmit={handleHeroSearch}>
              <div className="form-group">
                <label className="form-label">Search Model or Brand</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. BMW, Tesla, Toyota..."
                  value={heroSearch.make}
                  onChange={e => setHeroSearch({ ...heroSearch, make: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Body Category</label>
                <select
                  className="form-select"
                  value={heroSearch.type}
                  onChange={e => setHeroSearch({ ...heroSearch, type: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="VAN">Van</option>
                  <option value="TRUCK">Truck</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pick-up Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={heroSearch.startDate}
                  onChange={e => setHeroSearch({ ...heroSearch, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={heroSearch.endDate}
                  onChange={e => setHeroSearch({ ...heroSearch, endDate: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ height: '50px' }}>
                Find Vehicle <IconArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Trust Features Bar */}
          <div className="search-features-bar">
            <div className="feature-pill">
              <div className="feature-icon-box">
                <IconShield size={22} />
              </div>
              <div className="feature-text">
                <h4>Verified Fleet</h4>
                <p>Inspected every 5,000 km</p>
              </div>
            </div>

            <div className="feature-pill">
              <div className="feature-icon-box">
                <IconClock size={22} />
              </div>
              <div className="feature-text">
                <h4>Instant Booking</h4>
                <p>Guaranteed reservations</p>
              </div>
            </div>

            <div className="feature-pill">
              <div className="feature-icon-box">
                <IconCheck size={22} />
              </div>
              <div className="feature-text">
                <h4>Zero Hidden Fees</h4>
                <p>Exact daily rate billing</p>
              </div>
            </div>

            <div className="feature-pill">
              <div className="feature-icon-box">
                <IconCar size={22} />
              </div>
              <div className="feature-text">
                <h4>24/7 Roadside</h4>
                <p>Dedicated travel support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="section-wrap">
        <div className="page-container">
          <div className="section-head">
            <span className="section-tag">Curated Vehicles</span>
            <h2 className="section-heading">Featured Fleet For Any Horizon</h2>
            <p className="section-desc">
              Every vehicle in our collection is maintained to factory specifications, thoroughly sanitized, and primed for immediate departure.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'ALL' ? 'All Fleet' : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading the finest vehicles...
            </div>
          ) : featuredFleet.length ? (
            <div className="vehicle-grid">
              {featuredFleet.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <h3>No vehicles found in this category</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Please select another category or check back shortly.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/vehicles" className="btn btn-outline btn-lg">
              Browse All Available Fleet ({vehicles.length}) ↗
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-wrap" style={{ background: '#FFFFFF' }}>
        <div className="page-container">
          <div className="section-head">
            <span className="section-tag">Effortless Process</span>
            <h2 className="section-heading">How Roam Rentals Works</h2>
            <p className="section-desc">
              Three seamless steps stand between you and the open road.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Choose Your Fit</h3>
              <p>
                Browse our high-performance sedans, family SUVs, versatile vans, and work-ready trucks with crystal-clear specifications.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Reserve Your Dates</h3>
              <p>
                Select your pick-up and return timeline. Our system verifies real-time availability and maintenance schedules instantly.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Unlock & Roam</h3>
              <p>
                Complete your simulated payment, collect your keys at the dispatch center, and enjoy unlimited miles and complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="section-wrap">
        <div className="page-container">
          <div className="section-head">
            <span className="section-tag">Driver Testimonials</span>
            <h2 className="section-heading">Stories From The Open Highway</h2>
            <p className="section-desc">
              Read how fellow travelers experience Roam Rentals across business tours and weekend road trips.
            </p>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => <IconStar key={i} size={18} />)}
              </div>
              <p className="review-comment">
                "The Tesla Model 3 Long Range was in immaculate condition. Smooth pick-up process and transparent billing with zero surprise fees at return."
              </p>
              <div className="review-author">Aarav M. · Verified Driver</div>
            </div>

            <div className="review-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => <IconStar key={i} size={18} />)}
              </div>
              <p className="review-comment">
                "Rented the BMW 3 Series for an executive retreat. Handled beautifully across the expressway and the booking portal made payment effortless."
              </p>
              <div className="review-author">Sneha R. · Business Traveler</div>
            </div>

            <div className="review-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => <IconStar key={i} size={18} />)}
              </div>
              <p className="review-comment">
                "Took the Toyota RAV4 Hybrid into the hills with family. Exceptionally clean, great fuel range, and wonderful customer support throughout."
              </p>
              <div className="review-author">Karthik V. · Roadtrip Enthusiast</div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="section-wrap" style={{ background: '#FFFFFF' }}>
        <div className="page-container">
          <div className="section-head">
            <span className="section-tag">Rental Guidelines</span>
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <p className="section-desc">
              Clear answers on reservations, scheduling, payment simulation, and fleet policies.
            </p>
          </div>

          <div className="faq-wrap">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{faq.q}</span>
                    <IconChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        color: 'var(--teal-600)'
                      }}
                    />
                  </button>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
