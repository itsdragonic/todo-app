import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../api'

export default function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.username) e.username = 'Username is required'
    else if (isRegistering && (form.username.length < 3 || form.username.length > 16))
      e.username = 'Username must be 3–16 characters'

    if (!form.password) e.password = 'Password is required'
    else if (isRegistering && (form.password.length < 3 || form.password.length > 16))
      e.password = 'Password must be 3–16 characters'

    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      const res = isRegistering ? await api.register(form) : await api.login(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      onLogin(res.data.token, res.data.username)
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong'
      if (message.toLowerCase().includes('username')) setErrors({ username: message })
      else if (message.toLowerCase().includes('password')) setErrors({ password: message })
      else setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center font-serif">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-[360px] px-10 py-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm"
      >
        <h1 className="text-[#f0ede6] text-2xl font-normal tracking-tight mb-2">
          {isRegistering ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-[#666] text-sm font-sans mb-8">
          {isRegistering ? 'Username and password, 3–16 characters.' : 'Sign in to your workspace.'}
        </p>

        <AnimatePresence>
          {errors.general && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs font-sans mb-4"
            >
              {errors.general}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Username field */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => {
              setForm({ ...form, username: e.target.value })
              if (errors.username) setErrors({ ...errors, username: null })
            }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className={`block w-full px-4 py-3 bg-[#111] border rounded-sm text-[#f0ede6] text-sm font-sans transition-colors ${
              errors.username ? 'border-red-800' : 'border-[#2a2a2a]'
            }`}
          />
          <AnimatePresence>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs font-sans mt-1.5 ml-1"
              >
                {errors.username}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password field */}
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => {
              setForm({ ...form, password: e.target.value })
              if (errors.password) setErrors({ ...errors, password: null })
            }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className={`block w-full px-4 py-3 bg-[#111] border rounded-sm text-[#f0ede6] text-sm font-sans transition-colors ${
              errors.password ? 'border-red-800' : 'border-[#2a2a2a]'
            }`}
          />
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs font-sans mt-1.5 ml-1"
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ backgroundColor: '#e8e4dc' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 mt-2 bg-[#f0ede6] text-[#0f0f0f] rounded-sm text-sm font-sans font-semibold cursor-pointer border-none"
        >
          {loading ? '...' : isRegistering ? 'Register' : 'Login'}
        </motion.button>

        <button
          onClick={() => { setIsRegistering(!isRegistering); setErrors({}) }}
          className="w-full py-3 mt-3 bg-transparent border border-[#2a2a2a] rounded-sm text-[#666] text-xs font-sans cursor-pointer hover:border-[#444] transition-colors"
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </motion.div>
    </div>
  )
}