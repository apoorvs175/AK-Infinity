import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Star,
  Check,
  AlertCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import type { Client, AIAnalysis as AIAnalysisType } from '../types'
import { useAuth } from '../lib/auth'
import { API_URL } from '../lib/api'

export default function AIAnalysisPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [client, setClient] = useState<Client | null>(null)
  const [analysis, setAnalysis] = useState<AIAnalysisType | null>(null)
  const [salesCoach, setSalesCoach] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  // Determine the correct back URL from referrer or default to Indian clients
  const backUrl = useMemo(() => {
    const state = location.state as { from?: string }
    if (state?.from) {
      return state.from
    }
    return '/admin/clients/indian'
  }, [location.state])

  const loadData = useCallback(async () => {
    if (!clientId) return

    setLoading(true)
    try {
      const clientsResponse = await fetch(`${API_URL}/api/clients`)
      const clientsData = await clientsResponse.json()
      const foundClient = clientsData.find((c: Client) => c.id === clientId)
      setClient(foundClient || null)

      const analysisResponse = await fetch(`${API_URL}/api/ai-analysis/${clientId}`)
      if (analysisResponse.ok) {
        setAnalysis(await analysisResponse.json())
      }

      const salesCoachResponse = await fetch(`${API_URL}/api/sales-coach/${clientId}`)
      if (salesCoachResponse.ok) {
        setSalesCoach(await salesCoachResponse.json())
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    if (user) loadData()
  }, [loadData, user])

  const handleReanalyze = async () => {
    if (!clientId) return
    setProcessing(true)
    try {
      const response = await fetch(`${API_URL}/api/ai-analysis/${clientId}/analyze?force=true`, { method: 'POST' })
      if (response.ok) {
        // Poll for updates
        const pollInterval = setInterval(async () => {
          const updatedResponse = await fetch(`${API_URL}/api/ai-analysis/${clientId}`)
          if (updatedResponse.ok) {
            const updatedAnalysis = await updatedResponse.json()
            setAnalysis(updatedAnalysis)
            if (updatedAnalysis && ['Completed', 'Failed'].includes(updatedAnalysis.status)) {
              clearInterval(pollInterval)
              setProcessing(false)
              // Reload sales coach too
              const salesCoachResponse = await fetch(`${API_URL}/api/sales-coach/${clientId}`)
              if (salesCoachResponse.ok) {
                setSalesCoach(await salesCoachResponse.json())
              }
            }
          }
        }, 3000)
      }
    } catch (error) {
      console.error(error)
      setProcessing(false)
    }
  }

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
  }

  const getOnlinePresenceLevel = () => {
    let score = 0
    if (analysis?.website_status?.overall === 'Good' || client?.website_url) score += 40
    if (analysis?.digital_presence?.score) score += analysis.digital_presence.score / 2
    if (score > 75) return { label: 'Excellent', color: 'text-green-700 bg-gradient-to-r from-green-100 to-emerald-100' }
    if (score > 50) return { label: 'Good', color: 'text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100' }
    if (score > 25) return { label: 'Average', color: 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100' }
    return { label: 'Poor', color: 'text-red-700 bg-gradient-to-r from-red-100 to-rose-100' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex">
        <div className="flex-1 flex flex-col">
          {/* Skeleton Header */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-2xl border-b border-slate-200 px-4 py-3 md:px-6 md:py-4 shadow-sm">
            <div className="flex items-center gap-3 max-w-6xl mx-auto w-full">
              <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 bg-slate-100 rounded-xl w-48 animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-lg w-32 animate-pulse" />
              </div>
            </div>
          </header>

          {/* Skeleton Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl border border-slate-100 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl" />
                    <div className="h-6 bg-slate-100 rounded-lg w-40" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: i === 1 ? 4 : 2 }).map((_, j) => (
                      <div key={j} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-100">
                        <div className="h-3 bg-slate-200 rounded-lg w-24 mb-2" />
                        <div className="h-5 bg-slate-200 rounded-lg w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  const onlinePresence = getOnlinePresenceLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-2xl border-b border-slate-200 px-4 py-3 md:px-6 md:py-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(backUrl)}
                className="p-2 bg-white border border-slate-200 hover:bg-gradient-to-r from-yellow-50 to-orange-50 hover:border-yellow-200 rounded-xl transition-all duration-300 text-slate-600 hover:text-[#0B132B] hover:shadow-lg hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg md:text-3xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent">
                  {client?.business_name || 'Client'} - Sales Playbook
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium">
                  Everything you need for a perfect sales call
                </p>
              </div>
            </div>
            <button
              onClick={handleReanalyze}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#EAB308] to-yellow-600 hover:from-yellow-600 hover:to-[#EAB308] text-[#0B132B] rounded-xl text-xs md:text-sm font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Refresh Analysis</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
            {/* Card 1: Client Overview */}
            <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-[#EAB308] to-orange-500 flex items-center justify-center shadow-lg">
                  <Building className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent">Client Overview</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Basic Info */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Business Name</p>
                    <p className="text-sm md:text-base font-bold text-[#0B132B]">{client?.business_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Owner Name</p>
                    <p className="text-sm md:text-base font-bold text-[#0B132B]">{client?.owner_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Address</p>
                    <p className="text-xs md:text-sm text-slate-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 mt-0.5" />
                      {client?.address_name || client?.region || '-'}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Phone</p>
                      <a
                        href={`tel:${client?.owner_contact_number}`}
                        className="text-sm md:text-base font-bold text-green-700 hover:text-green-800 hover:underline transition-all"
                      >
                        {client?.owner_contact_number || '-'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">WhatsApp</p>
                      <a
                        href={`https://wa.me/${client?.owner_contact_number?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm md:text-base font-bold text-green-700 hover:text-green-800 hover:underline transition-all truncate"
                      >
                        Send Message
                      </a>
                    </div>
                  </div>

                  {client?.website_url && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Website</p>
                        <a
                          href={client.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm md:text-base font-bold text-blue-700 hover:text-blue-800 hover:underline transition-all truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}

                  {client?.google_maps_link && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Google Maps</p>
                        <a
                          href={client.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm md:text-base font-bold text-red-700 hover:text-red-800 hover:underline transition-all"
                        >
                          View Location
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Progress</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm ${client?.first_call ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600'}`}>
                        {client?.first_call ? 'First Call ✓' : 'First Call'}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm ${client?.first_meeting ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600'}`}>
                        {client?.first_meeting ? 'Meeting ✓' : 'Meeting'}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm ${client?.final_call ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600'}`}>
                        {client?.final_call ? 'Final Call ✓' : 'Final Call'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Region</p>
                    <p className="text-xs md:text-sm text-slate-600 font-medium">{client?.region || '-'}</p>
                  </div>
                </div>

                {/* Dates & AI Status */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Created</p>
                    <p className="text-xs md:text-sm text-slate-600 font-medium">
                      {client?.created_at ? new Date(client.created_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Updated</p>
                    <p className="text-xs md:text-sm text-slate-600 font-medium">
                      {client?.updated_at ? new Date(client.updated_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">AI Analysis</p>
                    <p className={`text-xs md:text-sm font-bold ${
                      analysis?.status === 'Completed' ? 'text-green-700' :
                      analysis?.status === 'Processing' ? 'text-yellow-700' :
                      analysis?.status === 'Failed' ? 'text-red-700' : 'text-slate-600'
                    }`}>
                      {analysis?.status || 'Not Started'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Card 2: Business Health Report */}
            <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-5 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent">Business Health Report</h2>
                </div>
                {analysis?.updated_at && (
                  <div className="text-right px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 shadow-sm">
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-bold">Last Updated</p>
                    <p className="text-xs md:text-sm font-bold text-slate-700">
                      {new Date(analysis.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {/* Website */}
                <div className="p-4 md:p-5 lg:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-slate-500" />
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Website</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {analysis?.website_url || analysis?.website_status?.overall === 'Good' ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-green-500" />
                        <span className="text-base md:text-xl font-extrabold text-slate-900">Available</span>
                        {analysis?.website_url && (
                          <a 
                            href={analysis.website_url.startsWith('http') ? analysis.website_url : `https://${analysis.website_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs md:text-sm text-blue-600 hover:text-blue-800 underline truncate max-w-48"
                          >
                            {analysis.website_url}
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
                        <span className="text-base md:text-xl font-extrabold text-slate-900">Not Found</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Google Reviews */}
                <div className="p-4 md:p-5 lg:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-400" />
                    <p className="text-[10px] md:text-xs font-bold text-yellow-700 uppercase tracking-widest">Google Reviews</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderStars(analysis?.google_reviews?.average_rating || 0)}
                    <span className="text-base md:text-xl font-extrabold text-slate-900">
                      {analysis?.google_reviews?.average_rating ? `${analysis.google_reviews.average_rating}` : 'N/A'} 
                      {analysis?.google_reviews?.total_reviews ? ` (${analysis.google_reviews.total_reviews})` : ''}
                    </span>
                  </div>
                </div>

                {/* Google Business Profile */}
                <div className="p-4 md:p-5 lg:p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                    <p className="text-[10px] md:text-xs font-bold text-orange-700 uppercase tracking-widest">Google Profile</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {client?.google_maps_link ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-green-500" />
                        <span className="text-base md:text-xl font-extrabold text-slate-900">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
                        <span className="text-base md:text-xl font-extrabold text-slate-900">Not Available</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Online Presence */}
                <div className="p-4 md:p-5 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    <p className="text-[10px] md:text-xs font-bold text-blue-700 uppercase tracking-widest">Online Presence</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-extrabold shadow-sm ${onlinePresence.color}`}>
                      {onlinePresence.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Presence */}
              <div className="mt-5 md:mt-6">
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Social Media</p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const platforms = analysis?.public_online_presence?.platforms;
                    return platforms?.length > 0 ? (
                      platforms.map((platform: string, index: number) => (
                        <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs md:text-sm font-bold shadow-sm">
                          {platform}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 rounded-full text-xs md:text-sm font-bold shadow-sm">
                        No social media detected
                      </span>
                    );
                  })()}
                </div>
              </div>
            </section>

            {/* Card 3: Business Opportunities */}
            <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent">Business Opportunities</h2>
              </div>

              <div className="space-y-3 md:space-y-4">
                {salesCoach?.business_opportunities?.length > 0 ? (
                  salesCoach.business_opportunities.map((opp: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent mb-4">{opp.service}</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                          <p className="text-[10px] md:text-xs font-bold text-yellow-700 uppercase tracking-widest mb-1">Why Needed</p>
                          <p className="text-xs md:text-sm text-slate-700 font-medium">{opp.reason}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <p className="text-[10px] md:text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">How We Help</p>
                          <p className="text-xs md:text-sm text-slate-700 font-medium">{opp.how_we_help}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <p className="text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Benefits</p>
                          <ul className="space-y-2">
                            {opp.benefits?.map((benefit: string, benIndex: number) => (
                              <li key={benIndex} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 font-medium">
                                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl shadow-sm">
                    <p className="text-xs md:text-sm text-yellow-800 font-medium">
                      Run AI Analysis to get personalized business opportunity recommendations.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Card 4: Call Guide */}
            <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent">Call Guide</h2>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-8 border-yellow-500 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <p className="text-[10px] md:text-xs font-bold text-yellow-700 uppercase tracking-widest mb-2">1. Greeting</p>
                  <p className="text-sm md:text-base lg:text-xl text-slate-800 font-semibold">
                    {salesCoach?.call_guide?.greeting || `Namaste Sir, Kya meri baat ${client?.owner_name} ji se ho rahi hai?`}
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-8 border-blue-500 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <p className="text-[10px] md:text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">2. Introduction</p>
                  <p className="text-sm md:text-base lg:text-xl text-slate-800 font-semibold">
                    {salesCoach?.call_guide?.introduction || 'Sir mera naam Naman hai, main AK Infinity ki taraf se bol raha hoon. Hum businesses ko online grow karne mein madad karte hain. Aaj main sirf 2 minute lunga, agar aap allow karein to ek chhoti si baat share karna chahta hoon.'}
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-8 border-green-500 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <p className="text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-widest mb-2">3. Build Rapport</p>
                  <p className="text-sm md:text-base lg:text-xl text-slate-800 font-semibold">
                    {salesCoach?.call_guide?.build_rapport || `Sir humne aapka ${client?.business_name} dekha. Aapka kaam acche se chal raha hai lagta hai. Lekin ek cheez notice hui - aapki online presence thodi improve karne ki zarurat hai.`}
                  </p>
                </div>
              </div>
            </section>

            {/* Card 5: Live Call Assistant */}
            <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[#0B132B] to-slate-700 bg-clip-text text-transparent">Live Call Assistant</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Talking Points */}
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Talking Points</p>
                  <div className="space-y-3 md:space-y-4">
                    {salesCoach?.talking_points?.length > 0 ? (
                      salesCoach.talking_points.map((tp: any, index: number) => (
                        <div key={index} className="p-4 md:p-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-r from-[#EAB308] to-orange-500 text-white text-xs md:text-sm font-bold mt-0.5 shadow-lg">
                              {tp.point || index + 1}
                            </span>
                            <p className="text-xs md:text-sm lg:text-base text-slate-800 font-semibold">{tp.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      [
                        { point: 1, text: 'Sir, aajkal 90% customers pehle internet par search karte hain kisi business ke baare mein.' },
                        { point: 2, text: 'Agar aapki professional website aur strong online presence hoga to log aapko aur trust karenge.' },
                        { point: 3, text: 'Humne aise 50+ businesses ko help ki hai, unki leads 3x se zyada badhi hain.' },
                        { point: 4, text: 'Hum sirf ek baar demo dena chahte hain, aap decide kar lena baad mein koi bhi obligation nahi hai.' },
                        { point: 5, text: 'Sir agar aap interested hain to main aapko ek free 15-minute ka demo dikha sakta hoon, kya Thursday ya Friday ko koi time suit karega?' }
                      ].map((tp, index) => (
                        <div key={index} className="p-4 md:p-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-r from-[#EAB308] to-orange-500 text-white text-xs md:text-sm font-bold mt-0.5 shadow-lg">
                              {tp.point}
                            </span>
                            <p className="text-xs md:text-sm lg:text-base text-slate-800 font-semibold">{tp.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Objection Handling */}
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Possible Cross Questions</p>
                  <div className="space-y-3 md:space-y-4">
                    {salesCoach?.objection_handling?.length > 0 ? (
                      salesCoach.objection_handling.map((obj: any, index: number) => (
                        <div key={index} className="p-4 md:p-5 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="mb-3">
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Client</p>
                            <p className="text-xs md:text-sm text-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl font-medium">{obj.client}</p>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Reply</p>
                            <p className="text-xs md:text-sm text-slate-800 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl font-medium">{obj.reply}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      [
                        {
                          client: 'Website ki zarurat hi kya hai?',
                          reply: 'Sir, aajkal zyadatar customers pehle Google par search karte hain. Website business ki online identity hoti hai. Ye trust banati hai aur naye customers ko attract karti hai.'
                        },
                        {
                          client: 'Humare paas budget nahi hai',
                          reply: 'Sir bilkul samajh sakta hoon! Isliye hum different budget options provide karte hain. Pehle requirement samajh lete hain, phir best option suggest karenge. Koi obligation nahi hai.'
                        },
                        {
                          client: 'Hum already social media use karte hain',
                          reply: 'Bahut accha! Social media bhi zaruri hai, lekin website aapki apni property hoti hai. Social media par algorithm change ho sakta hai, lekin website par aap full control hote hain.'
                        }
                      ].map((obj, index) => (
                        <div key={index} className="p-4 md:p-5 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="mb-3">
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Client</p>
                            <p className="text-xs md:text-sm text-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl font-medium">{obj.client}</p>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Reply</p>
                            <p className="text-xs md:text-sm text-slate-800 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl font-medium">{obj.reply}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

// Missing Building icon component
function Building({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}
