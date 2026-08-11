import { formatPrice } from './bookingUtils'

export const businessBrand = {
  name: 'WorkItOut Studio',
  email: 'desmondodogwu306@gmail.com',
  phone: '08124289212',
  tagline: 'Strength, structure, and accountability for every client.',
}

export function getClientEmailTemplate(booking) {
  return {
    subject: `Your booking request for ${booking.date} is received`,
    text: `Hello ${booking.name},\n\nThank you for booking with ${businessBrand.name}. We received your request for ${booking.date} at ${booking.slot}.\n\nPlan: ${booking.planName || 'Single session'}\nQuoted total: ${booking.price ? formatPrice(booking.price) : 'To confirm'}\nHome service: ${booking.homeService ? 'Requested' : 'Not requested'}\nNotes: ${booking.notes || 'None'}\n\nWe will confirm your session shortly.\n\n${businessBrand.name}\n${businessBrand.email}\n${businessBrand.phone}\n${businessBrand.tagline}`,
  }
}

export function getOwnerEmailTemplate(booking) {
  return {
    subject: `New booking request from ${booking.name}`,
    text: `New booking received for ${businessBrand.name}.\n\nClient: ${booking.name}\nPhone: ${booking.phone}\nDate: ${booking.date}\nSlot: ${booking.slot}\nPlan: ${booking.planName || 'Single session'}\nQuoted total: ${booking.price ? formatPrice(booking.price) : 'To confirm'}\nHome service: ${booking.homeService ? 'Yes' : 'No'}\nNotes: ${booking.notes || 'None'}`,
  }
}

export function getSmsTemplate(booking) {
  return `New booking request for ${businessBrand.name}: ${booking.name} on ${booking.date} at ${booking.slot}. Contact: ${booking.phone}`
}
