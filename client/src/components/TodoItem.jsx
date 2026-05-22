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
      className="flex items-center gap-3 px-4 py-4 mb-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm group"
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo)}
        className="w-4 h-4 cursor-pointer flex-shrink-0 accent-[#f0ede6]"
      />
      <span className={`flex-1 text-sm font-sans transition-colors duration-200 ${
        todo.done ? 'line-through text-[#444]' : 'text-[#c8c4bc]'
      }`}>
        {todo.text}
      </span>
      <motion.button
        whileHover={{ color: '#e05555' }}
        onClick={() => onDelete(todo.id)}
        className="text-[#333] bg-transparent border-none cursor-pointer p-1 flex opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        <Trash2 size={14} />
      </motion.button>
    </motion.li>
  )
}