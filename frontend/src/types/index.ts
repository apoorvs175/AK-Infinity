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
