import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Sample leads data (in production, this would be from Supabase
let leads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 555-0100',
    message: 'Looking for web development services',
    status: 'new',
    created_at: new Date(Date.now() - 86400000),
    updated_at: new Date(Date.now() - 86400000)
  }
]

app.get('/', (req, res) => {
  res.json({ message: 'AK Infinity API' })
})

// Get all leads
app.get('/api/leads', (req, res) => {
  res.json(leads)
})

// Create a new lead
app.post('/api/leads', (req, res) => {
  const { name, email, phone, message } = req.body
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const newLead = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    message,
    status: 'new',
    created_at: new Date(),
    updated_at: new Date()
  }
  
  leads.push(newLead)
  res.status(201).json(newLead)
})

// Update lead status
app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  const leadIndex = leads.findIndex(l => l.id === id)
  
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found' })
  }

  leads[leadIndex] = {
    ...leads[leadIndex],
    status,
    updated_at: new Date()
  }

  res.json(leads[leadIndex])
})

// Delete lead
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params
  const initialLength = leads.length
  leads = leads.filter(l => l.id !== id)
  
  if (leads.length === initialLength) {
    return res.status(404).json({ error: 'Lead not found' })
  }

  res.json({ message: 'Lead deleted successfully' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
