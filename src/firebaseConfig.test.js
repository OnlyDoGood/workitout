import { describe, expect, it } from 'vitest'
import { getFirebaseConfig, shouldUseLocalFallback } from './firebaseConfig'

describe('getFirebaseConfig', () => {
  it('returns a config object when all required values are present', () => {
    const config = getFirebaseConfig({
      VITE_FIREBASE_API_KEY: 'demo-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'demo.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'demo-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'demo.firebasestorage.app',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '999999999999',
      VITE_FIREBASE_APP_ID: '1:999999999999:web:abc123',
    })

    expect(config).toMatchObject({
      apiKey: 'demo-api-key',
      projectId: 'demo-project',
    })
  })

  it('throws a helpful error when a required value is missing', () => {
    expect(() =>
      getFirebaseConfig({
        VITE_FIREBASE_API_KEY: 'demo-api-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'demo.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'demo-project',
        VITE_FIREBASE_STORAGE_BUCKET: 'demo.firebasestorage.app',
        VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789012',
      }),
    ).toThrow(/VITE_FIREBASE_APP_ID/)
  })

  it('uses local fallback when the Firebase values are placeholder-like', () => {
    const shouldFallback = shouldUseLocalFallback({
      VITE_FIREBASE_API_KEY: 'AIzaSyAY5rLGnQ4jQmDRXkZ0tQ_d0n5qX3a4nP1o',
      VITE_FIREBASE_PROJECT_ID: 'workitout-studio',
    })

    expect(shouldFallback).toBe(true)
  })
})
