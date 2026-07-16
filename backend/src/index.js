import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { runBusinessResearch } from './ai-research-engine.js'
import { generateSalesCoachReport, generateCallSummary } from './ai-sales-coach.js'
import { aiChatService } from './ai-chat-service.js'

const app = express()
const PORT = process.env.PORT || 5001

// Check if Supabase is configured
let supabase = null
console.log('🔧 Checking Supabase configuration...')
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set')
console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set')

if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim()) {
  try {
    console.log('🔄 Creating Supabase client...')
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    console.log('✅ Supabase configured successfully')
  } catch (err) {
    console.log('❌ Error configuring Supabase:', err)
  }
} else {
  console.log('⚠️  Supabase not configured - will use demo mode')
}

const allowedOrigins = [
  'https://akinfinity.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
];

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
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Supabase error fetching leads:', error)
        return res.json(demoLeads) // Fall back to demo mode on error
      }
      return res.json(data)
    }
    res.json(demoLeads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    res.json(demoLeads) // Fall back to demo mode on any error
  }
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
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Supabase error fetching visitors:', error)
        return res.json(demoVisitors) // Fall back to demo mode on error
      }
      return res.json(data)
    }
    res.json(demoVisitors)
  } catch (error) {
    console.error('Error fetching visitors:', error)
    res.json(demoVisitors) // Fall back to demo mode on any error
  }
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
  const { region } = req.query;
  
  if (supabase) {
    let query = supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (region) {
      query = query.eq('region', region);
    }
    
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  }
  res.json([]);
});

app.post('/api/clients', async (req, res) => {
  console.log('📥 Received request to create client:', req.body);
  
  const {
    business_name,
    owner_name,
    address_name,
    google_maps_link,
    owner_contact_number,
    region = 'Indian'
  } = req.body;

  if (!business_name || !owner_name || !address_name) {
    console.error('❌ Missing required fields:', { business_name, owner_name, address_name });
    return res.status(400).json({ error: 'Business name, owner name, and address are required' });
  }

  const newClient = {
    business_name,
    owner_name,
    address_name,
    google_maps_link,
    owner_contact_number,
    region,
    first_call: false,
    description: '',
    website: false,
    collaboration: false,
    first_meeting: false,
    final_call: false,
    agreement_signed: false,
    project_delivered: false
  };

  console.log('📝 Prepared client object:', newClient);

  if (supabase) {
    console.log('💾 Saving to Supabase...');
    const { data, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log('✅ Client saved to Supabase:', data[0]);
    return res.status(201).json(data[0]);
  }

  const demoClient = {
    id: Date.now().toString(),
    ...newClient,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  console.log('✅ Demo client created:', demoClient);
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
    final_call,
    agreement_signed,
    payment_amount,
    amount_received,
    project_delivered,
    region
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
  if (final_call !== undefined) updateData.final_call = final_call;
  if (agreement_signed !== undefined) updateData.agreement_signed = agreement_signed;
  if (payment_amount !== undefined) updateData.payment_amount = payment_amount;
  if (amount_received !== undefined) updateData.amount_received = amount_received;
  if (project_delivered !== undefined) updateData.project_delivered = project_delivered;
  if (region !== undefined) updateData.region = region;

  if (supabase) {
    // First, get the current client to check existing dates
    const { data: currentClient, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    // Set dates if the corresponding boolean is being set to true and date doesn't exist
    if (first_call === true && !currentClient.first_call_date) {
      updateData.first_call_date = new Date().toISOString();
    }
    if (first_meeting === true && !currentClient.first_meeting_date) {
      updateData.first_meeting_date = new Date().toISOString();
    }
    if (final_call === true && !currentClient.final_call_date) {
      updateData.final_call_date = new Date().toISOString();
    }
    if (agreement_signed === true && !currentClient.agreement_date) {
      updateData.agreement_date = new Date().toISOString();
    }

    // Update last_description_updated_at if description is changed
    if (description !== undefined && description !== currentClient.description) {
      updateData.last_description_updated_at = new Date().toISOString();
    }

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

// AI Analysis Endpoints

// Get latest AI analysis for a client
app.get('/api/ai-analysis/:clientId', async (req, res) => {
  const { clientId } = req.params;

  if (supabase) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_latest', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      return res.status(500).json({ error: error.message });
    }
    return res.json(data || null);
  }

  res.json(null);
});

// Get all AI analyses for a client
app.get('/api/ai-analysis/:clientId/all', async (req, res) => {
  const { clientId } = req.params;

  if (supabase) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  }

  res.json([]);
});

// Start AI analysis for a client
app.post('/api/ai-analysis/:clientId/analyze', async (req, res) => {
  const { clientId } = req.params;
  const { force = false } = req.query; // Optional force flag to re-run analysis

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    // Get client data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check for recent completed analysis (last 24 hours)
    if (!force) {
      const { data: existingAnalysis, error: checkError } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'Completed')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingAnalysis && !checkError) {
        // Update to mark as latest
        await supabase
          .from('ai_analysis')
          .update({ is_latest: true })
          .eq('id', existingAnalysis.id);

        await supabase
          .from('ai_analysis')
          .update({ is_latest: false })
          .eq('client_id', clientId)
          .neq('id', existingAnalysis.id);

        console.log('Reusing recent analysis from', existingAnalysis.created_at);
        return res.status(200).json(existingAnalysis);
      }
    }

    // Check if there's already a processing analysis
    const { data: processingAnalysis, error: processingCheckError } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'Processing')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (processingAnalysis && !processingCheckError) {
      // Return existing processing analysis
      return res.status(202).json(processingAnalysis);
    }

    // Create initial analysis record with Processing status
    const { data: newAnalysis, error: createError } = await supabase
      .from('ai_analysis')
      .insert([{
        client_id: clientId,
        status: 'Processing',
        is_latest: true
      }])
      .select()
      .single();

    if (createError) {
      return res.status(500).json({ error: createError.message });
    }

    // Mark all previous analyses as not latest
    await supabase
      .from('ai_analysis')
      .update({ is_latest: false })
      .eq('client_id', clientId)
      .neq('id', newAnalysis.id);

    // Return the processing analysis immediately
    res.status(202).json(newAnalysis);

    // Run the research in the background
    (async () => {
      try {
        const researchResult = await runBusinessResearch(client, clientId);
        
        // Update the analysis with results
        const googleReviews = researchResult.collectedData.googleMapsData ? {
          average_rating: researchResult.collectedData.googleMapsData.rating,
          total_reviews: researchResult.collectedData.googleMapsData.reviewsCount
        } : null;
        
        const websiteUrl = researchResult.collectedData.googleMapsData?.website || null;
        
        await supabase
          .from('ai_analysis')
          .update({
            status: 'Completed',
            business_summary: researchResult.aiAnalysis.business_summary,
            business_intelligence: researchResult.aiAnalysis.business_intelligence,
            review_intelligence: researchResult.aiAnalysis.review_intelligence,
            online_presence: researchResult.aiAnalysis.online_presence,
            digital_presence: researchResult.collectedData.websiteAnalysis,
            website_status: researchResult.collectedData.websiteAnalysis,
            public_online_presence: researchResult.aiAnalysis.online_presence,
            business_strengths: researchResult.aiAnalysis.business_intelligence.business_strengths,
            improvement_opportunities: researchResult.aiAnalysis.business_intelligence.growth_opportunities,
            suggested_services: [],
            confidence_score: researchResult.aiAnalysis.confidence_score,
            raw_data: researchResult.collectedData,
            google_reviews: googleReviews,
            website_url: websiteUrl,
            google_maps_data: researchResult.collectedData.googleMapsData,
            analysis_duration: researchResult.analysisDuration,
            ai_model: researchResult.aiModel,
            analysis_version: 'v1'
          })
          .eq('id', newAnalysis.id);
      } catch (error) {
        console.error('AI research failed:', error);
        
        // Create user-friendly error message
        let userFriendlyError = 'An error occurred during analysis';
        if (error.message) {
          if (error.message.includes('429') || error.message.includes('quota')) {
            userFriendlyError = 'API quota exceeded. Please try again later or upgrade your plan.';
          } else if (error.message.includes('GEMINI_API_KEY')) {
            userFriendlyError = 'Gemini API key not configured. Please check your environment variables.';
          } else if (error.message.includes('Failed to parse')) {
            userFriendlyError = 'Failed to generate analysis. Please try again.';
          } else {
            userFriendlyError = 'Analysis failed. Please try again.';
          }
        }
        
        // Update with failed status
        await supabase
          .from('ai_analysis')
          .update({
            status: 'Failed',
            error_message: userFriendlyError
          })
          .eq('id', newAnalysis.id);
      }
    })();

  } catch (error) {
    console.error('Error starting AI analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI Sales Coach & Memory Endpoints ====================

// Get or Generate Sales Coach Report
app.get('/api/sales-coach/:clientId', async (req, res) => {
  const { clientId } = req.params;
  
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    // Check if report already exists
    let { data: existingReport, error: getError } = await supabase
      .from('ai_sales_coach_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();
      
    if (getError && getError.code !== 'PGRST116') {
      return res.status(500).json({ error: getError.message });
    }
    
    if (existingReport) {
      return res.json(existingReport);
    }
    
    // If no report exists, create one
    // Get AI analysis first
    const { data: aiAnalysis, error: analysisError } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_latest', true)
      .single();
      
    if (analysisError) {
      return res.status(404).json({ error: 'AI Analysis not found' });
    }
    
    // Get client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (clientError) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Generate report
    const report = await generateSalesCoachReport(aiAnalysis, client);
    
    // Save to DB
    const { data: savedReport, error: saveError } = await supabase
      .from('ai_sales_coach_reports')
      .insert([{
        client_id: clientId,
        ai_analysis_id: aiAnalysis.id,
        opening_line: report.opening_line,
        conversation_strategy: report.conversation_strategy,
        questions_to_ask: report.questions_to_ask,
        predicted_objections: report.predicted_objections,
        professional_replies: report.professional_replies,
        closing_strategy: report.closing_strategy,
        recommended_services: report.recommended_services,
        sales_tips: report.sales_tips
      }])
      .select()
      .single();
      
    if (saveError) {
      return res.status(500).json({ error: saveError.message });
    }
    
    // Add timeline event
    await supabase.from('client_timeline').insert([{
      client_id: clientId,
      event_type: 'AI_SALES_COACH_GENERATED',
      event_title: 'AI Sales Coach Report Generated',
      event_description: 'AI-generated sales coaching report created'
    }]);
    
    res.json(savedReport);
    
  } catch (error) {
    console.error('Error with Sales Coach:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales-coach/:clientId/regenerate', async (req, res) => {
  const { clientId } = req.params;
  
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    // Get AI analysis
    const { data: aiAnalysis, error: analysisError } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_latest', true)
      .single();
      
    if (analysisError) {
      return res.status(404).json({ error: 'AI Analysis not found' });
    }
    
    // Get client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (clientError) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Generate new report
    const report = await generateSalesCoachReport(aiAnalysis, client);
    
    // Save to DB
    const { data: savedReport, error: saveError } = await supabase
      .from('ai_sales_coach_reports')
      .insert([{
        client_id: clientId,
        ai_analysis_id: aiAnalysis.id,
        opening_line: report.opening_line,
        conversation_strategy: report.conversation_strategy,
        questions_to_ask: report.questions_to_ask,
        predicted_objections: report.predicted_objections,
        professional_replies: report.professional_replies,
        closing_strategy: report.closing_strategy,
        recommended_services: report.recommended_services,
        sales_tips: report.sales_tips
      }])
      .select()
      .single();
      
    if (saveError) {
      return res.status(500).json({ error: saveError.message });
    }
    
    // Add timeline event
    await supabase.from('client_timeline').insert([{
      client_id: clientId,
      event_type: 'AI_SALES_COACH_REGENERATED',
      event_title: 'AI Sales Coach Report Regenerated',
      event_description: 'New AI sales coaching report created'
    }]);
    
    res.json(savedReport);
    
  } catch (error) {
    console.error('Error regenerating Sales Coach:', error);
    res.status(500).json({ error: error.message });
  }
});

// Call Notes Endpoints
app.get('/api/call-notes/:clientId', async (req, res) => {
  const { clientId } = req.params;
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('call_notes')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching call notes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/call-notes/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { short_notes, call_date } = req.body;
  
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    // Get client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (clientError) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Generate AI summary
    const aiSummary = await generateCallSummary(short_notes, client);
    
    // Save to DB
    const { data: savedNote, error: saveError } = await supabase
      .from('call_notes')
      .insert([{
        client_id: clientId,
        short_notes,
        ai_generated_summary: aiSummary,
        call_date: call_date || new Date().toISOString()
      }])
      .select()
      .single();
      
    if (saveError) {
      return res.status(500).json({ error: saveError.message });
    }
    
    // Add timeline event
    await supabase.from('client_timeline').insert([{
      client_id: clientId,
      event_type: 'CALL_NOTE_ADDED',
      event_title: 'Call Note Added',
      event_description: 'New call note recorded'
    }]);
    
    // Update follow-up recommendation
    await supabase.from('follow_up_recommendations').insert([{
      client_id: clientId,
      recommended_action: 'Review call summary and plan next steps',
      priority: 'MEDIUM',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
    }]);
    
    res.json(savedNote);
    
  } catch (error) {
    console.error('Error saving call note:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/call-notes/:id', async (req, res) => {
  const { id } = req.params;
  const { short_notes, ai_generated_summary } = req.body;
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('call_notes')
      .update({
        short_notes,
        ai_generated_summary,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('Error updating call note:', error);
    res.status(500).json({ error: error.message });
  }
});

// Timeline Endpoint
app.get('/api/client-timeline/:clientId', async (req, res) => {
  const { clientId } = req.params;
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('client_timeline')
      .select('*')
      .eq('client_id', clientId)
      .order('event_date', { ascending: false });
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: error.message });
  }
});

// Follow-up Recommendations Endpoints
app.get('/api/follow-up/:clientId', async (req, res) => {
  const { clientId } = req.params;
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('follow_up_recommendations')
      .select('*')
      .eq('client_id', clientId)
      .order('due_date', { ascending: true });
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/follow-up/:id', async (req, res) => {
  const { id } = req.params;
  const { is_completed, recommended_action, priority, due_date, notes } = req.body;
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('follow_up_recommendations')
      .update({
        is_completed,
        recommended_action,
        priority,
        due_date,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error updating follow-up:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI Chat Assistant Endpoints ====================

// Get or create conversation for a client
app.get('/api/chat/:clientId/conversation', async (req, res) => {
  const { clientId } = req.params;
  
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    // Find existing active conversation
    let { data: conversation, error: convError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (convError && convError.code !== 'PGRST116') {
      return res.status(500).json({ error: convError.message });
    }
    
    // If no conversation exists, create one
    if (!conversation) {
      const { data: newConversation, error: createError } = await supabase
        .from('ai_conversations')
        .insert([{
          client_id: clientId,
          title: 'Sales Conversation',
          status: 'active',
        }])
        .select()
        .single();
        
      if (createError) {
        return res.status(500).json({ error: createError.message });
      }
      conversation = newConversation;
    }
    
    // Get all messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
      
    if (messagesError) {
      return res.status(500).json({ error: messagesError.message });
    }
    
    // Get or create ai_context for this client
    let { data: aiContext, error: contextError } = await supabase
      .from('ai_context')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();
      
    if (contextError && contextError.code !== 'PGRST116') {
      return res.status(500).json({ error: contextError.message });
    }
    
    res.json({
      conversation,
      messages,
      aiContext,
    });
    
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send a chat message
app.post('/api/chat/:clientId/messages', async (req, res) => {
  const { clientId } = req.params;
  const { message } = req.body;
  
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    // Get client data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (clientError) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Get AI analysis
    let aiAnalysis = null;
    const { data: analysisData, error: analysisError } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_latest', true)
      .maybeSingle();
    if (!analysisError) {
      aiAnalysis = analysisData;
    }
      
    // Get sales coach report
    let salesCoachReport = null;
    const { data: coachData, error: coachError } = await supabase
      .from('ai_sales_coach_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!coachError) {
      salesCoachReport = coachData;
    }
    
    // Get or create conversation
    let { data: conversation, error: convError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (convError && convError.code !== 'PGRST116') {
      return res.status(500).json({ error: convError.message });
    }
    
    if (!conversation) {
      const { data: newConv, error: createError } = await supabase
        .from('ai_conversations')
        .insert([{ client_id: clientId, title: 'Sales Conversation', status: 'active' }])
        .select()
        .single();
      if (createError) {
        return res.status(500).json({ error: createError.message });
      }
      conversation = newConv;
    }
    
    // Get existing messages
    const { data: existingMessages, error: messagesError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
      
    if (messagesError) {
      return res.status(500).json({ error: messagesError.message });
    }
    
    // Get ai_context
    let { data: aiContext, error: contextError } = await supabase
      .from('ai_context')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();
      
    if (contextError && contextError.code !== 'PGRST116') {
      return res.status(500).json({ error: contextError.message });
    }
    
    // Save user message
    const { data: savedUserMessage, error: saveError1 } = await supabase
      .from('ai_messages')
      .insert([{
        conversation_id: conversation.id,
        client_id: clientId,
        role: 'user',
        content: message.trim(),
      }])
      .select()
      .single();
      
    if (saveError1) {
      return res.status(500).json({ error: saveError1.message });
    }
    
    // Prepare conversation history for AI
    const conversationHistory = [
      ...existingMessages,
      { role: 'user', content: message.trim() }
    ];
    
    // Get AI response
    let assistantMessage;
    let aiContent;
    try {
      aiContent = await aiChatService.sendMessage({
        client,
        aiAnalysis,
        salesCoachReport,
        aiContext,
        messages: conversationHistory,
        clientId,
      });
    } catch (aiError) {
      console.error('AI Error:', aiError);
    }
    
    // Determine user-friendly error message
    let responseContent;
    let tokens, model;
    if (aiContent) {
      responseContent = aiContent.content;
      tokens = aiContent.tokensReceived;
      model = aiContent.model;
    } else {
      // Map error types to friendly messages
      const errorType = aiError?.type || 'general';
      const errorMessages = {
        rate_limit: "The AI service is temporarily unavailable due to usage limits. Please try again in a few minutes.",
        not_configured: "AI service is not properly configured. Please check your API key.",
        timeout: "The AI request timed out. Please try again.",
        general: "Sorry, I couldn't process your request right now. Please try again later.",
      };
      responseContent = errorMessages[errorType] || errorMessages.general;
      tokens = 0;
      model = null;
    }
    
    // Save AI response or friendly message
    const { data: savedAssistantMsg, error: saveError2 } = await supabase
      .from('ai_messages')
      .insert([{
        conversation_id: conversation.id,
        client_id: clientId,
        role: 'assistant',
        content: responseContent,
        tokens,
        model,
      }])
      .select()
      .single();
      
    if (saveError2) {
      return res.status(500).json({ error: saveError2.message });
    }
    assistantMessage = savedAssistantMsg;
      
    // Update conversation's updated_at
    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id);
        
    // Update ai_context with snapshots
    const newAiContext = {
      client_id: clientId,
      business_snapshot: {
        business_name: client.business_name,
        owner_name: client.owner_name,
        address_name: client.address_name,
        region: client.region,
      },
      analysis_snapshot: aiAnalysis,
      call_guide_snapshot: salesCoachReport,
      updated_at: new Date().toISOString(),
    };
      
    if (aiContext) {
      await supabase.from('ai_context').update(newAiContext).eq('id', aiContext.id);
    } else {
      await supabase.from('ai_context').insert([newAiContext]);
    }
      
    // Every 10 messages, generate a summary if AI is working
    if (aiContent) {
      const allMessages = [...existingMessages, savedUserMessage, assistantMessage];
      if (allMessages.length % 10 === 0) {
        const summary = await aiChatService.generateConversationSummary(allMessages);
        if (summary) {
          await supabase
            .from('ai_conversations')
            .update({ summary })
            .eq('id', conversation.id);
            
          if (aiContext) {
            await supabase.from('ai_context').update({ last_summary: summary }).eq('id', aiContext.id);
          } else {
            await supabase.from('ai_context').insert([{ client_id: clientId, last_summary: summary }]);
          }
        }
      }
    }

    res.json({
      userMessage: savedUserMessage,
      assistantMessage,
    });
    
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
