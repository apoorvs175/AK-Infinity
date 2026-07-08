import { chromium } from 'playwright'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
let genAI = null
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

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
      contactInfo: {
        phone: null,
        email: null,
        address: null
      },
      uxIssues: [],
      missingInfo: []
    }
  }

  try {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    })
    
    let available = true
    let https = websiteUrl.startsWith('https')
    
    try {
      await page.goto(websiteUrl, { waitUntil: 'networkidle', timeout: 30000 })
    } catch (navError) {
      console.log('⚠️ Website navigation failed:', navError.message)
      available = false
    }
    
    let mobileResponsive = false
    let modernDesign = false
    const contactInfo = { phone: null, email: null, address: null }
    const uxIssues = []
    const missingInfo = []
    
    if (available) {
      // Check mobile responsiveness
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(1000)
      
      const viewportMeta = await page.evaluate(() => {
        return document.querySelector('meta[name="viewport"]') !== null
      })
      
      mobileResponsive = viewportMeta
      
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
      
      // Extract contact info
      const pageContent = await page.content()
      
      // Phone regex
      const phoneMatches = pageContent.match(/[+]?[\d\s\-()]{10,}/g)
      if (phoneMatches) {
        contactInfo.phone = phoneMatches[0].trim()
      }
      
      // Email regex
      const emailMatches = pageContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      if (emailMatches) {
        contactInfo.email = emailMatches[0]
      }
      
      // Check for missing information
      const hasAbout = pageContent.toLowerCase().includes('about')
      const hasServices = pageContent.toLowerCase().includes('service')
      const hasContact = pageContent.toLowerCase().includes('contact')
      
      if (!hasAbout) missingInfo.push('About section')
      if (!hasServices) missingInfo.push('Services section')
      if (!hasContact) missingInfo.push('Contact page')
      
      // UX checks
      const hasNavigation = await page.evaluate(() => {
        return document.querySelector('nav') !== null
      })
      if (!hasNavigation) uxIssues.push('No clear navigation')
    }
    
    console.log('✅ Website analysis complete:', { available, mobileResponsive, modernDesign, https, contactInfo })
    await browser.close()
    
    return {
      available,
      mobileResponsive,
      modernDesign,
      https,
      contactInfo,
      uxIssues,
      missingInfo
    }
  } catch (error) {
    console.error('❌ Error analyzing website:', error)
    return {
      available: false,
      mobileResponsive: false,
      modernDesign: false,
      https: false,
      contactInfo: { phone: null, email: null, address: null },
      uxIssues: ['Failed to analyze website'],
      missingInfo: []
    }
  }
}

/**
 * Generate business intelligence using Gemini
 */
async function generateBusinessIntelligence(collectedData) {
  console.log('🤖 Starting Gemini analysis...')
  if (!genAI) {
    console.log('⚠️ GEMINI_API_KEY not configured')
    throw new Error('GEMINI_API_KEY not configured')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
Analyze this business data and generate structured business intelligence in JSON format only.

Business Data:
${JSON.stringify(collectedData, null, 2)}

Please return a JSON object with the following structure (no extra text, just valid JSON):
{
  "business_summary": {
    "overview": "Brief overview of the business",
    "industry": "Industry category",
    "key_features": ["Feature 1", "Feature 2"]
  },
  "digital_presence": {
    "score": 0-100,
    "strengths": ["Strength 1"],
    "weaknesses": ["Weakness 1"]
  },
  "website_status": {
    "overall": "Good/Needs Improvement",
    "recommendations": ["Rec 1"]
  },
  "public_online_presence": {
    "platforms": ["Instagram", "Facebook", "LinkedIn"],
    "activity_level": "High/Medium/Low",
    "notes": "Any notes about online presence"
  },
  "business_strengths": ["Strength 1", "Strength 2"],
  "improvement_opportunities": ["Opportunity 1", "Opportunity 2"],
  "suggested_services": [
    {
      "service": "Service Name",
      "reason": "Why this service is relevant"
    }
  ],
  "confidence_score": 0-100
}

AK Infinity offers: Website Development, Digital Marketing, Mobile Apps, UI/UX Design, Branding, SEO, Social Media Management.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      console.log('✅ Gemini analysis complete:', parsed)
      return parsed
    }
    
    throw new Error('Failed to parse Gemini response')
  } catch (error) {
    console.error('❌ Error with Gemini:', error)
    throw error
  }
}

/**
 * Main research function
 */
export async function runBusinessResearch(client) {
  console.log('🚀 Starting business research for client:', client.business_name)
  console.log('📋 Client data:', JSON.stringify(client, null, 2))
  
  const collectedData = {
    client,
    googleMapsData: null,
    websiteAnalysis: null
  }

  // Step 1: Parse Google Maps URL
  if (client.google_maps_link) {
    console.log('📍 Step 1: Parsing Google Maps URL...')
    const mapsResult = await parseGoogleMapsURL(client.google_maps_link)
    if (mapsResult.success) {
      collectedData.googleMapsData = mapsResult.data
    } else {
      console.log('⚠️ Google Maps parsing failed:', mapsResult.error)
    }
  } else {
    console.log('⚠️ No Google Maps link provided')
  }

  // Step 2: Analyze website
  const websiteUrl = collectedData.googleMapsData?.website || ''
  if (websiteUrl) {
    console.log('🌐 Step 2: Analyzing website...')
    collectedData.websiteAnalysis = await analyzeWebsite(websiteUrl)
  } else {
    console.log('⚠️ No website URL to analyze')
  }

  // Step 3: Verify business
  console.log('✅ Step 3: Verifying business...')
  const businessVerified = collectedData.googleMapsData?.name?.length > 0

  // Step 4: Generate structured BI with Gemini
  console.log('🤖 Step 4: Generating business intelligence...')
  let businessIntelligence = null
  if (genAI) {
    businessIntelligence = await generateBusinessIntelligence(collectedData)
  } else {
    console.log('⚠️ Using fallback BI (no Gemini key)')
    const hasWebsite = collectedData.websiteAnalysis?.available || websiteUrl.length > 0
    businessIntelligence = {
      business_summary: {
        overview: collectedData.googleMapsData?.name 
          ? `Business analysis for ${collectedData.googleMapsData.name}`
          : 'Business analysis requires Gemini API key',
        industry: collectedData.googleMapsData?.category || 'Unknown',
        key_features: ['Data collection successful']
      },
      digital_presence: {
        score: hasWebsite ? 50 : 25,
        strengths: collectedData.googleMapsData?.rating ? ['Has Google reviews'] : [],
        weaknesses: ['AI analysis unavailable']
      },
      website_status: {
        overall: hasWebsite ? 'Available' : 'Not Found',
        recommendations: hasWebsite ? [] : ['Create a professional website']
      },
      public_online_presence: {
        platforms: [],
        activity_level: 'Unknown',
        notes: 'Social media check requires additional configuration'
      },
      business_strengths: collectedData.googleMapsData?.name ? ['Verified business listing'] : [],
      improvement_opportunities: hasWebsite ? [] : ['Website Development'],
      suggested_services: hasWebsite ? [] : [{
        service: 'Website Development',
        reason: 'Business has no official website'
      }],
      confidence_score: 30
    }
  }

  console.log('✅ Business research complete!')
  return {
    collectedData,
    businessIntelligence,
    businessVerified
  }
}
