import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToQueue, getQueueState } from '../queue'

const messages = {
  synced:  { text: 'All saved',  color: '#4ade80' },
  syncing: { text: 'Saving...',  color: '#facc15' },
  pending: { text: 'Waiting for server...', color: '#f97316' },
}

export default function SyncIndicator() {
  const [state, setState] = useState(getQueueState())

  useEffect(() => subscribeToQueue(setState), [])

  const { text, color } = messages[state]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5"
      >
        <motion.div
          animate={state === 'syncing' ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ background: color }}
          className="w-1.5 h-1.5 rounded-full"
        />
        <span className="text-xs font-sans" style={{ color }}>
          {text}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}