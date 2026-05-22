import { useState } from 'react'
import Auth from './components/Auth'
import TodoApp from './components/TodoApp'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))

  function handleLogin(token, username) {
    setToken(token)
    setUsername(username)
  }

  function handleLogout() {
    localStorage.clear()
    setToken(null)
    setUsername(null)
  }

  if (!token) return <Auth onLogin={handleLogin} />
  return <TodoApp username={username} onLogout={handleLogout} />
}