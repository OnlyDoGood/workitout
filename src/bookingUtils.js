export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const sessionOptions = [
  { label: 'Personal Training', value: 'personal-training' },
  { label: 'Strength Session', value: 'strength' },
  { label: 'Mobility Session', value: 'mobility' },
  { label: 'Home Workout', value: 'home-workout' },
  { label: 'Custom Plan', value: 'custom' },
]

export const plans = [
  {
    id: 'single-session',
    name: 'Single session',
    price: 15000,
    billing: 'per 60-minute session',
    description: 'A focused workout for a clear goal, technique check, or fresh start.',
    features: ['Goal and movement check-in', 'Personalised session plan', 'Post-session next steps'],
  },
  {
    id: 'foundation',
    name: 'Foundation',
    price: 48000,
    billing: '4 sessions / month',
    description: 'A consistent weekly rhythm for building strength, mobility, and accountability.',
    features: ['4 coached sessions', 'Weekly progress check-in', 'Simple plan between sessions'],
    featured: true,
  },
  {
    id: 'progress',
    name: 'Progress',
    price: 88000,
    billing: '8 sessions / month',
    description: 'Twice-weekly coaching for clients ready to make measurable progress.',
    features: ['8 coached sessions', 'Priority scheduling', 'Training plan adjustments'],
  },
]

export const homeServiceFee = 5000

export function getPlan(planId) {
  return plans.find((plan) => plan.id === planId) || plans[0]
}

export function formatPrice(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function getMonthGrid(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const totalCells = Math.ceil((startDay + lastDay.getDate()) / 7) * 7

  const days = []

  for (let index = 0; index < totalCells; index += 1) {
    const currentDate = new Date(year, month, index - startDay + 1)
    days.push(currentDate)
  }

  return days
}

export function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function getSessionOptions() {
  return sessionOptions.map((option) => ({ ...option }))
}

export function getSessionLabel(sessionType) {
  if (!sessionType) {
    return 'Session'
  }

  if (sessionType === 'custom') {
    return 'custom'
  }

  const match = sessionOptions.find((option) => option.value === sessionType)
  return match ? match.label : sessionType
}

export function buildBookingNotification(booking, status = 'pending') {
  const sessionLabel = getSessionLabel(booking.sessionType)
  const isConfirmed = status === 'confirmed' || status === 'approved'

  return {
    title: isConfirmed ? 'Session booked' : 'Booking request received',
    message: isConfirmed
      ? `${booking.name}, your ${sessionLabel} session for ${booking.date} at ${booking.slot} is confirmed.`
      : `${booking.name}, your ${sessionLabel} session request for ${booking.date} at ${booking.slot} is being reviewed.`,
    status,
  }
}
