import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../api'

export default function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const res = isRegistering ? await api.register(form) : await api.login(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      onLogin(res.data.token, res.data.username)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
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
          {isRegistering ? 'Start tracking your tasks.' : 'Sign in to your workspace.'}
        </p>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs font-sans mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {['username', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="block w-full px-4 py-3 mb-3 bg-[#111] border border-[#2a2a2a] rounded-sm text-[#f0ede6] text-sm font-sans"
          />
        ))}

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
          onClick={() => { setIsRegistering(!isRegistering); setError('') }}
          className="w-full py-3 mt-3 bg-transparent border border-[#2a2a2a] rounded-sm text-[#666] text-xs font-sans cursor-pointer hover:border-[#444] transition-colors"
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </motion.div>
    </div>
  )
}