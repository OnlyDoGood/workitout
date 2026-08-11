import { useEffect, useMemo, useState } from 'react'
import './App.css'
import './dashboard.css'
import { buildBookingNotification, formatDateKey, formatPrice, getMonthGrid, getPlan, getSessionOptions, homeServiceFee, isSameDay, plans, weekDays } from './bookingUtils'
import BookingDashboard from './BookingDashboard'

const slots = [
  { label: 'Morning slot', value: '7:00 AM - 9:00 AM' },
  { label: 'Evening slot', value: '6:00 PM - 8:00 PM' },
]

const themes = [
  { id: 'mono', label: 'Mono' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'forest', label: 'Forest' },
  { id: 'ember', label: 'Ember' },
]

function ThemePicker({ theme, onChange }) {
  return (
    <div className="theme-picker" aria-label="Choose a color theme">
      <span className="theme-picker-label">Theme</span>
      {themes.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`theme-swatch theme-swatch-${option.id} ${theme === option.id ? 'active' : ''}`}
          onClick={() => onChange(option.id)}
          aria-label={`${option.label} theme`}
          aria-pressed={theme === option.id}
          title={`${option.label} theme`}
        />
      ))}
    </div>
  )
}

function AppContent({ user }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState(slots[0].value)
  const [selectedSessionType, setSelectedSessionType] = useState(getSessionOptions()[0]?.value || 'personal-training')
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1].id)
  const [homeService, setHomeService] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [bookings, setBookings] = useState([])
  const [status, setStatus] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)
  const [showDashboard, setShowDashboard] = useState(false)
  const [theme, setTheme] = useState('mono')
  const [menuOpen, setMenuOpen] = useState(false)

  const sessionOptions = useMemo(() => getSessionOptions(), [])

  const monthDate = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return date
  }, [monthOffset])

  const monthDays = useMemo(() => getMonthGrid(monthDate), [monthDate])

  useEffect(() => {
    const saved = window.localStorage.getItem('workitout-bookings')
    if (saved) {
      setBookings(JSON.parse(saved))
    }

    const savedNotification = window.localStorage.getItem('workitout-last-notification')
    if (savedNotification) {
      try {
        const parsedNotification = JSON.parse(savedNotification)
        setStatus(parsedNotification.message)
        window.localStorage.removeItem('workitout-last-notification')
      } catch {
        window.localStorage.removeItem('workitout-last-notification')
      }
    }

    const savedTheme = window.localStorage.getItem('workitout-theme')
    if (themes.some((option) => option.id === savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  const changeTheme = (nextTheme) => {
    setTheme(nextTheme)
    window.localStorage.setItem('workitout-theme', nextTheme)
  }

  const bookedKeys = useMemo(() => new Set(bookings.map((item) => item.date)), [bookings])
  const selectedPlan = getPlan(selectedPlanId)
  const bookingTotal = selectedPlan.price + (homeService ? homeServiceFee : 0)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name,
      phone,
      date: formatDateKey(selectedDate),
      slot: selectedSlot,
      sessionType: selectedSessionType,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      price: bookingTotal,
      homeService,
      notes,
    }

    try {
      const booking = {
        id: `${payload.date}-${Date.now()}`,
        ...payload,
        status: 'pending',
        clientEmail: user?.email || '',
      }
      const nextBookings = [...bookings, booking]
      setBookings(nextBookings)
      window.localStorage.setItem('workitout-bookings', JSON.stringify(nextBookings))

      const notice = buildBookingNotification(booking, 'pending')
      setStatus(notice.message)
      setShowPopup(true)
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
        new window.Notification(notice.title, { body: notice.message })
      }

      setName('')
      setPhone('')
      setNotes('')
    } catch {
      setStatus('Booking failed. Please try again.')
    }
  }

  const selectDay = (day) => {
    setSelectedDate(day)
  }

  if (showDashboard) {
    return <BookingDashboard user={user} theme={theme} onBack={() => setShowDashboard(false)} />
  }

  return (
    <div className={`page-shell theme-${theme}`}>
      <header className="hero-section">
        <nav className="topbar">
          <div className="brand">WorkItOut Studio</div>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <button type="button" className="link-button" onClick={() => { setShowDashboard(true); setMenuOpen(false) }}>
              Sessions
            </button>
            <a href="#booking" onClick={() => setMenuOpen(false)}>Book your session</a>
            <ThemePicker theme={theme} onChange={changeTheme} />
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Personal training • Monday to Saturday • Premium coaching</p>
            <h1>Book smarter, train stronger, and keep your routine on track.</h1>
            <p>
              Choose a date, reserve a morning or evening slot, and pick the session style that fits your goals.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#booking">
                Reserve a session
              </a>
              <a className="secondary-link" href="#guidelines">
                View home guidelines
              </a>
            </div>
          </div>

          <div className="hero-card">
            <h2>Studio availability</h2>
            <ul>
              <li>Morning: 7:00 AM - 9:00 AM</li>
              <li>Evening: 6:00 PM - 8:00 PM</li>
              <li>Session types: personal training, strength, mobility, and home workouts</li>
              <li>Service days: Monday to Saturday</li>
            </ul>
            <div className="owner-card">
              <h3>Owner details</h3>
              <p>📧 desmondodogwu306@gmail.com</p>
              <p>📱 +234 812 428 9212</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section-grid" id="booking">
          <div className="card pricing-card" id="plans">
            <p className="eyebrow section-eyebrow">Choose your commitment</p>
            <h2>Plans and pricing</h2>
            <p className="section-intro">Straightforward rates that protect your coaching time and give you room to progress.</p>
            <div className="plan-grid">
              {plans.map((plan) => (
                <div className={`price-box ${plan.featured ? 'featured' : ''} ${selectedPlanId === plan.id ? 'selected-plan' : ''}`} key={plan.id}>
                  <p className="price-label">{plan.name}</p>
                  <p className="price">{formatPrice(plan.price)}</p>
                  <p className="price-billing">{plan.billing}</p>
                  <p>{plan.description}</p>
                  <ul className="plan-features">
                    {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <button type="button" className="secondary-link plan-select" onClick={() => setSelectedPlanId(plan.id)} aria-pressed={selectedPlanId === plan.id}>
                    {selectedPlanId === plan.id ? 'Selected plan' : 'Choose this plan'}
                  </button>
                </div>
              ))}
            </div>
            <p className="pricing-note">Home visits add {formatPrice(homeServiceFee)} for travel and setup. Plans are paid monthly; your exact schedule is confirmed after your request.</p>
          </div>

          <div className="card booking-card">
            <h2>Book your next session</h2>
            <p>Choose a plan first, then select a date and submit your request for confirmation.</p>

            <div className="calendar-card">
              <div className="calendar-header">
                <button type="button" onClick={() => setMonthOffset((value) => value - 1)}>
                  ←
                </button>
                <h3>{monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button type="button" onClick={() => setMonthOffset((value) => value + 1)}>
                  →
                </button>
              </div>

              <div className="weekday-row">
                {weekDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {monthDays.map((day) => {
                  const key = formatDateKey(day)
                  const isCurrentMonth = day.getMonth() === monthDate.getMonth()
                  const isSelected = isSameDay(day, selectedDate)
                  const isBooked = bookedKeys.has(key)

                  return (
                    <button
                      key={key}
                      type="button"
                      className={`calendar-day ${isCurrentMonth ? '' : 'muted'} ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                      onClick={() => selectDay(day)}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="field-group">
                <label className="field-title" htmlFor="name">
                  Your name
                </label>
                <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>

              <div className="summary-box booking-summary">
                <p className="price-label">Selected plan</p>
                <strong>{selectedPlan.name}</strong>
                <span>{formatPrice(selectedPlan.price)}{homeService ? ` + ${formatPrice(homeServiceFee)} home visit` : ''}</span>
                <b>Total: {formatPrice(bookingTotal)}</b>
              </div>

              <div className="field-group">
                <label className="field-title" htmlFor="phone">
                  Phone number
                </label>
                <input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </div>
              <div className="field-group">
                <label className="field-title" htmlFor="slot">
                  Preferred slot
                </label>
                <select id="slot" value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)}>
                  {slots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.value}
                    </option>
                  ))}
                </select>
              </div>

                <div className="field-group">
                <label className="field-title" htmlFor="session-type">
                  Session type
                </label>
                <select id="session-type" value={selectedSessionType} onChange={(event) => setSelectedSessionType(event.target.value)}>
                  {sessionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group toggle-row">
                <label htmlFor="home-service">Request home service</label>
                <input
                  id="home-service"
                  type="checkbox"
                  checked={homeService}
                  onChange={() => setHomeService((value) => !value)}
                />
              </div>

              <div className="field-group">
                <label className="field-title" htmlFor="notes">
                  Notes for your coach
                </label>
                  <textarea
                  id="notes"
                  rows="4"
                  placeholder="Share your goals, location, or anything else you want me to know."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>

              <button type="submit" className="primary-btn full-width">
                Submit booking request
              </button>
            </form>

            {status && showPopup && (
              <div className="popup-overlay" role="dialog" aria-modal="true">
                <div className="popup-card">
                  <h3>Booking request received</h3>
                  <p>{status}</p>
                  <button type="button" className="primary-btn" onClick={() => setShowPopup(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

        </section>

        <section className="card guidelines-card" id="guidelines">
          <h2>Home workout guidelines</h2>
          <div className="guideline-list">
            <div>
              <h3>Warm up first</h3>
              <p>Spend 5 to 10 minutes moving gently before any workout.</p>
            </div>
            <div>
              <h3>Stay consistent</h3>
              <p>Use your booked date and slot to build a repeatable training routine.</p>
            </div>
            <div>
              <h3>Keep it simple</h3>
              <p>Focus on good form, proper breathing, and enough recovery between sets.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <strong>WorkItOut Studio</strong>
          <p>Personal training built around your goals.</p>
        </div>
        <div className="footer-details">
          <p>Monday to Saturday</p>
          <p>7:00 AM - 9:00 AM · 6:00 PM - 8:00 PM</p>
          <p>desmondodogwu306@gmail.com · +234 812 428 9212</p>
        </div>
        <a className="footer-link" href="#booking">Book your session ↑</a>
      </footer>
    </div>
  )
}

function App() {
  return <AppContent user={null} />
}

export default App
