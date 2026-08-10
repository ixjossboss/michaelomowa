export interface Skill {
  id: string;
  category: 'core' | 'technical' | 'soft' | 'business' | 'ai';
  name: string;
  proficiency: number; // 0 to 100
  iconName: string; // Lucide icon identifier
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  skillsAcquired: string[];
  description: string;
  isFeatured: boolean;
  certificateUrl?: string;
}

export interface MetricResult {
  label: string;
  value: string;
  change?: string; // e.g. "+35%"
  description?: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
}

export interface ProjectMilestone {
  id: string;
  phase: 'Research' | 'MVP' | 'Launch' | 'Optimization' | string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  date?: string;
  keyDeliverable?: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Project Management' | 'Business Analysis' | 'AI Industry' | 'Financial Advisory' | string;
  description: string;
  detailedDescription: string;
  
  // Structured Case Study Breakdown
  challenge?: string;
  strategicApproach?: string;
  execution?: string;
  measurableResults?: MetricResult[];
  
  // Visual Progress Path / Milestones
  milestones?: ProjectMilestone[];
  
  clientOutcome?: string;
  testimonial?: CaseStudyTestimonial;
  recommendedVisuals?: string[];
  
  deliverables?: string[];
  link?: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number; // 1-5
  verifiedClient: boolean;
  avatarUrl?: string;
}

export interface Publication {
  id: string;
  title: string;
  type: 'Whitepaper' | 'Article' | 'Research Guide' | 'Case Study';
  publisher: string;
  date: string;
  summary: string;
  link?: string;
  topics: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  badgeIcon: string;
  verified: boolean;
}

export interface ValueMetric {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface Education {
  institution: string;
  degree: string;
  status: string; // e.g. "Undergraduate" or "Completed"
  expectedGraduation: string;
  achievements: string[];
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  linkedinDisplay: string;
  github?: string;
  githubDisplay?: string;
  address?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
  automatedReplySent: boolean;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  avatarUrl: string;
  valueMetrics: ValueMetric[];
  skills: Skill[];
  achievements: Achievement[];
  workExperience?: WorkExperience[];
  projects: Project[];
  testimonials: Testimonial[];
  publications: Publication[];
  certifications: Certification[];
  education: Education;
  contact: ContactInfo;
}

