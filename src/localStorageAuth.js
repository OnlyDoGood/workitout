const STORAGE_KEY = 'workitout-local-users'

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }

  return null
}

function readUsers() {
  const storage = getStorage()
  if (!storage) {
    return []
  }

  const raw = storage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function writeUsers(users) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(users))
  }
}

export function registerLocalUser(email, password, role = 'customer') {
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const existing = users.find((user) => user.email === normalizedEmail)

  if (existing) {
    throw new Error('User already exists')
  }

  const newUser = {
    email: normalizedEmail,
    password,
    role,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  writeUsers(users)
  return newUser
}

export function authenticateLocalUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()
  const user = users.find((candidate) => candidate.email === normalizedEmail && candidate.password === password)

  if (!user) {
    throw new Error('Invalid credentials')
  }

  return { email: user.email, role: user.role }
}

export function isAdminEmail(email) {
  return email.trim().toLowerCase() === 'desmondodogwu306@gmail.com'
}
