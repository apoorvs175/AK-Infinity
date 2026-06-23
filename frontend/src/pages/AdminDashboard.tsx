import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, LogOut, Trash2, Search } from 'lucide-react'
import AKLogo from '../assets/AK_Main_Logo.webp'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected'
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      navigate('/admin/login')
    } else {
      setLeads(sampleLeads)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/admin/login')
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
  }

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="flex h-screen">
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-[50px] h-[44px] bg-white rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden">
                <img src={AKLogo} alt="AK Infinity Logo" className="w-[46px] h-[47px] object-contain" />
              </div>
              <span className="text-xl font-bold text-slate-900">AK Infinity</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium">
              <Users className="w-5 h-5" />
              Leads
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Lead Management Dashboard</h1>
              <p className="text-slate-600">Manage and track your leads</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Leads', value: stats.total, color: 'from-primary-500 to-primary-600' },
                { label: 'New', value: stats.new, color: 'from-blue-500 to-blue-600' },
                { label: 'Contacted', value: stats.contacted, color: 'from-yellow-500 to-yellow-600' },
                { label: 'Converted', value: stats.converted, color: 'from-green-500 to-green-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Name</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Phone</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{lead.name}</div>
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
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLeads.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  No leads found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
