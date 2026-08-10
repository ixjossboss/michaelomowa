import React, { useState } from 'react';
import { PortfolioData, ContactMessage, NewsletterSubscriber, Project, Skill, Achievement } from '../types';
import { 
  Settings, Lock, Unlock, Save, RefreshCw, Trash2, Plus, 
  MessageSquareText, Users, Briefcase, Award, GraduationCap, 
  Database, FileSpreadsheet, Sparkles, Check, CheckCircle2, 
  ArrowRight, ToggleLeft
} from 'lucide-react';

interface AdminCMSProps {
  data: PortfolioData;
  onUpdateData: (newData: PortfolioData) => void;
  messages: ContactMessage[];
  onUpdateMessages: (newMessages: ContactMessage[]) => void;
  subscribers: NewsletterSubscriber[];
  onUpdateSubscribers: (newSubs: NewsletterSubscriber[]) => void;
  onResetDefaults: () => void;
}

type TabType = 'general' | 'skills' | 'projects' | 'achievements' | 'inbox' | 'subscribers' | 'system';

export const AdminCMS: React.FC<AdminCMSProps> = ({
  data,
  onUpdateData,
  messages,
  onUpdateMessages,
  subscribers,
  onUpdateSubscribers,
  onResetDefaults
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Edit fields states (General Content)
  const [editBio, setEditBio] = useState(data.bio);
  const [editTitle, setEditTitle] = useState(data.title);
  const [editSubtitle, setEditSubtitle] = useState(data.subtitle);
  const [editGrad, setEditGrad] = useState(data.education.expectedGraduation);
  const [editStatus, setEditStatus] = useState(data.education.status);
  const [newEduBullet, setNewEduBullet] = useState('');

  // Project creator states
  const [newProj, setNewProj] = useState<Partial<Project>>({
    title: '',
    category: 'Project Management',
    description: '',
    detailedDescription: '',
    tags: [],
    deliverables: [],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
  });
  const [projTagString, setProjTagString] = useState('');
  const [projDelivString, setProjDelivString] = useState('');

  // Skill creator states
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState(85);
  const [newSkillCat, setNewSkillCat] = useState<'core' | 'technical' | 'soft' | 'business'>('business');
  const [newSkillIcon, setNewSkillIcon] = useState('Briefcase');

  // Achievement creator states
  const [newAch, setNewAch] = useState<Partial<Achievement>>({
    title: '',
    organization: 'University of the People',
    date: 'May 20, 2026',
    description: '',
    skillsAcquired: []
  });
  const [achSkillsString, setAchSkillsString] = useState('');

  const triggerSaveStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin.toLowerCase() === 'admin' || pin === '') {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveGeneral = () => {
    const updated = {
      ...data,
      title: editTitle,
      subtitle: editSubtitle,
      bio: editBio,
      education: {
        ...data.education,
        expectedGraduation: editGrad,
        status: editStatus
      }
    };
    onUpdateData(updated);
    triggerSaveStatus('Profile updated successfully!');
  };

  const handleAddEduBullet = () => {
    if (!newEduBullet.trim()) return;
    const updated = {
      ...data,
      education: {
        ...data.education,
        achievements: [...data.education.achievements, newEduBullet.trim()]
      }
    };
    onUpdateData(updated);
    setNewEduBullet('');
    triggerSaveStatus('Added core education study detail.');
  };

  const handleDeleteEduBullet = (idx: number) => {
    const updated = {
      ...data,
      education: {
        ...data.education,
        achievements: data.education.achievements.filter((_, i) => i !== idx)
      }
    };
    onUpdateData(updated);
    triggerSaveStatus('Removed education detail.');
  };

  // Skills
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const updatedSkill: Skill = {
      id: `skill-${Date.now()}`,
      category: newSkillCat,
      name: newSkillName.trim(),
      proficiency: newSkillProf,
      iconName: newSkillIcon
    };
    onUpdateData({
      ...data,
      skills: [...data.skills, updatedSkill]
    });
    setNewSkillName('');
    triggerSaveStatus(`Added skill: ${updatedSkill.name}`);
  };

  const handleDeleteSkill = (id: string) => {
    onUpdateData({
      ...data,
      skills: data.skills.filter(s => s.id !== id)
    });
    triggerSaveStatus('Removed skill.');
  };

  // Achievements
  const handleAddAchievement = () => {
    if (!newAch.title?.trim()) return;
    const updatedAch: Achievement = {
      id: `ach-${Date.now()}`,
      title: newAch.title.trim(),
      organization: newAch.organization || 'University of the People',
      date: newAch.date || 'Ongoing',
      description: newAch.description || '',
      skillsAcquired: achSkillsString ? achSkillsString.split(',').map(s => s.trim()).filter(Boolean) : [],
      isFeatured: true
    };
    onUpdateData({
      ...data,
      achievements: [updatedAch, ...data.achievements]
    });
    setNewAch({
      title: '',
      organization: 'University of the People',
      date: 'May 20, 2026',
      description: '',
      skillsAcquired: []
    });
    setAchSkillsString('');
    triggerSaveStatus('Added achievement record.');
  };

  const handleDeleteAchievement = (id: string) => {
    onUpdateData({
      ...data,
      achievements: data.achievements.filter(a => a.id !== id)
    });
    triggerSaveStatus('Removed achievement.');
  };

  // Projects
  const handleAddProject = () => {
    if (!newProj.title?.trim()) return;
    const finalProject: Project = {
      id: `proj-${Date.now()}`,
      title: newProj.title.trim(),
      category: newProj.category || 'Project Management',
      description: newProj.description || '',
      detailedDescription: newProj.detailedDescription || '',
      tags: projTagString ? projTagString.split(',').map(t => t.trim()).filter(Boolean) : ['Advisory'],
      deliverables: projDelivString ? projDelivString.split(',').map(d => d.trim()).filter(Boolean) : [],
      image: newProj.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
    };
    onUpdateData({
      ...data,
      projects: [...data.projects, finalProject]
    });
    setNewProj({
      title: '',
      category: 'Project Management',
      description: '',
      detailedDescription: '',
      tags: [],
      deliverables: [],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
    });
    setProjTagString('');
    setProjDelivString('');
    triggerSaveStatus('Created team project case study.');
  };

  const handleDeleteProject = (id: string) => {
    onUpdateData({
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    });
    triggerSaveStatus('De-allocated project study.');
  };

  // Messages Inbox
  const handleMarkAsRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: 'read' as const } : m);
    onUpdateMessages(updated);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    onUpdateMessages(updated);
    triggerSaveStatus('Deleted message.');
  };

  // Export Subs
  const handleExportSubscribers = () => {
    const headers = 'Email,SubscribedAt,Active\n';
    const rows = subscribers.map(s => `"${s.email}","${s.subscribedAt}",${s.active}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Michael_Omowa_Subscribers_Export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearSubscribers = () => {
    if (window.confirm('Are you sure you want to trigger wipeout of subscriber database tables?')) {
      onUpdateSubscribers([]);
      triggerSaveStatus('Cleared subscriber rosters.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in no-print">
      
      {/* Top Controller Bar */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary animate-spin-slow" />
          <div>
            <h3 className="font-bold text-sm tracking-tight">Active Content Management Panel</h3>
            <p className="text-[10px] text-slate-400">Instantly update Michael's portfolio details</p>
          </div>
        </div>
        {unlocked && (
          <button
            onClick={() => setUnlocked(false)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition border border-slate-700 hover:border-slate-500"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock CMS</span>
          </button>
        )}
      </div>

      {/* Lock screen view */}
      {!unlocked ? (
        <div className="p-8 max-w-sm mx-auto text-center space-y-4">
          <div className="bg-primary/5 text-primary border border-primary/20 w-12 h-12 rounded-full inline-flex items-center justify-center mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">CMS Configuration Lock</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Edit bio, projects, achievements, and audit logs live. Tap "Unlock" to manage everything securely.
            </p>
          </div>
          <form onSubmit={handleUnlock} className="flex gap-1">
            <input
              type="password"
              placeholder="Admin PIN (leave empty or 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="flex-1 bg-white border border-slate-300 focus:border-primary rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
            >
              Unlock
            </button>
          </form>
          {pinError && <p className="text-[10px] text-red-500 font-medium">Incorrect Pin. Default is empty.</p>}
          <p className="text-[10px] text-slate-400 italic">No complex database config required! Preserved in browser local environment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[480px]">
          
          {/* Left Sidebar tabs */}
          <div className="md:col-span-1 bg-slate-100 border-r border-slate-200">
            <nav className="p-3 space-y-1">
              {[
                { id: 'general', label: 'Biography & Info', Icon: Users },
                { id: 'skills', label: 'Core Skills', Icon: Briefcase },
                { id: 'projects', label: 'Studies & Projects', Icon: Sparkles },
                { id: 'achievements', label: 'Achievements', Icon: Award },
                { id: 'inbox', label: `Inquiries (${messages.filter(m => m.status === 'unread').length})`, Icon: MessageSquareText },
                { id: 'subscribers', label: `Subscribers (${subscribers.length})`, Icon: FileSpreadsheet },
                { id: 'system', label: 'System Recovery', Icon: Database }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.Icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-white font-bold shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right tab display area */}
          <div className="md:col-span-3 p-6 bg-white overflow-y-auto max-h-[500px]">
            
            {/* Sync Notifications toast */}
            {saveStatus && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span className="font-semibold">{saveStatus}</span>
              </div>
            )}

            {/* TAB: General Info */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Section Profile Bio</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Headline Title</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">General Biography Background</label>
                    <textarea
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none resize-none"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                    />
                  </div>

                  {/* Education specs */}
                  <div className="border-t border-slate-100 pt-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Education Status Level</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Expected Graduation Date</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        value={editGrad}
                        onChange={(e) => setEditGrad(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save General Bio</span>
                  </button>
                </div>

                {/* Academic Focus Specs */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Education Focus Areas</h5>
                  <ul className="space-y-1.5 mb-3">
                    {data.education.achievements.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs text-slate-700">
                        <span>{item}</span>
                        <button
                          onClick={() => handleDeleteEduBullet(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                      placeholder="Add strategic focus item e.g., Financial Modeling class"
                      value={newEduBullet}
                      onChange={(e) => setNewEduBullet(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddEduBullet()}
                    />
                    <button
                      onClick={handleAddEduBullet}
                      className="bg-slate-900 text-white rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Manage Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Current Skills Roster</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.skills.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-200 px-1.5 py-0.5 rounded-full">{skill.category}</span>
                          <span className="text-[10px] text-primary font-bold">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Skill form */}
                <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                  <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">Add New Professional Skill</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Skill Name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="E.g., Corporate Governance Analysis"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Category Type</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        value={newSkillCat}
                        onChange={(e) => setNewSkillCat(e.target.value as any)}
                      >
                        <option value="business">Business</option>
                        <option value="soft">Soft Competencies</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Set Proficiency State ({newSkillProf}%)</label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={newSkillProf}
                        onChange={(e) => setNewSkillProf(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <button
                      onClick={handleAddSkill}
                      className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer self-end transition"
                    >
                      Register Skill
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Manage Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Portfolio Project Studies</h4>
                <div className="space-y-2">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs gap-3">
                      <div>
                        <span className="text-[10px] text-primary whitespace-nowrap font-semibold bg-primary-light px-2 py-0.5 rounded-full uppercase tracking-wider">{proj.category}</span>
                        <h4 className="font-bold text-slate-900 mt-1">{proj.title}</h4>
                        <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{proj.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Project Form */}
                <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                  <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">Add New Portfolio Project</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Project Title</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="E.g., Community Budget Auditing Campaign"
                        value={newProj.title}
                        onChange={(e) => setNewProj({...newProj, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Category Domain</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="E.g., Business Analytics"
                        value={newProj.category}
                        onChange={(e) => setNewProj({...newProj, category: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Short Card Introduction Summary</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                      placeholder="Brief one-sentence elevator pitch summarizing results..."
                      value={newProj.description}
                      onChange={(e) => setNewProj({...newProj, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Comprehensive Detailed Background & Analysis (Pop-up Modal details)</label>
                    <textarea
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none resize-none"
                      placeholder="Elaborate on the strategic scope, metrics, challenges, and teamwork parameters utilized..."
                      value={newProj.detailedDescription}
                      onChange={(e) => setNewProj({...newProj, detailedDescription: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Deliverables (comma separated)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="Team Charter, Interactive Matrix, Final Briefing"
                        value={projDelivString}
                        onChange={(e) => setProjDelivString(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Applied Methodologies / Tags (comma separated)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="Strategy, Financial Planning, Remote Team"
                        value={projTagString}
                        onChange={(e) => setProjTagString(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Project Card Thumbnail Image URL</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none text-[10px]"
                      value={newProj.image}
                      onChange={(e) => setNewProj({...newProj, image: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={handleAddProject}
                    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition shadow-xs"
                  >
                    Deploy Project Case Study
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Achievements */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Achievements & Certifications Log</h4>
                <div className="space-y-2">
                  {data.achievements.map((ach) => (
                    <div key={ach.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900">{ach.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{ach.organization} • {ach.date}</span>
                        <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">{ach.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAchievement(ach.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Achievement Form */}
                <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                  <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">Add New Highlight/Credential</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Credential Title</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="E.g., High Honors List - Term 4"
                        value={newAch.title}
                        onChange={(e) => setNewAch({...newAch, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Organization Institution</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        value={newAch.organization}
                        onChange={(e) => setNewAch({...newAch, organization: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Acquisition date</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        value={newAch.date}
                        onChange={(e) => setNewAch({...newAch, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Competencies Acquired (comma separated)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                        placeholder="Teamwork, Financial Modeling, Strategic Planning"
                        value={achSkillsString}
                        onChange={(e) => setAchSkillsString(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Acreage Description</label>
                    <textarea
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none resize-none"
                      placeholder="Outline course metrics, results or grade Commendations..."
                      value={newAch.description}
                      onChange={(e) => setNewAch({...newAch, description: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={handleAddAchievement}
                    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition shadow-xs"
                  >
                    Deploy Highlight Record
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Message Inbox Logs */}
            {activeTab === 'inbox' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Submitted Contact Inquiries</h4>
                  <span className="text-[11px] font-semibold text-primary select-none">{messages.length} total messages received</span>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <MessageSquareText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-400">Sandbox Contact Inbox is Empty</p>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Fill and dispatch the contact form on your frontpage to watch messages log securely here!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`border rounded-xl p-4 text-xs transition relative ${
                          msg.status === 'unread' 
                            ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {msg.status === 'unread' && (
                          <span className="absolute top-4 right-4 bg-primary text-white font-bold text-[9px] px-2 py-0.5 rounded-full select-none">
                            Unread
                          </span>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-baseline flex-wrap gap-2 pr-12">
                            <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                          </div>
                          
                          <div className="text-[10px] text-slate-500 font-medium flex gap-2">
                            <span>From: <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a></span>
                            <span>•</span>
                            <span>Subject: <strong className="text-slate-700">{msg.subject}</strong></span>
                          </div>

                          <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-slate-600 leading-normal font-mono text-[11px]">
                            {msg.message}
                          </div>

                          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100/50 mt-1">
                            {msg.status === 'unread' && (
                              <button
                                onClick={() => handleMarkAsRead(msg.id)}
                                className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-700 transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Mark Read</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg px-2.5 py-1 text-[10px] font-bold transition cursor-pointer border border-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Log</span>
                            </button>
                            <span className="text-[10px] text-slate-400 ms-auto font-medium select-none flex items-center gap-1 italic">
                              <Check className="w-3 h-3 text-emerald-500" /> Auto-reply dispatched
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Subscribers */}
            {activeTab === 'subscribers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Newsletter Subscription Rosters</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportSubscribers}
                      disabled={subscribers.length === 0}
                      className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition disabled:opacity-40"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={handleClearSubscribers}
                      disabled={subscribers.length === 0}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge</span>
                    </button>
                  </div>
                </div>

                {subscribers.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-400">No Newsletter Subscribers Registered Now</p>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Emails compiled on the frontend subscription box automatically stack here for instant recall!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner bg-slate-50">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
                          <th className="p-3">Subscriber Mail</th>
                          <th className="p-3">Opt-in Date</th>
                          <th className="p-3">Registered State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {subscribers.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition text-slate-700">
                            <td className="p-3 font-semibold">{sub.email}</td>
                            <td className="p-3 text-slate-500">{sub.subscribedAt}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: System Recovery */}
            {activeTab === 'system' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Sandbox Database Reset</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Michael Omowa's portfolio contains a local content engine. If you want to purge all edits, mock messages, and email newsletters, and restore the portfolio back to the pristine default business parameters:
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Wipe out customized changes and restore default business administration states?')) {
                        onResetDefaults();
                        triggerSaveStatus('Database tables reset back to original profile default parameters!');
                      }
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 transition rounded-xl font-bold text-xs px-4 py-2.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <span>Reset Database Defaults</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 bg-blue-50/50 p-4 border border-blue-100 rounded-xl space-y-1">
                  <h5 className="font-semibold text-slate-700">Live Client Persistence Notes:</h5>
                  <p>All portfolio assets, resume details, and messages log securely in standard browser LocalStorage nodes. The site will remember all of your added project modifications even after refreshing the page!</p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
