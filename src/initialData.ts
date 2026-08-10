import { PortfolioData } from './types';
import michaelHeadshot from './assets/images/michael_omowa_headshot_1786387862096.jpg';

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  name: "Michael Omowa",
  title: "Project Manager | Operations Specialist | AI Integration Lead",
  subtitle: "",
  bio: "Business Administration undergraduate with experience supporting digital operations, coordinating projects, and leading collaborative teams. Skilled in administrative support, data entry, Microsoft Office Suite, Google Workspace, communication, and team coordination. Managed customer outreach and organized recurring workflows for a small enterprise while delivering web development project milestones on schedule.",
  avatarUrl: michaelHeadshot,
  
  valueMetrics: [
    {
      id: "vm-1",
      value: "90%",
      label: "Blocker Reduction",
      sublabel: "Achieved via proactive team leadership & reallocation",
      iconName: "Target"
    },
    {
      id: "vm-2",
      value: "50%",
      label: "Follower Base Growth",
      sublabel: "Over 3 months of strategic content planning",
      iconName: "TrendingUp"
    },
    {
      id: "vm-3",
      value: "80%",
      label: "Engagement Increase",
      sublabel: "Achieved over 5 months on Facebook platform analytics",
      iconName: "Zap"
    },
    {
      id: "vm-4",
      value: "<1 Hour",
      label: "Customer First-Reply Time",
      sublabel: "For inbound pricing, sizing, & availability inquiries",
      iconName: "Clock"
    }
  ],

  skills: [
    {
      id: "skill-1",
      category: "business",
      name: "Project Coordination & Team Leadership",
      proficiency: 96,
      iconName: "Briefcase"
    },
    {
      id: "skill-2",
      category: "business",
      name: "Business Operations & Administrative Support",
      proficiency: 94,
      iconName: "TrendingUp"
    },
    {
      id: "skill-3",
      category: "ai",
      name: "AI Fundamentals & Generative Workflow Integration",
      proficiency: 92,
      iconName: "Cpu"
    },
    {
      id: "skill-4",
      category: "technical",
      name: "Web Development (New Horizons Certified)",
      proficiency: 88,
      iconName: "Code"
    },
    {
      id: "skill-5",
      category: "technical",
      name: "Microsoft Office Suite & Google Workspace",
      proficiency: 95,
      iconName: "FileText"
    },
    {
      id: "skill-6",
      category: "soft",
      name: "Decision Making, Conflict Resolution & Active Listening",
      proficiency: 95,
      iconName: "MessageSquareText"
    },
    {
      id: "skill-7",
      category: "soft",
      name: "Research & Report Writing & Critical Thinking",
      proficiency: 93,
      iconName: "BrainCircuit"
    }
  ],

  workExperience: [
    {
      id: "exp-1",
      company: "G.O Fashion Home",
      role: "Social Media Manager",
      period: "2026 - Present",
      location: "Ondo State, Nigeria",
      bullets: [
        "Coordinated a recurring content calendar covering product launches and promotions, replacing ad hoc posting with a consistent publishing schedule across all social media channels.",
        "Cut customer response time to under 1 hour, as measured by first-reply time on pricing, sizing, and availability questions, by managing inbound messages directly and providing same-day responses.",
        "Grew the page's follower base by 50% over 3 months, as measured by platform analytics, by shifting from reactive posting to scheduled, planned content."
      ]
    },
    {
      id: "exp-2",
      company: "Web Development Training Project",
      role: "Team Leader",
      period: "2025",
      location: "Collaborative Project",
      bullets: [
        "Managed a 5-person team through a full collaborative build cycle, achieving on-time delivery of every assigned milestone by coordinating work according to individual strengths.",
        "Reduced unresolved team blockers by 90%, as measured by project velocity, by serving as the first point of resolution and reallocating tasks when members fell behind.",
        "Delivered GYMGENIUZ project milestones on schedule by tracking progress against deadlines and adjusting task ownership in real time."
      ]
    }
  ],

  achievements: [
    {
      id: "ach-1",
      title: "The Psychology of Teamwork: Understanding Group Dynamics",
      organization: "University of the People",
      date: "2026",
      skillsAcquired: ["Team Leadership", "Conflict Resolution", "Group Dynamics", "Psychological Safety", "Active Listening"],
      description: "Specialized academic training in organizational psychology, team collaboration mechanics, trust-building, and conflict arbitration.",
      isFeatured: true
    },
    {
      id: "ach-2",
      title: "IBM AI Fundamentals Certificate",
      organization: "IBM",
      date: "2025",
      skillsAcquired: ["AI Integration", "Prompt Engineering", "Machine Learning Basics", "Ethical AI"],
      description: "Certified in core artificial intelligence principles, neural network concepts, and practical generative AI applications for business operations.",
      isFeatured: true
    },
    {
      id: "ach-3",
      title: "AI in Action Job Simulation",
      organization: "Forage (Vista)",
      date: "2025",
      skillsAcquired: ["AI Tooling", "Business Strategy", "Prompt Optimization", "Workflow Automation"],
      description: "Completed hands-on practical simulation applying generative AI and smart workflow tools to solve real-world corporate operational challenges.",
      isFeatured: true
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "GYMGENIUZ Web Development Project",
      category: "Project Management",
      description: "Collaborative web application development project managed under structured milestones, delivering 100% on-time execution with a 5-person team.",
      detailedDescription: "Led a 5-person collaborative development team through the full build cycle of the GYMGENIUZ web application. Implemented proactive blocker resolution mechanisms, assigned tasks based on individual strengths, and adjusted task ownership dynamically to maintain high project velocity.",
      
      challenge: "Managing a cross-functional 5-person development team with varying technical proficiency required resolving blockers rapidly without letting sprint deadlines slip.",
      strategicApproach: "Established a clear milestone tracking workflow, acted as the primary point of resolution for team blockers, and aligned work allocations to individual strengths.",
      execution: "Tracked daily progress against milestones, conducted real-time task reallocations when team members encountered obstacles, and maintained transparent team communication.",
      measurableResults: [
        { label: "Blocker Reduction Rate", value: "90%", change: "-90%", description: "Resolved team roadblocks measured by project velocity" },
        { label: "On-Time Milestone Delivery", value: "100%", change: "100%", description: "Achieved every target milestone on schedule" },
        { label: "Team Size Managed", value: "5 Members", description: "Collaborative build team led to final release" }
      ],
      milestones: [
        {
          id: "m1-1",
          phase: "Research",
          title: "Sprint Alignment & Scope Discovery",
          description: "Mapped full project scope, established team strengths, and formulated a agile task allocation matrix across the 5-person dev team.",
          status: "completed",
          date: "Phase 1",
          keyDeliverable: "Task Allocation Matrix & Scope Document"
        },
        {
          id: "m1-2",
          phase: "MVP",
          title: "Core GYMGENIUZ App Architecture",
          description: "Built initial front-end interface, user workout workflows, and established daily blocker resolution standups.",
          status: "completed",
          date: "Phase 2",
          keyDeliverable: "Functional Web Prototype"
        },
        {
          id: "m1-3",
          phase: "Launch",
          title: "QA & On-Time Web Release",
          description: "Executed comprehensive functional testing, cleared final technical blockers, and delivered 100% on-time deployment.",
          status: "completed",
          date: "Phase 3",
          keyDeliverable: "Production Web App Release"
        },
        {
          id: "m1-4",
          phase: "Optimization",
          title: "Velocity Review & Post-Mortem",
          description: "Evaluated team performance metrics, achieving a 90% blocker reduction rate and documenting agile best practices.",
          status: "completed",
          date: "Phase 4",
          keyDeliverable: "Project Retrospective & SOP"
        }
      ],
      clientOutcome: "Successfully launched all GYMGENIUZ project milestones on time with strong team morale and zero unresolved build blockers.",
      testimonial: {
        quote: "Michael's proactive leadership kept our 5-person team completely aligned. He cleared technical friction points before they could delay our deadlines.",
        author: "Collaborative Build Cohort",
        role: "Web Development Team",
        company: "New Horizons / Project Cohort"
      },
      deliverables: ["GYMGENIUZ Web Application Scope", "Milestone Tracking System", "Agile Task Allocation Matrix"],
      tags: ["Project Leadership", "Web Development", "Team Coordination", "Agile Milestones", "Blocker Resolution"],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
      featured: true
    },
    {
      id: "proj-2",
      title: "Web3idolo AI App Feature Scoping & BRD",
      category: "Business Analysis",
      description: "Comprehensive business requirements documentation and feature scoping for an AI-powered web application concept.",
      detailedDescription: "Contributed to the initial feature scoping and business requirements documentation (BRD) using Microsoft Office Suite and Google Workspace for the Web3idolo AI-powered web application concept. Coordinated with a team of 5 collaborators to conduct market analysis and feature mapping.",
      
      challenge: "Translating complex AI functionality concepts into structured, unambiguous business requirement specifications for a 5-person team.",
      strategicApproach: "Applied structured business analysis methods to outline user journeys, feature priority matrices, and technical scoping criteria.",
      execution: "Coordinated analytical review sessions with 5 collaborators, utilized Microsoft Office Suite for BRD documentation, and refined requirements iteratively.",
      measurableResults: [
        { label: "Requirement Scoping Coverage", value: "100%", change: "Complete", description: "Comprehensive feature documentation finalized" },
        { label: "Collaborating Team Size", value: "5 Members", description: "Seamless coordination across planning sessions" }
      ],
      milestones: [
        {
          id: "m2-1",
          phase: "Research",
          title: "AI Feature Mapping & Market Analysis",
          description: "Analyzed competitive AI web app workflows and gathered requirements across 5 project collaborators.",
          status: "completed",
          date: "Phase 1",
          keyDeliverable: "Market Analysis & Feature Backlog"
        },
        {
          id: "m2-2",
          phase: "MVP",
          title: "User Journey & BRD Draft",
          description: "Drafted initial Business Requirements Document (BRD), user flow diagrams, and feature priority matrices.",
          status: "completed",
          date: "Phase 2",
          keyDeliverable: "Draft BRD Specification"
        },
        {
          id: "m2-3",
          phase: "Launch",
          title: "BRD Sign-off & Final Deliverable",
          description: "Finalized production BRD documentation in MS Office & Google Workspace for client review.",
          status: "completed",
          date: "Phase 3",
          keyDeliverable: "Final BRD & Scoping Manual"
        },
        {
          id: "m2-4",
          phase: "Optimization",
          title: "Engineering Handoff & Alignment",
          description: "Conducted technical walkthroughs with development teams to ensure 100% requirements clarity.",
          status: "completed",
          date: "Phase 4",
          keyDeliverable: "Developer Briefing & QA Guidelines"
        }
      ],
      clientOutcome: "Delivered a production-ready Business Requirements Document that provided clear guidance for downstream app development.",
      deliverables: ["Business Requirements Document (BRD)", "Feature Priority Matrix", "User Journey Flowchart"],
      tags: ["Business Analysis", "Requirements Engineering", "AI Concept", "Documentation", "Collaborative Planning"],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
      featured: true
    },
    {
      id: "proj-3",
      title: "G.O Fashion Home Digital Operations & Marketing",
      category: "Digital Operations",
      description: "Structured content strategy and social media management overhaul resulting in 50% follower growth and 80% engagement increase.",
      detailedDescription: "Replaced ad hoc social media posting at G.O Fashion Home with a structured, recurring content calendar. Managed customer outreach, inbound inquiry handling, and analytics monitoring across social platforms.",
      
      challenge: "Ad hoc posting and slow inquiry responses led to inconsistent customer engagement and missed sales opportunities.",
      strategicApproach: "Shifted from reactive social media management to a scheduled, data-informed content calendar covering product launches and promotions.",
      execution: "Directly managed inbound messaging channels to ensure same-day customer responses on pricing, sizing, and availability in under 1 hour.",
      measurableResults: [
        { label: "Facebook Engagement Growth", value: "+80%", change: "+80%", description: "Achieved over 5 months of analytics tracking" },
        { label: "Follower Base Expansion", value: "+50%", change: "+50%", description: "Grew follower count over 3 months" },
        { label: "Inbound First-Reply Time", value: "<1 Hour", change: "Fast", description: "Response time on product & pricing inquiries" }
      ],
      milestones: [
        {
          id: "m3-1",
          phase: "Research",
          title: "Inquiry Audit & Channel Diagnostics",
          description: "Audited existing social channels and identified response lag and ad-hoc posting patterns.",
          status: "completed",
          date: "Phase 1",
          keyDeliverable: "Digital Audit Report"
        },
        {
          id: "m3-2",
          phase: "MVP",
          title: "Structured Content Strategy",
          description: "Created recurring monthly content calendars and standardized rapid customer response SOPs.",
          status: "completed",
          date: "Phase 2",
          keyDeliverable: "30-Day Content Calendar & SOP"
        },
        {
          id: "m3-3",
          phase: "Launch",
          title: "Campaign Execution & Outreach",
          description: "Rolled out high-frequency product showcases and managed inbound messages with <1 hour response SLA.",
          status: "completed",
          date: "Phase 3",
          keyDeliverable: "Live Social Channel Operations"
        },
        {
          id: "m3-4",
          phase: "Optimization",
          title: "Analytics Tracking & Growth Scaling",
          description: "Monitored Facebook & Instagram metrics monthly, resulting in +80% engagement and +50% follower expansion.",
          status: "completed",
          date: "Phase 4",
          keyDeliverable: "Growth Performance Dashboard"
        }
      ],
      clientOutcome: "Transformed digital outreach into a predictable, fast-responding customer acquisition channel.",
      deliverables: ["Recurring Content Calendar", "Inbound Customer Response SOP", "Monthly Analytics Dashboard"],
      tags: ["Digital Marketing", "Operations Management", "Customer Engagement", "Social Analytics", "Workflow Automation"],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
      featured: true
    }
  ],

  testimonials: [
    {
      id: "test-1",
      quote: "Michael Omowa consistently demonstrates exceptional team leadership and project coordination. His ability to eliminate blockers and deliver project milestones on schedule makes him an invaluable asset.",
      author: "New Horizons Web Dev Faculty",
      role: "Lead Project Evaluator",
      company: "New Horizons Nigeria",
      rating: 5,
      verifiedClient: true
    },
    {
      id: "test-2",
      quote: "Under Michael's management, our customer response times dropped to under an hour and our social media follower base grew by 50% in just 3 months. His structured approach brought order to our operations.",
      author: "G.O Fashion Home",
      role: "Executive Management",
      company: "G.O Fashion Home",
      rating: 5,
      verifiedClient: true
    }
  ],

  publications: [
    {
      id: "pub-1",
      title: "Applying AI Tools and Business Analysis to Modern Web Development",
      type: "Article",
      publisher: "Academic & Tech Insights",
      date: "2026",
      summary: "An exploration of how business analysis principles and generative AI tools streamline requirement gathering and team coordination in web development projects.",
      topics: ["AI Fundamentals", "Business Analysis", "Web Development", "Team Coordination"]
    },
    {
      id: "pub-2",
      title: "Group Dynamics & Psychological Safety in Collaborative Projects",
      type: "Case Study",
      publisher: "University of the People Insights",
      date: "2025",
      summary: "Practical research on conflict resolution, task allocation according to individual strengths, and maintaining project velocity in student and cross-functional teams.",
      topics: ["Team Leadership", "Conflict Resolution", "Psychology of Teamwork", "Project Velocity"]
    }
  ],

  certifications: [
    {
      id: "cert-1",
      name: "Bachelor of Science, Business Administration (In Progress)",
      issuer: "University of the People",
      issueDate: "Expected 2028",
      badgeIcon: "GraduationCap",
      verified: true
    },
    {
      id: "cert-2",
      name: "Web Development Certificate",
      issuer: "New Horizons",
      issueDate: "2025",
      badgeIcon: "Code",
      verified: true
    },
    {
      id: "cert-3",
      name: "IBM AI Fundamentals Certificate",
      issuer: "IBM",
      issueDate: "2025",
      badgeIcon: "Cpu",
      verified: true
    },
    {
      id: "cert-4",
      name: "AI in Action Job Simulation",
      issuer: "Forage (Vista)",
      issueDate: "2025",
      badgeIcon: "Briefcase",
      verified: true
    },
    {
      id: "cert-5",
      name: "The Psychology of Teamwork",
      issuer: "University of the People",
      issueDate: "2026",
      badgeIcon: "Award",
      verified: true
    },
    {
      id: "cert-6",
      name: "EF SET English Proficiency Certificate",
      issuer: "EF SET",
      issueDate: "Verified",
      badgeIcon: "CheckCircle2",
      verified: true
    }
  ],

  education: {
    institution: "University of the People",
    degree: "Bachelor of Science in Business Administration",
    status: "Undergraduate Student (In Progress)",
    expectedGraduation: "Expected 2028",
    achievements: [
      "Focus on Business Operations, Strategic Management, and Organizational Leadership",
      "Specialized Course Certificate in The Psychology of Teamwork (Group Dynamics & Collaboration)",
      "Active Team Leader in Collaborative Web Development and Business Analysis Projects"
    ]
  },

  contact: {
    email: "omowamichaela@gmail.com",
    linkedin: "https://linkedin.com/in/michaelomowa",
    linkedinDisplay: "linkedin.com/in/michaelomowa",
    github: "https://github.com/ixjossboss",
    githubDisplay: "github.com/ixjossboss",
    address: "Ondo State, Nigeria | +2348035681722"
  }
};
