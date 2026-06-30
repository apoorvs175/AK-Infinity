// Visitor Tracker Utility
let sessionId = localStorage.getItem('visitorSessionId') || crypto.randomUUID()
localStorage.setItem('visitorSessionId', sessionId)

let visitorId: string | null = null
let startTime = Date.now()

const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com'

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
    console.log('🔍 Tracking visit to:', pageVisited)
    
    const userAgent = navigator.userAgent
    const { browser, os, deviceType } = parseUserAgent(userAgent)
    const referrer = document.referrer || 'Direct'
    
    let locationData: {
      latitude?: number
      longitude?: number
      accuracy?: number
    } = {}
    let locationPermission = 'not_requested'
    
    // Try to get geolocation
    if ('geolocation' in navigator) {
      console.log('📍 Requesting location permission...')
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          })
        })
        
        locationPermission = 'granted'
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        console.log('✅ Location obtained:', locationData)
      } catch (geoError) {
        console.log('❌ Geolocation error:', geoError)
        
        if ((geoError as GeolocationPositionError).code === 1) {
          locationPermission = 'denied'
          console.log('🔒 User denied location permission')
        } else if ((geoError as GeolocationPositionError).code === 2) {
          locationPermission = 'unavailable'
          console.log('⚠️ Location unavailable')
        } else if ((geoError as GeolocationPositionError).code === 3) {
          locationPermission = 'timeout'
          console.log('⏱️ Location request timed out')
        }
      }
    } else {
      console.log('⚠️ Geolocation not supported in this browser')
    }
    
    console.log('📤 Sending visitor data with permission:', locationPermission)
    
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
        session_id: sessionId,
        location_permission: locationPermission,
        ...locationData
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Visitor tracked successfully:', data.id)
      visitorId = data.id
      startTime = Date.now()
    } else {
      console.error('❌ Error tracking visit:', response.status)
    }
  } catch (error) {
    console.error('❌ Error tracking visit:', error)
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