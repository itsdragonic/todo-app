import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        marginBottom: 8,
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 4,
      }}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo)}
        style={{ width: 16, height: 16, accentColor: '#f0ede6', cursor: 'pointer', flexShrink: 0 }}
      />
      <span style={{
        flex: 1,
        fontSize: 15,
        fontFamily: 'sans-serif',
        color: todo.done ? '#444' : '#c8c4bc',
        textDecoration: todo.done ? 'line-through' : 'none',
        transition: 'color 0.2s',
      }}>
        {todo.text}
      </span>
      <motion.button
        whileHover={{ color: '#e05555' }}
        onClick={() => onDelete(todo.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#444',
          padding: 4,
          display: 'flex',
          transition: 'color 0.2s',
        }}
      >
        <Trash2 size={15} />
      </motion.button>
    </motion.li>
  )
}