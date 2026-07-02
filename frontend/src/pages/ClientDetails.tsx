import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Plus,
  MapPin,
  Edit2,
  X,
  Check,
  Phone,
  Menu,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Client } from '../types';
import { useAuth } from '../lib/auth';
import AKLogo from '../assets/AK_Main_Logo.webp';

const API_URL = import.meta.env.VITE_API_URL || 'https://ak-infinity-backend.onrender.com';

// Format Indian currency
const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const StatusChip = ({ checked }: { checked: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      checked
        ? 'bg-green-50 text-green-700'
        : 'bg-slate-50 text-slate-600'
    }`}
  >
    {checked ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-slate-300"></div>}
    {checked ? 'Yes' : 'No'}
  </span>
);

const ServiceChip = ({ label, active }: { label: string; active: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'bg-slate-100 text-slate-500'
    }`}
  >
    {label}
  </span>
);

export default function ClientDetails() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Client>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClients = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditValues({ ...client });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    try {
      const response = await fetch(`${API_URL}/api/clients/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues)
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClients(prev => prev.map(c => c.id === editingId ? updatedClient : c));
        showToast('Client updated successfully!', 'success');
        setEditingId(null);
        setEditValues({});
      } else {
        throw new Error('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      showToast('Failed to update client', 'error');
    }
  };

  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    console.log('🔄 Creating client...');
    
    const formData = new FormData(e.currentTarget);
    const newClientData = {
      business_name: formData.get('business_name') as string,
      owner_name: formData.get('owner_name') as string,
      address_name: formData.get('address_name') as string,
      google_maps_link: formData.get('google_maps_link') as string,
      owner_contact_number: formData.get('owner_contact_number') as string
    };

    console.log('📤 Sending client data to:', `${API_URL}/api/clients`, newClientData);

    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClientData)
      });

      console.log('📥 Response status:', response.status);
      const responseText = await response.text();
      console.log('📥 Response text:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ Client created successfully:', data);
        setClients(prev => [data, ...prev]);
        if (formRef.current) {
          formRef.current.reset();
        }
        setShowModal(false);
        showToast('Client created successfully!', 'success');
      } else {
        console.error('❌ Server responded with error:', response.status, responseText);
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || responseText;
        } catch {
          errorMessage = responseText;
        }
        showToast('Failed to create client: ' + errorMessage, 'error');
      }
    } catch (error) {
      console.error('❌ Error creating client:', error);
      showToast('Failed to create client: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp SVG icon
  const WhatsAppIcon = ({ className }: { className: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.492-.67-.5h-.572c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414l-.049-.148z"/>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.116.559 4.166 1.607 5.974L.008 24l6.252-1.64c1.773.987 3.762 1.52 5.754 1.52C18.641 23.88 24 18.493 24 11.987 24 5.367 18.638 0 12.017 0zm.006 21.456c-1.873 0-3.694-.506-5.262-1.465l-.309-.18-3.707.972 1.001-3.603-.2-.32c-1.046-1.68-1.594-3.609-1.594-5.65 0-5.225 4.267-9.48 9.529-9.48 2.554 0 4.951.997 6.747 2.805 1.796 1.808 2.783 4.21 2.783 6.775 0 5.225-4.267 9.48-9.508 9.48z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:static z-50 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-64'} ${
          showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
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
          <button 
            onClick={() => setShowSidebar(false)} 
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <Link
            to="/admin"
            onClick={() => setShowSidebar(false)}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0B132B]"
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <div className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm bg-[#EAB308]/10 text-[#EAB308] shadow-sm">
            <Users className="w-4.5 h-4.5" />
            {!sidebarCollapsed && <span>Client Details</span>}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-3 border-t border-slate-200">
          <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-100 ${sidebarCollapsed ? 'flex flex-col items-center gap-1.5' : 'flex items-center gap-2.5'}`}>
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
              onClick={async () => {
                await signOut();
                navigate('/admin/login');
              }}
              className={`p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors ${sidebarCollapsed ? 'w-full justify-center' : ''}`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-[#0B132B]">Client Details</h1>
                <p className="text-xs md:text-sm text-slate-500">Manage your client information</p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-[#EAB308] hover:bg-[#d4a207] text-[#0B132B] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Table Container */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <style>{`
                  /* Custom scrollbar */
                  .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                  }
                `}</style>
                <table className="w-full min-w-[1400px] custom-scrollbar">
                  {/* Sticky Header */}
                  <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider w-10">Sr</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Business</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Owner</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Address</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Contact</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">First Call</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Services</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">First Meeting</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Agreement</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Payment</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Received</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Delivered</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider w-14">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-slate-50">
                          {Array.from({ length: 14 }).map((_, j) => (
                            <td key={j} className="px-3 py-2.5">
                              <div className="h-3.5 bg-slate-100 rounded w-16 animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : clients.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="w-14 h-14 mx-auto text-slate-200 mb-2 md:mb-3" />
                            <p className="text-sm md:text-base font-semibold text-[#0B132B]">No Clients Found</p>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">Create your first client to get started</p>
                            <button
                              onClick={() => setShowModal(true)}
                              className="flex items-center gap-1.5 bg-[#EAB308] hover:bg-[#d4a207] text-[#0B132B] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Client
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      clients.map((client, index) => {
                        const isEditing = editingId === client.id;
                        const currentValues = isEditing ? editValues : client;

                        return (
                          <tr
                            key={client.id}
                            className={`group transition-all duration-200 ${
                              isEditing ? 'bg-blue-50' : 'hover:bg-slate-50 hover:shadow-inner'
                            }`}
                          >
                            <td className="px-3 py-2.5 text-xs font-medium text-slate-600">{index + 1}</td>
                            
                            {/* Business Name */}
                            <td className="px-3 py-2.5">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={currentValues.business_name || ''}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, business_name: e.target.value }))}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                />
                              ) : (
                                <span className="text-sm font-medium text-[#0B132B]">{client.business_name}</span>
                              )}
                            </td>

                            {/* Owner Name */}
                            <td className="px-3 py-2.5">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={currentValues.owner_name || ''}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, owner_name: e.target.value }))}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                />
                              ) : (
                                <span className="text-xs text-slate-600">{client.owner_name}</span>
                              )}
                            </td>

                            {/* Address */}
                            <td className="px-3 py-2.5">
                              {isEditing ? (
                                <div className="space-y-1.5">
                                  <input
                                    type="text"
                                    value={currentValues.address_name || ''}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, address_name: e.target.value }))}
                                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                    placeholder="Address"
                                  />
                                  <input
                                    type="url"
                                    value={currentValues.google_maps_link || ''}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, google_maps_link: e.target.value }))}
                                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                    placeholder="Maps URL"
                                  />
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-xs text-slate-600 block">{client.address_name}</span>
                                  {client.google_maps_link && (
                                    <a
                                      href={client.google_maps_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                                    >
                                      <MapPin className="w-3 h-3" />
                                      Location
                                    </a>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Contact Number */}
                            <td className="px-3 py-2.5">
                              {isEditing ? (
                                <input
                                  type="tel"
                                  value={currentValues.owner_contact_number || ''}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, owner_contact_number: e.target.value }))}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                  placeholder="Contact"
                                />
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-slate-600">{client.owner_contact_number || '-'}</span>
                                  {client.owner_contact_number && (
                                    <div className="flex items-center gap-0.5">
                                      <a
                                        href={`tel:${client.owner_contact_number}`}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all shadow-sm hover:shadow-md"
                                        title="Call"
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                      </a>
                                      <a
                                        href={`https://wa.me/${client.owner_contact_number.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-all shadow-sm hover:shadow-md"
                                        title="WhatsApp"
                                      >
                                        <WhatsAppIcon className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* First Call */}
                            <td className="px-3 py-2.5 text-center">
                              {isEditing ? (
                                <button
                                  onClick={() => setEditValues(prev => ({ ...prev, first_call: !prev.first_call }))}
                                  className={`w-4 h-4 rounded border flex items-center justify-center mx-auto transition-all ${
                                    currentValues.first_call
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-slate-300 hover:border-slate-400'
                                  }`}
                                >
                                  {currentValues.first_call && <Check className="w-2.5 h-2.5" />}
                                </button>
                              ) : (
                                <StatusChip checked={client.first_call} />
                              )}
                            </td>

                            {/* Description */}
                            <td className="px-3 py-2.5">
                              {isEditing ? (
                                <textarea
                                  value={currentValues.description || ''}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50 resize-none"
                                  placeholder="Description"
                                  rows={2}
                                />
                              ) : (
                                <div className="relative group">
                                  <span className="text-xs text-slate-600 line-clamp-2 block">
                                    {client.description || '—'}
                                  </span>
                                  {client.description && client.description.length > 50 && (
                                    <div className="absolute bottom-full left-0 mb-1 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-pre-wrap z-20 max-w-xs shadow-lg">
                                      {client.description}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Services */}
                            <td className="px-3 py-2.5">
                              {isEditing ? (
                                <div className="flex flex-wrap gap-1.5">
                                  <button
                                    onClick={() => setEditValues(prev => ({ ...prev, website: !prev.website }))}
                                    className={`px-1.5 py-0.5 rounded text-xs font-medium border transition-all ${
                                      currentValues.website
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'
                                    }`}
                                  >
                                    Website
                                  </button>
                                  <button
                                    onClick={() => setEditValues(prev => ({ ...prev, collaboration: !prev.collaboration }))}
                                    className={`px-1.5 py-0.5 rounded text-xs font-medium border transition-all ${
                                      currentValues.collaboration
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'
                                    }`}
                                  >
                                    Collab
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {client.website && <ServiceChip label="Website" active={true} />}
                                  {client.collaboration && <ServiceChip label="Collab" active={true} />}
                                  {!client.website && !client.collaboration && <span className="text-xs text-slate-400">—</span>}
                                </div>
                              )}
                            </td>

                            {/* First Meeting */}
                            <td className="px-3 py-2.5 text-center">
                              {isEditing ? (
                                <button
                                  onClick={() => setEditValues(prev => ({ ...prev, first_meeting: !prev.first_meeting }))}
                                  className={`w-4 h-4 rounded border flex items-center justify-center mx-auto transition-all ${
                                    currentValues.first_meeting
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-slate-300 hover:border-slate-400'
                                  }`}
                                >
                                  {currentValues.first_meeting && <Check className="w-2.5 h-2.5" />}
                                </button>
                              ) : (
                                <StatusChip checked={client.first_meeting} />
                              )}
                            </td>

                            {/* Agreement Signed */}
                            <td className="px-3 py-2.5 text-center">
                              {isEditing ? (
                                <button
                                  onClick={() => setEditValues(prev => ({ ...prev, agreement_signed: !prev.agreement_signed }))}
                                  className={`w-4 h-4 rounded border flex items-center justify-center mx-auto transition-all ${
                                    currentValues.agreement_signed
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-slate-300 hover:border-slate-400'
                                  }`}
                                >
                                  {currentValues.agreement_signed && <Check className="w-2.5 h-2.5" />}
                                </button>
                              ) : (
                                <StatusChip checked={client.agreement_signed} />
                              )}
                            </td>

                            {/* Payment Amount */}
                            <td className="px-3 py-2.5 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={currentValues.payment_amount ?? ''}
                                  onChange={(e) => setEditValues(prev => ({
                                    ...prev,
                                    payment_amount: e.target.value ? Number(e.target.value) : undefined
                                  }))}
                                  className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                  placeholder="0"
                                />
                              ) : (
                                <span className="text-sm font-medium text-[#0B132B]">{formatCurrency(client.payment_amount)}</span>
                              )}
                            </td>

                            {/* Amount Received */}
                            <td className="px-3 py-2.5 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={currentValues.amount_received ?? ''}
                                  onChange={(e) => setEditValues(prev => ({
                                    ...prev,
                                    amount_received: e.target.value ? Number(e.target.value) : undefined
                                  }))}
                                  className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/50"
                                  placeholder="0"
                                />
                              ) : (
                                <span className="text-sm font-medium text-[#0B132B]">{formatCurrency(client.amount_received)}</span>
                              )}
                            </td>

                            {/* Project Delivered */}
                            <td className="px-3 py-2.5 text-center">
                              {isEditing ? (
                                <button
                                  onClick={() => setEditValues(prev => ({ ...prev, project_delivered: !prev.project_delivered }))}
                                  className={`w-4 h-4 rounded border flex items-center justify-center mx-auto transition-all ${
                                    currentValues.project_delivered
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-slate-300 hover:border-slate-400'
                                  }`}
                                >
                                  {currentValues.project_delivered && <Check className="w-2.5 h-2.5" />}
                                </button>
                              ) : (
                                <StatusChip checked={client.project_delivered} />
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-3 py-2.5 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-0.5">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-all shadow-sm hover:shadow-md"
                                    title="Save"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-all shadow-sm hover:shadow-md"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEdit(client)}
                                  className="p-1 text-slate-500 hover:text-[#EAB308] hover:bg-[#EAB308]/10 rounded transition-all shadow-sm hover:shadow-md"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl max-w-md w-full p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <h2 className="text-lg font-bold text-[#0B132B]">Add New Client</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all"
              >
                <X className="w-4.5 h-4.5 md:w-5 md:h-5" />
              </button>
            </div>
            <form ref={formRef} onSubmit={handleCreateClient} className="space-y-3.5 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm bg-slate-50/50 focus:bg-white"
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">Owner Name</label>
                <input
                  type="text"
                  name="owner_name"
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm bg-slate-50/50 focus:bg-white"
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <input
                  type="text"
                  name="address_name"
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm bg-slate-50/50 focus:bg-white"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">Google Maps URL (optional)</label>
                <input
                  type="url"
                  name="google_maps_link"
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm bg-slate-50/50 focus:bg-white"
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">Owner Contact Number (optional)</label>
                <input
                  type="tel"
                  name="owner_contact_number"
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]/50 outline-none transition-all text-xs md:text-sm bg-slate-50/50 focus:bg-white"
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="flex gap-2.5 pt-2 md:pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-3 md:px-4 py-1.5 md:py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-xs md:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-3 md:px-4 py-1.5 md:py-2 bg-[#EAB308] text-[#0B132B] rounded-lg hover:bg-[#d4a207] font-medium text-xs md:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Save Client'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border-l-4 ${
          toast.type === 'success'
            ? 'bg-white border-green-500 text-green-800'
            : 'bg-white border-red-500 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
