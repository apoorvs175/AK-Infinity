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
  second_call: boolean;
  third_call: boolean;
  description?: string;
  website: boolean;
  collaboration: boolean;
  first_meeting: boolean;
  final_call: boolean;
  agreement_signed: boolean;
  deal_closed: boolean;
  payment_amount?: number;
  amount_received?: number;
  project_delivered: boolean;
  region: 'Indian' | 'International';
  created_at: string;
  updated_at: string;
  website_url?: string;
  first_call_date?: string;
  second_call_date?: string;
  third_call_date?: string;
  first_meeting_date?: string;
  final_call_date?: string;
  agreement_date?: string;
  deal_closed_date?: string;
  last_description_updated_at?: string;
}

export interface AIAnalysis {
  id: string;
  client_id: string;
  status: 'Not Analyzed' | 'Processing' | 'Completed' | 'Failed';
  error_message?: string;
  business_summary?: string;
  business_intelligence?: {
    business_category?: string;
    industry?: string;
    target_customers?: string;
    business_model?: string;
    key_products_services?: string[];
    unique_selling_proposition?: string;
    business_strengths?: string[];
    business_weaknesses?: string[];
    growth_opportunities?: Array<{
      opportunity?: string;
      ak_infinity_service?: string;
    }>;
  };
  review_intelligence?: {
    sentiment?: string;
    common_positive?: string[];
    common_complaints?: string[];
  };
  online_presence?: {
    overall_rating?: string;
    reasons?: string[];
    social_media?: {
      facebook?: boolean;
      instagram?: boolean;
      linkedin?: boolean;
      youtube?: boolean;
    };
  };
  digital_presence?: any;
  website_status?: any;
  public_online_presence?: any;
  business_strengths?: any;
  improvement_opportunities?: any;
  suggested_services?: any;
  confidence_score?: number;
  raw_data?: any;
  is_latest: boolean;
  created_at: string;
  updated_at: string;
  google_reviews?: {
    average_rating?: number;
    total_reviews?: number;
  };
  website_url?: string;
  google_maps_data?: any;
  analysis_duration?: number;
  ai_model?: string;
  analysis_version?: string;
}

export interface AISalesCoachReport {
  id: string;
  client_id: string;
  ai_analysis_id?: string;
  opening_line?: string;
  conversation_strategy?: any[];
  questions_to_ask?: string[];
  predicted_objections?: any[];
  professional_replies?: any[];
  closing_strategy?: string;
  recommended_services?: any[];
  sales_tips?: string[];
  generated_at: string;
  updated_at: string;
}

export interface CallNote {
  id: string;
  client_id: string;
  short_notes?: string;
  ai_generated_summary?: any;
  call_date: string;
  created_at: string;
  updated_at: string;
}

export interface ClientTimelineEvent {
  id: string;
  client_id: string;
  event_type: string;
  event_title?: string;
  event_description?: string;
  event_date: string;
  created_at: string;
}

export interface FollowUpRecommendation {
  id: string;
  client_id: string;
  recommended_action?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  due_date?: string;
  notes?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIConversation {
  id: string;
  client_id: string;
  title?: string;
  summary?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  client_id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
  model?: string;
  created_at: string;
  updated_at: string;
}

export interface AIContext {
  id: string;
  client_id: string;
  business_snapshot?: any;
  analysis_snapshot?: any;
  call_guide_snapshot?: any;
  last_summary?: string;
  updated_at: string;
}

export interface ClientDescriptionHistory {
  id: string;
  client_id: string;
  description: string;
  created_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  client_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
