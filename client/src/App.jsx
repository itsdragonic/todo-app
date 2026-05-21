import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://todo-app-server-1frd.onrender.com'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [authForm, setAuthForm] = useState({ username: '', password: '' })
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')

  const authHeaders = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (token) fetchTodos()
  }, [token])

  async function fetchTodos() {
    const res = await axios.get(`${API}/todos`, { headers: authHeaders })
    setTodos(res.data)
  }

  async function handleAuth() {
    setError('')
    const route = isRegistering ? 'register' : 'login'
    try {
      const res = await axios.post(`${API}/auth/${route}`, authForm)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      setToken(res.data.token)
      setUsername(res.data.username)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
    setTodos([])
  }

  async function addTodo() {
    if (!text.trim()) return
    await axios.post(`${API}/todos`, { text }, { headers: authHeaders })
    setText('')
    fetchTodos()
  }

  async function toggleTodo(todo) {
    await axios.patch(`${API}/todos/${todo.id}`, { done: !todo.done }, { headers: authHeaders })
    fetchTodos()
  }

  async function deleteTodo(id) {
    await axios.delete(`${API}/todos/${id}`, { headers: authHeaders })
    fetchTodos()
  }

  // ── Login / Register screen ───────────────────────────────
  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', fontFamily: 'sans-serif' }}>
        <h1>{isRegistering ? 'Create Account' : 'Login'}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          placeholder="Username"
          value={authForm.username}
          onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: 8, fontSize: 16, boxSizing: 'border-box' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={authForm.password}
          onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: 16, fontSize: 16, boxSizing: 'border-box' }}
        />
        <button onClick={handleAuth} style={{ width: '100%', padding: '10px', fontSize: 16, marginBottom: 8 }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button onClick={() => { setIsRegistering(!isRegistering); setError('') }} style={{ width: '100%', padding: '10px', fontSize: 16, background: 'none', border: '1px solid #ccc' }}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    )
  }

  // ── Todo screen ───────────────────────────────────────────
  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Todo App</h1>
        <div>
          <span style={{ marginRight: 12, color: '#666' }}>👋 {username}</span>
          <button onClick={logout} style={{ padding: '6px 12px' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '8px 12px', fontSize: 16 }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px', fontSize: 16 }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo)}
            />
            <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#aaa' : 'inherit' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App