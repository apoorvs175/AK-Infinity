import { chromium } from 'playwright'
import { aiAnalysisServiceProvider } from './ai/index.js'
import { logAIRequest } from './utils/logger.js'

/**
 * Parse Google Maps URL to extract business information with improved selectors
 */
async function parseGoogleMapsURL(googleMapsUrl) {
  console.log('🔍 Starting Google Maps parsing for:', googleMapsUrl)
  try {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    })
    
    await page.goto(googleMapsUrl, { waitUntil: 'networkidle', timeout: 45000 })
    
    // Wait for page to fully load
    await page.waitForTimeout(4000)
    
    const businessData = await page.evaluate(() => {
      const data = {
        name: '',
        address: '',
        phone: '',
        website: '',
        category: '',
        rating: null,
        reviewsCount: null,
        openingHours: [],
        description: '',
        googleMapsUrl: window.location.href
      }
      
      // Extract business name
      const nameSelectors = [
        'h1',
        '[role="heading"] h1',
        '.DUwDvf',
        '.lfPIob'
      ]
      for (const sel of nameSelectors) {
        const el = document.querySelector(sel)
        if (el && el.textContent.trim()) {
          data.name = el.textContent.trim()
          break
        }
      }
      
      // Extract category
      const categorySelectors = [
        'button[jsaction*="category"] span',
        '.DkEaL',
        '.hfpxzc'
      ]
      for (const sel of categorySelectors) {
        const el = document.querySelector(sel)
        if (el && el.textContent.trim()) {
          data.category = el.textContent.trim()
          break
        }
      }
      
      // Extract rating and reviews
      const ratingReviewSelectors = [
        '.F7nice',
        '.MW4etd'
      ]
      for (const sel of ratingReviewSelectors) {
        const container = document.querySelector(sel)
        if (container) {
          // Rating
          const ratingText = container.textContent
          const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/)
          if (ratingMatch) {
            data.rating = parseFloat(ratingMatch[1])
          }
          
          // Reviews count
          const reviewsMatch = ratingText.match(/(\d+(?:,\d+)*)/g)
          if (reviewsMatch && reviewsMatch.length > 1) {
            data.reviewsCount = parseInt(reviewsMatch[reviewsMatch.length - 1].replace(/,/g, ''))
          }
          break
        }
      }
      
      // Extract address, phone, website from info buttons
      const infoButtons = document.querySelectorAll('[data-item-id]')
      infoButtons.forEach(btn => {
        const itemId = btn.getAttribute('data-item-id')
        const text = btn.textContent.trim()
        
        if (itemId?.includes('address')) {
          data.address = text
        } else if (itemId?.includes('phone') || itemId?.includes('tel')) {
          data.phone = text
        } else if (itemId?.includes('website')) {
          // Check if it's a valid website (not directions etc.)
          if (text.includes('.') && !text.includes(' ')) {
            data.website = text.startsWith('http') ? text : `https://${text}`
          }
        }
      })
      
      // Fallback for website/phone/address if not found via data-item-id
      if (!data.website || !data.phone || !data.address) {
        const allSpans = Array.from(document.querySelectorAll('span'))
        for (const span of allSpans) {
          const text = span.textContent.trim()
          
          // Phone
          if (!data.phone && /^[+]?[\d\s\-()]{8,}$/.test(text)) {
            data.phone = text
          }
          
          // Website
          if (!data.website && 
              (text.includes('.com') || text.includes('.in') || text.includes('.org') || text.includes('.net')) && 
              !text.includes(' ') && 
              !text.includes('@') &&
              !text.includes('Directions')) {
            data.website = text.startsWith('http') ? text : `https://${text}`
          }
        }
      }
      
      console.log('📊 Extracted Google Maps data in browser:', data)
      return data
    })
    
    console.log('✅ Google Maps parsing successful:', businessData)
    await browser.close()
    
    return {
      success: true,
      data: businessData
    }
  } catch (error) {
    console.error('❌ Error parsing Google Maps URL:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Analyze website using Playwright
 */
async function analyzeWebsite(websiteUrl) {
  console.log('🌐 Starting website analysis for:', websiteUrl)
  if (!websiteUrl) {
    console.log('⚠️ No website URL provided')
    return {
      available: false,
      mobileResponsive: false,
      modernDesign: false,
      https: false,
      hasNavigation: false,
      hasAboutPage: false,
      hasServicesPage: false,
      hasContactPage: false,
      contactInfo: {
        phone: null,
        email: null,
        address: null
      },
      uxIssues: [],
      observations: []
    }
  }

  try {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    })
    
    let available = true
    let https = websiteUrl.startsWith('https')
    const observations = []
    const uxIssues = []
    
    try {
      await page.goto(websiteUrl, { waitUntil: 'networkidle', timeout: 30000 })
    } catch (navError) {
      console.log('⚠️ Website navigation failed:', navError.message)
      available = false
      observations.push('Website failed to load')
    }
    
    let mobileResponsive = false
    let modernDesign = false
    let hasNavigation = false
    let hasAboutPage = false
    let hasServicesPage = false
    let hasContactPage = false
    const contactInfo = { phone: null, email: null, address: null }
    
    if (available) {
      // Check mobile responsiveness
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(1000)
      
      const viewportMeta = await page.evaluate(() => {
        return document.querySelector('meta[name="viewport"]') !== null
      })
      
      mobileResponsive = viewportMeta
      if (mobileResponsive) observations.push('Mobile responsive via viewport meta tag')
      else uxIssues.push('No viewport meta tag for mobile responsiveness')
      
      // Check for modern design cues
      modernDesign = await page.evaluate(() => {
        const hasTailwind = document.querySelector('link[href*="tailwind"]') || 
                           Array.from(document.querySelectorAll('*')).some(el => 
                             Array.from(el.classList).some(cls => cls.startsWith('bg-') || cls.startsWith('text-') || cls.startsWith('p-') || cls.startsWith('m-'))
                           )
        const hasFlexbox = Array.from(document.querySelectorAll('*')).some(el => {
          const style = window.getComputedStyle(el)
          return style.display === 'flex' || style.display === 'grid'
        })
        return hasTailwind || hasFlexbox
      })
      if (modernDesign) observations.push('Modern layout with flex/grid or Tailwind')
      else observations.push('Basic design without modern layout techniques')
      
      // Extract contact info
      const pageContent = await page.content()
      
      // Phone regex
      const phoneMatches = pageContent.match(/[+]?[\d\s\-()]{10,}/g)
      if (phoneMatches) {
        contactInfo.phone = phoneMatches[0].trim()
        observations.push('Phone number found on website')
      }
      
      // Email regex
      const emailMatches = pageContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      if (emailMatches) {
        contactInfo.email = emailMatches[0]
        observations.push('Email address found on website')
      }
      
      // Check for about/services/contact pages
      hasAboutPage = pageContent.toLowerCase().includes('about')
      hasServicesPage = pageContent.toLowerCase().includes('service')
      hasContactPage = pageContent.toLowerCase().includes('contact')
      
      if (hasAboutPage) observations.push('About page found')
      if (hasServicesPage) observations.push('Services page found')
      if (hasContactPage) observations.push('Contact page found')
      
      // UX checks
      hasNavigation = await page.evaluate(() => {
        return document.querySelector('nav') !== null
      })
      if (hasNavigation) observations.push('Navigation menu found')
      else uxIssues.push('No clear navigation')
    }
    
    console.log('✅ Website analysis complete:', { available, mobileResponsive, modernDesign, https, contactInfo })
    await browser.close()
    
    return {
      available,
      mobileResponsive,
      modernDesign,
      https,
      hasNavigation,
      hasAboutPage,
      hasServicesPage,
      hasContactPage,
      contactInfo,
      uxIssues,
      observations
    }
  } catch (error) {
    console.error('❌ Error analyzing website:', error)
    return {
      available: false,
      mobileResponsive: false,
      modernDesign: false,
      https: false,
      hasNavigation: false,
      hasAboutPage: false,
      hasServicesPage: false,
      hasContactPage: false,
      contactInfo: { phone: null, email: null, address: null },
      uxIssues: ['Failed to analyze website'],
      observations: ['Website analysis failed']
    }
  }
}

/**
 * Generate business intelligence using Gemini
 */
async function generateBusinessIntelligence(collectedData, clientId) {
  console.log('🤖 Starting AI Analysis Service...')
  const startTimestamp = new Date()
  
  if (!aiAnalysisServiceProvider.isConfigured()) {
    const error = new Error('AI_ANALYSIS_API_KEY not configured')
    logAIRequest({
      timestamp: startTimestamp.toISOString(),
      clientId,
      service: 'analysis',
      requestType: 'business-intelligence',
      tokensSent: 0,
      tokensReceived: 0,
      responseTimeMs: new Date() - startTimestamp,
      error: error.message,
    })
    throw error
  }

  const prompt = `
Analyze this business data and generate a comprehensive analysis in valid JSON format only.

Business Data:
${JSON.stringify(collectedData, null, 2)}

Generate JSON with this structure:
{
  "business_summary": "200-400 word professional, human-readable summary. If not enough info, use: 'Unable to generate a reliable business summary because sufficient public information could not be verified.'",
  "business_intelligence": {
    "business_category": "Business category from Google Maps or best guess",
    "industry": "Industry the business belongs to",
    "target_customers": "Who are their primary customers? (3-5 types)",
    "business_model": "Explain how they earn revenue",
    "key_products_services": ["Product/Service 1", "Product/Service 2", "Product/Service 3"],
    "unique_selling_proposition": "What makes them unique?",
    "business_strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
    "business_weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "growth_opportunities": [
      {
        "opportunity": "Growth opportunity",
        "ak_infinity_service": "Which AK Infinity service helps with this"
      }
    ]
  },
  "review_intelligence": {
    "sentiment": "Positive/Mixed/Negative/Unavailable",
    "common_positive": ["Positive point 1", "Positive point 2"],
    "common_complaints": ["Complaint 1", "Complaint 2"]
  },
  "online_presence": {
    "overall_rating": "Poor/Fair/Good/Excellent",
    "reasons": ["Reason 1", "Reason 2"],
    "social_media": {
      "facebook": false,
      "instagram": false,
      "linkedin": false,
      "youtube": false
    }
  },
  "confidence_score": 0-100
}

Important Rules:
- No hallucinations: only use verified public information from the provided data.
- If review text isn't available, set sentiment to "Unavailable"
- confidence_score should be based on: google data quality (20%), website availability (25%), amount of verified info (30%), AI certainty (25%)
- Return ONLY valid JSON, no extra text.
`

  try {
    const result = await aiAnalysisServiceProvider.sendMessage({
      messages: [{ role: 'user', content: prompt }],
    })

    const text = result.content.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    let aiAnalysis = {}
    
    if (jsonMatch) {
      aiAnalysis = JSON.parse(jsonMatch[0])
    } else {
      throw new Error('AI returned invalid JSON')
    }

    const endTimestamp = new Date()
    logAIRequest({
      timestamp: startTimestamp.toISOString(),
      clientId,
      service: 'analysis',
      requestType: 'business-intelligence',
      tokensSent: result.tokensSent,
      tokensReceived: result.tokensReceived,
      responseTimeMs: endTimestamp - startTimestamp,
      error: null,
    })
    
    console.log('✅ AI Analysis complete')
    return aiAnalysis
  } catch (error) {
    const endTimestamp = new Date()
    logAIRequest({
      timestamp: startTimestamp.toISOString(),
      clientId,
      service: 'analysis',
      requestType: 'business-intelligence',
      tokensSent: 0,
      tokensReceived: 0,
      responseTimeMs: endTimestamp - startTimestamp,
      error: error.message,
    })
    console.error('❌ Error with AI Analysis:', error)
    // Fallback
    const hasWebsite = collectedData.websiteAnalysis?.available || collectedData.googleMapsData?.website
    const hasGoogleData = collectedData.googleMapsData?.name
    const confidenceScore = (hasGoogleData ? 30 : 0) + (hasWebsite ? 30 : 0) + 10
    return {
      business_summary: "Unable to generate a reliable business summary because sufficient public information could not be verified.",
      business_intelligence: {
        business_category: collectedData.googleMapsData?.category || 'Unknown',
        industry: 'Unknown',
        target_customers: 'Not enough data',
        business_model: 'Not enough data',
        key_products_services: [],
        unique_selling_proposition: 'Not enough data',
        business_strengths: hasGoogleData ? ['Verified Google Business Profile'] : [],
        business_weaknesses: hasWebsite ? [] : ['No official website'],
        growth_opportunities: []
      },
      review_intelligence: {
        sentiment: 'Unavailable',
        common_positive: [],
        common_complaints: []
      },
      online_presence: {
        overall_rating: hasWebsite ? 'Fair' : 'Poor',
        reasons: [
          hasGoogleData ? 'Google Business Profile Exists' : 'No Google Business Profile',
          hasWebsite ? 'Website Exists' : 'No Website'
        ],
        social_media: {
          facebook: false,
          instagram: false,
          linkedin: false,
          youtube: false
        }
      },
      confidence_score: confidenceScore
    }
  }
}

/**
 * Main research function
 */
export async function runBusinessResearch(client, clientId) {
  console.log('🚀 Starting business research for client:', client.business_name)
  console.log('📋 Client data:', JSON.stringify(client, null, 2))
  const pipelineStart = Date.now()
  
  const collectedData = {
    client,
    googleMapsData: null,
    websiteAnalysis: null
  }

  // Step 1: Parse Google Maps URL - continue even if fails
  if (client.google_maps_link) {
    console.log('📍 Step 1: Parsing Google Maps URL...')
    try {
      const mapsResult = await parseGoogleMapsURL(client.google_maps_link)
      if (mapsResult.success) {
        collectedData.googleMapsData = mapsResult.data
      } else {
        console.log('⚠️ Google Maps parsing failed:', mapsResult.error)
      }
    } catch (e) {
      console.error('❌ Google Maps parsing threw error:', e)
    }
  } else {
    console.log('⚠️ No Google Maps link provided')
  }

  // Step 2: Analyze website - continue even if fails
  const websiteUrl = collectedData.googleMapsData?.website || ''
  if (websiteUrl) {
    console.log('🌐 Step 2: Analyzing website...')
    try {
      collectedData.websiteAnalysis = await analyzeWebsite(websiteUrl)
    } catch (e) {
      console.error('❌ Website analysis threw error:', e)
    }
  } else {
    console.log('⚠️ No website URL to analyze')
  }

  // Step 3: Verify business
  console.log('✅ Step 3: Verifying business...')
  const businessVerified = collectedData.googleMapsData?.name?.length > 0

  // Step 4: Generate structured BI with AI
  console.log('🤖 Step 4: Generating business intelligence...')
  let aiAnalysis = null
  if (aiAnalysisServiceProvider.isConfigured()) {
    try {
      aiAnalysis = await generateBusinessIntelligence(collectedData, clientId)
    } catch (e) {
      console.error('❌ AI Analysis threw error:', e)
    }
  }
  
  if (!aiAnalysis) {
    console.log('⚠️ Using fallback BI (no analysis API key or AI failed)')
    const hasWebsite = collectedData.websiteAnalysis?.available || websiteUrl.length > 0
    const hasGoogleData = collectedData.googleMapsData?.name
    aiAnalysis = {
      business_summary: "Unable to generate a reliable business summary because sufficient public information could not be verified.",
      business_intelligence: {
        business_category: collectedData.googleMapsData?.category || 'Unknown',
        industry: 'Unknown',
        target_customers: 'Not enough data',
        business_model: 'Not enough data',
        key_products_services: [],
        unique_selling_proposition: 'Not enough data',
        business_strengths: hasGoogleData ? ['Verified Google Business Profile'] : [],
        business_weaknesses: hasWebsite ? [] : ['No official website'],
        growth_opportunities: []
      },
      review_intelligence: {
        sentiment: 'Unavailable',
        common_positive: [],
        common_complaints: []
      },
      online_presence: {
        overall_rating: hasWebsite ? 'Fair' : 'Poor',
        reasons: [
          hasGoogleData ? 'Google Business Profile Exists' : 'No Google Business Profile',
          hasWebsite ? 'Website Exists' : 'No Website'
        ],
        social_media: {
          facebook: false,
          instagram: false,
          linkedin: false,
          youtube: false
        }
      },
      confidence_score: (hasGoogleData ? 30 : 0) + (hasWebsite ? 30 : 0) + 10
    }
  }
  
  const analysisDuration = Date.now() - pipelineStart

  console.log('✅ Business research complete!')
  return {
    collectedData,
    aiAnalysis,
    businessVerified,
    analysisDuration,
    aiModel: 'Gemini 2.5 Flash'
  }
}
