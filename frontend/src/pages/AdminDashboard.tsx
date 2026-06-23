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

const API_URL = import.meta.env.VITE_API_URL || ''

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

  // Sample data
  const sampleLeads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 555-0100',
      message: 'Looking for web development services',
      status: 'new',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Mobile app development inquiry',
      status: 'contacted',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

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
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      navigate('/admin/login')
    } else {
      loadLeads()
      loadVisitors()
    }
  }, [navigate])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL + '/api/leads')
      const data = await response.json()
      setLeads(data.length > 0 ? data : sampleLeads)
    } catch (error) {
      setLeads(sampleLeads)
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
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
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
            ${sidebarCollapsed ? 'w-20' : 'w-72'}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl border border-[#EAB308]/30 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={AKLogo} alt="AK Infinity Logo" className="w-10 h-10 object-contain" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-[#0B132B] to-[#EAB308] bg-clip-text text-transparent">
                  AK Infinity
                </span>
              )}
            </Link>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                    flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                    ${activeSection === item.id
                      ? 'bg-[#EAB308]/10 text-[#EAB308] shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B132B]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-[#EAB308]' : ''}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-slate-200">
            <div className={`
              p-3 rounded-xl bg-slate-50 border border-slate-100
              ${sidebarCollapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}
            `}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EAB308] to-[#0B132B] flex items-center justify-center text-white font-semibold">
                A
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B132B] truncate">Admin User</p>
                  <p className="text-xs text-slate-500 truncate">admin@akinfinity.com</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className={`
                  p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors
                  ${sidebarCollapsed ? 'w-full justify-center' : ''}
                `}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Page Title */}
                <div>
                  <h1 className="text-2xl font-bold text-[#0B132B]">{getPageTitle()}</h1>
                  <p className="text-sm text-slate-500">
                    {activeSection === 'dashboard' && 'Welcome back! Here\'s your overview.'}
                    {activeSection === 'leads' && 'Manage and track your leads'}
                    {activeSection === 'visitors' && 'Track and analyze website visitors'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#EAB308]/50 focus-within:ring-2 focus-within:ring-[#EAB308]/20 transition-all">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent border-none outline-none text-sm text-slate-700 w-64 placeholder:text-slate-400"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0B132B] transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EAB308] rounded-full border-2 border-white" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EAB308] to-[#0B132B] flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-[#0B132B]">Admin User</p>
                        <p className="text-xs text-slate-500">admin@akinfinity.com</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {activeSection === 'dashboard' && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
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
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                      >
                        <div className="text-sm text-slate-500 font-medium mb-2">{stat.label}</div>
                        <div className={`text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Leads */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#0B132B]">Recent Leads</h3>
                        <button
                          onClick={() => setActiveSection('leads')}
                          className="text-sm text-[#EAB308] hover:text-[#EAB308]/80 font-medium flex items-center gap-1"
                        >
                          View all <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                              <div className="w-10 h-10 rounded-full bg-slate-200" />
                              <div className="flex-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-1.5" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                              </div>
                              <div className="h-6 bg-slate-200 rounded-full w-20" />
                            </div>
                          ))
                        ) : (
                          leads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EAB308]/20 to-[#0B132B]/20 flex items-center justify-center">
                                  <User className="w-5 h-5 text-[#0B132B]" />
                                </div>
                                <div>
                                  <p className="font-medium text-[#0B132B]">{lead.name}</p>
                                  <p className="text-sm text-slate-500">{lead.email}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                                {lead.status}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recent Visitors */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#0B132B]">Recent Visitors</h3>
                        <button
                          onClick={() => setActiveSection('visitors')}
                          className="text-sm text-[#EAB308] hover:text-[#EAB308]/80 font-medium flex items-center gap-1"
                        >
                          View all <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                              <div className="w-10 h-10 rounded-full bg-slate-200" />
                              <div className="flex-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-1.5" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                              </div>
                              <div className="h-6 bg-slate-200 rounded w-16" />
                            </div>
                          ))
                        ) : visitors.length > 0 ? (
                          visitors.slice(0, 5).map((visitor) => (
                            <div key={visitor.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EAB308]/10 flex items-center justify-center text-[#EAB308]">
                                  {getDeviceIcon(visitor.device_type)}
                                </div>
                                <div>
                                  <p className="font-medium text-[#0B132B]">
                                    {visitor.browser} on {visitor.os}
                                  </p>
                                  <p className="text-sm text-slate-500">{visitor.page_visited}</p>
                                </div>
                              </div>
                              <p className="text-sm text-slate-500">
                                {formatTimeSpent(visitor.time_spent || 0)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Globe className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500">No visitors yet</p>
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search leads..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all"
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

                  {/* Leads Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Name</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Email</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Phone</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Date</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-[#0B132B]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-6 bg-slate-200 rounded-full w-20 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse ml-auto" />
                                </td>
                              </tr>
                            ))
                          ) : (
                            filteredLeads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="font-medium text-[#0B132B]">{lead.name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{lead.email}</td>
                                <td className="px-6 py-4 text-slate-600">{lead.phone || '-'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                  {new Date(lead.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {!loading && filteredLeads.length === 0 && (
                      <div className="p-16 text-center">
                        <Users className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 text-lg font-medium">No leads found</p>
                        <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === 'visitors' && (
                <>
                  {/* Visitors Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Device</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Browser</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">OS</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Page</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Referrer</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Time Spent</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#0B132B]">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
                                    <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-40 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                                </td>
                              </tr>
                            ))
                          ) : (
                            visitors.map((visitor) => (
                              <tr key={visitor.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#EAB308]/10 flex items-center justify-center text-[#EAB308]">
                                      {getDeviceIcon(visitor.device_type)}
                                    </div>
                                    <span className="text-[#0B132B] font-medium">{visitor.device_type || 'Unknown'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{visitor.browser || '-'}</td>
                                <td className="px-6 py-4 text-slate-600">{visitor.os || '-'}</td>
                                <td className="px-6 py-4 text-slate-600">{visitor.page_visited || '-'}</td>
                                <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{visitor.referrer || '-'}</td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{formatTimeSpent(visitor.time_spent || 0)}</td>
                                <td className="px-6 py-4 text-slate-600">
                                  {new Date(visitor.created_at).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {!loading && visitors.length === 0 && (
                      <div className="p-16 text-center">
                        <Globe className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 text-lg font-medium">No visitors yet</p>
                        <p className="text-slate-400 text-sm mt-1">Start promoting your site!</p>
                      </div>
                    )}
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
