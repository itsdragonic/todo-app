import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash } from 'lucide-react'
import { api } from '../api'

export default function Sidebar({ open, onClose, onDeleteAccount }) {
  async function handleDeleteAccount() {
    if (!confirm('Are you sure? This will permanently delete your account and all todos.')) return
    try {
      await api.deleteAccount()
      onDeleteAccount()
    } catch {
      alert('Something went wrong.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 10,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 280,
              background: '#141414',
              borderLeft: '1px solid #2a2a2a',
              zIndex: 20,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <span style={{ color: '#f0ede6', fontFamily: 'Georgia, serif', fontSize: 18 }}>Menu</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1 }} />

            <motion.button
              whileHover={{ borderColor: '#e05555', color: '#e05555' }}
              onClick={handleDeleteAccount}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                color: '#666',
                fontSize: 14,
                fontFamily: 'sans-serif',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <Trash size={15} />
              Delete Account
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}