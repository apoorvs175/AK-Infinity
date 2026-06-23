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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 mx-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-[56px] h-[48px] bg-white rounded-xl border border-gray-300 flex items-center justify-center mx-auto mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
            <img src={AKLogo} alt="AK Infinity Logo" className="w-[51px] h-[52px] object-contain" style={{ transform: 'scale(1.1)' }} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-xs md:text-sm text-slate-600">Access the lead management dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5 md:mb-2">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              type="email"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="admin@akinfinity.com"
            />
            {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5 md:mb-2">Password</label>
            <div className="relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 pr-10 md:pr-12 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
              <p className="text-red-700 text-xs md:text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <Button type="submit" size="md" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
