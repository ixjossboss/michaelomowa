import React from 'react';
import { Project, ProjectMilestone } from '../types';
import { 
  X, ExternalLink, ShieldCheck, Cpu, Target, BrainCircuit, Zap, BarChart3, 
  Quote, Image as ImageIcon, Sparkles, CheckCircle2, Search, Rocket, 
  TrendingUp, Layers, Clock, ArrowRight, FileCheck, GitCommit
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  // Derive or fallback milestones ensuring Research, MVP, Launch, Optimization are always present
  const milestones: ProjectMilestone[] = (project.milestones && project.milestones.length > 0)
    ? project.milestones
    : [
        {
          id: `${project.id}-m1`,
          phase: 'Research',
          title: 'Problem Discovery & Analysis',
          description: project.challenge || 'Conducting stakeholder interviews, gathering core requirements, and mapping initial operational constraints.',
          status: 'completed',
          date: 'Phase 1',
          keyDeliverable: 'Requirements Specification & Roadmap'
        },
        {
          id: `${project.id}-m2`,
          phase: 'MVP',
          title: 'MVP Architecture & Prototype',
          description: project.strategicApproach || 'Developing core features, wireframes, and establishing sprint workflows.',
          status: 'completed',
          date: 'Phase 2',
          keyDeliverable: 'Functional Prototype'
        },
        {
          id: `${project.id}-m3`,
          phase: 'Launch',
          title: 'QA Testing & Official Rollout',
          description: project.execution || 'Executing user acceptance testing, fixing deployment blockers, and going live.',
          status: 'completed',
          date: 'Phase 3',
          keyDeliverable: 'Production Release & SOPs'
        },
        {
          id: `${project.id}-m4`,
          phase: 'Optimization',
          title: 'Analytics & Continuous Scaling',
          description: 'Monitoring post-launch engagement, gathering user feedback, and refining performance metrics.',
          status: 'completed',
          date: 'Phase 4',
          keyDeliverable: 'Growth Metrics & Maintenance Plan'
        }
      ];

  const getPhaseIcon = (phase: string) => {
    const lower = phase.toLowerCase();
    if (lower.includes('research') || lower.includes('discovery')) return <Search className="w-4 h-4" />;
    if (lower.includes('mvp') || lower.includes('prototype') || lower.includes('build')) return <Layers className="w-4 h-4" />;
    if (lower.includes('launch') || lower.includes('rollout') || lower.includes('release')) return <Rocket className="w-4 h-4" />;
    if (lower.includes('optimization') || lower.includes('scaling') || lower.includes('growth')) return <TrendingUp className="w-4 h-4" />;
    return <GitCommit className="w-4 h-4" />;
  };

  const getPhaseColorClasses = (phase: string) => {
    const lower = phase.toLowerCase();
    if (lower.includes('research')) {
      return {
        badge: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        node: 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/50',
        bar: 'from-indigo-500 to-purple-500'
      };
    }
    if (lower.includes('mvp')) {
      return {
        badge: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        node: 'bg-purple-600 text-white ring-4 ring-purple-100 dark:ring-purple-900/50',
        bar: 'from-purple-500 to-emerald-500'
      };
    }
    if (lower.includes('launch')) {
      return {
        badge: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        node: 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/50',
        bar: 'from-emerald-500 to-amber-500'
      };
    }
    return {
      badge: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      node: 'bg-amber-600 text-white ring-4 ring-amber-100 dark:ring-amber-900/50',
      bar: 'from-amber-500 to-emerald-500'
    };
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in no-print">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner/Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-950 flex-shrink-0">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover opacity-75 hover:scale-105 transition duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-5 sm:p-6">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-primary font-bold bg-primary-light/95 uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block shadow-xs">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-[10px] bg-amber-500/90 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured Case Study
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">{project.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full p-2 transition-all cursor-pointer hover:rotate-90 duration-300"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-7 divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* Executive Overview */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-400 mb-2">Executive Overview</h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-normal">
              {project.detailedDescription || project.description}
            </p>
          </div>

          {/* Structured Case Study Breakdown Grid */}
          <div className="pt-6 space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Comprehensive Case Study Architecture
            </h3>

            {/* 1. Challenge & Strategic Approach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Challenge */}
              <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4 text-rose-600" />
                  1. The Business Challenge
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {project.challenge || "High operational friction, unpredictable delivery timelines, and unmapped stakeholder requirements."}
                </p>
              </div>

              {/* Strategic Approach */}
              <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider">
                  <BrainCircuit className="w-4 h-4 text-sky-600" />
                  2. Strategic Approach
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {project.strategicApproach || "Agile process mapping, stakeholder workshops, and integration of predictive analytical tools."}
                </p>
              </div>
            </div>

            {/* 2. Execution */}
            {project.execution && (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-primary" />
                  3. Execution & Implementation Strategy
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {project.execution}
                </p>
              </div>
            )}

            {/* Visual Progress Path & Milestone Roadmap */}
            <div className="bg-slate-900/5 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-primary" />
                    <span>Project Milestone & Progress Path</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Sequential execution roadmap from initial discovery through MVP rollout & optimization
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{milestones.filter(m => m.status === 'completed').length}/{milestones.length} Phases Completed</span>
                </span>
              </div>

              {/* Progress Track Nodes (Horizontal Process Line for desktop) */}
              <div className="hidden md:grid grid-cols-4 gap-2 relative">
                {/* Connector Bar Background */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                
                {milestones.map((m, idx) => {
                  const colors = getPhaseColorClasses(m.phase);
                  return (
                    <div key={m.id || idx} className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform hover:scale-110 cursor-default ${colors.node}`}>
                        {getPhaseIcon(m.phase)}
                      </div>
                      <span className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${colors.badge}`}>
                        {m.phase}
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                        {m.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Milestone Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {milestones.map((m, idx) => {
                  const colors = getPhaseColorClasses(m.phase);
                  return (
                    <div 
                      key={m.id || idx} 
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl space-y-2 shadow-xs hover:shadow-md transition duration-200 group relative overflow-hidden"
                    >
                      {/* Accent Left Border */}
                      <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b ${colors.bar}`} />

                      <div className="flex items-center justify-between gap-2 pl-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase border flex items-center gap-1 ${colors.badge}`}>
                          {getPhaseIcon(m.phase)}
                          <span>{m.phase}</span>
                        </span>

                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {m.date || `Phase ${idx + 1}`}
                        </span>
                      </div>

                      <div className="pl-1">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                          <span>{m.title}</span>
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      {m.keyDeliverable && (
                        <div className="pl-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          <FileCheck className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="truncate"><strong>Deliverable:</strong> {m.keyDeliverable}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Measurable Results & Key Metrics */}
            {project.measurableResults && project.measurableResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  4. Measurable Results & Impact Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.measurableResults.map((m, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-100 p-3.5 rounded-xl text-center flex flex-col justify-between">
                      <div className="text-2xl font-black text-emerald-700 tracking-tight">{m.value}</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 mt-1">{m.label}</div>
                        {m.description && (
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{m.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Outcome & Testimonial */}
            {(project.clientOutcome || project.testimonial) && (
              <div className="bg-primary-light/30 border border-primary/20 p-4 sm:p-5 rounded-xl space-y-3">
                {project.clientOutcome && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">Target Client Outcome</span>
                    <p className="text-xs font-semibold text-slate-800">{project.clientOutcome}</p>
                  </div>
                )}

                {project.testimonial && (
                  <div className="pt-2 border-t border-primary/10">
                    <div className="flex items-start gap-2.5">
                      <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs italic text-slate-700 leading-relaxed mb-2">"{project.testimonial.quote}"</p>
                        <div className="text-[11px] font-bold text-slate-900">{project.testimonial.author}</div>
                        <div className="text-[10px] text-slate-500">{project.testimonial.role} • {project.testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Visual Artifacts */}
            {project.recommendedVisuals && project.recommendedVisuals.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Recommended Visuals & Documentation Artifacts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {project.recommendedVisuals.map((vis, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="font-medium text-slate-700 text-[11px]">{vis}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Deliverables & Methodologies */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Tangible Deliverables
                </h4>
                <ul className="space-y-1.5">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs font-medium text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-primary" />
                Methodologies & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center flex-shrink-0">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Michael Omowa • Project Management & AI Case Study</span>
          <button
            onClick={() => {
              if (project.link) {
                window.open(project.link, '_blank');
              } else {
                alert(`In a production deployment, this button links directly to the verified artifact repository or client documentation for "${project.title}".`);
              }
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm hover:shadow cursor-pointer ml-auto sm:ml-0"
          >
            <span>Access Case Study Artifacts</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

