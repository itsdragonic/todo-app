import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://todo-app-server-1frd.onrender.com/'

function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  // Load todos when page opens
  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const res = await axios.get(`${API}/todos`)
    setTodos(res.data)
  }

  async function addTodo() {
    if (!text.trim()) return
    await axios.post(`${API}/todos`, { text })
    setText('')
    fetchTodos()
  }

  async function toggleTodo(todo) {
    await axios.patch(`${API}/todos/${todo.id}`, { done: !todo.done })
    fetchTodos()
  }

  async function deleteTodo(id) {
    await axios.delete(`${API}/todos/${id}`)
    fetchTodos()
  }

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>Todo App</h1>

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