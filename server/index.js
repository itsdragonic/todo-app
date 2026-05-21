const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const app = express()
app.use(cors())
app.use(express.json())

// GET all todos
app.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  })
  res.json(todos)
})

// POST create a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body
  const todo = await prisma.todo.create({
    data: { text }
  })
  res.json(todo)
})

// PATCH toggle done/undone
app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { done } = req.body
  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: { done }
  })
  res.json(todo)
})

// DELETE a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params
  await prisma.todo.delete({ where: { id: Number(id) } })
  res.json({ success: true })
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))