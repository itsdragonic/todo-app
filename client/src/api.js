import axios from 'axios'

const BASE = 'https://todo-app-server-1frd.onrender.com'

function headers() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const api = {
  register: (data) => axios.post(`${BASE}/auth/register`, data),
  login:    (data) => axios.post(`${BASE}/auth/login`, data),

  getTodos:    ()         => axios.get(`${BASE}/todos`, { headers: headers() }),
  createTodo:  (text)     => axios.post(`${BASE}/todos`, { text }, { headers: headers() }),
  toggleTodo:  (id, done) => axios.patch(`${BASE}/todos/${id}`, { done }, { headers: headers() }),
  deleteTodo:  (id)       => axios.delete(`${BASE}/todos/${id}`, { headers: headers() }),
  deleteAccount: ()       => axios.delete(`${BASE}/auth/account`, { headers: headers() }),
  getMe:       ()         => axios.get(`${BASE}/users/me`, { headers: headers() }),
  updateTheme: (theme)    => axios.put(`${BASE}/users/me/theme`, { theme }, { headers: headers() }),
}