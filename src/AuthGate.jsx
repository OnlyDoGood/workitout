import { useEffect, useState } from 'react'
import { authenticateLocalUser, registerLocalUser } from './localStorageAuth'

const ADMIN_EMAIL = 'desmondodogwu306@gmail.com'
const ADMIN_PHONE = '08124289212'

function normalizeIdentifier(identifier) {
  if (!identifier) {
    return ''
  }

  return identifier.trim().toLowerCase() === ADMIN_PHONE ? ADMIN_EMAIL : identifier.trim().toLowerCase()
}

function isAdminIdentifier(identifier) {
  const normalized = normalizeIdentifier(identifier)
  return normalized === ADMIN_EMAIL || normalized === ADMIN_PHONE
}

function AuthGate({ children, onAuthStateChanged }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('customer')
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [goal, setGoal] = useState('')
  const [experience, setExperience] = useState('beginner')
  const [trainingType, setTrainingType] = useState('general-fitness')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = window.localStorage.getItem('workitout-active-user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setRole(parsedUser.role || 'customer')
      onAuthStateChanged?.(parsedUser, parsedUser.role || 'customer')
    }
    setLoading(false)
  }, [onAuthStateChanged])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalizedEmail = normalizeIdentifier(email)
    const isAdmin = isAdminIdentifier(email)

    try {
      if (mode === 'signup') {
        const localUser = registerLocalUser(normalizedEmail, password, isAdmin ? 'admin' : 'customer')
        const resolvedUser = {
          uid: `local-${localUser.email}`,
          email: localUser.email,
          displayName: fullName || localUser.email,
          role: localUser.role,
          fullName,
          phone,
          goal,
          experience,
          trainingType,
        }
        window.localStorage.setItem('workitout-active-user', JSON.stringify(resolvedUser))
        setUser(resolvedUser)
        setRole(localUser.role)
        setError('')
        return
      }

      const localUser = authenticateLocalUser(normalizedEmail, password)
      const resolvedUser = {
        uid: `local-${localUser.email}`,
        email: localUser.email,
        displayName: fullName || localUser.email,
        role: localUser.role,
        fullName,
        phone,
        goal,
        experience,
        trainingType,
      }
      window.localStorage.setItem('workitout-active-user', JSON.stringify(resolvedUser))
      setUser(resolvedUser)
      setRole(localUser.role)
      setError('')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    }
  }

  if (loading) {
    return <div className="dashboard-shell"><p>Loading your account...</p></div>
  }

  if (!user) {
    return (
      <div className="dashboard-shell auth-shell">
        <div className="auth-card">
          <h1>Welcome to WorkItOut Studio</h1>
          <p>Sign in or create an account to book sessions.</p>
          <div className="toggle-row auth-toggle">
            <button type="button" className={mode === 'login' ? 'primary-btn' : 'secondary-link'} onClick={() => setMode('login')}>
              Sign in
            </button>
            <button type="button" className={mode === 'signup' ? 'primary-btn' : 'secondary-link'} onClick={() => setMode('signup')}>
              Create account
            </button>
          </div>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="field-group">
              <label className="field-title" htmlFor="auth-email">Email or phone</label>
              <input id="auth-email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="field-group">
              <label className="field-title" htmlFor="auth-password">Password</label>
              <input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            {mode === 'signup' && (
              <>
                <div className="field-group">
                  <label className="field-title" htmlFor="auth-full-name">Full name</label>
                  <input id="auth-full-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </div>
                <div className="field-group">
                  <label className="field-title" htmlFor="auth-phone">Phone number</label>
                  <input id="auth-phone" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} required />
                </div>
                <div className="field-group">
                  <label className="field-title" htmlFor="auth-goal">Fitness goal</label>
                  <input id="auth-goal" type="text" value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="e.g. Lose weight, build strength, improve mobility" required />
                </div>
                <div className="field-group">
                  <label className="field-title" htmlFor="auth-experience">Experience level</label>
                  <select id="auth-experience" value={experience} onChange={(event) => setExperience(event.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-title" htmlFor="auth-training-type">Preferred training type</label>
                  <select id="auth-training-type" value={trainingType} onChange={(event) => setTrainingType(event.target.value)}>
                    <option value="general-fitness">General fitness</option>
                    <option value="strength">Strength training</option>
                    <option value="fat-loss">Fat loss</option>
                    <option value="mobility">Mobility</option>
                    <option value="home-training">Home training</option>
                  </select>
                </div>
              </>
            )}
            <button type="submit" className="primary-btn full-width">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          {error && <div className="summary-box">{error}</div>}
        </div>
      </div>
    )
  }

  return children({ user, role })
}

export default AuthGate
