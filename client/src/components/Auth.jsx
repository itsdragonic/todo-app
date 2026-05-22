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
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: 360,
          padding: '48px 40px',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 4,
        }}
      >
        <motion.h1
          style={{ color: '#f0ede6', fontSize: 28, fontWeight: 400, marginBottom: 8, letterSpacing: '-0.5px' }}
        >
          {isRegistering ? 'Create account' : 'Welcome back'}
        </motion.h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 32, fontFamily: 'sans-serif' }}>
          {isRegistering ? 'Start tracking your tasks.' : 'Sign in to your workspace.'}
        </p>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#e05555', fontSize: 13, marginBottom: 16, fontFamily: 'sans-serif' }}
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
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 14px',
              marginBottom: 12,
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: 3,
              color: '#f0ede6',
              fontSize: 15,
              fontFamily: 'sans-serif',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        ))}

        <motion.button
          whileHover={{ background: '#e8e4dc' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: 8,
            background: '#f0ede6',
            color: '#0f0f0f',
            border: 'none',
            borderRadius: 3,
            fontSize: 15,
            fontFamily: 'sans-serif',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? '...' : isRegistering ? 'Register' : 'Login'}
        </motion.button>

        <button
          onClick={() => { setIsRegistering(!isRegistering); setError('') }}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: 10,
            background: 'none',
            border: '1px solid #2a2a2a',
            borderRadius: 3,
            color: '#666',
            fontSize: 13,
            fontFamily: 'sans-serif',
            cursor: 'pointer',
          }}
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </motion.div>
    </div>
  )
}