import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, LogOut } from 'lucide-react'
import { api } from '../api'

export default function Sidebar({ open, onClose, onDeleteAccount, onLogout }) {
  async function handleDeleteAccount() {
    if (!confirm('This will permanently delete your account and all todos. Are you sure?')) return
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-10"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-[#141414] border-l border-[#2a2a2a] z-20 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-[#f0ede6] font-serif text-lg">Menu</span>
              <button
                onClick={onClose}
                className="text-[#666] hover:text-[#f0ede6] transition-colors bg-transparent border-none cursor-pointer flex"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onLogout(); onClose() }}
                className="flex items-center gap-3 w-full px-4 py-3 bg-transparent border border-[#2a2a2a] rounded-sm text-[#666] text-sm font-sans cursor-pointer hover:border-[#444] hover:text-[#aaa] transition-all text-left"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>

            <div className="flex-1" />

            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-3 w-full px-4 py-3 bg-transparent border border-[#2a2a2a] rounded-sm text-[#666] text-sm font-sans cursor-pointer hover:border-red-800 hover:text-red-400 transition-all text-left"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}