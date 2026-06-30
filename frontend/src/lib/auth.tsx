import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

interface AuthContextType {
  user: any
  loading: boolean
  signOut: () => Promise<void>
  sessionId: string | null
  loginWithSessionId: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Helper function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Helper function to get session ID from localStorage
function getStoredSessionId(): string | null {
  return localStorage.getItem('admin_session_id')
}

// Helper function to store session ID
function storeSessionId(sessionId: string): void {
  localStorage.setItem('admin_session_id', sessionId)
}

// Helper function to clear session ID
function clearStoredSessionId(): void {
  localStorage.removeItem('admin_session_id')
}

// Helper function to verify session is still valid
async function verifySessionWithBackend(sessionId: string): Promise<boolean> {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com'
    const response = await fetch(`${API_URL}/api/verify-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    })
    const data = await response.json()
    return data.valid === true
  } catch (error) {
    console.error('Error verifying session:', error)
    return false
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      // Demo mode - set a dummy user and session
      const storedSessionId = getStoredSessionId()
      if (storedSessionId) {
        setSessionId(storedSessionId)
        setUser({ id: 'demo-user', email: 'demo@akinfinity.com' })
      }
      setLoading(false)
      return
    }

    // Check for existing session
    const storedSessionId = getStoredSessionId()
    if (storedSessionId) {
      // Verify session is still valid
      verifySessionWithBackend(storedSessionId).then(isValid => {
        if (isValid) {
          setSessionId(storedSessionId)
        } else {
          // Session expired, clear it
          clearStoredSessionId()
          setSessionId(null)
        }
      })
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Handle page unload/close - clear session
    const handleBeforeUnload = () => {
      clearStoredSessionId()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const loginWithSessionId = async (email: string, password: string) => {
    if (!supabase) {
      // Demo mode
      const newSessionId = generateSessionId()
      storeSessionId(newSessionId)
      setSessionId(newSessionId)
      setUser({ id: 'demo-user', email: 'demo@akinfinity.com' })
      return
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // Create session on backend
    if (authData) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com'
        const sessionData = {
          session_id: generateSessionId(),
          email: email,
          user_agent: navigator.userAgent,
          ip_address: 'client-ip'
        }

        const response = await fetch(`${API_URL}/api/create-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sessionData)
        })

        if (response.ok) {
          const data = await response.json()
          storeSessionId(data.session_id)
          setSessionId(data.session_id)
        }
      } catch (error) {
        console.error('Error creating session:', error)
        // Still allow login even if session creation fails
        const newSessionId = generateSessionId()
        storeSessionId(newSessionId)
        setSessionId(newSessionId)
      }
    }
  }

  const signOut = async () => {
    const currentSessionId = getStoredSessionId()
    
    if (currentSessionId && supabase) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com'
        await fetch(`${API_URL}/api/end-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ session_id: currentSessionId })
        })
      } catch (error) {
        console.error('Error ending session:', error)
      }
    }

    clearStoredSessionId()
    setSessionId(null)

    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, sessionId, loginWithSessionId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
