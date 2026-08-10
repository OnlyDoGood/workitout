import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFirebaseConfig, shouldUseLocalFallback } from './firebaseConfig'

export let auth = null
export let db = null
export let firebaseInitError = null
export let app = null

try {
  if (shouldUseLocalFallback()) {
    firebaseInitError = new Error('Using local fallback because Firebase config is not configured for a real project.')
  } else {
    const firebaseConfig = getFirebaseConfig()
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
} catch (error) {
  firebaseInitError = error
}

export default app
