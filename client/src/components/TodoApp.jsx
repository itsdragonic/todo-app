import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { api } from '../api'
import { enqueue } from '../queue'
import TodoItem from './TodoItem'
import Sidebar from './Sidebar'
import SyncIndicator from './SyncIndicator'

export default function TodoApp({ username, onLogout }) {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nextTempId = useRef(-1) // temporary negative IDs for optimistic items

  useEffect(() => { fetchTodos() }, [])

  async function fetchTodos() {
    try {
      const res = await api.getTodos()
      setTodos(res.data)
    } catch {
      // server not up yet, will retry via queue on next action
    }
  }

  function addTodo() {
    if (!text.trim()) return
    const tempId = nextTempId.current--
    const optimistic = { id: tempId, text, done: false, createdAt: new Date().toISOString() }

    // Show instantly
    setTodos(prev => [optimistic, ...prev])
    setText('')

    // Queue the real API call, then refresh to get the real ID
    enqueue({ type: 'CREATE_TODO', text, onSuccess: fetchTodos })
  }

  function toggleTodo(todo) {
    // Update instantly
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))

    // Queue the real API call
    enqueue({ type: 'TOGGLE_TODO', id: todo.id, done: !todo.done })
  }

  function deleteTodo(id) {
    // Remove instantly
    setTodos(prev => prev.filter(t => t.id !== id))

    // Queue the real API call
    enqueue({ type: 'DELETE_TODO', id })
  }

  function handleDeleteAccount() {
    localStorage.clear()
    onLogout()
  }

  const remaining = todos.filter(t => !t.done).length

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-[#1e1e1e]">
        <div>
          <h1 className="text-[#f0ede6] text-lg font-normal font-serif tracking-tight">
            {username}'s tasks
          </h1>
          <p className="text-[#444] text-xs font-sans mt-0.5">
            {remaining} remaining
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SyncIndicator />
          <motion.button
            whileHover={{ color: '#f0ede6' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSidebarOpen(true)}
            className="text-[#555] bg-transparent border-none cursor-pointer flex p-1 transition-colors"
          >
            <Menu size={22} />
          </motion.button>
        </div>
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
            className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#f0ede6] text-sm font-sans"
          />
          <motion.button
            whileHover={{ backgroundColor: '#e8e4dc' }}
            whileTap={{ scale: 0.97 }}
            onClick={addTodo}
            className="px-5 py-3 bg-[#f0ede6] text-[#0f0f0f] border-none rounded-sm text-sm font-sans font-semibold cursor-pointer"
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