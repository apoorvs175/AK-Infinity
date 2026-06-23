import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT || 5000

// Check if Supabase is configured
let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim() && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY.trim()) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )
    console.log('Supabase configured')
  } catch (err) {
    console.log('Supabase not configured, using in-memory storage')
  }
}

app.use(cors())
app.use(express.json())

// In-memory data
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

let visitors = []

app.get('/', (req, res) => {
  res.json({ message: 'AK Infinity API' })
})

// Get all leads
app.get('/api/leads', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data.length > 0) {
      return res.json(data)
    }
  }
  res.json(leads)
})

// Create a new lead
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, message } = req.body
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ name, email, phone, message }])
      .select()
    
    if (!error) {
      return res.status(201).json(data[0])
    }
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
  return res.status(201).json(newLead)
})

// Update lead status
app.put('/api/leads/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
    
    if (!error && data.length > 0) {
      return res.json(data[0])
    }
  }
  
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
app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params

  if (supabase) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (!error) {
      return res.json({ message: 'Lead deleted successfully' })
    }
  }

  const initialLength = leads.length
  leads = leads.filter(l => l.id !== id)
  
  if (leads.length === initialLength) {
    return res.status(404).json({ error: 'Lead not found' })
  }

  res.json({ message: 'Lead deleted successfully' })
})

// Visitor endpoints
app.get('/api/visitors', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) {
      return res.json(data)
    }
  }
  res.json(visitors)
})

app.post('/api/visitors', async (req, res) => {
  const {
    ip_address,
    user_agent,
    device_type,
    browser,
    os,
    page_visited,
    referrer,
    session_id
  } = req.body
  
  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .insert([{
        ip_address,
        user_agent,
        device_type,
        browser,
        os,
        page_visited,
        referrer,
        session_id
      }])
      .select()
    
    if (!error) {
      return res.status(201).json(data[0])
    }
  }
  
  const newVisitor = {
    id: Date.now().toString(),
    ip_address,
    user_agent,
    device_type,
    browser,
    os,
    page_visited,
    referrer,
    session_id,
    time_spent: 0,
    created_at: new Date(),
    updated_at: new Date()
  }
  visitors.push(newVisitor)
  res.status(201).json(newVisitor)
})

app.put('/api/visitors/:id', async (req, res) => {
  const { id } = req.params
  const { time_spent } = req.body

  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .update({ time_spent })
      .eq('id', id)
      .select()
    
    if (!error) {
      return res.json(data[0])
    }
  }
  
  const visitorIndex = visitors.findIndex(v => v.id === id)
  if (visitorIndex !== -1) {
    visitors[visitorIndex] = {
      ...visitors[visitorIndex],
      time_spent,
      updated_at: new Date()
    }
    return res.json(visitors[visitorIndex])
  }
  
  res.status(404).json({ error: 'Visitor not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
