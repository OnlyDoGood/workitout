import { useState } from 'react'
import { buildBookingNotification, getSessionOptions } from './bookingUtils'

const routineSamples = [
  {
    title: 'Personal Training',
    focus: 'One-to-one coaching for your goals',
    routine: ['Warm-up and movement check', 'Goal-focused strength block', 'Conditioning finisher', 'Cool-down and progress notes'],
  },
  {
    title: 'Strength Session',
    focus: 'Build full-body strength and control',
    routine: ['Dynamic warm-up', 'Squat or hinge technique', 'Upper-body push and pull', 'Core stability finisher'],
  },
  {
    title: 'Mobility Session',
    focus: 'Move with more freedom and confidence',
    routine: ['Breathing and joint preparation', 'Hips and ankle mobility', 'Shoulder and spine flow', 'Recovery stretches'],
  },
  {
    title: 'Home Workout',
    focus: 'A practical routine with minimal equipment',
    routine: ['Low-impact warm-up', 'Bodyweight circuit', 'Single-leg balance work', 'Stretch and recovery'],
  },
  {
    title: 'Custom Plan',
    focus: 'A routine shaped around your experience and goals',
    routine: ['Initial goal and movement review', 'Coach-selected training blocks', 'Progressive weekly targets', 'Plan adjustments after check-in'],
  },
]

const slots = [
  '7:00 AM - 9:00 AM',
  '6:00 PM - 8:00 PM',
]

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function BookingDashboard({ onBack, user, theme }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(getToday())
  const [slot, setSlot] = useState(slots[0])
  const [sessionType, setSessionType] = useState(getSessionOptions()[0].value)
  const [notes, setNotes] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const booking = {
      id: `${date}-${Date.now()}`,
      name,
      phone,
      date,
      slot,
      sessionType,
      homeService: false,
      notes,
      status: 'pending',
      clientEmail: email,
    }
    const savedBookings = JSON.parse(window.localStorage.getItem('workitout-bookings') || '[]')
    window.localStorage.setItem('workitout-bookings', JSON.stringify([...savedBookings, booking]))
    const notice = buildBookingNotification(booking, 'pending')
    setConfirmation(notice.message)
    setName('')
    setPhone('')
    setNotes('')
  }

  return (
    <div className={`dashboard-shell theme-${theme}`}>
      <div className="sessions-header">
        <div>
          <p className="eyebrow">WorkItOut training library</p>
          <h1>Sessions</h1>
          <p>Explore a sample of what you can expect in each training session.</p>
        </div>
        <button type="button" className="home-button" onClick={onBack}>← Back to homepage</button>
      </div>

      <div className="routine-grid">
        {routineSamples.map((session) => (
          <article key={session.title} className="routine-card">
            <div className="routine-card-heading">
              <h2>{session.title}</h2>
              <span>Sample routine</span>
            </div>
            <p>{session.focus}</p>
            <ol>
              {session.routine.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </article>
        ))}
      </div>

      <section className="session-booking-section">
        <div>
          <p className="eyebrow">Ready to train?</p>
          <h2>Book from the Sessions page</h2>
          <p>Send your details and preferred session. Your request will be reviewed and confirmed by the studio.</p>
        </div>

        <form className="session-booking-form" onSubmit={handleSubmit}>
          <div className="session-form-grid">
            <label>
              Full name
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label>
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Phone number
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
            </label>
            <label>
              Preferred date
              <input type="date" min={getToday()} value={date} onChange={(event) => setDate(event.target.value)} required />
            </label>
            <label>
              Preferred time
              <select value={slot} onChange={(event) => setSlot(event.target.value)}>
                {slots.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              Session type
              <select value={sessionType} onChange={(event) => setSessionType(event.target.value)}>
                {getSessionOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <label>
            Anything we should know?
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="3" placeholder="Goals, experience, or injuries to consider" />
          </label>
          <div className="session-form-actions">
            <button type="submit" className="primary-btn">Request this session</button>
            {confirmation && <p className="session-confirmation" role="status">{confirmation}</p>}
          </div>
        </form>
      </section>
    </div>
  )
}

export default BookingDashboard
