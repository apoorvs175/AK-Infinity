import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT || 5001

// Check if Supabase is configured
let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim()) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    console.log('Supabase configured')
  } catch (err) {
    console.log('Supabase not configured')
  }
}

const allowedOrigins = [
  'https://akinfinity.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'AK Infinity API' })
})

// Store in-memory data for demo purposes when Supabase isn't configured
let demoLeads = []
let demoVisitors = []
let nextLeadId = 1
let nextVisitorId = 1

// Get all leads
app.get('/api/leads', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.json(data)
  }
  res.json(demoLeads)
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
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(201).json(data[0])
  }
  
  const newLead = {
    id: nextLeadId++,
    name,
    email,
    phone,
    message,
    status: 'new',
    created_at: new Date().toISOString()
  }
  demoLeads.unshift(newLead)
  res.status(201).json(newLead)
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
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Lead not found' })
    }
    return res.json(data[0])
  }
  
  const leadIndex = demoLeads.findIndex(lead => lead.id == id)
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found' })
  }
  demoLeads[leadIndex].status = status
  res.json(demoLeads[leadIndex])
})

// Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params

  if (supabase) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.json({ message: 'Lead deleted successfully' })
  }

  const initialLength = demoLeads.length
  demoLeads = demoLeads.filter(lead => lead.id != id)
  if (demoLeads.length === initialLength) {
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
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.json(data)
  }
  res.json(demoVisitors)
})

// Reverse geocoding function using OpenStreetMap Nominatim
async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AK-Infinity-Visitor-Tracker/1.0'
        }
      }
    )
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    if (!data || !data.address) {
      return null
    }
    
    const address = data.address
    return {
      full_address: data.display_name,
      locality: address.suburb || address.neighbourhood || address.village || address.town || address.city || '',
      city: address.city || address.town || address.village || '',
      district: address.county || address.state_district || '',
      state: address.state || '',
      country: address.country || '',
      postal_code: address.postcode || ''
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

app.post('/api/visitors', async (req, res) => {
  const {
    ip_address,
    user_agent,
    device_type,
    browser,
    os,
    page_visited,
    referrer,
    session_id,
    latitude,
    longitude,
    accuracy,
    location_permission
  } = req.body
  
  console.log('📥 Received visitor data:', {
    page_visited,
    location_permission,
    hasLocation: !!(latitude && longitude)
  })
  
  let visitorData = {
    ip_address,
    user_agent,
    device_type,
    browser,
    os,
    page_visited,
    referrer,
    session_id,
    location_permission: location_permission || 'not_requested'
  }
  
  // If we have coordinates, try to reverse geocode
  if (latitude && longitude) {
    console.log('📍 Reverse geocoding coordinates:', { latitude, longitude })
    
    visitorData.latitude = latitude
    visitorData.longitude = longitude
    visitorData.accuracy = accuracy
    visitorData.google_maps_url = `https://www.google.com/maps?q=${latitude},${longitude}`
    
    const addressData = await reverseGeocode(latitude, longitude)
    if (addressData) {
      console.log('🏠 Address found:', addressData)
      visitorData = { ...visitorData, ...addressData }
    } else {
      console.log('❌ No address found from reverse geocoding')
    }
  }
  
  if (supabase) {
    console.log('💾 Saving to Supabase...')
    const { data, error } = await supabase
      .from('visitors')
      .insert([visitorData])
      .select()
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return res.status(500).json({ error: error.message })
    }
    console.log('✅ Visitor saved to Supabase:', data[0].id)
    return res.status(201).json(data[0])
  }
  
  const newVisitor = {
    id: nextVisitorId++,
    ...visitorData,
    time_spent: 0,
    created_at: new Date().toISOString()
  }
  demoVisitors.unshift(newVisitor)
  console.log('✅ Visitor saved to demo storage:', newVisitor.id)
  res.status(201).json(newVisitor)
})

app.put('/api/visitors/:id', async (req, res) => {
  const { id } = req.params;
  const { time_spent } = req.body;

  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .update({ time_spent })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    return res.json(data[0]);
  }
  
  const visitorIndex = demoVisitors.findIndex(visitor => visitor.id == id);
  if (visitorIndex === -1) {
    return res.status(404).json({ error: 'Visitor not found' });
  }
  demoVisitors[visitorIndex].time_spent = time_spent;
  res.json(demoVisitors[visitorIndex]);
});

// Client endpoints
app.get('/api/clients', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  }
  res.json([]);
});

app.post('/api/clients', async (req, res) => {
  const {
    business_name,
    owner_name,
    address_name,
    google_maps_link,
    owner_contact_number
  } = req.body;

  if (!business_name || !owner_name || !address_name) {
    return res.status(400).json({ error: 'Business name, owner name, and address are required' });
  }

  const newClient = {
    business_name,
    owner_name,
    address_name,
    google_maps_link,
    owner_contact_number,
    first_call: false,
    description: '',
    website: false,
    collaboration: false,
    first_meeting: false,
    agreement_signed: false,
    project_delivered: false
  };

  if (supabase) {
    const { data, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data[0]);
  }

  const demoClient = {
    id: Date.now().toString(),
    ...newClient,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  res.status(201).json(demoClient);
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const {
    business_name,
    owner_name,
    address_name,
    google_maps_link,
    owner_contact_number,
    first_call,
    description,
    website,
    collaboration,
    first_meeting,
    agreement_signed,
    payment_amount,
    amount_received,
    project_delivered
  } = req.body;

  const updateData = { updated_at: new Date().toISOString() };
  if (business_name !== undefined) updateData.business_name = business_name;
  if (owner_name !== undefined) updateData.owner_name = owner_name;
  if (address_name !== undefined) updateData.address_name = address_name;
  if (google_maps_link !== undefined) updateData.google_maps_link = google_maps_link;
  if (owner_contact_number !== undefined) updateData.owner_contact_number = owner_contact_number;
  if (first_call !== undefined) updateData.first_call = first_call;
  if (description !== undefined) updateData.description = description;
  if (website !== undefined) updateData.website = website;
  if (collaboration !== undefined) updateData.collaboration = collaboration;
  if (first_meeting !== undefined) updateData.first_meeting = first_meeting;
  if (agreement_signed !== undefined) updateData.agreement_signed = agreement_signed;
  if (payment_amount !== undefined) updateData.payment_amount = payment_amount;
  if (amount_received !== undefined) updateData.amount_received = amount_received;
  if (project_delivered !== undefined) updateData.project_delivered = project_delivered;

  if (supabase) {
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.json(data[0]);
  }

  return res.json({ id, ...updateData });
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;

  if (supabase) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ message: 'Client deleted successfully' });
  }

  res.json({ message: 'Client deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
