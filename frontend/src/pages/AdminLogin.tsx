import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../components/Button'
import AKLogo from '../assets/AK_Main_Logo.webp'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

interface LoginFormData {
  email: string
  password: string
}

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()
  const { user } = useAuth()

  // Redirect to admin if already logged in
  if (user) {
    navigate('/admin')
    return null
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    console.log('🔑 Attempting login with:', { email: data.email, hasSupabase: !!supabase })

    try {
      if (!supabase) {
        console.log('⚠️ Supabase not configured! Allowing demo login')
        // Set demo session
        const demoUser = { id: 'demo-user', email: data.email }
        sessionStorage.setItem('ak_infinity_session', JSON.stringify(demoUser))
        navigate('/admin')
        return
      }
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      console.log('📋 Login response:', { authData, error })

      if (error) {
        console.error('❌ Login error:', error)
        setError(error.message)
      } else {
        console.log('✅ Login successful!', authData)
        navigate('/admin')
      }
    } catch (err) {
      console.error('💥 Unexpected login error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-[#EAB308]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-[#0B132B]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-10 mx-4 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(0,0,0,0.1)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#EAB308]/10 to-[#0B132B]/10 rounded-2xl border border-[#EAB308]/20 flex items-center justify-center mx-auto mb-6 shadow-sm overflow-hidden">
            <img src={AKLogo} alt="AK Infinity Logo" className="w-12 h-12 object-contain" style={{ transform: 'scale(1.1)' }} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#0B132B] to-[#EAB308] bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Access your lead management dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0B132B] mb-2">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              type="email"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-sm bg-slate-50/50 focus:bg-white"
              placeholder="admin@akinfinity.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B132B] mb-2">Password</label>
            <div className="relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-sm bg-slate-50/50 focus:bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            size="md" 
            className="w-full !bg-[#EAB308] hover:!bg-[#d4a207] !text-[#0B132B] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
