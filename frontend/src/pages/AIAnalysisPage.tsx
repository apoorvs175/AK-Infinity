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
  Target,
  Briefcase,
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Cpu,
  Database,
  Building2,
  Plus,
  X,
  Check
} from 'lucide-react';
import type { Client, AIAnalysis as AIAnalysisType, ClientDescriptionHistory } from '../types'
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
  const [descriptionHistory, setDescriptionHistory] = useState<ClientDescriptionHistory[]>([])
  const [isAddingDescription, setIsAddingDescription] = useState(false)
  const [newDescriptionText, setNewDescriptionText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

      const historyResponse = await fetch(`${API_URL}/api/client-description-history/${clientId}`)
      if (historyResponse.ok) {
        setDescriptionHistory(await historyResponse.json())
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  const addDescription = useCallback(async () => {
    if (!newDescriptionText.trim() || !clientId) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/client-description-history/${clientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDescriptionText.trim() })
      })
      if (response.ok) {
        // Refresh history
        const historyResponse = await fetch(`${API_URL}/api/client-description-history/${clientId}`)
        if (historyResponse.ok) {
          setDescriptionHistory(await historyResponse.json())
        }
        setIsAddingDescription(false)
        setNewDescriptionText('')
      }
    } catch (error) {
      console.error('Error adding description:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [newDescriptionText, clientId])

  useEffect(() => {
    if (user) loadData()
  }, [loadData, user])

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

  const WhatsAppIcon = ({ className }: { className: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.492-.67-.5h-.572c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414l-.049-.148z"/>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.116.559 4.166 1.607 5.974L.008 24l6.252-1.64c1.773.987 3.762 1.52 5.754 1.52C18.641 23.88 24 18.493 24 11.987 24 5.367 18.638 0 12.017 0zm.006 21.456c-1.873 0-3.694-.506-5.262-1.465l-.309-.18-3.707.972 1.001-3.603-.2-.32c-1.046-1.68-1.594-3.609-1.594-5.65 0-5.225 4.267-9.48 9.529-9.48 2.554 0 4.951.997 6.747 2.805 1.796 1.808 2.783 4.21 2.783 6.775 0 5.225-4.267 9.48-9.508 9.48z"/>
    </svg>
  );

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
            <div className="px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 max-w-7xl mx-auto w-full">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 md:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">Business Information</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1">Business Name</p>
                        <p className="text-lg md:text-xl font-bold text-[#0B132B] leading-snug break-words">
                          {client?.business_name || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1">Owner Name</p>
                        <p className="text-sm md:text-base font-medium text-slate-600 leading-snug break-words">
                          {client?.owner_name || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 md:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-green-700" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">Contact Information</span>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1">Phone Number</p>
                      {client?.owner_contact_number ? (
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={`tel:${client.owner_contact_number}`}
                            className="text-lg md:text-xl font-bold text-[#0B132B] hover:text-green-700 transition-colors break-all"
                          >
                            {client.owner_contact_number}
                          </a>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${client.owner_contact_number}`}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all shadow-sm hover:shadow-md"
                              title="Call"
                              aria-label="Call client"
                            >
                              <Phone className="w-5 h-5" />
                            </a>
                            <a
                              href={`https://wa.me/${client.owner_contact_number.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all shadow-sm hover:shadow-md"
                              title="WhatsApp"
                              aria-label="Open WhatsApp chat"
                            >
                              <WhatsAppIcon className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg md:text-xl font-bold text-slate-400">-</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#EAB308]/40 hover:border-[#EAB308] rounded-2xl p-4 md:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:col-span-2 xl:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">Address</span>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm md:text-base font-medium text-[#0B132B] leading-relaxed break-words">
                        {client?.address_name || '-'}
                      </p>
                      {client?.google_maps_link && (
                        <a
                          href={client.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <MapPin className="w-4 h-4" />
                          View Location
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Client Timeline Section */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-[#0B132B]">Client Timeline</h2>
                  <p className="text-slate-500 mt-1">Important dates and milestones</p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#EAB308]/70 hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#0B132B]">Client Added</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{formatDate(client?.created_at)}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#0B132B]">First Call</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{client?.first_call_date ? formatDate(client.first_call_date) : ''}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#0B132B]">Second Call</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{client?.second_call_date ? formatDate(client.second_call_date) : ''}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#0B132B]">Third Call</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{client?.third_call_date ? formatDate(client.third_call_date) : ''}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#0B132B]">Final Call</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{client?.final_call_date ? formatDate(client.final_call_date) : ''}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#0B132B]">Deal Closed</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{client?.deal_closed_date ? formatDate(client.deal_closed_date) : ''}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Client Description History Section */}
              <section className="mb-8">
                <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0B132B]">Client Description History</h2>
                    <p className="text-slate-500 mt-1">All client notes and updates</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingDescription(!isAddingDescription)
                      setNewDescriptionText('')
                    }}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#d4a207] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B132B] rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Description</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>

                {isAddingDescription && (
                  <div className="mb-6 bg-white rounded-2xl border-2 border-[#EAB308]/70 hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 md:p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Description</label>
                    <textarea
                      value={newDescriptionText}
                      onChange={(e) => setNewDescriptionText(e.target.value)}
                      placeholder="Enter description here..."
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50 resize-none"
                    />
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={addDescription}
                        disabled={!newDescriptionText.trim() || isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#d4a207] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B132B] rounded-lg text-sm font-medium transition-all"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingDescription(false)
                          setNewDescriptionText('')
                        }}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg text-sm font-medium transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border-2 border-[#EAB308]/70 hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {descriptionHistory.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {descriptionHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm text-slate-700">{formatDate(item.created_date)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-slate-700">{formatTime(item.created_date)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.description}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      No description history available.
                    </div>
                  )}
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

                {/* New Premium Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Card 1 - Digital Presence */}
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0B132B]">Digital Presence</h3>
                        <p className="text-xs text-slate-500">Website, Google Business &amp; Social Presence</p>
                      </div>
                    </div>

                    {/* Section A - Website Status */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Website Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Availability</span>
                          {analysis?.digital_presence?.available || analysis?.website_url ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-700">Available</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-700">Not Found</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">HTTPS</span>
                          {analysis?.digital_presence?.https ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-700">Enabled</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-700">Disabled</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Mobile Friendly</span>
                          {analysis?.digital_presence?.mobileResponsive ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-700">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-700">No</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-slate-100 mb-5"></div>

                    {/* Section B - Google Business Profile */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Google Business Profile</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-slate-500 block">Business Name</span>
                          <p className="text-sm font-medium text-[#0B132B] truncate">
                            {analysis?.google_maps_data?.name || 'Information Not Available'}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block">Category</span>
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {analysis?.business_intelligence?.business_category || analysis?.google_maps_data?.category || 'Information Not Available'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-slate-100 mb-5"></div>

                    {/* Section C - Social Presence */}
                    <div className="mt-auto">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Social Presence</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          { key: 'facebook', label: 'Facebook' },
                          { key: 'instagram', label: 'Instagram' },
                          { key: 'linkedin', label: 'LinkedIn' },
                          { key: 'youtube', label: 'YouTube' },
                        ].map((platform) => (
                          <span
                            key={platform.key}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              analysis?.online_presence?.social_media?.[platform.key as keyof typeof analysis.online_presence.social_media]
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {platform.label}
                          </span>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Overall Social Presence</p>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          analysis?.online_presence?.overall_rating === 'Excellent' ? 'bg-green-100 text-green-700' :
                          analysis?.online_presence?.overall_rating === 'Good' ? 'bg-blue-100 text-blue-700' :
                          analysis?.online_presence?.overall_rating === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {analysis?.online_presence?.overall_rating || 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Business Reputation */}
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shrink-0">
                        <Star className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0B132B]">Business Reputation</h3>
                        <p className="text-xs text-slate-500">Google Reviews &amp; Customer Trust</p>
                      </div>
                    </div>

                    {/* Google Rating */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Google Rating</h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-[#0B132B]">
                          {analysis?.google_reviews?.average_rating || '0'}
                        </span>
                        <span className="text-xl text-slate-400">/ 5</span>
                      </div>
                      <div className="mt-2">
                        {renderStars(analysis?.google_reviews?.average_rating || 0)}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-slate-100 mb-5"></div>

                    {/* Total Reviews */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Reviews</h4>
                      <p className="text-2xl font-bold text-[#0B132B]">
                        {analysis?.google_reviews?.total_reviews ? `${analysis.google_reviews.total_reviews}` : '0'}
                      </p>
                      <p className="text-xs text-slate-500">Customer Reviews</p>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-slate-100 mb-5"></div>

                    {/* Review Summary */}
                    <div className="mt-auto">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Review Summary</h4>
                      <div className="space-y-2">
                        {/* Positive Reviews */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-slate-700">Positive</span>
                          </div>
                          <span className="text-sm font-bold text-green-700">
                            {analysis?.review_intelligence?.sentiment === 'Positive' ? '82%' : 
                             analysis?.review_intelligence?.sentiment === 'Mixed' ? '45%' : 
                             analysis?.review_intelligence?.sentiment === 'Negative' ? '10%' : '0%'}
                          </span>
                        </div>
                        {/* Neutral Reviews */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-slate-700">Neutral</span>
                          </div>
                          <span className="text-sm font-bold text-yellow-700">
                            {analysis?.review_intelligence?.sentiment === 'Positive' ? '12%' : 
                             analysis?.review_intelligence?.sentiment === 'Mixed' ? '35%' : 
                             analysis?.review_intelligence?.sentiment === 'Negative' ? '20%' : '0%'}
                          </span>
                        </div>
                        {/* Negative Reviews */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-slate-700">Negative</span>
                          </div>
                          <span className="text-sm font-bold text-red-700">
                            {analysis?.review_intelligence?.sentiment === 'Positive' ? '6%' : 
                             analysis?.review_intelligence?.sentiment === 'Mixed' ? '20%' : 
                             analysis?.review_intelligence?.sentiment === 'Negative' ? '70%' : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - AI Confidence */}
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0B132B]">AI Confidence</h3>
                        <p className="text-xs text-slate-500">Overall AI Analysis Score</p>
                      </div>
                    </div>

                    {/* Circular Progress Indicator */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-40 h-40">
                        {/* Background Circle */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                          {/* Progress Circle */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="#EAB308" 
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(analysis?.confidence_score || 0) * 2.83} 283`}
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-extrabold text-[#0B132B]">
                            {analysis?.confidence_score || 0}%
                          </span>
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            AI Confidence
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Panel */}
                    <div className="mt-auto bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        This score represents how confident the AI is in the collected business information.
                      </p>
                      {analysis && analysis.confidence_score && analysis.confidence_score < 50 && (
                        <div className="mt-3 flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 rounded-lg p-3">
                          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Limited online information was available. Running another analysis later may improve confidence.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overall Rating Reasons */}
                {analysis && analysis.online_presence && analysis.online_presence.reasons && analysis.online_presence.reasons.length > 0 && (
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-6 mb-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                    <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Industry</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.industry || 'Not available'}</p>
                  </div>
                  {/* Target Customers */}
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Customers</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.target_customers || 'Not enough data'}</p>
                  </div>
                  {/* Business Model */}
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Business Model</h4>
                    <p className="text-base text-slate-800">{analysis?.business_intelligence?.business_model || 'Not enough data'}</p>
                  </div>
                  {/* Unique Selling Proposition */}
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                    <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                    <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                    <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                    <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                        <div key={index} className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                    <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="bg-white border-2 border-[#EAB308]/70 hover:border-[#EAB308] rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
