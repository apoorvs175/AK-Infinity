import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Plus, MapPin, CheckCircle2 } from 'lucide-react';
import type { Client } from '../types';
import { useAuth } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com';

export default function ClientDetails() {
  const { signOut } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    business_name: '',
    owner_name: '',
    address_name: '',
    google_maps_link: '',
    owner_contact_number: ''
  });

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clients`);
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle inline update
  const handleUpdateClient = async (id: string, field: keyof Client, value: any) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: value })
      });
      
      if (response.ok) {
        // Update local state
        setClients(prev => prev.map(client => 
          client.id === id ? { ...client, [field]: value } : client
        ));
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  // Handle create new client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClient)
      });
      
      if (response.ok) {
        const data = await response.json();
        setClients(prev => [data, ...prev]);
        setShowModal(false);
        setNewClient({
          business_name: '',
          owner_name: '',
          address_name: '',
          google_maps_link: '',
          owner_contact_number: ''
        });
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar / Header */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0 hidden md:block">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AK</span>
              </div>
              <span className="font-bold text-xl text-gray-900">AK Infinity</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              to="/admin/clients"
              className="flex items-center gap-3 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl transition-all font-medium"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Client Details</span>
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
                <p className="text-gray-500 text-sm">Manage your client information</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Client
              </button>
            </div>
          </header>

          {/* Clients Table */}
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Sr No</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Business Name</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Owner Name</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Address</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-900">First Call</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-900">First Meeting</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-900">Agreement Signed</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-gray-900">Payment Amount</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-gray-900">Amount Received</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-900">Project Delivered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-4"><div className="w-8 h-4 bg-gray-100 rounded animate-pulse"></div></td>
                          <td className="px-4 py-4"><div className="w-32 h-4 bg-gray-100 rounded animate-pulse"></div></td>
                          <td className="px-4 py-4"><div className="w-24 h-4 bg-gray-100 rounded animate-pulse"></div></td>
                          <td className="px-4 py-4"><div className="w-40 h-4 bg-gray-100 rounded animate-pulse"></div></td>
                          <td className="px-4 py-4 text-center"><div className="w-5 h-5 bg-gray-100 rounded animate-pulse mx-auto"></div></td>
                          <td className="px-4 py-4 text-center"><div className="w-5 h-5 bg-gray-100 rounded animate-pulse mx-auto"></div></td>
                          <td className="px-4 py-4 text-center"><div className="w-5 h-5 bg-gray-100 rounded animate-pulse mx-auto"></div></td>
                          <td className="px-4 py-4 text-right"><div className="w-20 h-4 bg-gray-100 rounded animate-pulse ml-auto"></div></td>
                          <td className="px-4 py-4 text-right"><div className="w-20 h-4 bg-gray-100 rounded animate-pulse ml-auto"></div></td>
                          <td className="px-4 py-4 text-center"><div className="w-5 h-5 bg-gray-100 rounded animate-pulse mx-auto"></div></td>
                        </tr>
                      ))
                    ) : clients.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="w-12 h-12 text-gray-300" />
                            <p className="text-lg font-medium">No clients yet</p>
                            <p className="text-sm">Create your first client to get started</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      clients.map((client, index) => (
                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-600 font-medium">{index + 1}</td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                            <input
                              type="text"
                              value={client.business_name}
                              onChange={(e) => handleUpdateClient(client.id, 'business_name', e.target.value)}
                              className="bg-transparent border border-transparent hover:border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 px-1 py-0.5 rounded"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <input
                              type="text"
                              value={client.owner_name}
                              onChange={(e) => handleUpdateClient(client.id, 'owner_name', e.target.value)}
                              className="bg-transparent border border-transparent hover:border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 px-1 py-0.5 rounded"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {client.google_maps_link ? (
                              <a
                                href={client.google_maps_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-yellow-600 text-blue-600"
                              >
                                <MapPin className="w-3 h-3" />
                                <input
                                  type="text"
                                  value={client.address_name}
                                  onChange={(e) => handleUpdateClient(client.id, 'address_name', e.target.value)}
                                  className="bg-transparent border border-transparent hover:border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 px-1 py-0.5 rounded"
                                />
                              </a>
                            ) : (
                              <input
                                type="text"
                                value={client.address_name}
                                onChange={(e) => handleUpdateClient(client.id, 'address_name', e.target.value)}
                                className="bg-transparent border border-transparent hover:border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 px-1 py-0.5 rounded"
                              />
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleUpdateClient(client.id, 'first_call', !client.first_call)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto ${
                                client.first_call
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {client.first_call && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleUpdateClient(client.id, 'first_meeting', !client.first_meeting)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto ${
                                client.first_meeting
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {client.first_meeting && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleUpdateClient(client.id, 'agreement_signed', !client.agreement_signed)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto ${
                                client.agreement_signed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {client.agreement_signed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-900">
                            <input
                              type="number"
                              value={client.payment_amount || ''}
                              onChange={(e) => handleUpdateClient(client.id, 'payment_amount', e.target.value ? Number(e.target.value) : null)}
                              className="bg-transparent border border-transparent hover:border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 px-1 py-0.5 rounded w-24 text-right"
                              placeholder="₹0"
                            />
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-900">
                            <input
                              type="number"
                              value={client.amount_received || ''}
                              onChange={(e) => handleUpdateClient(client.id, 'amount_received', e.target.value ? Number(e.target.value) : null)}
                              className="bg-transparent border border-transparent hover:border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 px-1 py-0.5 rounded w-24 text-right"
                              placeholder="₹0"
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleUpdateClient(client.id, 'project_delivered', !client.project_delivered)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto ${
                                client.project_delivered
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {client.project_delivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Client</h2>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={newClient.business_name}
                  onChange={(e) => setNewClient({ ...newClient, business_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={newClient.owner_name}
                  onChange={(e) => setNewClient({ ...newClient, owner_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={newClient.address_name}
                  onChange={(e) => setNewClient({ ...newClient, address_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                <input
                  type="url"
                  value={newClient.google_maps_link}
                  onChange={(e) => setNewClient({ ...newClient, google_maps_link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Contact Number</label>
                <input
                  type="tel"
                  value={newClient.owner_contact_number}
                  onChange={(e) => setNewClient({ ...newClient, owner_contact_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 font-medium"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
