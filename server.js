import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import twilio from 'twilio'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const transport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null
const twilioClient = process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN) : null

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataFile = path.join(__dirname, 'bookings.json')

app.use(cors())
app.use(express.json())

const readBookings = () => {
  if (!fs.existsSync(dataFile)) {
    return []
  }

  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch {
    return []
  }
}

const writeBookings = (bookings) => {
  fs.writeFileSync(dataFile, JSON.stringify(bookings, null, 2))
}

const sendClientNotifications = async (booking) => {
  const clientEmail = booking.clientEmail || booking.email || process.env.CLIENT_EMAIL
  const clientPhone = booking.phone || booking.clientPhone

  if (transport && clientEmail) {
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'WorkItOut Studio <no-reply@example.com>',
      to: clientEmail,
      subject: `Your booking for ${booking.date} is confirmed`,
      text: `Hello ${booking.name},\n\nYour ${booking.sessionType || 'session'} booking for ${booking.date} at ${booking.slot} has been confirmed.\n\nPlease reply to this email or contact the studio if you need to make changes.\n\nWorkItOut Studio\nEmail: ${process.env.OWNER_EMAIL || 'desmondodogwu306@gmail.com'}\nPhone: 08124289212`,
    })
  }

  if (twilioClient && clientPhone) {
    await twilioClient.messages.create({
      body: `Your booking with WorkItOut Studio is confirmed for ${booking.date} at ${booking.slot}.`,
      from: process.env.TWILIO_FROM,
      to: clientPhone,
    })
  }
}

app.get('/api/bookings', (_req, res) => {
  res.json(readBookings())
})

app.post('/api/bookings', async (req, res) => {
  const booking = {
    id: `${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  }

  const bookings = readBookings()
  bookings.push(booking)
  writeBookings(bookings)

  if (transport) {
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'WorkItOut Studio <no-reply@example.com>',
      to: process.env.OWNER_EMAIL || 'desmondodogwu306@gmail.com',
      subject: `Your booking request for ${booking.date} has been received`,
      text: `Hello ${booking.name},\n\nThank you for booking with WorkItOut Studio. We received your request for ${booking.date} at ${booking.slot}.\n\nHome service: ${booking.homeService ? 'Requested' : 'Not requested'}\nNotes: ${booking.notes || 'None'}\n\nWe will confirm your session shortly.\n\nWorkItOut Studio\nEmail: desmondodogwu306@gmail.com\nPhone: 08124289212\nStrength, structure, and accountability for every client.`,
    })
  }

  if (transport) {
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'WorkItOut Studio <no-reply@example.com>',
      to: process.env.OWNER_EMAIL || 'desmondodogwu306@gmail.com',
      subject: `New booking request from ${booking.name}`,
      text: `New booking received for WorkItOut Studio.\n\nClient: ${booking.name}\nPhone: ${booking.phone}\nDate: ${booking.date}\nSlot: ${booking.slot}\nHome service: ${booking.homeService ? 'Yes' : 'No'}\nNotes: ${booking.notes || 'None'}`,
    })
  }

  if (twilioClient && process.env.OWNER_PHONE) {
    await twilioClient.messages.create({
      body: `New booking request for WorkItOut Studio: ${booking.name} on ${booking.date} at ${booking.slot}. Contact: ${booking.phone}`,
      from: process.env.TWILIO_FROM,
      to: process.env.OWNER_PHONE,
    })
  }

  res.status(201).json(booking)
})

app.post('/api/bookings/:id/confirm', async (req, res) => {
  const bookings = readBookings()
  const index = bookings.findIndex((item) => item.id === req.params.id)

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Booking not found' })
    return
  }

  const updatedBooking = {
    ...bookings[index],
    ...req.body,
    status: 'approved',
  }

  bookings[index] = updatedBooking
  writeBookings(bookings)

  try {
    await sendClientNotifications(updatedBooking)
    res.json({ success: true, booking: updatedBooking })
  } catch (error) {
    console.error('Client notification failed', error)
    res.status(500).json({ success: false, message: 'Confirmation sent but client notification failed' })
  }
})

app.delete('/api/bookings/:id', (req, res) => {
  const bookings = readBookings().filter((item) => item.id !== req.params.id)
  writeBookings(bookings)
  res.json({ success: true })
})

app.listen(port, () => {
  console.log(`Booking server running on http://localhost:${port}`)
})
