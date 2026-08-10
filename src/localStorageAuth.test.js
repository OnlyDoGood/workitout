import { describe, expect, it, beforeEach } from 'vitest'
import { authenticateLocalUser, registerLocalUser } from './localStorageAuth'

const storage = new Map()

describe('local demo auth', () => {
  beforeEach(() => {
    storage.clear()
    globalThis.localStorage = {
      getItem: (key) => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
      clear: () => storage.clear(),
    }
  })

  it('registers and authenticates a local user', () => {
    const user = registerLocalUser('demo@example.com', 'secret123', 'customer')
    expect(user.email).toBe('demo@example.com')

    const authenticated = authenticateLocalUser('demo@example.com', 'secret123')
    expect(authenticated.email).toBe('demo@example.com')
    expect(authenticated.role).toBe('customer')
  })
})
