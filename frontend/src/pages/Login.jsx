import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = isLogin
      ? await login(formData.email, formData.password)
      : await signup(formData.name, formData.email, formData.password)

    if (result.success) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created & logged in!')
      navigate('/dashboard')
    } else {
      toast.error(result.message || 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-[440px] h-[560px] bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl p-8 flex flex-col justify-between">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto">
            <img
              src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/6f5a8e7b0cac4a01871d5c215eeac9a2?ik-sanitizeSvg=true"
              alt="Pulse Logo"
              className="w-14 h-14 object-contain"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              PULSE STREAM
            </h1>
            <p className="text-sm text-slate-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex-1 flex flex-col justify-center"
        >
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50/50"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-medium text-sm shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
            className="font-medium text-indigo-600 hover:text-indigo-700 text-xs transition"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
