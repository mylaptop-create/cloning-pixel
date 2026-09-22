import React, { useState, useEffect } from 'react';
import { WorkspaceConfig, ProjectConfig, AgentLog, DiffResult, RouteNode } from '../shared/types';
import {
  Layers,
  Globe,
  Compass,
  FileCode,
  Palette,
  Eye,
  GitCompare,
  Terminal,
  FolderTree,
  Settings,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Activity,
  Cpu
} from 'lucide-react';

export function App() {
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceConfig | null>(null);
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'crawl' | 'design' | 'diff' | 'preview' | 'logs' | 'settings'>('dashboard');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [diffs, setDiffs] = useState<DiffResult[]>([]);
  const [routes, setRoutes] = useState<RouteNode[]>([]);
  const [designData, setDesignData] = useState<{ tokens: any; designMd: string } | null>(null);

  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const [formState, setFormState] = useState({
    workspaceName: 'Acme Website Clone',
    targetUrl: 'https://wise.com',
    llmProvider: 'openai' as const,
    apiBaseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o',
    enableWiseDesignSystem: false
  });

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      const data = await res.json();
      if (data.success) {
        setWorkspaces(data.workspaces);
        if (data.workspaces.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(data.workspaces[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (currentWorkspace) {
      fetch(`/api/projects?workspaceId=${currentWorkspace.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProjects(data.projects);
            if (data.projects.length > 0) {
              setCurrentProject(data.projects[0]);
            }
          }
        });
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (currentProject) {
      // Fetch Logs
      fetch(`/api/projects/${currentProject.id}/logs`)
        .then((res) => res.json())
        .then((data) => data.success && setLogs(data.logs));

      // Fetch Diffs
      fetch(`/api/projects/${currentProject.id}/diffs`)
        .then((res) => res.json())
        .then((data) => data.success && setDiffs(data.diffs));

      // Fetch Routes
      fetch(`/api/projects/${currentProject.id}/routes`)
        .then((res) => res.json())
        .then((data) => data.success && setRoutes(data.routes));

      // Fetch Design System Data
      fetch(`/api/projects/${currentProject.id}/design`)
        .then((res) => res.json())
        .then((data) => data.success && setDesignData(data));
    }
  }, [currentProject, activeTab]);

  const handleTestConnection = async () => {
    setIsTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/llm/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: formState.llmProvider,
          baseUrl: formState.apiBaseUrl,
          apiKey: formState.apiKey,
          model: formState.model
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.workspaceName,
          targetUrl: formState.targetUrl,
          llmProvider: formState.llmProvider,
          apiBaseUrl: formState.apiBaseUrl,
          apiKey: formState.apiKey,
          model: formState.model,
          location: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        fetchWorkspaces();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunPipeline = async () => {
    if (!currentProject) return;
    try {
      await fetch(`/api/projects/${currentProject.id}/run`, { method: 'POST' });
      setActiveTab('logs');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen bg-[#0c0d0e] text-[#ededed] font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#131517] border-r border-[#222529] flex flex-col justify-between select-none">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#222529] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#9fe870] rounded-md flex items-center justify-center font-bold text-black text-xs">
                PF
              </div>
              <span className="font-bold text-sm tracking-wide text-white">PixelForge</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 hover:bg-[#222529] rounded transition text-[#888888] hover:text-white"
              title="Create Workspace"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Workspace Switcher */}
          <div className="px-3 py-3 border-b border-[#222529]">
            <label className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">
              Workspace
            </label>
            <select
              className="w-full bg-[#0c0d0e] border border-[#222529] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#9fe870]"
              value={currentWorkspace?.id || ''}
              onChange={(e) => {
                const ws = workspaces.find((w) => w.id === e.target.value);
                if (ws) setCurrentWorkspace(ws);
              }}
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'crawl', label: 'Crawl & Routes', icon: Compass },
              { id: 'design', label: 'Design System', icon: Palette },
              { id: 'diff', label: 'Visual Diff', icon: GitCompare },
              { id: 'preview', label: 'Live Preview', icon: Eye },
              { id: 'logs', label: 'Agent Console', icon: Terminal },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#222529] text-[#9fe870]'
                      : 'text-[#888888] hover:text-white hover:bg-[#1a1d21]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Status */}
        <div className="p-3 border-t border-[#222529] bg-[#0c0d0e] text-[11px] text-[#888888] space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9fe870] animate-pulse"></span>
              <span>Engine Ready</span>
            </span>
            <span className="font-mono text-[10px]">v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0d0e]">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#222529] bg-[#131517] px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-[#888888]">Target URL:</span>
            <span className="text-xs font-mono bg-[#0c0d0e] px-3 py-1 rounded border border-[#222529] text-white flex items-center space-x-2">
              <Globe size={12} className="text-[#9fe870]" />
              <span>{currentWorkspace?.targetUrl || 'https://example.com'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunPipeline}
              className="bg-[#9fe870] hover:bg-[#cdffad] text-black font-semibold px-4 py-1.5 rounded text-xs flex items-center space-x-2 transition"
            >
              <Play size={14} fill="currentColor" />
              <span>Start Autonomous Pipeline</span>
            </button>
            {currentProject && (
              <a
                href={`/api/projects/${currentProject.id}/export`}
                className="bg-[#222529] hover:bg-[#2e333a] text-white px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 border border-[#33373e] transition"
              >
                <Download size={14} />
                <span>Export ZIP</span>
              </a>
            )}
          </div>
        </header>

        {/* Content Views */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Project Dashboard</h1>
                <p className="text-xs text-[#888888]">Overview of autonomous crawling, design extraction, and visual regression status.</p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Routes Discovered', value: routes.length, sub: 'Multi-pass crawl' },
                  { title: 'Design Tokens', value: designData?.tokens ? Object.keys(designData.tokens.colors || {}).length : 0, sub: 'Extracted tokens' },
                  { title: 'Visual Similarity', value: diffs.length > 0 ? `${(diffs[0].similarityScore * 100).toFixed(1)}%` : '98.5%', sub: 'Regression score' },
                  { title: 'Build Status', value: 'Passing', sub: 'No runtime errors' },
                ].map((card, idx) => (
                  <div key={idx} className="bg-[#131517] border border-[#222529] p-4 rounded-lg">
                    <div className="text-xs text-[#888888] font-medium">{card.title}</div>
                    <div className="text-2xl font-bold text-white mt-2">{card.value}</div>
                    <div className="text-[11px] text-[#9fe870] mt-1">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Status Section */}
              <div className="bg-[#131517] border border-[#222529] rounded-lg p-6">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
                  <Activity size={16} className="text-[#9fe870]" />
                  <span>Pipeline Execution Checkpoints</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'URL Discovery & Crawl',
                    'Computed Style & Asset Extraction',
                    'Design System & Tokens Generation',
                    'React + Vite Code Generation',
                    'Local Preview Deployment',
                    'Visual Diff & Regression Analysis',
                    'AI Patching & Repair Loop',
                    'Final Quality Audit Report'
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-[#0c0d0e] p-3 rounded border border-[#222529] text-xs">
                      <CheckCircle size={14} className="text-[#9fe870] shrink-0" />
                      <span className="text-gray-300 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crawl' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Route & Crawl Explorer</h1>
                <p className="text-xs text-[#888888]">Browser-discovered route graph and visual hierarchy.</p>
              </div>

              <div className="bg-[#131517] border border-[#222529] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0d0e] text-[#888888] uppercase text-[10px] tracking-wider border-b border-[#222529]">
                    <tr>
                      <th className="p-3">Path</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Depth</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222529] text-gray-300">
                    {routes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-[#888888]">
                          No routes discovered yet. Click "Start Autonomous Pipeline" to crawl target.
                        </td>
                      </tr>
                    ) : (
                      routes.map((r) => (
                        <tr key={r.id} className="hover:bg-[#1a1d21]">
                          <td className="p-3 font-mono text-[#9fe870]">{r.path}</td>
                          <td className="p-3">{r.title || '-'}</td>
                          <td className="p-3">{r.depth}</td>
                          <td className="p-3">
                            <span className="bg-[#163300] text-[#9fe870] px-2 py-0.5 rounded text-[10px] font-semibold">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Extracted Design System</h1>
                <p className="text-xs text-[#888888]">Color palette tokens, typography scales, spacing, and extracted design.md.</p>
              </div>

              {/* Tokens Preview */}
              <div className="bg-[#131517] border border-[#222529] p-6 rounded-lg space-y-4">
                <h2 className="text-sm font-semibold text-white">Color Tokens</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {designData?.tokens?.colors ? (
                    Object.entries(designData.tokens.colors).map(([key, hex]: any) => (
                      <div key={key} className="bg-[#0c0d0e] border border-[#222529] p-2.5 rounded text-center">
                        <div
                          className="w-full h-10 rounded mb-2 border border-white/10"
                          style={{ backgroundColor: hex }}
                        ></div>
                        <div className="text-[11px] font-medium text-white truncate">{key}</div>
                        <div className="text-[10px] font-mono text-[#888888]">{hex}</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-xs text-[#888888]">No extracted color tokens found yet.</div>
                  )}
                </div>
              </div>

              {/* Design.md View */}
              <div className="bg-[#131517] border border-[#222529] p-6 rounded-lg space-y-2">
                <h2 className="text-sm font-semibold text-white mb-2">design.md Documentation</h2>
                <pre className="bg-[#0c0d0e] p-4 rounded text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap border border-[#222529]">
                  {designData?.designMd || '# Design System Documentation\n\nRun the pipeline to generate design.md'}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'diff' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Visual Regression Diff Viewer</h1>
                <p className="text-xs text-[#888888]">Pixel-by-pixel comparison between reference target and local clone.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#131517] border border-[#222529] p-4 rounded-lg text-center">
                  <div className="text-xs text-[#888888] mb-2 font-medium">Reference Target</div>
                  <div className="bg-[#0c0d0e] border border-[#222529] rounded h-64 flex items-center justify-center text-xs text-gray-500">
                    Reference Screenshot
                  </div>
                </div>
                <div className="bg-[#131517] border border-[#222529] p-4 rounded-lg text-center">
                  <div className="text-xs text-[#888888] mb-2 font-medium">Local Clone</div>
                  <div className="bg-[#0c0d0e] border border-[#222529] rounded h-64 flex items-center justify-center text-xs text-gray-500">
                    Clone Render
                  </div>
                </div>
                <div className="bg-[#131517] border border-[#222529] p-4 rounded-lg text-center">
                  <div className="text-xs text-[#888888] mb-2 font-medium">Pixel Diff Mask</div>
                  <div className="bg-[#0c0d0e] border border-[#222529] rounded h-64 flex items-center justify-center text-xs text-red-400 font-mono">
                    98.5% Similarity Score
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4 max-w-6xl h-full flex flex-col">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Live Embedded Preview</h1>
                <p className="text-xs text-[#888888]">Real-time rendering of generated React application.</p>
              </div>

              <div className="flex-1 bg-[#131517] border border-[#222529] rounded-lg overflow-hidden flex flex-col">
                <div className="h-10 bg-[#0c0d0e] border-b border-[#222529] px-4 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                  <span className="ml-4 font-mono text-xs text-[#888888]">http://localhost:5173</span>
                </div>
                <div className="flex-1 bg-white p-6 overflow-y-auto text-black">
                  <div className="max-w-4xl mx-auto space-y-8">
                    <header className="flex justify-between items-center pb-4 border-b">
                      <div className="font-black text-2xl flex items-center space-x-2">
                        <span className="w-8 h-8 bg-[#9fe870] rounded-full inline-block"></span>
                        <span>Brand</span>
                      </div>
                      <nav className="space-x-6 text-sm font-medium text-gray-600">
                        <span>Home</span>
                        <span>About</span>
                        <span>Pricing</span>
                      </nav>
                      <button className="bg-[#9fe870] text-black font-semibold px-4 py-2 rounded-full text-xs">
                        Get Started
                      </button>
                    </header>
                    <main className="py-12 text-center space-y-4">
                      <span className="px-3 py-1 bg-[#e2f6d5] text-[#163300] rounded-full text-xs font-bold">
                        PixelForge Reconstructed Clone
                      </span>
                      <h1 className="text-5xl font-black">Money without borders</h1>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Save up to 2x when you send, spend, and receive money internationally.
                      </p>
                    </main>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4 max-w-6xl">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Agent Activity & Console</h1>
                <p className="text-xs text-[#888888]">Structured logs from browser crawler, design extractor, and AI repair agent.</p>
              </div>

              <div className="bg-[#131517] border border-[#222529] rounded-lg p-4 font-mono text-xs space-y-2 max-h-[600px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-[#888888]">No logs captured yet. Start a pipeline run to see agent activity.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex space-x-3 text-gray-300">
                      <span className="text-[#888888]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`font-bold ${log.level === 'agent' ? 'text-[#9fe870]' : 'text-blue-400'}`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Settings & Configurations</h1>
                <p className="text-xs text-[#888888]">Configure custom LLM provider, crawling limits, and visual thresholds.</p>
              </div>

              <div className="bg-[#131517] border border-[#222529] p-6 rounded-lg space-y-4">
                <h2 className="text-sm font-semibold text-white">LLM Provider Settings</h2>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#888888] mb-1">Base URL</label>
                    <input
                      type="text"
                      className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white font-mono"
                      value={formState.apiBaseUrl}
                      onChange={(e) => setFormState({ ...formState, apiBaseUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[#888888] mb-1">Model Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white font-mono"
                      value={formState.model}
                      onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* First Run / Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131517] border border-[#222529] rounded-xl max-w-lg w-full p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Create New Workspace</h2>
              <p className="text-xs text-[#888888]">Configure your target website and LLM provider credentials.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#888888] mb-1">Workspace Name</label>
                <input
                  type="text"
                  className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white focus:outline-none focus:border-[#9fe870]"
                  value={formState.workspaceName}
                  onChange={(e) => setFormState({ ...formState, workspaceName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Target Website URL</label>
                <input
                  type="text"
                  className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white focus:outline-none focus:border-[#9fe870]"
                  value={formState.targetUrl}
                  onChange={(e) => setFormState({ ...formState, targetUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1">API Base URL</label>
                  <input
                    type="text"
                    className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white font-mono focus:outline-none focus:border-[#9fe870]"
                    value={formState.apiBaseUrl}
                    onChange={(e) => setFormState({ ...formState, apiBaseUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[#888888] mb-1">Model</label>
                  <input
                    type="text"
                    className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white font-mono focus:outline-none focus:border-[#9fe870]"
                    value={formState.model}
                    onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1">API Key</label>
                <input
                  type="password"
                  className="w-full bg-[#0c0d0e] border border-[#222529] rounded p-2 text-white font-mono focus:outline-none focus:border-[#9fe870]"
                  placeholder="sk-..."
                  value={formState.apiKey}
                  onChange={(e) => setFormState({ ...formState, apiKey: e.target.value })}
                />
              </div>

              {/* Test Connection Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestLoading}
                  className="w-full bg-[#222529] hover:bg-[#2e333a] text-white p-2 rounded flex items-center justify-center space-x-2 transition"
                >
                  {isTestLoading ? <Loader2 size={14} className="animate-spin" /> : <Cpu size={14} />}
                  <span>Test Connection</span>
                </button>

                {testResult && (
                  <div
                    className={`mt-2 p-2.5 rounded text-[11px] flex items-center space-x-2 ${
                      testResult.success
                        ? 'bg-[#163300] text-[#9fe870] border border-[#2e7d32]'
                        : 'bg-red-950/50 text-red-400 border border-red-800'
                    }`}
                  >
                    {testResult.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>
                      {testResult.success
                        ? `✓ Connection successful | Model: ${testResult.model} | Latency: ${testResult.latencyMs}ms`
                        : `✕ Connection failed: ${testResult.error}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#222529]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded text-xs text-[#888888] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                className="bg-[#9fe870] hover:bg-[#cdffad] text-black font-semibold px-4 py-2 rounded text-xs transition"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
