// Project type
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'web' | 'mobile' | 'ui' | '3d';
  technologies: string[];
  demoUrl: string;
  codeUrl: string;
}

// Skill type
export interface Skill {
  name: string;
  percentage: number;
}

// Timeline item type
export interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
}

// Social link type
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Contact form fields
export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Marketplace item type
export interface MarketplaceItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'service' | 'template' | 'plugin' | 'ebook' | 'course';
  price: number;
  discountPrice?: number;
  features: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  link: string;
}

// Theme type
export type Theme = 'dark' | 'light';

// Project filter type
export type ProjectFilter = 'all' | 'web' | 'mobile' | 'ui' | '3d';

// Marketplace filter type
export type MarketplaceFilter = 'all' | 'service' | 'template' | 'plugin' | 'ebook' | 'course';
