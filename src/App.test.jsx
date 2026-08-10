import { describe, expect, it } from 'vitest'
import { buildBookingNotification, formatDateKey, getMonthGrid, getSessionLabel, getSessionOptions, isSameDay } from './bookingUtils'

describe('booking utilities', () => {
  it('formats dates correctly', () => {
    const date = new Date(2026, 7, 2)
    expect(formatDateKey(date)).toBe('2026-08-02')
  })

  it('creates a month grid and detects same-day values', () => {
    const grid = getMonthGrid(new Date(2026, 7, 1))
    expect(grid.length).toBeGreaterThan(28)
    expect(isSameDay(grid[0], new Date(2026, 6, 27))).toBe(true)
  })

  it('provides multiple session options with readable labels', () => {
    const sessions = getSessionOptions()
    expect(sessions.length).toBeGreaterThanOrEqual(3)
    expect(getSessionLabel('personal-training')).toBe('Personal Training')
    expect(getSessionLabel('custom')).toBe('custom')
  })

  it('builds a notification message for a confirmed booking', () => {
    const notification = buildBookingNotification({
      name: 'Ada',
      date: '2026-08-02',
      slot: '7:00 AM - 9:00 AM',
      sessionType: 'personal-training',
    }, 'confirmed')

    expect(notification.title).toContain('Session booked')
    expect(notification.message).toContain('Ada')
    expect(notification.message).toContain('Personal Training')
  })
})
