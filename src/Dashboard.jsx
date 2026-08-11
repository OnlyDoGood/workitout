import { useEffect, useState } from 'react'
import { loadBookings } from './storage'
import { formatPrice } from './bookingUtils'

function Dashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
      .catch(() => {
        setBookings([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="dashboard-shell">
      <h1>Owner dashboard</h1>
      <p>Manage incoming booking requests and follow up with clients.</p>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="dashboard-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="dashboard-card">
              <h3>{booking.name}</h3>
              <p>{booking.phone}</p>
              <p>Date: {booking.date}</p>
              <p>Slot: {booking.slot}</p>
              <p>Plan: {booking.planName || 'Single session'}</p>
              <p>Quoted total: {booking.price ? formatPrice(booking.price) : 'To confirm'}</p>
              <p>Home service: {booking.homeService ? 'Yes' : 'No'}</p>
              <p>Notes: {booking.notes || 'No notes'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
