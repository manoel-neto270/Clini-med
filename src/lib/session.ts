import { useEffect, useState } from 'react'

const STORAGE_KEY = 'clinimed:patientName'

export function getStoredPatientName(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function setStoredPatientName(name: string) {
  window.localStorage.setItem(STORAGE_KEY, name)
}

export function clearStoredPatientName() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function usePatientName() {
  const [patientName, setPatientName] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setPatientName(getStoredPatientName())
    setReady(true)
  }, [])

  return { patientName, ready }
}
