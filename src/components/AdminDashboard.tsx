import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  FolderGit2,
  BookOpen,
  Calendar,
  Activity,
  Cpu,
  Mail,
  FileCode,
  ListOrdered,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Copy,
  AlertCircle,
  Database,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, WriteUp, DailyLog, Skill, LiveStatus, PersonalMetrics } from '../types';
import { SUPABASE_POSTGRES_SCHEMA } from '../utils/exportSql';
import { soundFx } from '../utils/audio';

type AdminTab =
  | 'STATUS'
  | 'METRICS'
  | 'PROJECTS'
  | 'WRITEUPS'
  | 'LOGS'
  | 'SKILLS'
  | 'MESSAGES'
  | 'AUDIT'
  | 'SQL_EXPORT';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    currentUser,
    liveStatus,
    updateLiveStatus,
    metrics,
    updateMetrics,
    projects,
    addProject,
    updateProject,
    deleteProject,
    writeUps,
    addWriteUp,
    updateWriteUp,
    deleteWriteUp,
    dailyLogs,
    addDailyLog,
    deleteDailyLog,
    skills,
    addSkill,
    deleteSkill,
    contactMessages,
    auditLogs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('STATUS');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Forms states
  // 1. Live Status Form
  const [statusForm, setStatusForm] = useState<LiveStatus>({ ...liveStatus });

  // 2. Metrics Form
  const [metricsForm, setMetricsForm] = useState<PersonalMetrics>({ ...metrics });

  // 3. New Project Form
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '',
    category: 'WEB SECURITY',
    shortDescription: '',
    problem: '',
    solution: '',
    technologies: ['Python', 'Docker'],
    securityConcepts: ['Zero Trust', 'Least Privilege'],
    githubLink: 'https://github.com/ram-sec/new-tool',
    date: '2026',
    status: 'ACTIVE',
  });

  // 4. New Write-up Form
  const [isAddingWriteUp, setIsAddingWriteUp] = useState(false);
  const [newWriteUp, setNewWriteUp] = useState<Omit<WriteUp, 'id' | 'views'>>({
    title: '',
    slug: '',
    excerpt: '',
    author: 'Ram',
    date: 'Sep 2026',
    readingTime: '6 min read',
    difficulty: 'INTERMEDIATE',
    category: 'Web Security',
    tags: ['Security', 'Audit'],
    content: '### Executive Overview\n\nEnter research details here...',
    featured: false,
    published: true,
  });

  // 5. New Daily Log Form
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLog, setNewLog] = useState<Omit<DailyLog, 'id'>>({
    date: '10 SEP 2026',
    title: '',
    workedOn: '',
    learned: '',
    failed: '',
    willTryNext: '',
    tags: ['Research', 'Audit'],
  });

  // 6. New Skill Form
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    category: 'OFFENSIVE SECURITY',
    experienceLevel: 'Advanced',
    proficiencyPercent: 85,
    description: '',
    projectsUsingIt: ['SentinelForge'],
  });

  if (!isAdminOpen) return null;

  const showNotification = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    updateLiveStatus(statusForm);
    showNotification('SOC Live Telemetry status successfully updated.');
  };

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    updateMetrics(metricsForm);
    showNotification('Portfolio metrics successfully calibrated.');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addProject(newProject);
    setIsAddingProject(false);
    showNotification(`Project "${newProject.name}" successfully committed.`);
  };

  const handleCreateWriteUp = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addWriteUp(newWriteUp);
    setIsAddingWriteUp(false);
    showNotification(`Write-up "${newWriteUp.title}" published.`);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addDailyLog(newLog);
    setIsAddingLog(false);
    showNotification(`Daily log "${newLog.title}" recorded in journal.`);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addSkill(newSkill);
    setIsAddingSkill(false);
    showNotification(`Skill "${newSkill.name}" registered into Arsenal matrix.`);
  };

  const copySqlSchema = () => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(SUPABASE_POSTGRES_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div
      id="admin-dashboard-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-150"
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        id="admin-dashboard-card"
        className="w-full max-w-6xl max-h-[92vh] bg-[#090d16] border border-zinc-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dashboard Top Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wider flex items-center gap-2">
                <span>RAM.SEC // CONTROL CENTER & CMS</span>
                <span className="px-2 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-500/40 text-[10px]">
                  ADMIN PRIVILEGED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Session Operator: {currentUser?.name || currentUser?.username || 'admin'} • Real-time synchronization
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {saveBanner && (
          <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-6 py-2 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveBanner}</span>
          </div>
        )}

        {/* Main Content Area: Sidebar Tabs + Working Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-56 bg-zinc-950/80 border-r border-zinc-800 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTab('STATUS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'STATUS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>SOC Live Status</span>
            </button>

            <button
              onClick={() => setActiveTab('METRICS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'METRICS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Metrics Calibration</span>
            </button>

            <button
              onClick={() => setActiveTab('PROJECTS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'PROJECTS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('WRITEUPS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'WRITEUPS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Write-ups ({writeUps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('LOGS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'LOGS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daily Log ({dailyLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SKILLS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'SKILLS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Arsenal Skills ({skills.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('MESSAGES')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'MESSAGES'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-400" />
              <span>Inquiries ({contactMessages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'AUDIT'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <ListOrdered className="w-4 h-4 text-zinc-400" />
              <span>Audit Trail</span>
            </button>

            <div className="pt-3 mt-3 border-t border-zinc-800">
              <button
                onClick={() => setActiveTab('SQL_EXPORT')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                  activeTab === 'SQL_EXPORT'
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>SQL Schema Export</span>
              </button>
            </div>
          </div>

          {/* Right Working Panel */}
          <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-zinc-200">
            {/* 1. Tab: SOC Live Status Editor */}
            {activeTab === 'STATUS' && (
              <form onSubmit={handleSaveStatus} className="max-w-2xl space-y-5">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    SOC Real-Time Telemetry Settings
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    These values populate the Live Status Panel on the homepage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">System Status</label>
                    <select
                      value={statusForm.systemStatus}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, systemStatus: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="OPERATIONAL">OPERATIONAL</option>
                      <option value="MONITORING">MONITORING</option>
                      <option value="DEGRADED">DEGRADED</option>
                      <option value="INCIDENT RESPONSE">INCIDENT RESPONSE</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Threat Level</label>
                    <select
                      value={statusForm.threatLevel}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, threatLevel: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="LOW">LOW</option>
                      <option value="GUARDED">GUARDED</option>
                      <option value="ELEVATED">ELEVATED</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Lab Status</label>
                    <select
                      value={statusForm.labStatus}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, labStatus: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="ONLINE">ONLINE</option>
                      <option value="RESEARCHING">RESEARCHING</option>
                      <option value="SANDBOX ACTIVE">SANDBOX ACTIVE</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">System Uptime</label>
                    <input
                      type="text"
                      value={statusForm.uptime}
                      onChange={(e) => setStatusForm({ ...statusForm, uptime: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-zinc-400 text-[11px] uppercase">Current Research Focus</label>
                    <input
                      type="text"
                      value={statusForm.currentFocus}
                      onChange={(e) => setStatusForm({ ...statusForm, currentFocus: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>COMMIT STATUS CHANGES</span>
                </button>
              </form>
            )}

            {/* 2. Tab: Metrics Calibration */}
            {activeTab === 'METRICS' && (
              <form onSubmit={handleSaveMetrics} className="max-w-2xl space-y-5">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Verified Portfolio Metrics Editor
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Update counts of verified achievements. If value is 0, &apos;Building&apos; is automatically rendered.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Security Projects</label>
                    <input
                      type="number"
                      value={metricsForm.securityProjects}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, securityProjects: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Research Write-ups</label>
                    <input
                      type="number"
                      value={metricsForm.writeups}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, writeups: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Lab Hours</label>
                    <input
                      type="number"
                      value={metricsForm.labHours}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, labHours: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Arsenal Tools</label>
                    <input
                      type="number"
                      value={metricsForm.tools}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, tools: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Certifications</label>
                    <input
                      type="number"
                      value={metricsForm.certifications}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, certifications: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">GitHub Repos</label>
                    <input
                      type="number"
                      value={metricsForm.githubProjects}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, githubProjects: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>CALIBRATE METRICS</span>
                </button>
              </form>
            )}

            {/* 3. Tab: Projects Manager */}
            {activeTab === 'PROJECTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-purple-400" />
                      Project Showcase Management
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Manage repositories, threat models, and live demonstrators.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingProject(!isAddingProject)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingProject ? 'CANCEL' : 'ADD NEW PROJECT'}</span>
                  </button>
                </div>

                {isAddingProject && (
                  <form onSubmit={handleCreateProject} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Register New Security Project</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Project Name (e.g. AuthShield)"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      >
                        <option value="WEB SECURITY">WEB SECURITY</option>
                        <option value="NETWORK">NETWORK</option>
                        <option value="PYTHON">PYTHON</option>
                        <option value="OSINT">OSINT</option>
                        <option value="LINUX">LINUX</option>
                        <option value="RESEARCH">RESEARCH</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Short description..."
                        className="sm:col-span-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newProject.shortDescription}
                        onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                      />
                      <textarea
                        placeholder="Security problem addressed..."
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newProject.problem}
                        onChange={(e) => setNewProject({ ...newProject, problem: e.target.value })}
                      />
                      <textarea
                        placeholder="Engineered defensive solution..."
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newProject.solution}
                        onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold"
                    >
                      SAVE PROJECT
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{proj.name}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {proj.category}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            [{proj.status}]
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">
                          {proj.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${proj.name}"?`)) {
                              deleteProject(proj.id);
                            }
                          }}
                          className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Tab: Write-ups Manager */}
            {activeTab === 'WRITEUPS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Security Write-ups & Research CMS
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Publish vulnerabilities, technical write-ups, and CTF analyses.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingWriteUp(!isAddingWriteUp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingWriteUp ? 'CANCEL' : 'WRITE NEW ARTICLE'}</span>
                  </button>
                </div>

                {isAddingWriteUp && (
                  <form onSubmit={handleCreateWriteUp} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Publish New Security Write-up</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Article Title"
                        value={newWriteUp.title}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, title: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <select
                        value={newWriteUp.difficulty}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, difficulty: e.target.value as any })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      >
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="ELITE">ELITE</option>
                      </select>
                      <textarea
                        rows={2}
                        placeholder="Executive Excerpt..."
                        className="sm:col-span-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newWriteUp.excerpt}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, excerpt: e.target.value })}
                      />
                      <textarea
                        rows={6}
                        placeholder="Markdown Content..."
                        className="sm:col-span-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono"
                        value={newWriteUp.content}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, content: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold"
                    >
                      PUBLISH WRITE-UP
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {writeUps.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{w.title}</span>
                          <span className="text-[10px] text-zinc-400">({w.category})</span>
                          {w.featured && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{w.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete write-up "${w.title}"?`)) {
                              deleteWriteUp(w.id);
                            }
                          }}
                          className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete write-up"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Tab: Daily Log Manager */}
            {activeTab === 'LOGS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Daily Research Log Journal
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Document real-time laboratory hypotheses, discoveries, and troubleshooting.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingLog(!isAddingLog)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingLog ? 'CANCEL' : 'RECORD NEW ENTRY'}</span>
                  </button>
                </div>

                {isAddingLog && (
                  <form onSubmit={handleCreateLog} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Record Security Log Entry</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Date (e.g. 10 SEP 2026)"
                        value={newLog.date}
                        onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Log Title"
                        value={newLog.title}
                        onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What I worked on..."
                        value={newLog.workedOn}
                        onChange={(e) => setNewLog({ ...newLog, workedOn: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What I learned..."
                        value={newLog.learned}
                        onChange={(e) => setNewLog({ ...newLog, learned: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What failed..."
                        value={newLog.failed}
                        onChange={(e) => setNewLog({ ...newLog, failed: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What I will try next..."
                        value={newLog.willTryNext}
                        onChange={(e) => setNewLog({ ...newLog, willTryNext: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold"
                    >
                      COMMIT LOG TO DATABASE
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {dailyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">[{log.date}]</span>
                          <span className="text-white font-bold">{log.title}</span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{log.workedOn}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete log entry?`)) {
                            deleteDailyLog(log.id);
                          }
                        }}
                        className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Tab: Skills Manager */}
            {activeTab === 'SKILLS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-teal-400" />
                      Arsenal Competency Matrix
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Update offensive, defensive, and tooling skill proficiencies.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingSkill(!isAddingSkill)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingSkill ? 'CANCEL' : 'ADD SKILL'}</span>
                  </button>
                </div>

                {isAddingSkill && (
                  <form onSubmit={handleCreateSkill} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Skill Name (e.g. eBPF Filtering)"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      >
                        <option value="OFFENSIVE SECURITY">OFFENSIVE SECURITY</option>
                        <option value="DEFENSIVE SECURITY">DEFENSIVE SECURITY</option>
                        <option value="NETWORKING">NETWORKING</option>
                        <option value="PROGRAMMING">PROGRAMMING</option>
                        <option value="OSINT">OSINT</option>
                        <option value="TOOLS">TOOLS</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Proficiency % (1-100)"
                        value={newSkill.proficiencyPercent}
                        onChange={(e) => setNewSkill({ ...newSkill, proficiencyPercent: parseInt(e.target.value) || 50 })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <input
                        type="text"
                        placeholder="Description..."
                        value={newSkill.description}
                        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold">
                      SAVE SKILL
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-[10px] text-zinc-500">{s.category} • {s.proficiencyPercent}%</div>
                      </div>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Tab: Contact Inquiries Viewer */}
            {activeTab === 'MESSAGES' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-400" />
                    Secure Inquiries Inbox ({contactMessages.length})
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Messages transmitted through the site&apos;s contact endpoint.
                  </p>
                </div>

                {contactMessages.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                    No inquiries received yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{msg.name}</span>
                            <span className="text-zinc-400 text-[11px]">&lt;{msg.email}&gt;</span>
                            <span className="px-2 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-emerald-400">
                              {msg.inquiryType}
                            </span>
                          </div>
                          <span className="text-zinc-500 text-[10px]">{msg.timestamp}</span>
                        </div>
                        <div className="text-xs text-zinc-300 font-semibold">{msg.subject}</div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. Tab: Audit Trail */}
            {activeTab === 'AUDIT' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-zinc-400" />
                    Security Event Audit Log
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Immutable activity log tracking administrator actions, authentications, and data modifications.
                  </p>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-[11px] font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-zinc-500">{log.timestamp}</span>
                        <span className="font-bold text-emerald-400">[{log.action}]</span>
                        <span className="text-zinc-300">{log.details}</span>
                      </div>
                      <div className="text-zinc-500 text-[10px]">
                        user: {log.user} • ip: {log.ip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Tab: Database SQL Schema Export */}
            {activeTab === 'SQL_EXPORT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      PostgreSQL / Supabase Schema Exporter
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Deploy ready DDL SQL script to migrate this portfolio to Supabase or any PostgreSQL instance.
                    </p>
                  </div>
                  <button
                    onClick={copySqlSchema}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'COPIED TO CLIPBOARD' : 'COPY SQL DDL'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-[400px]">
                  {SUPABASE_POSTGRES_SCHEMA}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
