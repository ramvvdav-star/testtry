import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LiveStatus,
  PersonalMetrics,
  Project,
  WriteUp,
  DailyLog,
  Skill,
  TimelineItem,
  CertificationItem,
  EducationItem,
  LabExperiment,
  SiteSettings,
  User,
  AuditLog,
  Message,
} from '../types';
import {
  initialSiteSettings,
  initialLiveStatus,
  initialMetrics,
  initialSkills,
  initialProjects,
  initialWriteUps,
  initialDailyLogs,
  initialTimeline,
  initialCertifications,
  initialEducation,
  initialLabExperiments,
  initialUser,
  initialAuditLogs,
} from '../data/initialData';
import { soundFx } from '../utils/audio';

interface AppContextType {
  siteSettings: SiteSettings;
  liveStatus: LiveStatus;
  metrics: PersonalMetrics;
  skills: Skill[];
  projects: Project[];
  writeUps: WriteUp[];
  dailyLogs: DailyLog[];
  timeline: TimelineItem[];
  certifications: CertificationItem[];
  education: EducationItem[];
  labExperiments: LabExperiment[];
  messages: Message[];
  currentUser: User | null;
  auditLogs: AuditLog[];

  // Navigation & Modals
  activeSection: string;
  setActiveSection: (section: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  selectedWriteUp: WriteUp | null;
  setSelectedWriteUp: (wu: WriteUp | null) => void;

  // Actions
  updateLiveStatus: (status: Partial<LiveStatus>) => void;
  updateMetrics: (metrics: Partial<PersonalMetrics>) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addWriteUp: (wu: Omit<WriteUp, 'id' | 'views'>) => void;
  updateWriteUp: (id: string, wu: Partial<WriteUp>) => void;
  deleteWriteUp: (id: string) => void;
  incrementWriteUpViews: (id: string) => void;
  toggleSaveArticle: (id: string) => void;
  addDailyLog: (log: Omit<DailyLog, 'id'>) => void;
  updateDailyLog: (id: string, log: Partial<DailyLog>) => void;
  deleteDailyLog: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  sendMessage: (msg: { name: string; email: string; subject: string; message: string }) => boolean;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  login: (emailOrUser: string, roleOrPass?: string) => { success: boolean; error?: string };
  signup: (username: string, password?: string, email?: string) => { success: boolean; error?: string };
  logout: () => void;
  toggleAudioEffects: () => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'RAM_SEC_';

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore quota issues
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(() => getStored('settings', initialSiteSettings));
  const [liveStatus, setLiveStatusState] = useState<LiveStatus>(() => getStored('liveStatus', initialLiveStatus));
  const [metrics, setMetricsState] = useState<PersonalMetrics>(() => getStored('metrics', initialMetrics));
  const [skills, setSkillsState] = useState<Skill[]>(() => getStored('skills', initialSkills));
  const [projects, setProjectsState] = useState<Project[]>(() => getStored('projects', initialProjects));
  const [writeUps, setWriteUpsState] = useState<WriteUp[]>(() => getStored('writeUps', initialWriteUps));
  const [dailyLogs, setDailyLogsState] = useState<DailyLog[]>(() => getStored('dailyLogs', initialDailyLogs));
  const [timeline] = useState<TimelineItem[]>(() => getStored('timeline', initialTimeline));
  const [certifications] = useState<CertificationItem[]>(() => getStored('certifications', initialCertifications));
  const [education] = useState<EducationItem[]>(() => getStored('education', initialEducation));
  const [labExperiments] = useState<LabExperiment[]>(() => getStored('labExperiments', initialLabExperiments));
  const [messages, setMessagesState] = useState<Message[]>(() => getStored('messages', []));
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getStored('user', initialUser));
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>(() => getStored('auditLogs', initialAuditLogs));

  // Modals & Active states
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);

  // Sync soundFx config
  useEffect(() => {
    soundFx.setEnabled(siteSettings.audioEffects);
  }, [siteSettings.audioEffects]);

  // Dynamic status timestamp refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStatusState((prev) => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync state to local storage
  useEffect(() => { setStored('settings', siteSettings); }, [siteSettings]);
  useEffect(() => { setStored('liveStatus', liveStatus); }, [liveStatus]);
  useEffect(() => { setStored('metrics', metrics); }, [metrics]);
  useEffect(() => { setStored('skills', skills); }, [skills]);
  useEffect(() => { setStored('projects', projects); }, [projects]);
  useEffect(() => { setStored('writeUps', writeUps); }, [writeUps]);
  useEffect(() => { setStored('dailyLogs', dailyLogs); }, [dailyLogs]);
  useEffect(() => { setStored('messages', messages); }, [messages]);
  useEffect(() => { setStored('user', currentUser); }, [currentUser]);
  useEffect(() => { setStored('auditLogs', auditLogs); }, [auditLogs]);

  // Audit log helper
  const addAudit = (action: string, details: string, severity: 'INFO' | 'WARNING' | 'ALERT' = 'INFO') => {
    const newLog: AuditLog = {
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action,
      actor: currentUser ? currentUser.email : 'anonymous',
      severity,
      details,
    };
    setAuditLogsState((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const updateLiveStatus = (status: Partial<LiveStatus>) => {
    setLiveStatusState((prev) => {
      const updated = { ...prev, ...status, lastUpdate: 'Just now' };
      addAudit('STATUS_UPDATE', `Live status updated to ${updated.systemStatus} / Threat: ${updated.threatLevel}`);
      return updated;
    });
  };

  const updateMetrics = (newMetrics: Partial<PersonalMetrics>) => {
    setMetricsState((prev) => {
      const updated = { ...prev, ...newMetrics };
      addAudit('METRICS_UPDATE', 'Personal metrics updated by admin');
      return updated;
    });
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettingsState((prev) => {
      const updated = { ...prev, ...settings };
      addAudit('SETTINGS_UPDATE', 'Site configuration modified');
      return updated;
    });
  };

  const addProject = (proj: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...proj,
      id: 'proj-' + Date.now(),
    };
    setProjectsState((prev) => [newProj, ...prev]);
    setMetricsState((m) => ({ ...m, securityProjects: m.securityProjects + 1 }));
    addAudit('PROJECT_CREATE', `Created project: ${newProj.name}`);
  };

  const updateProject = (id: string, proj: Partial<Project>) => {
    setProjectsState((prev) => prev.map((p) => (p.id === id ? { ...p, ...proj } : p)));
    addAudit('PROJECT_UPDATE', `Updated project id: ${id}`);
  };

  const deleteProject = (id: string) => {
    setProjectsState((prev) => prev.filter((p) => p.id !== id));
    setMetricsState((m) => ({ ...m, securityProjects: Math.max(0, m.securityProjects - 1) }));
    addAudit('PROJECT_DELETE', `Deleted project id: ${id}`, 'WARNING');
  };

  const addWriteUp = (wu: Omit<WriteUp, 'id' | 'views'>) => {
    const newWu: WriteUp = {
      ...wu,
      id: 'wu-' + Date.now(),
      views: 1,
    };
    setWriteUpsState((prev) => [newWu, ...prev]);
    setMetricsState((m) => ({ ...m, writeups: m.writeups + 1 }));
    addAudit('WRITEUP_CREATE', `Published write-up: ${newWu.title}`);
  };

  const updateWriteUp = (id: string, wu: Partial<WriteUp>) => {
    setWriteUpsState((prev) => prev.map((w) => (w.id === id ? { ...w, ...wu } : w)));
    addAudit('WRITEUP_UPDATE', `Updated write-up id: ${id}`);
  };

  const deleteWriteUp = (id: string) => {
    setWriteUpsState((prev) => prev.filter((w) => w.id !== id));
    setMetricsState((m) => ({ ...m, writeups: Math.max(0, m.writeups - 1) }));
    addAudit('WRITEUP_DELETE', `Deleted write-up id: ${id}`, 'WARNING');
  };

  const incrementWriteUpViews = (id: string) => {
    setWriteUpsState((prev) => prev.map((w) => (w.id === id ? { ...w, views: (w.views || 0) + 1 } : w)));
  };

  const toggleSaveArticle = (id: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const exists = currentUser.savedArticles.includes(id);
    const updatedArticles = exists
      ? currentUser.savedArticles.filter((item) => item !== id)
      : [...currentUser.savedArticles, id];
    setCurrentUserState({ ...currentUser, savedArticles: updatedArticles });
    soundFx.playKeyClick();
  };

  const addDailyLog = (log: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = { ...log, id: 'log-' + Date.now() };
    setDailyLogsState((prev) => [newLog, ...prev]);
    addAudit('DAILY_LOG_CREATE', `Added log entry: ${newLog.title}`);
  };

  const updateDailyLog = (id: string, log: Partial<DailyLog>) => {
    setDailyLogsState((prev) => prev.map((l) => (l.id === id ? { ...l, ...log } : l)));
    addAudit('DAILY_LOG_UPDATE', `Updated log entry id: ${id}`);
  };

  const deleteDailyLog = (id: string) => {
    setDailyLogsState((prev) => prev.filter((l) => l.id !== id));
    addAudit('DAILY_LOG_DELETE', `Removed log entry id: ${id}`);
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...skill, id: 'skill-' + Date.now() };
    setSkillsState((prev) => [...prev, newSkill]);
    setMetricsState((m) => ({ ...m, tools: m.tools + 1 }));
    addAudit('SKILL_CREATE', `Added skill/tool: ${newSkill.name}`);
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setSkillsState((prev) => prev.map((s) => (s.id === id ? { ...s, ...skill } : s)));
  };

  const deleteSkill = (id: string) => {
    setSkillsState((prev) => prev.filter((s) => s.id !== id));
    setMetricsState((m) => ({ ...m, tools: Math.max(0, m.tools - 1) }));
  };

  const sendMessage = (msg: { name: string; email: string; subject: string; message: string }): boolean => {
    if (!msg.name || !msg.email || !msg.message) return false;
    const newMsg: Message = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      read: false,
    };
    setMessagesState((prev) => [newMsg, ...prev]);
    addAudit('MESSAGE_RECEIVED', `Inquiry received from ${msg.name} (${msg.email})`);
    soundFx.playSuccessTone();
    return true;
  };

  const markMessageRead = (id: string) => {
    setMessagesState((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessagesState((prev) => prev.filter((m) => m.id !== id));
  };

  const login = (emailOrUser: string, roleOrPass: string = 'researcher'): { success: boolean; error?: string } => {
    if (!emailOrUser || !emailOrUser.trim()) {
      return { success: false, error: 'Identifier is required' };
    }
    const cleanId = emailOrUser.trim();
    const isAdmin = cleanId.toLowerCase() === 'admin' || roleOrPass === 'admin';

    // Verify admin credentials if attempting to sign in as admin
    if (cleanId.toLowerCase() === 'admin' && roleOrPass !== 'admin' && roleOrPass !== 'ramsec2026') {
      soundFx.playKeyClick();
      return { success: false, error: 'Invalid admin passphrase key' };
    }

    const role: 'admin' | 'researcher' | 'guest' = isAdmin
      ? 'admin'
      : roleOrPass === 'guest'
      ? 'guest'
      : 'researcher';

    const cleanName = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;
    const displayName = isAdmin
      ? 'Ram (Admin)'
      : cleanName
      ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      : 'Researcher';

    const user: User = {
      id: 'user-' + Date.now(),
      name: displayName,
      username: cleanId.toLowerCase(),
      email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@sec.local`,
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      savedArticles: currentUser ? currentUser.savedArticles : [],
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        : undefined,
    };
    setCurrentUserState(user);
    addAudit('USER_LOGIN', `User ${user.email} authenticated with role: ${role}`);
    soundFx.playSuccessTone();
    return { success: true };
  };

  const signup = (username: string, _password?: string, email?: string): { success: boolean; error?: string } => {
    if (!username || username.trim().length < 2) {
      return { success: false, error: 'Username must be at least 2 characters' };
    }
    const cleanUser = username.trim();
    const userEmail = email && email.includes('@') ? email.trim() : `${cleanUser.toLowerCase()}@sec.local`;
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
      username: cleanUser.toLowerCase(),
      email: userEmail,
      role: 'researcher',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      savedArticles: [],
    };
    setCurrentUserState(newUser);
    addAudit('USER_REGISTER', `New user registered: ${cleanUser} (${userEmail})`);
    soundFx.playSuccessTone();
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      addAudit('USER_LOGOUT', `User ${currentUser.email} logged out`);
    }
    setCurrentUserState(null);
    setIsAdminOpen(false);
    setIsProfileModalOpen(false);
  };

  const toggleAudioEffects = () => {
    setSiteSettingsState((prev) => ({
      ...prev,
      audioEffects: !prev.audioEffects,
    }));
  };

  const resetToDefaults = () => {
    setSiteSettingsState(initialSiteSettings);
    setLiveStatusState(initialLiveStatus);
    setMetricsState(initialMetrics);
    setSkillsState(initialSkills);
    setProjectsState(initialProjects);
    setWriteUpsState(initialWriteUps);
    setDailyLogsState(initialDailyLogs);
    setCurrentUserState(initialUser);
    setMessagesState([]);
    setAuditLogsState(initialAuditLogs);
    localStorage.clear();
    addAudit('SYSTEM_RESET', 'All portfolio records restored to pristine seed state', 'WARNING');
  };

  return (
    <AppContext.Provider
      value={{
        siteSettings,
        liveStatus,
        metrics,
        skills,
        projects,
        writeUps,
        dailyLogs,
        timeline,
        certifications,
        education,
        labExperiments,
        messages,
        currentUser,
        auditLogs,
        activeSection,
        setActiveSection,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isTerminalOpen,
        setIsTerminalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedProject,
        setSelectedProject,
        selectedWriteUp,
        setSelectedWriteUp,
        updateLiveStatus,
        updateMetrics,
        updateSiteSettings,
        addProject,
        updateProject,
        deleteProject,
        addWriteUp,
        updateWriteUp,
        deleteWriteUp,
        incrementWriteUpViews,
        toggleSaveArticle,
        addDailyLog,
        updateDailyLog,
        deleteDailyLog,
        addSkill,
        updateSkill,
        deleteSkill,
        sendMessage,
        markMessageRead,
        deleteMessage,
        login,
        signup,
        logout,
        toggleAudioEffects,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
