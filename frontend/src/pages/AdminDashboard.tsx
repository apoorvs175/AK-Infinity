import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  LogOut,
  Trash2,
  Search,
  Eye,
  Smartphone,
  Monitor,
  Globe,
  Menu,
  Bell,
  ChevronLeft,
  User,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react'
import AKLogo from '../assets/AK_Main_Logo.webp'
import type { Lead, Visitor } from '../types'
import { useAuth } from '../lib/auth'

const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeSection, setActiveSection] = useState<'dashboard' | 'leads' | 'visitors'>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed')
    if (savedSidebarState !== null) {
      setSidebarCollapsed(savedSidebarState === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString())
  }, [sidebarCollapsed])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    loadLeads()
    loadVisitors()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL + '/api/leads')
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error('Error loading leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const loadVisitors = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL + '/api/visitors')
      const data = await response.json()
      setVisitors(data)
    } catch (error) {
      console.error('Error loading visitors:', error)
      setVisitors([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getDeviceIcon = (deviceType?: string) => {
    if (deviceType === 'Mobile') return <Smartphone className="w-4 h-4" />
    if (deviceType === 'Tablet') return <Monitor className="w-4 h-4" />
    return <Globe className="w-4 h-4" />
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    contactedLeads: leads.filter(l => l.status === 'contacted').length,
    convertedLeads: leads.filter(l => l.status === 'converted').length,
    totalVisitors: visitors.length,
    todayVisitors: visitors.filter(v => {
      const today = new Date()
      const visitDate = new Date(v.created_at)
      return today.toDateString() === visitDate.toDateString()
    }).length
  }

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'visitors', label: 'Visitors', icon: Eye },
  ]

  const getPageTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard'
      case 'leads': return 'Lead Management'
      case 'visitors': return 'Visitor Analytics'
      default: return 'Dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`
            fixed lg:static z-50 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'w-16' : 'w-64'}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Section */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl border border-[#EAB308]/30 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={AKLogo} alt="AK Infinity Logo" className="w-8 h-8 object-contain" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-lg font-bold bg-gradient-to-r from-[#0B132B] to-[#EAB308] bg-clip-text text-transparent">
                  AK Infinity
                </span>
              )}
            </Link>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`
                    flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
                    ${activeSection === item.id
                      ? 'bg-[#EAB308]/10 text-[#EAB308] shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B132B]'}
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 ${activeSection === item.id ? 'text-[#EAB308]' : ''}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-3 border-t border-slate-200">
            <div className={`
              p-2.5 rounded-lg bg-slate-50 border border-slate-100
              ${sidebarCollapsed ? 'flex flex-col items-center gap-1.5' : 'flex items-center gap-2.5'}
            `}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308] to-[#0B132B] flex items-center justify-center text-white font-semibold text-xs">
                A
              </div>
              {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0B132B]">
                      {user?.email?.split('@')[0] || 'Admin User'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {user?.email || 'admin@akinfinity.com'}
                    </p>
                  </div>
                )}
              <button
                onClick={handleLogout}
                className={`
                  p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors
                  ${sidebarCollapsed ? 'w-full justify-center' : ''}
                `}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Page Title */}
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-[#0B132B]">{getPageTitle()}</h1>
                  <p className="text-xs md:text-sm text-slate-500">
                    {activeSection === 'dashboard' && 'Welcome back! Here\'s your overview.'}
                    {activeSection === 'leads' && 'Manage and track your leads'}
                    {activeSection === 'visitors' && 'Track and analyze website visitors'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {/* Notifications */}
                <button className="relative p-1.5 md:p-2.5 rounded-lg md:rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0B132B] transition-all">
                  <Bell className="w-4.5 h-4.5 md:w-5 md:h-5" />
                  <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#EAB308] rounded-full border border-white md:border-2" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 pr-2 md:p-1.5 md:pr-3 rounded-lg md:rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#EAB308] to-[#0B132B] flex items-center justify-center text-white font-semibold text-sm">
                      A
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-white rounded-xl md:rounded-2xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-[#0B132B]">
                          {user?.email?.split('@')[0] || 'Admin User'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user?.email || 'admin@akinfinity.com'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
              {activeSection === 'dashboard' && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-5">
                    {[
                      { label: 'Total Visitors', value: stats.totalVisitors, color: 'from-blue-500 to-blue-600' },
                      { label: 'Today\'s Visitors', value: stats.todayVisitors, color: 'from-cyan-500 to-cyan-600' },
                      { label: 'Total Leads', value: stats.totalLeads, color: 'from-[#EAB308] to-yellow-600' },
                      { label: 'New Leads', value: stats.newLeads, color: 'from-blue-500 to-blue-600' },
                      { label: 'Contacted', value: stats.contactedLeads, color: 'from-yellow-500 to-yellow-600' },
                      { label: 'Converted', value: stats.convertedLeads, color: 'from-green-500 to-green-600' },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                      >
                        <div className="text-[11px] md:text-sm text-slate-500 font-medium mb-1 md:mb-2">{stat.label}</div>
                        <div className={`text-2xl md:text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                    {/* Recent Leads */}
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-sm md:text-lg font-semibold text-[#0B132B]">Recent Leads</h3>
                        <button
                          onClick={() => setActiveSection('leads')}
                          className="text-xs md:text-sm text-[#EAB308] hover:text-[#EAB308]/80 font-medium flex items-center gap-1"
                        >
                          View all <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2.5 py-1.5 animate-pulse">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div className="flex-1">
                                <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
                                <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                              </div>
                              <div className="h-5 bg-slate-200 rounded-full w-16" />
                            </div>
                          ))
                        ) : (
                          leads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308]/20 to-[#0B132B]/20 flex items-center justify-center">
                                  <User className="w-4 h-4 text-[#0B132B]" />
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-[#0B132B]">{lead.name}</p>
                                  <p className="text-[10px] md:text-xs text-slate-500">{lead.email}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                                {lead.status}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recent Visitors */}
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-sm md:text-lg font-semibold text-[#0B132B]">Recent Visitors</h3>
                        <button
                          onClick={() => setActiveSection('visitors')}
                          className="text-xs md:text-sm text-[#EAB308] hover:text-[#EAB308]/80 font-medium flex items-center gap-1"
                        >
                          View all <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2.5 py-1.5 animate-pulse">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div className="flex-1">
                                <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
                                <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                              </div>
                              <div className="h-5 bg-slate-200 rounded w-14" />
                            </div>
                          ))
                        ) : visitors.length > 0 ? (
                          visitors.slice(0, 5).map((visitor) => (
                            <div key={visitor.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#EAB308]/10 flex items-center justify-center text-[#EAB308]">
                                  {getDeviceIcon(visitor.device_type)}
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-[#0B132B]">
                                    {visitor.browser} on {visitor.os}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-slate-500">{visitor.page_visited}</p>
                                </div>
                              </div>
                              <p className="text-[10px] md:text-sm text-slate-500">
                                {formatTimeSpent(visitor.time_spent || 0)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 md:py-12">
                            <Globe className="w-10 h-10 md:w-12 md:h-12 mx-auto text-slate-300 mb-2 md:mb-3" />
                            <p className="text-xs md:text-sm text-slate-500">No visitors yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'leads' && (
                <>
                  {/* Filters */}
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search leads..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Leads Table - Mobile View as Cards */}
                  <div className="lg:hidden space-y-2">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 animate-pulse">
                          <div className="h-3 bg-slate-200 rounded w-20 mb-1.5" />
                          <div className="h-2.5 bg-slate-200 rounded w-28 mb-1" />
                          <div className="h-2.5 bg-slate-200 rounded w-36" />
                        </div>
                      ))
                    ) : filteredLeads.length > 0 ? (
                      filteredLeads.map((lead) => (
                        <div key={lead.id} className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-semibold text-[#0B132B]">{lead.name}</p>
                              <p className="text-xs text-slate-500">{lead.email}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-[10px] text-slate-400">
                              {lead.phone && <span>{lead.phone} • </span>}
                              {new Date(lead.created_at).toLocaleDateString()}
                            </div>
                            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
                        <Users className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                        <p className="text-sm text-slate-500 font-medium">No leads found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
                      </div>
                    )}
                  </div>

                  {/* Leads Table - Desktop View */}
                  <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Name</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Email</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Phone</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Status</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Date</th>
                            <th className="text-right px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-32 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-48 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-28 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-5 bg-slate-200 rounded-full w-20 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-24 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                  <div className="h-7 w-7 bg-slate-200 rounded-lg animate-pulse ml-auto" />
                                </td>
                              </tr>
                            ))
                          ) : (
                            filteredLeads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3.5">
                                  <div className="text-sm font-medium text-[#0B132B]">{lead.name}</div>
                                </td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">{lead.email}</td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">{lead.phone || '-'}</td>
                                <td className="px-6 py-3.5">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">
                                  {new Date(lead.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                  <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                    <Trash2 className="w-4.5 h-4.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'visitors' && (
                <>
                  {/* Visitors - Mobile View as Cards */}
                  <div className="lg:hidden space-y-2">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 animate-pulse">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-slate-200 rounded-full" />
                            <div className="flex-1">
                              <div className="h-3 bg-slate-200 rounded w-32 mb-1" />
                              <div className="h-2.5 bg-slate-200 rounded w-24" />
                            </div>
                            <div className="h-6 bg-slate-200 rounded w-14" />
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded w-40 mb-1.5" />
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div className="h-2.5 bg-slate-200 rounded w-28" />
                            <div className="h-2.5 bg-slate-200 rounded w-24" />
                            <div className="h-2.5 bg-slate-200 rounded w-24" />
                            <div className="h-2.5 bg-slate-200 rounded w-28" />
                            <div className="h-2.5 bg-slate-200 rounded w-24" />
                            <div className="h-2.5 bg-slate-200 rounded w-32" />
                          </div>
                        </div>
                      ))
                    ) : visitors.length > 0 ? (
                      visitors.map((visitor) => (
                        <div key={visitor.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                          {/* Top Section */}
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-[#EAB308]/10 flex items-center justify-center text-[#EAB308] flex-shrink-0">
                              {getDeviceIcon(visitor.device_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs font-semibold text-[#0B132B]">
                                    {visitor.browser} on {visitor.os}
                                  </p>
                                </div>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EAB308]/10 text-[#0B132B] flex-shrink-0 ml-2">
                                  {formatTimeSpent(visitor.time_spent || 0)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Page Visited */}
                          <div className="mb-2">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Page</p>
                            <p className="text-xs text-slate-600 truncate">
                              {visitor.page_visited || '-'}
                            </p>
                          </div>

                          {/* Location Section (if available) */}
                          {visitor.latitude && visitor.longitude && (
                            <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider mb-0.5">📍 Location</p>
                              {visitor.full_address ? (
                                <p className="text-xs text-blue-800 mb-1">{visitor.full_address}</p>
                              ) : (
                                <p className="text-xs text-blue-700 mb-1">{visitor.latitude.toFixed(6)}, {visitor.longitude.toFixed(6)}</p>
                              )}
                              {visitor.google_maps_url && (
                                <a 
                                  href={visitor.google_maps_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  <Globe className="w-3 h-3" />
                                  View on Map
                                </a>
                              )}
                            </div>
                          )}

                          {/* Location permission status if no coordinates */}
                          {!visitor.latitude && visitor.location_permission && visitor.location_permission !== 'granted' && (
                            <div className="mb-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-[10px] text-slate-500">
                                Location: {visitor.location_permission === 'denied' ? 'Permission Denied' : 
                                         visitor.location_permission === 'unavailable' ? 'Unavailable' : 
                                         visitor.location_permission === 'timeout' ? 'Timeout' : 'Not Requested'}
                              </p>
                            </div>
                          )}

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Device</p>
                              <p className="text-xs text-slate-600">
                                {visitor.device_type || 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Browser</p>
                              <p className="text-xs text-slate-600">
                                {visitor.browser || '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">OS</p>
                              <p className="text-xs text-slate-600">
                                {visitor.os || '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Referrer</p>
                              <p className="text-xs text-slate-600 truncate">
                                {visitor.referrer || 'Direct'}
                              </p>
                            </div>
                            {visitor.city && (
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">City</p>
                                <p className="text-xs text-slate-600">
                                  {visitor.city}
                                </p>
                              </div>
                            )}
                            {visitor.state && (
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">State</p>
                                <p className="text-xs text-slate-600">
                                  {visitor.state}
                                </p>
                              </div>
                            )}
                            {visitor.country && (
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Country</p>
                                <p className="text-xs text-slate-600">
                                  {visitor.country}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Date</p>
                              <p className="text-xs text-slate-600">
                                {new Date(visitor.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Time</p>
                              <p className="text-xs text-slate-600">
                                {new Date(visitor.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
                        <Globe className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                        <p className="text-sm text-slate-500 font-medium">No visitors yet</p>
                        <p className="text-xs text-slate-400 mt-1">Start promoting your site!</p>
                      </div>
                    )}
                  </div>

                  {/* Visitors Table - Desktop View */}
                  <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Device</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Browser</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">OS</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Page</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Location</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Map</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Time Spent</th>
                            <th className="text-left px-6 py-3.5 text-sm font-semibold text-[#0B132B]">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-slate-200 rounded-full animate-pulse" />
                                    <div className="h-3.5 bg-slate-200 rounded w-24 animate-pulse" />
                                  </div>
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-28 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-20 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-32 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-40 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-20 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-16 animate-pulse" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="h-3.5 bg-slate-200 rounded w-32 animate-pulse" />
                                </td>
                              </tr>
                            ))
                          ) : (
                            visitors.map((visitor) => (
                              <tr key={visitor.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#EAB308]/10 flex items-center justify-center text-[#EAB308]">
                                      {getDeviceIcon(visitor.device_type)}
                                    </div>
                                    <span className="text-sm text-[#0B132B] font-medium">{visitor.device_type || 'Unknown'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">{visitor.browser || '-'}</td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">{visitor.os || '-'}</td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">{visitor.page_visited || '-'}</td>
                                <td className="px-6 py-3.5 text-sm text-slate-600 max-w-xs">
                                  {visitor.full_address ? (
                                    <span className="line-clamp-2">{visitor.full_address}</span>
                                  ) : visitor.city && visitor.country ? (
                                    <span>{visitor.city}, {visitor.country}</span>
                                  ) : visitor.location_permission === 'denied' ? (
                                    <span className="text-slate-400 italic">Permission Denied</span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5">
                                  {visitor.google_maps_url ? (
                                    <a 
                                      href={visitor.google_maps_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                      <Globe className="w-4 h-4" />
                                      View
                                    </a>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 text-sm text-slate-600 font-medium">{formatTimeSpent(visitor.time_spent || 0)}</td>
                                <td className="px-6 py-3.5 text-sm text-slate-600">
                                  {new Date(visitor.created_at).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}