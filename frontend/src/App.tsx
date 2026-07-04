import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ClientDetailsPage from './pages/ClientDetails'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './lib/auth'
import { trackVisit, updateTimeSpent } from './lib/visitorTracker'

// Component to handle page tracking
function PageTracker() {
  const location = useLocation()
  
  useEffect(() => {
    // Track page visit
    trackVisit(location.pathname)
    
    // Update time spent every 10 seconds
    const interval = setInterval(updateTimeSpent, 10000)
    
    // Update time spent when leaving the page
    const handleBeforeUnload = () => {
      updateTimeSpent()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      updateTimeSpent()
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [location.pathname])
  
  return null
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <PageTracker />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={<Navigate to="/admin/clients/indian" replace />}
          />
          <Route
            path="/admin/clients/indian"
            element={
              <ProtectedRoute>
                <ClientDetailsPage region="Indian" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients/international"
            element={
              <ProtectedRoute>
                <ClientDetailsPage region="International" />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary font-sans antialiased">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppWidget />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
