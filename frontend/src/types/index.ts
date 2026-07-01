export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  page_visited?: string;
  referrer?: string;
  time_spent?: number;
  session_id?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  full_address?: string;
  locality?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  location_permission?: string;
  google_maps_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  deliverables: string[];
  price: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  link?: string;
  highlights: string[];
}

export interface Client {
  id: string;
  business_name: string;
  owner_name: string;
  address_name: string;
  google_maps_link?: string;
  owner_contact_number?: string;
  first_call: boolean;
  first_meeting: boolean;
  agreement_signed: boolean;
  payment_amount?: number;
  amount_received?: number;
  project_delivered: boolean;
  created_at: string;
  updated_at: string;
}
