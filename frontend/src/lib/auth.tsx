import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

interface AuthContextType {
  user: any
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      // Demo mode - check if we have a session in sessionStorage
      const hasSession = sessionStorage.getItem('ak_infinity_session')
      if (hasSession) {
        try {
          setUser(JSON.parse(hasSession))
        } catch (error) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      // Store session in sessionStorage
      if (session?.user) {
        sessionStorage.setItem('ak_infinity_session', JSON.stringify(session.user))
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Update sessionStorage on auth change
      if (session?.user) {
        sessionStorage.setItem('ak_infinity_session', JSON.stringify(session.user))
      } else {
        sessionStorage.removeItem('ak_infinity_session')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    sessionStorage.removeItem('ak_infinity_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
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
