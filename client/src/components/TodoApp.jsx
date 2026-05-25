import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { api } from '../api'
import TodoItem from './TodoItem'
import Sidebar from './Sidebar'

export default function TodoApp({ username, onLogout }) {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchTodos() }, [])

  async function fetchTodos() {
    const res = await api.getTodos()
    setTodos(res.data)
  }

  async function addTodo() {
    if (!text.trim()) return
    await api.createTodo(text)
    setText('')
    fetchTodos()
  }

  async function toggleTodo(todo) {
    await api.toggleTodo(todo.id, !todo.done)
    fetchTodos()
  }

  async function deleteTodo(id) {
    await api.deleteTodo(id)
    fetchTodos()
  }

  function handleDeleteAccount() {
    localStorage.clear()
    onLogout()
  }

  const remaining = todos.filter(t => !t.done).length

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-[#1e1e1e]">
        <div>
          <h1 className="text-lg font-normal font-serif tracking-tight" style={{ color: 'var(--text-h)' }}>
            {username}'s tasks
          </h1>
          <p className="text-xs font-sans mt-0.5" style={{ color: 'var(--text)' }}>
            {remaining} remaining
          </p>
        </div>
        <motion.button
          whileHover={{ color: '#f0ede6' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setSidebarOpen(true)}
          className="text-[#555] bg-transparent border-none cursor-pointer flex p-1 transition-colors"
        >
          <Menu size={22} />
        </motion.button>
      </header>

      {/* Content */}
      <main className="max-w-xl mx-auto px-6 py-10">
        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 border rounded-sm text-sm font-sans"
            style={{ background: 'var(--accent-bg)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}
          />
          <motion.button
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            onClick={addTodo}
            className="px-5 py-3 border-none rounded-sm text-sm font-sans font-semibold cursor-pointer"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            Add
          </motion.button>
        </div>

        {/* List */}
        <ul className="list-none p-0 m-0">
          <AnimatePresence>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </AnimatePresence>
          {todos.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#333] font-sans text-sm text-center mt-16"
            >
              No tasks yet. Add one above.
            </motion.p>
          )}
        </ul>
      </main>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onDeleteAccount={handleDeleteAccount}
        onLogout={onLogout}
      />
    </div>
  )
}