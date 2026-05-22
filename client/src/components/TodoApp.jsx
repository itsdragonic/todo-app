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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      fontFamily: 'Georgia, serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: '1px solid #1e1e1e',
      }}>
        <h1 style={{ color: '#f0ede6', fontSize: 20, fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
          {username}'s tasks
        </h1>
        <motion.button
          whileHover={{ color: '#f0ede6' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setSidebarOpen(true)}
          style={{
            background: 'none', border: 'none',
            color: '#555', cursor: 'pointer',
            display: 'flex', padding: 4,
            transition: 'color 0.2s',
          }}
        >
          <Menu size={22} />
        </motion.button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>
        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 4,
              color: '#f0ede6',
              fontSize: 15,
              fontFamily: 'sans-serif',
              outline: 'none',
            }}
          />
          <motion.button
            whileHover={{ background: '#e8e4dc' }}
            whileTap={{ scale: 0.97 }}
            onClick={addTodo}
            style={{
              padding: '12px 20px',
              background: '#f0ede6',
              color: '#0f0f0f',
              border: 'none',
              borderRadius: 4,
              fontSize: 15,
              fontFamily: 'sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Add
          </motion.button>
        </div>

        {/* Todo count */}
        {todos.length > 0 && (
          <p style={{ color: '#444', fontSize: 12, fontFamily: 'sans-serif', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {todos.filter(t => !t.done).length} remaining · {todos.length} total
          </p>
        )}

        {/* Todo list */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
              style={{ color: '#333', fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', marginTop: 48 }}
            >
              No tasks yet. Add one above.
            </motion.p>
          )}
        </ul>
      </div>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}