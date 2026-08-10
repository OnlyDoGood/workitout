import { useState } from 'react'
import { isAdminLoginValid } from './auth'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isAdminLoginValid({ username, password })) {
      onLogin(username)
      setError('')
    } else {
      setError('Invalid admin credentials. Use your email/phone and the provided password.')
    }
  }

  return (
    <div className="dashboard-shell auth-shell">
      <div className="auth-card">
        <h1>Admin login</h1>
        <p>Access the booking dashboard for WorkItOut Studio.</p>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="field-group">
            <label className="field-title" htmlFor="username">Email or phone</label>
            <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div className="field-group">
            <label className="field-title" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <button type="submit" className="primary-btn full-width">Login</button>
        </form>
        {error && <div className="summary-box">{error}</div>}
      </div>
    </div>
  )
}

export default AdminLogin
