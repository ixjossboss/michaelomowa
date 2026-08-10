import React, { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './initialData';
import { PortfolioData, ContactMessage, NewsletterSubscriber, Project } from './types';
import { ResumeDownload } from './components/ResumeDownload';
import { ProjectModal } from './components/ProjectModal';
import { ContactForm } from './components/ContactForm';
import { NewsletterSubscription } from './components/NewsletterSubscription';
import { AdminCMS } from './components/AdminCMS';

// Lucide icon imports
import { 
  Briefcase, TrendingUp, DollarSign, Users, BrainCircuit, 
  MessageSquareText, Award, GraduationCap, Mail, 
  Linkedin, Github, Search, Settings, ArrowRight, ShieldCheck, 
  ChevronRight, Sparkles, Star, Target, Zap, Cpu,
  BookOpen, FileText, Quote, CheckCircle2, Check, BarChart3, Layers, Copy,
  Sun, Moon, Eye, ArrowUp, Menu, X as CloseIcon
} from 'lucide-react';

export default function App() {
  // Load data from localStorage or fallback to initial defaults
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const cached = localStorage.getItem('michael_portfolio_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!parsed.workExperience || parsed.name !== "Michael Omowa") {
          return INITIAL_PORTFOLIO_DATA;
        }
        if (!parsed.avatarUrl || !parsed.avatarUrl.startsWith('data:')) {
          parsed.avatarUrl = INITIAL_PORTFOLIO_DATA.avatarUrl;
        }
        if (parsed.subtitle && parsed.subtitle.includes("University of the People")) {
          parsed.subtitle = "";
        }
        return parsed;
      } catch (e) {
        return INITIAL_PORTFOLIO_DATA;
      }
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const cached = localStorage.getItem('michael_portfolio_messages');
    return cached ? JSON.parse(cached) : [];
  });

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const cached = localStorage.getItem('michael_portfolio_subs');
    return cached ? JSON.parse(cached) : [];
  });

  const [mailchimpEnabled, setMailchimpEnabled] = useState(() => {
    const cached = localStorage.getItem('michael_portfolio_mailchimp');
    return cached ? JSON.parse(cached) === true : false;
  });

  // UI state managers
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('michael_portfolio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    localStorage.setItem('michael_portfolio_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleCopyEmail = (e: React.MouseEvent, emailAddress: string = portfolioData.contact.email) => {
    e.preventDefault();
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => {
      setCopiedEmail(false);
    }, 2500);
  };

  // Sync state to localStorage on update
  useEffect(() => {
    localStorage.setItem('michael_portfolio_data', JSON.stringify(portfolioData));
  }, [portfolioData]);

  useEffect(() => {
    localStorage.setItem('michael_portfolio_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('michael_portfolio_subs', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('michael_portfolio_mailchimp', JSON.stringify(mailchimpEnabled));
  }, [mailchimpEnabled]);

  // Utility resets
  const handleResetDefaults = () => {
    setPortfolioData(INITIAL_PORTFOLIO_DATA);
    setMessages([]);
    setSubscribers([]);
    setMailchimpEnabled(false);
    localStorage.clear();
  };

  // Skill & Metric icons solver
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'DollarSign': return <DollarSign className={className} />;
      case 'Users': return <Users className={className} />;
      case 'MessageSquareText': return <MessageSquareText className={className} />;
      case 'BrainCircuit': return <BrainCircuit className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      default: return <Briefcase className={className} />;
    }
  };

  // Contacts handler
  const handleAddNewMessage = (msg: ContactMessage) => {
    setMessages(prev => [msg, ...prev]);
  };

  const handleAddNewSubscriber = (sub: NewsletterSubscriber) => {
    setSubscribers(prev => {
      if (prev.some(s => s.email.toLowerCase() === sub.email.toLowerCase())) return prev;
      return [sub, ...prev];
    });
  };

  // Filtering systems for search bar and categories
  const categoriesList = ['All', ...Array.from(new Set(portfolioData.projects.map(p => p.category)))];

  const filteredProjects = portfolioData.projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const searchString = `${project.title} ${project.category} ${project.description} ${project.challenge || ''} ${project.strategicApproach || ''} ${project.tags.join(' ')}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSkills = portfolioData.skills.filter(skill => {
    const matchesSearch = `${skill.name} ${skill.category}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredAchievements = portfolioData.achievements.filter(ach => {
    const matchesSearch = `${ach.title} ${ach.organization} ${ach.description} ${ach.skillsAcquired.join(' ')}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col selection:bg-primary/20 selection:text-primary-dark transition-colors duration-300">
      
      {/* Geometric background grid */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/40 dark:from-slate-900/40 via-white dark:via-slate-950 to-transparent pointer-events-none no-print">
        <div className="w-full h-full opacity-6 dark:opacity-10 bg-[linear-gradient(to_right,#1E90FF_1px,transparent_1px),linear-gradient(to_bottom,#1E90FF_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 no-print transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Badge */}
          <a href="#hero" className="flex items-center gap-2">
            <div className="bg-primary hover:bg-primary-dark text-white p-2 rounded-xl transition duration-300 pointer-events-auto">
              <span className="font-mono text-sm tracking-widest font-bold">MO</span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight block leading-none">{portfolioData.name}</span>
              <span className="text-[10px] text-primary dark:text-emerald-400 font-bold block mt-0.5 uppercase tracking-widest">PM • Business Analyst • AI</span>
            </div>
          </a>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-primary dark:hover:text-emerald-400 transition">Overview</a>
            <a href="#case-studies" className="hover:text-primary dark:hover:text-emerald-400 transition">Case Studies</a>
            <a href="#skills" className="hover:text-primary dark:hover:text-emerald-400 transition">Competencies</a>
            <a href="#experience" className="hover:text-primary dark:hover:text-emerald-400 transition">Experience</a>
            <a href="#certifications" className="hover:text-primary dark:hover:text-emerald-400 transition">Certifications</a>
            <a href="#publications" className="hover:text-primary dark:hover:text-emerald-400 transition">Publications</a>
            <a href="#testimonials" className="hover:text-primary dark:hover:text-emerald-400 transition">Endorsements</a>
            <a href="#contact" className="hover:text-primary dark:hover:text-emerald-400 transition">Contact</a>
          </nav>

          {/* Action trigger, Theme Switcher, CMS link & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* GitHub Account Link */}
            <a
              href={portfolioData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center min-h-[40px] min-w-[40px]"
              title="View GitHub Profile (github.com/ixjossboss)"
              aria-label="GitHub Account"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center min-h-[40px] min-w-[40px]"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className={`hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl border transition duration-300 cursor-pointer min-h-[40px] ${
                showAdminPanel 
                  ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-white text-white dark:text-slate-900' 
                  : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
              title="Toggle Live Content Management Panel"
            >
              <Settings className="w-3.5 h-3.5 animate-spin-slow text-primary" />
              <span>{showAdminPanel ? 'Close CMS' : 'CMS'}</span>
            </button>

            <button
              onClick={() => setShowResumeModal(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5 min-h-[40px]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview CV</span>
              <span className="sm:hidden">CV</span>
            </button>

            {/* Mobile Navigation Drawer Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center min-h-[40px] min-w-[40px]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Responsive Mobile Drawer Navigation */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white/98 dark:bg-slate-950/98 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 animate-fade-in shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <a
                href="#hero"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Overview</span>
              </a>
              <a
                href="#case-studies"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Case Studies</span>
              </a>
              <a
                href="#skills"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Competencies</span>
              </a>
              <a
                href="#experience"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Experience</span>
              </a>
              <a
                href="#certifications"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Certifications</span>
              </a>
              <a
                href="#publications"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Publications</span>
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Endorsements</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 border border-slate-200/60 dark:border-slate-800"
              >
                <span>Contact</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:hidden">
              <button
                onClick={() => {
                  setShowAdminPanel(!showAdminPanel);
                  setMobileNavOpen(false);
                }}
                className="w-full text-center text-xs font-bold py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4 text-primary" />
                <span>{showAdminPanel ? 'Close Live CMS' : 'Manage CMS Content'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Primary Page Canvas */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
        
        {/* Dynamic Admin CMS Display */}
        {showAdminPanel && (
          <div className="animate-scale-up border-b border-slate-200 pb-10">
            <AdminCMS
              data={portfolioData}
              onUpdateData={setPortfolioData}
              messages={messages}
              onUpdateMessages={setMessages}
              subscribers={subscribers}
              onUpdateSubscribers={setSubscribers}
              onResetDefaults={handleResetDefaults}
            />
          </div>
        )}

        {/* Home / Hero Section */}
        <section id="hero" className="space-y-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Profile Photo */}
            <div className="md:col-span-4 flex justify-center no-print animate-fade-in-up">
              <div className="relative group">
                {/* Soft ambient aura glow on hover */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/30 via-teal-400/20 to-primary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none" />

                {/* Decorative background cards */}
                <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-3 scale-102 group-hover:rotate-6 group-hover:bg-primary/20 transition-all duration-500 ease-out" />
                <div className="absolute inset-0 bg-slate-900/[0.04] rounded-2xl -rotate-6 scale-98 group-hover:-rotate-8 transition-all duration-500 ease-out" />
                
                {/* Main profile container with interactive ring and soft shadow glow */}
                <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:border-primary/30 ring-0 group-hover:ring-4 group-hover:ring-primary/20 z-10 overflow-hidden max-w-[280px] transition-all duration-500">
                  <img
                    id="hero-profile-image"
                    src={portfolioData.avatarUrl || INITIAL_PORTFOLIO_DATA.avatarUrl}
                    alt={portfolioData.name}
                    className="w-full aspect-square object-cover object-top rounded-xl shadow-sm ring-1 ring-slate-900/5 group-hover:scale-[1.03] transition-transform duration-500 ease-out bg-slate-100 dark:bg-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute bottom-5 right-5 bg-slate-900 dark:bg-slate-950 text-white font-mono text-[9px] font-bold p-1 px-2.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md border border-slate-700">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>Available for Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero details column */}
            <div className="md:col-span-8 space-y-5 text-center md:text-left">
              <div>
                <span className="text-[11px] text-primary dark:text-emerald-400 bg-primary-light dark:bg-emerald-950/60 font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3 border border-primary/20 dark:border-emerald-500/30 glow-badge">
                  Project Management • Business Analysis • AI Strategy
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {portfolioData.name}
                </h1>
                <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 mt-2">
                  {portfolioData.title}
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl bg-slate-50/80 dark:bg-slate-900/80 border-s-4 border-primary px-4 py-3 rounded-r-xl font-normal">
                {portfolioData.subtitle ? `${portfolioData.subtitle}. ` : ''}{portfolioData.bio}
              </p>

              {/* Action Buttons & Social Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="w-full sm:w-auto bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-slate-800 dark:border-emerald-500 glow-btn-primary"
                >
                  <Eye className="w-4 h-4 text-primary dark:text-emerald-300" />
                  <span>Preview & Download Executive CV</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white" />
                </button>
                <a
                  href="#case-studies"
                  className="w-full sm:w-auto bg-primary/10 dark:bg-emerald-500/10 hover:bg-primary/20 dark:hover:bg-emerald-500/20 text-primary dark:text-emerald-400 border border-primary/20 dark:border-emerald-500/30 font-bold text-xs px-5 py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer glow-badge"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Explore Case Studies</span>
                </a>

                {portfolioData.contact.github && (
                  <a
                    href={portfolioData.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-900 dark:hover:bg-slate-800 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl transition flex items-center justify-center cursor-pointer glow-badge"
                    title="View GitHub Repositories"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {portfolioData.contact.linkedin && (
                  <a
                    href={portfolioData.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl transition flex items-center justify-center cursor-pointer glow-badge"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Prominent Value Metrics Bar */}
          {portfolioData.valueMetrics && portfolioData.valueMetrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {portfolioData.valueMetrics.map((metric) => (
                <div 
                  key={metric.id}
                  className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl transition duration-300 group shadow-2xs glow-hover-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary dark:group-hover:text-emerald-400 transition">
                      {metric.value}
                    </span>
                    <div className="p-2 bg-primary-light/80 dark:bg-emerald-950/80 rounded-xl text-primary dark:text-emerald-400 group-hover:bg-primary dark:group-hover:bg-emerald-500 group-hover:text-white transition">
                      {renderIcon(metric.iconName, "w-4 h-4")}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{metric.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{metric.sublabel}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Global Filter & Search Bar Section */}
        <section id="search-filter" className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl no-print">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search query field */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies, methodologies, tools..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
              />
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest me-1.5 shrink-0 hidden sm:inline">Domain:</span>
              {categoriesList.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold select-none cursor-pointer transition shrink-0 whitespace-nowrap min-h-[38px] ${
                    activeCategory === category 
                      ? 'bg-primary text-white font-bold shadow-xs' 
                      : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

          {searchQuery && (
            <div className="mt-3 text-[11px] text-slate-400 font-medium italic">
              Showing search results matching: "{searchQuery}"
            </div>
          )}
        </section>

        {/* Structured Case Studies Section */}
        <section id="case-studies" className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Structured Case Studies</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Detailed breakdown of Challenge, Strategic Approach, Execution & Measurable Results</p>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-bold bg-slate-100 px-2.5 py-0.5 rounded-full select-none">{filteredProjects.length} case studies</span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              No case studies found fitting current search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-primary transition duration-300 group hover:shadow-xl cursor-pointer flex flex-col justify-between glow-hover-card"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] bg-primary text-white font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="text-[9px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-base sm:text-lg tracking-tight leading-snug group-hover:text-primary-light transition">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Brief */}
                    <div className="p-5 space-y-4">
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Micro Case Study Preview */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-rose-50/70 border border-rose-100 p-2.5 rounded-xl">
                          <div className="text-[10px] uppercase font-bold text-rose-700 mb-0.5 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Challenge
                          </div>
                          <p className="text-slate-700 text-[10px] line-clamp-2">{project.challenge || "Operational delay & workflow complexity"}</p>
                        </div>

                        <div className="bg-sky-50/70 border border-sky-100 p-2.5 rounded-xl">
                          <div className="text-[10px] uppercase font-bold text-sky-700 mb-0.5 flex items-center gap-1">
                            <BrainCircuit className="w-3 h-3" />
                            Approach
                          </div>
                          <p className="text-slate-700 text-[10px] line-clamp-2">{project.strategicApproach || "Agile BPMN process redesign & AI integration"}</p>
                        </div>
                      </div>

                      {/* Measurable Results Badges */}
                      {project.measurableResults && project.measurableResults.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Key Measurable Outcomes</div>
                          <div className="flex flex-wrap gap-2">
                            {project.measurableResults.map((m, idx) => (
                              <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 glow-badge">
                                <span>{m.label}:</span>
                                <span className="text-emerald-900">{m.value}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary group-hover:bg-primary-light/40 transition">
                    <span>View Full Case Study & Visual Artifacts</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills & Competencies Grid */}
        <section id="skills" className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Core Competencies & Tooling</h2>
              <p className="text-xs text-slate-500 mt-0.5">Project management methodologies, business analysis frameworks, and AI tools</p>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-bold bg-slate-100 px-2.5 py-0.5 rounded-full select-none">{filteredSkills.length} listed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredSkills.map((skill) => (
              <div 
                key={skill.id} 
                className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-primary transition duration-300 flex flex-col justify-between h-36 hover:shadow-md group glow-hover-card"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-primary-light transition duration-300">
                    {renderIcon(skill.iconName, "w-4 h-4 text-primary")}
                  </div>
                  <span className="font-mono text-xs font-bold text-primary">{skill.proficiency}%</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-primary transition">{skill.name}</h3>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience Timeline */}
        {portfolioData.workExperience && portfolioData.workExperience.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Professional Experience</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Track record in digital operations, social media management, and web development leadership</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.workExperience.map((exp) => (
                <div key={exp.id} className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-2xs hover:border-primary transition duration-300 space-y-4 flex flex-col justify-between glow-hover-card">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{exp.role}</h3>
                        <div className="text-xs font-bold text-primary mt-0.5">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Credibility Signals */}
        {portfolioData.certifications && portfolioData.certifications.length > 0 && (
          <section id="certifications" className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Certifications & Credentials</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Formal qualifications in Project Management, Business Intelligence, and AI Strategy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {portfolioData.certifications.map((cert) => (
                <div key={cert.id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 hover:border-primary transition shadow-2xs flex flex-col justify-between glow-hover-card">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-primary-light rounded-xl text-primary">
                        {renderIcon(cert.badgeIcon, "w-5 h-5")}
                      </div>
                      {cert.verified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{cert.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{cert.issuer}</p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 font-bold border-t border-slate-100 pt-2">
                    Issued / Status: {cert.issueDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications & Thought Leadership */}
        {portfolioData.publications && portfolioData.publications.length > 0 && (
          <section id="publications" className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Publications & Thought Leadership</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Research whitepapers and industry guides on AI governance and team dynamics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioData.publications.map((pub) => (
                <div key={pub.id} className="bg-slate-50/80 border border-slate-200 p-5 rounded-2xl space-y-3 hover:bg-white hover:border-primary transition shadow-2xs flex flex-col justify-between glow-hover-card">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">{pub.type}</span>
                      <span className="text-slate-400">{pub.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{pub.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{pub.publisher}</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{pub.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap gap-1">
                    {pub.topics.map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Client & Stakeholder Testimonials */}
        {portfolioData.testimonials && portfolioData.testimonials.length > 0 && (
          <section id="testimonials" className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Quote className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Endorsements & Testimonials</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Verifiable recommendations from project sponsors, directors, and academic leaders</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioData.testimonials.map((test) => (
                <div key={test.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between relative glow-hover-card">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">"{test.quote}"</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center">
                      {test.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{test.author}</span>
                        {test.verifiedClient && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{test.role} • {test.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        <section id="achievements" className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Key Honors & Project Milestones</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recognition for leadership, team dynamics, and strategic consulting</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredAchievements.map((ach) => (
              <div 
                key={ach.id} 
                className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 flex flex-col justify-between glow-hover-card"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-primary">
                    <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                      <Award className="w-4 h-4" />
                      {ach.organization}
                    </span>
                    <span className="text-slate-400 text-[10px]">{ach.date}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
                    {ach.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {ach.skillsAcquired.map((skill, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          <div className="md:col-span-4 bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-center md:text-left min-h-[220px] glow-hover-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-2">
              <GraduationCap className="w-8 h-8 text-primary mx-auto md:mx-0 animate-pulse" />
              <h3 className="font-bold text-base leading-tight">Academic Studies</h3>
              <p className="text-[10px] text-slate-400 leading-normal uppercase tracking-wider font-bold">Business Administration & Strategy</p>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Concentration in Strategic Management, Organizational Behavior, and AI-driven business process optimization.
            </p>
          </div>

          <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs glow-hover-card">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[10px] text-primary bg-primary-light font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{portfolioData.education.status}</span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">{portfolioData.education.degree}</h4>
              <p className="text-slate-500 text-xs font-semibold">{portfolioData.education.institution} • Expected Graduation: {portfolioData.education.expectedGraduation}</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Strategic Concentrations & Coursework
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                {portfolioData.education.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </section>

        {/* Contact and Newsletter Block */}
        <section id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-6">
            <ContactForm onNewMessage={handleAddNewMessage} />
          </div>

          <div className="space-y-6 flex flex-col justify-between h-full">

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Direct Professional Channels</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Connecting with executive recruiters, business leaders, and AI product teams. Reach out directly:
              </p>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={(e) => handleCopyEmail(e, portfolioData.contact.email)} 
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-primary/20 p-3 rounded-xl transition cursor-pointer text-xs group text-left"
                  title="Click to copy email address"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-light text-primary group-hover:bg-primary group-hover:text-white p-2 rounded-lg transition duration-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest mb-0.5">Primary Inbox</span>
                      <span className="text-slate-800 font-semibold">{portfolioData.contact.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-500 group-hover:text-primary group-hover:border-primary/30 transition">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{copiedEmail ? 'Copied!' : 'Copy'}</span>
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <a 
                  href={portfolioData.contact.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-primary/20 p-3 rounded-xl transition cursor-pointer text-xs group"
                >
                  <div className="bg-primary-light text-primary group-hover:bg-primary group-hover:text-white p-2 rounded-lg transition duration-300">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest mb-0.5">LinkedIn Profile</span>
                    <span className="text-slate-800 font-semibold">{portfolioData.contact.linkedinDisplay}</span>
                  </div>
                </a>

                {portfolioData.contact.github && (
                  <a 
                    href={portfolioData.contact.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-primary/20 p-3 rounded-xl transition cursor-pointer text-xs group"
                  >
                    <div className="bg-primary-light text-primary group-hover:bg-primary group-hover:text-white p-2 rounded-lg transition duration-300">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest mb-0.5">GitHub Profile & Repos</span>
                      <span className="text-slate-800 font-semibold">{portfolioData.contact.githubDisplay || 'github.com/ixjossboss'}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-auto">
              <NewsletterSubscription
                onSubscribe={handleAddNewSubscriber}
                mailchimpEnabled={mailchimpEnabled}
                onToggleMailchimp={() => setMailchimpEnabled(!mailchimpEnabled)}
              />
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-[11px] text-slate-400">
            <span className="text-slate-500 inline-flex items-center gap-1.5">
              Contact: 
              <button 
                onClick={(e) => handleCopyEmail(e, portfolioData.contact.email || "omowamichaela@gmail.com")} 
                className="hover:text-white text-slate-300 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                title="Click to copy email address"
              >
                <span>{portfolioData.contact.email || "omowamichaela@gmail.com"}</span>
                <Copy className="w-3 h-3 text-slate-400 hover:text-primary transition-colors" />
              </button>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <button
              onClick={() => setShowResumeModal(true)}
              className="text-primary hover:text-primary-light font-bold cursor-pointer transition hover:underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Executive CV</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Michael Omowa. All Rights Reserved.</span>
        </div>
      </footer>

      {/* Dynamic Popups & Modals */}
      <ResumeDownload
        data={portfolioData}
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Scroll to Top Floating Action Button with Faded Black Background */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 bg-black/80 hover:bg-black/95 text-white p-3.5 rounded-full shadow-2xl border border-white/15 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer animate-fade-in no-print flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform duration-200" />
        </button>
      )}

      {/* Floating Copied Toast Notification */}
      {copiedEmail && (
        <div className={`fixed ${showScrollTop ? 'bottom-20' : 'bottom-6'} right-6 z-50 bg-slate-900/95 text-white border border-slate-700 shadow-2xl px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in-up no-print backdrop-blur-md`}>
          <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-full flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs">Copied to clipboard!</span>
            <span className="text-[10px] text-slate-400 font-mono">{portfolioData.contact.email}</span>
          </div>
        </div>
      )}

    </div>
  );
}

