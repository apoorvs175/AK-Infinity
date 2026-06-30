import { useEffect, useState } from 'react'
import { Plus, Trash2, ExternalLink, Loader } from 'lucide-react'
import type { Client } from '../types'
import Button from '../components/Button'

const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com'

interface CreateClientForm {
  business_name: string
  owner_name: string
  owner_contact_number: string
  address_name: string
  google_maps_link: string
}

export default function ClientDetails() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<CreateClientForm>({
    business_name: '',
    owner_name: '',
    owner_contact_number: '',
    address_name: '',
    google_maps_link: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/clients`)
      const data = await response.json()
      setClients(data || [])
    } catch (err) {
      console.error('Error loading clients:', err)
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to create client')
      const newClient = await response.json()
      setClients([newClient, ...clients])
      setShowCreateModal(false)
      setFormData({
        business_name: '',
        owner_name: '',
        owner_contact_number: '',
        address_name: '',
        google_maps_link: ''
      })
    } catch (err) {
      console.error('Error creating client:', err)
      setError('Failed to create client')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete client')
      setClients(clients.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting client:', err)
      setError('Failed to delete client')
    }
  }

  const handleCellEdit = async (clientId: string, field: string, value: any) => {
    setSaving(true)
    try {
      const updateData: any = {}
      
      // Convert boolean fields
      if (['first_call', 'first_meeting', 'agreement_signed', 'project_delivered'].includes(field)) {
        updateData[field] = value === true ? false : true
      } else {
        updateData[field] = value
      }

      const response = await fetch(`${API_URL}/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update client')
      const updatedClient = await response.json()
      
      setClients(clients.map(c => c.id === clientId ? updatedClient : c))
      setEditingCell(null)
    } catch (err) {
      console.error('Error updating client:', err)
      setError('Failed to update client')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredClients = clients.filter(client =>
    client.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderCell = (client: Client, field: string, index: number) => {
    const isEditing = editingCell?.id === client.id && editingCell?.field === field
    const value = client[field as keyof Client]

    if (['first_call', 'first_meeting', 'agreement_signed', 'project_delivered'].includes(field)) {
      return (
        <button
          onClick={() => handleCellEdit(client.id, field, value)}
          className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
            value
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={saving}
        >
          {value ? '✓ Yes' : '✗ No'}
        </button>
      )
    }

    if (field === 'address_name' && client.google_maps_link) {
      return (
        <div className="flex items-center gap-2">
          <span>{value || '-'}</span>
          {client.google_maps_link && (
            <a
              href={client.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )
    }

    if (isEditing) {
      return (
        <input
          type={field.includes('amount') ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => {
            if (editValue !== String(value)) {
              handleCellEdit(client.id, field, field.includes('amount') ? parseFloat(editValue) : editValue)
            } else {
              setEditingCell(null)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (editValue !== String(value)) {
                handleCellEdit(client.id, field, field.includes('amount') ? parseFloat(editValue) : editValue)
              } else {
                setEditingCell(null)
              }
            }
            if (e.key === 'Escape') setEditingCell(null)
          }}
          autoFocus
          disabled={saving}
          className="w-full px-2 py-1 border border-blue-500 rounded text-sm"
        />
      )
    }

    return (
      <button
        onClick={() => {
          setEditingCell({ id: client.id, field })
          setEditValue(String(value || ''))
        }}
        className="text-left hover:bg-gray-50 px-2 py-1 rounded transition-colors"
        disabled={saving}
      >
        {field.includes('amount') ? `₹${(value as number || 0).toLocaleString()}` : value || '-'}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Client Details</h1>
            <p className="text-slate-600 mt-1">Manage and track all your clients</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 md:w-auto w-full justify-center"
          >
            <Plus className="w-5 h-5" />
            Create New Client
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by business name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <p>No clients found. Create your first client to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Sr No</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Business Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Owner Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Address</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">First Call</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">Meeting</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">Agreement</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 whitespace-nowrap">Received</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">Delivered</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderCell(client, 'business_name', index)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderCell(client, 'owner_name', index)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        {client.owner_contact_number || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderCell(client, 'address_name', index)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {renderCell(client, 'first_call', index)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {renderCell(client, 'first_meeting', index)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {renderCell(client, 'agreement_signed', index)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderCell(client, 'payment_amount', index)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderCell(client, 'amount_received', index)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {renderCell(client, 'project_delivered', index)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {filteredClients.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <p className="text-slate-600 text-sm">Total Clients</p>
              <p className="text-2xl font-bold text-slate-900">{filteredClients.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <p className="text-slate-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{filteredClients.reduce((sum, c) => sum + (c.payment_amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <p className="text-slate-600 text-sm">Received</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{filteredClients.reduce((sum, c) => sum + (c.amount_received || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <p className="text-slate-600 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredClients.filter(c => c.project_delivered).length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create New Client</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="owner_contact_number"
                  value={formData.owner_contact_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Name</label>
                <input
                  type="text"
                  name="address_name"
                  value={formData.address_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Link</label>
                <input
                  type="url"
                  name="google_maps_link"
                  value={formData.google_maps_link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Client'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
