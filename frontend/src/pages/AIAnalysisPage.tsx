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
  TrendingUp,
  RefreshCw,
  Target,
  Briefcase,
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Cpu,
  Database,
  Building2,
  User,
  Map,
  Layers,
  Store,
  Calendar
} from 'lucide-react';
import type { Client, AIAnalysis as AIAnalysisType } from '../types'
import { useAuth } from '../lib/auth'
import { API_URL } from '../lib/api'
import AIChatAssistant from '../components/AIChatAssistant'

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not Available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Not Available';
    }
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return 'Not Available';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Not Available';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="flex h-screen">
          <main className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
              <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-5 bg-slate-100 rounded-lg w-32 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded-lg w-24 animate-pulse" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl w-32 animate-pulse" />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg animate-pulse" />
                      <div className="h-5 bg-slate-100 rounded-lg w-40 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Array.from({ length: i === 1 ? 4 : 2 }).map((_, j) => (
                        <div key={j} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="h-3 bg-slate-200 rounded w-16 mb-2 animate-pulse" />
                          <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex h-screen">
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(backUrl)}
                  className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all duration-200 text-slate-600 hover:text-[#0B132B]"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-[#0B132B]">
                    {client?.business_name || 'Client'} - Sales Playbook
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500">
                    Everything you need for a perfect sales call
                  </p>
                </div>
              </div>
              <button
                onClick={handleReanalyze}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#d4a207] text-[#0B132B] rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh Analysis</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              {/* Client Information Section */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-[#0B132B]">Client Information</h2>
                  <p className="text-slate-500 mt-1">Complete details about {client?.business_name || 'the client'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Business Name */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Business Name</span>
                    </div>
                    <p className="text-lg font-semibold text-[#0B132B]">{client?.business_name || '-'}</p>
                  </div>
                  
                  {/* Owner Name */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner Name</span>
                    </div>
                    <p className="text-lg font-semibold text-[#0B132B]">{client?.owner_name || '-'}</p>
                  </div>
                  
                  {/* Phone Number */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</span>
                    </div>
                    {client?.owner_contact_number ? (
                      <a
                        href={`tel:${client.owner_contact_number}`}
                        className="text-lg font-semibold text-green-700 hover:text-green-800 transition-colors"
                      >
                        {client.owner_contact_number}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-slate-400">-</p>
                    )}
                  </div>
                  
                  {/* WhatsApp */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-emerald-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp</span>
                    </div>
                    {client?.owner_contact_number ? (
                      <a
                        href={`https://wa.me/${client.owner_contact_number.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        Send Message
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-slate-400">-</p>
                    )}
                  </div>
                  
                  {/* Google Maps */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Map className="w-5 h-5 text-red-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google Maps</span>
                    </div>
                    {client?.google_maps_link ? (
                      <a
                        href={client.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-red-700 hover:text-red-800 transition-colors"
                      >
                        View Location
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-slate-400">-</p>
                    )}
                  </div>
                  
                  {/* Address */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Address</span>
                    </div>
                    <p className="text-lg font-semibold text-[#0B132B]">{client?.address_name || '-'}</p>
                  </div>
                  
                  {/* Region */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Region</span>
                    </div>
                    <p className="text-lg font-semibold text-[#0B132B]">{client?.region || '-'}</p>
                  </div>
                  
                  {/* Website */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</span>
                    </div>
                    {client?.website_url ? (
                      <a
                        href={client.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-700 hover:text-blue-800 transition-colors truncate"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-slate-400">-</p>
                    )}
                  </div>
                  
                  {/* Business Category */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Store className="w-5 h-5 text-purple-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Business Category</span>
                    </div>
                    <p className="text-lg font-semibold text-[#0B132B]">
                      {analysis?.business_intelligence?.business_category || analysis?.google_maps_data?.category || '-'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Client Timeline Section */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-[#0B132B]">Client Timeline</h2>
                  <p className="text-slate-500 mt-1">Important dates and milestones</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Date Added */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Added</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#0B132B]">{formatDate(client?.created_at)}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(client?.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* First Call Date */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First Call Date</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#0B132B]">{formatDate(client?.first_call_date)}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(client?.first_call_date)}
                      </p>
                    </div>
                  </div>

                  {/* First Meeting Date */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First Meeting Date</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#0B132B]">{formatDate(client?.first_meeting_date)}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(client?.first_meeting_date)}
                      </p>
                    </div>
                  </div>

                  {/* Final Call Date */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Final Call Date</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#0B132B]">{formatDate(client?.final_call_date)}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(client?.final_call_date)}
                      </p>
                    </div>
                  </div>

                  {/* Agreement Date */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agreement Date</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#0B132B]">{formatDate(client?.agreement_date)}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(client?.agreement_date)}
                      </p>
                    </div>
                  </div>

                  {/* Last Description Updated */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Description Updated</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#0B132B]">{formatDate(client?.last_description_updated_at)}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(client?.last_description_updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Business Health Report */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B132B]">Business Health Report</h2>
                      <p className="text-slate-500 mt-1">Comprehensive analysis of the business's online presence</p>
                    </div>
                    {analysis?.updated_at && (
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Last Updated</p>
                        <p className="text-sm font-medium text-slate-700">
                          {new Date(analysis.updated_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {/* Website Status */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis?.digital_presence?.available || analysis?.website_url ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                          <span className="text-xl font-bold text-slate-900">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-500" />
                          <span className="text-xl font-bold text-slate-900">Not Found</span>
                        </>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">HTTPS</span>
                        {analysis?.digital_presence?.https ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Mobile Friendly</span>
                        {analysis?.digital_presence?.mobileResponsive ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Google Reviews */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-600 fill-yellow-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google Reviews</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(analysis?.google_reviews?.average_rating || 0)}
                      <span className="text-xl font-bold text-slate-900">
                        {analysis?.google_reviews?.average_rating ? `${analysis.google_reviews.average_rating}` : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {analysis?.google_reviews?.total_reviews ? `${analysis.google_reviews.total_reviews} reviews` : 'No reviews'}
                    </p>
                    <div className="mt-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        analysis?.review_intelligence?.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                        analysis?.review_intelligence?.sentiment === 'Mixed' ? 'bg-yellow-100 text-yellow-700' :
                        analysis?.review_intelligence?.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {analysis?.review_intelligence?.sentiment || 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  {/* Google Business Profile */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-red-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google Business</span>
                    </div>
                    <p className="text-lg font-semibold text-[#0B132B] truncate">
                      {analysis?.google_maps_data?.name || 'Not Available'}
                    </p>
                    <p className="text-sm text-slate-600 truncate">
                      {analysis?.business_intelligence?.business_category || analysis?.google_maps_data?.category || 'Category not available'}
                    </p>
                  </div>

                  {/* Social Presence */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-purple-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Social Presence</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: 'facebook', label: 'FB' },
                        { key: 'instagram', label: 'IG' },
                        { key: 'linkedin', label: 'LI' },
                        { key: 'youtube', label: 'YT' },
                      ].map((platform) => (
                        <span
                          key={platform.key}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            analysis?.online_presence?.social_media?.[platform.key as keyof typeof analysis.online_presence.social_media]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {platform.label}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Overall Rating</p>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                        analysis?.online_presence?.overall_rating === 'Excellent' ? 'bg-green-100 text-green-700' :
                        analysis?.online_presence?.overall_rating === 'Good' ? 'bg-blue-100 text-blue-700' :
                        analysis?.online_presence?.overall_rating === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {analysis?.online_presence?.overall_rating || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* AI Confidence */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Confidence</span>
                    </div>
                    <p className="text-3xl font-extrabold text-[#0B132B]">
                      {analysis?.confidence_score || 0}%
                    </p>
                  </div>
                </div>

                {/* Overall Rating Reasons */}
                {analysis && analysis.online_presence && analysis.online_presence.reasons && analysis.online_presence.reasons.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Insights</p>
                    <ul className="space-y-2">
                      {analysis.online_presence.reasons.map((reason: string, index: number) => (
                        <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-[#EAB308] mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Analysis Metadata */}
                {(analysis?.analysis_duration || analysis?.ai_model || analysis?.analysis_version || analysis?.created_at) && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Analysis Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {analysis.ai_model && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">AI Model</p>
                          <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-slate-500" />
                            {analysis.ai_model}
                          </p>
                        </div>
                      )}
                      {analysis.analysis_duration && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Duration</p>
                          <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-500" />
                            {(analysis.analysis_duration / 1000).toFixed(1)}s
                          </p>
                        </div>
                      )}
                      {analysis.created_at && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Generated</p>
                          <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                            <Database className="w-4 h-4 text-slate-500" />
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {analysis.analysis_version && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Version</p>
                          <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-slate-500" />
                            {analysis.analysis_version}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* AI Findings Section */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-[#0B132B]">AI Findings</h2>
                  <p className="text-slate-500 mt-1">Comprehensive analysis of the business</p>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    Executive Summary
                  </h3>
                  {analysis?.status === 'Processing' ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-blue-800 font-medium">Business summary is being generated...</p>
                    </div>
                  ) : analysis?.status === 'Failed' ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-800 font-medium">
                        Unable to generate a business summary because sufficient verified public information could not be collected.
                      </p>
                    </div>
                  ) : analysis?.business_summary ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {analysis.business_summary}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-sm text-yellow-800 font-medium">
                        Run AI Analysis to get a personalized business summary.
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Insights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Industry */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Industry</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.industry || 'Not available'}</p>
                  </div>
                  {/* Target Customers */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Customers</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.target_customers || 'Not enough data'}</p>
                  </div>
                  {/* Business Model */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Business Model</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.business_model || 'Not enough data'}</p>
                  </div>
                  {/* Unique Selling Proposition */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">USP</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.unique_selling_proposition || 'Not enough data'}</p>
                  </div>
                </div>

                {/* Strengths */}
                {analysis?.business_intelligence?.business_strengths && analysis.business_intelligence.business_strengths.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                      </div>
                      Strengths
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <ul className="space-y-2">
                        {analysis.business_intelligence.business_strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis?.business_intelligence?.business_weaknesses && analysis.business_intelligence.business_weaknesses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                        <XCircle className="w-3.5 h-3.5 text-red-700" />
                      </div>
                      Weaknesses
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <ul className="space-y-2">
                        {analysis.business_intelligence.business_weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Key Products/Services */}
                {analysis?.business_intelligence?.key_products_services && analysis.business_intelligence.key_products_services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                      </div>
                      Key Products/Services
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <ul className="space-y-2">
                        {analysis.business_intelligence.key_products_services.map((product: string, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {product}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Growth Opportunities */}
                {analysis?.business_intelligence?.growth_opportunities && analysis.business_intelligence.growth_opportunities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-yellow-700" />
                      </div>
                      Growth Opportunities
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <ul className="space-y-3">
                        {analysis.business_intelligence.growth_opportunities.map((opp: any, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                              <span className="text-yellow-600 mt-1">•</span>
                              {opp.opportunity}
                            </div>
                            {opp.ak_infinity_service && (
                              <div className="pl-6 text-sm text-yellow-700 font-medium">
                                AK Infinity Service: {opp.ak_infinity_service}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommended Services */}
                {analysis?.suggested_services && analysis.suggested_services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center">
                        <Award className="w-3.5 h-3.5 text-white" />
                      </div>
                      Recommended Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.suggested_services.map((service: any, index: number) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-4">
                          <p className="font-semibold text-[#EAB308] text-base">{service.service}</p>
                          <p className="text-sm text-slate-600 mt-1">{service.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                {analysis?.improvement_opportunities && analysis.improvement_opportunities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Target className="w-3.5 h-3.5 text-purple-700" />
                      </div>
                      AI Recommendations
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <ul className="space-y-2">
                        {analysis.improvement_opportunities.map((opp: string, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </section>

              {/* Sales Playbook Section */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-[#0B132B]">Sales Playbook</h2>
                  <p className="text-slate-500 mt-1">Your guide to a perfect sales call</p>
                </div>

                {/* Opening Strategy */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-yellow-700" />
                    </div>
                    Opening Strategy
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">1. Greeting</h4>
                      <p className="text-base text-slate-800 font-medium">
                        {salesCoach?.call_guide?.greeting || `Namaste Sir, Kya meri baat ${client?.owner_name} ji se ho rahi hai?`}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">2. Introduction</h4>
                      <p className="text-base text-slate-800 font-medium">
                        {salesCoach?.call_guide?.introduction || 'Sir mera naam Naman hai, main AK Infinity ki taraf se bol raha hoon. Hum businesses ko online grow karne mein madad karte hain. Aaj main sirf 2 minute lunga, agar aap allow karein to ek chhoti si baat share karna chahta hoon.'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">3. Build Rapport</h4>
                      <p className="text-base text-slate-800 font-medium">
                        {salesCoach?.call_guide?.build_rapport || `Sir humne aapka ${client?.business_name} dekha. Aapka kaam acche se chal raha hai lagta hai. Lekin ek cheez notice hui - aapki online presence thodi improve karne ki zarurat hai.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conversation Flow (Talking Points) */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    Conversation Flow
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                    {salesCoach?.talking_points?.length > 0 ? (
                      salesCoach.talking_points.map((tp: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 text-white text-sm font-bold mt-0.5 shrink-0">
                            {tp.point || index + 1}
                          </span>
                          <p className="text-base text-slate-800">{tp.text}</p>
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
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 text-white text-sm font-bold mt-0.5 shrink-0">
                            {tp.point}
                          </span>
                          <p className="text-base text-slate-800">{tp.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Questions to Ask */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Target className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    Questions to Ask
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <ul className="space-y-2">
                      {salesCoach?.questions_to_ask?.length > 0 ? (
                        salesCoach.questions_to_ask.map((q: string, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {q}
                          </li>
                        ))
                      ) : (
                        [
                          'Sir, aapki current online presence ke baare mein kya sochate hain?',
                          'Aapke liye ideal customer kaun hai?',
                          'Aapke business mein aane wale next 6 months ke goals kya hain?',
                          'Kya aapne kabhi professional services li hain online presence improve karne ke liye?'
                        ].map((q, index) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {q}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                {/* Objections (Possible Cross Questions) */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                      <XCircle className="w-3.5 h-3.5 text-red-700" />
                    </div>
                    Objections
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                    {salesCoach?.objection_handling?.length > 0 ? (
                      salesCoach.objection_handling.map((obj: any, index: number) => (
                        <div key={index} className="p-3 border border-slate-200 rounded-lg">
                          <div className="mb-2">
                            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Client</h5>
                            <p className="text-base text-slate-800 bg-slate-50 p-2 rounded">{obj.client}</p>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Suggested Reply</h5>
                            <p className="text-base text-slate-800 bg-green-50 p-2 rounded">{obj.reply}</p>
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
                        <div key={index} className="p-3 border border-slate-200 rounded-lg">
                          <div className="mb-2">
                            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Client</h5>
                            <p className="text-base text-slate-800 bg-slate-50 p-2 rounded">{obj.client}</p>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Suggested Reply</h5>
                            <p className="text-base text-slate-800 bg-green-50 p-2 rounded">{obj.reply}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Closing Strategy */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                    </div>
                    Closing Strategy
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-base text-slate-800">
                      {salesCoach?.closing_strategy || 'Sir, thank you for your time. Aaj humne discuss kiya ki kaise aapki online presence improve ho sakti hai aur leads badh sakti hain. Main aapko ek free 15-minute ka demo dekar dikhata hoon ki hum kaise kaam karte hain. Kya aapke paas Thursday ya Friday koi time hai?'}
                    </p>
                  </div>
                </div>

                {/* Next Follow-up */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-purple-700" />
                    </div>
                    Next Follow-up
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <ul className="space-y-2">
                      {salesCoach?.follow_up_recommendations?.length > 0 ? (
                        salesCoach.follow_up_recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            {rec}
                          </li>
                        ))
                      ) : (
                        [
                          'Within 24 hours: Send a WhatsApp message with a link to our portfolio.',
                          'After 3 days: Follow up call to check if they have any questions.',
                          'After 7 days: Send a personalized email with case studies of similar businesses.'
                        ].map((rec, index) => (
                          <li key={index} className="text-base text-slate-800 flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            {rec}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* AI Chat Assistant Section */}
              {clientId && <AIChatAssistant clientId={clientId} />}

            </div>
          </main>
        </main>
      </div>
    </div>
  )
}


