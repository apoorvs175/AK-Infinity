// Visitor Tracker Utility
let sessionId = localStorage.getItem('visitorSessionId') || crypto.randomUUID()
localStorage.setItem('visitorSessionId', sessionId)

let visitorId: string | null = null
let startTime = Date.now()

const API_URL = import.meta.env.VITE_API_URL || ''

// Parse user agent to get browser and OS info
function parseUserAgent(userAgent: string) {
  let browser = 'Unknown'
  let os = 'Unknown'
  let deviceType = 'Desktop'

  // Detect OS
  if (/Windows NT 10.0/.test(userAgent)) os = 'Windows 10/11'
  else if (/Macintosh/.test(userAgent)) os = 'macOS'
  else if (/X11/.test(userAgent)) os = 'Linux'
  else if (/Android/.test(userAgent)) os = 'Android'
  else if (/like Mac OS X/.test(userAgent)) os = 'iOS'

  // Detect Browser
  if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) browser = 'Chrome'
  else if (/Firefox/.test(userAgent)) browser = 'Firefox'
  else if (/Safari/.test(userAgent)) browser = 'Safari'
  else if (/Edg/.test(userAgent)) browser = 'Edge'
  else if (/Opera/.test(userAgent) || /OPR/.test(userAgent)) browser = 'Opera'

  // Detect device type
  if (/Mobi/.test(userAgent) || /Android/.test(userAgent)) {
    deviceType = 'Mobile'
  } else if (/Tablet/.test(userAgent) || (/iPad/.test(userAgent) && !/iPhone/.test(userAgent))) {
    deviceType = 'Tablet'
  }

  return { browser, os, deviceType }
}

// Track page visit
export async function trackVisit(pageVisited: string) {
  try {
    const userAgent = navigator.userAgent
    const { browser, os, deviceType } = parseUserAgent(userAgent)
    const referrer = document.referrer || 'Direct'
    
    const response = await fetch(API_URL + '/api/visitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_agent: userAgent,
        device_type: deviceType,
        browser,
        os,
        page_visited: pageVisited,
        referrer,
        session_id: sessionId
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      visitorId = data.id
      startTime = Date.now()
    }
  } catch (error) {
    console.error('Error tracking visit:', error)
  }
}

// Update time spent on page
export async function updateTimeSpent() {
  if (!visitorId) return
  
  try {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    await fetch(API_URL + '/api/visitors/' + visitorId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time_spent: timeSpent
      })
    })
  } catch (error) {
    console.error('Error updating time spent:', error)
  }
}