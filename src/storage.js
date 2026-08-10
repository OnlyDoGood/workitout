export const STORAGE_PROVIDER = 'local' // switch to 'supabase' or 'firebase' later

export async function saveBooking(booking) {
  const response = await fetch('http://localhost:3001/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })

  if (!response.ok) {
    throw new Error('Failed to save booking')
  }

  return response.json()
}

export async function loadBookings() {
  const response = await fetch('http://localhost:3001/api/bookings')
  if (!response.ok) {
    throw new Error('Failed to load bookings')
  }

  return response.json()
}
