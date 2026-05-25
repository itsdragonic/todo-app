import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import TodoApp from './components/TodoApp'
import { api } from './api'
import { applyTheme } from './theme'

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
    applyTheme('light')
  }

  useEffect(() => {
    async function loadMe() {
      if (!token) return
      try {
        const res = await api.getMe()
        const theme = res.data.theme || 'light'
        applyTheme(theme)
      } catch (err) {
        // ignore
      }
    }
    loadMe()
  }, [token])

  if (!token) return <Auth onLogin={handleLogin} />
  return <TodoApp username={username} onLogout={handleLogout} />
}