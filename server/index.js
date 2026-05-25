const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const app = express()
app.use(cors())
app.use(express.json())

// ── Auth middleware ───────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Not logged in' })
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── Auth routes ───────────────────────────────────────────────
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' })

  if (username.length < 3 || username.length > 16)
    return res.status(400).json({ error: 'Username must be between 3 and 16 characters' })

  if (password.length < 3 || password.length > 16)
    return res.status(400).json({ error: 'Password must be between 3 and 16 characters' })

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing)
    return res.status(400).json({ error: 'Username is already taken' })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { username, password: hashed }
  })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
  res.json({ token, username: user.username })
})

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user)
    return res.status(400).json({ error: 'Invalid username or password' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid)
    return res.status(400).json({ error: 'Invalid username or password' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
  res.json({ token, username: user.username })
})

// ── Todo routes (protected) ───────────────────────────────────
app.get('/todos', requireAuth, async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  })
  res.json(todos)
})

app.post('/todos', requireAuth, async (req, res) => {
  const { text } = req.body
  const todo = await prisma.todo.create({
    data: { text, userId: req.userId }
  })
  res.json(todo)
})

app.patch('/todos/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { done } = req.body
  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: { done }
  })
  res.json(todo)
})

app.delete('/todos/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  await prisma.todo.delete({ where: { id: Number(id) } })
  res.json({ success: true })
})

app.delete('/auth/account', requireAuth, async (req, res) => {
  await prisma.todo.deleteMany({ where: { userId: req.userId } })
  await prisma.user.delete({ where: { id: req.userId } })
  res.json({ success: true })
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))