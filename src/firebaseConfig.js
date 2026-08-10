export function shouldUseLocalFallback(env = import.meta.env) {
  if (env?.VITE_USE_LOCAL_FALLBACK === 'true') {
    return true
  }

  const placeholderValues = [
    'AIzaSyAY5rLGnQ4jQmDRXkZ0tQ_d0n5qX3a4nP1o',
    'AIzaSyA5fD6XQ4u9N3WgC8wY2Le0M5kF9pR7bH1',
    'workitout-studio',
    'workitout-studio-12345',
    '123456789012',
    '987654321098',
    '1:123456789012:web:abc123def456ghi789',
    '1:987654321098:web:abcd1234efgh5678',
  ]

  return placeholderValues.some((value) => Object.values(env || {}).includes(value))
}

export function getFirebaseConfig(env = import.meta.env) {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ]

  const missing = requiredKeys.filter((key) => !env?.[key])

  if (missing.length > 0) {
    throw new Error(`Missing Firebase environment variables: ${missing.join(', ')}`)
  }

  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  }

  const placeholderValues = [
    'AIzaSyAY5rLGnQ4jQmDRXkZ0tQ_d0n5qX3a4nP1o',
    'workitout-studio',
    '123456789012',
    '1:123456789012:web:abc123def456ghi789',
  ]

  const isPlaceholder = placeholderValues.some((value) => Object.values(config).includes(value))

  if (isPlaceholder) {
    throw new Error('Firebase values are still using placeholder/demo values')
  }

  return config
}
