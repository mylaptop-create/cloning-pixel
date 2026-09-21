export interface WorkspaceConfig {
  id: string;
  name: string;
  location: string;
  targetUrl: string;
  llmProvider: 'openai' | 'openai-compatible' | 'anthropic-compatible' | 'custom';
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrawlSettings {
  sameOriginOnly: boolean;
  maxPages: number;
  maxDepth: number;
  includeQueryRoutes: boolean;
  includeHashRoutes: boolean;
}

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

export interface VisualSettings {
  threshold: number;
  maxIterations: number;
  viewports: ViewportConfig[];
}

export interface ProjectConfig {
  id: string;
  workspaceId: string;
  name: string;
  targetUrl: string;
  enableWiseDesignSystem?: boolean;
  crawl: CrawlSettings;
  visual: VisualSettings;
  createdAt: string;
  updatedAt: string;
}

export interface RouteNode {
  id: string;
  projectId: string;
  url: string;
  path: string;
  title?: string;
  status: 'discovered' | 'crawled' | 'generated' | 'failed';
  depth: number;
  parentPath?: string;
  metadata?: Record<string, any>;
}

export interface DiscoveredAsset {
  id: string;
  projectId: string;
  url: string;
  localPath: string;
  type: 'image' | 'svg' | 'font' | 'video' | 'stylesheet' | 'script';
  mimeType?: string;
  size?: number;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, number>;
  motion: Record<string, any>;
}

export interface AgentTask {
  id: string;
  projectId: string;
  status: 'pending' | 'running' | 'blocked' | 'completed' | 'failed' | 'needs-review';
  priority: number;
  description: string;
  stage: 'crawl' | 'analyze' | 'design' | 'generate' | 'preview' | 'compare' | 'repair' | 'validate';
  evidence?: any;
  files?: string[];
  result?: any;
  createdAt: string;
  updatedAt: string;
}

export interface DiffResult {
  id: string;
  projectId: string;
  routePath: string;
  viewport: string;
  iteration: number;
  similarityScore: number;
  mismatchPixels: number;
  referenceImage: string;
  cloneImage: string;
  diffImage: string;
  overlayImage: string;
  classifications: DiffClassification[];
  createdAt: string;
}

export interface DiffClassification {
  type: 'POSITION' | 'SIZE' | 'SPACING' | 'FONT' | 'COLOR' | 'IMAGE' | 'BORDER' | 'RADIUS' | 'SHADOW' | 'RESPONSIVE' | 'CONTENT' | 'MISSING_ELEMENT' | 'EXTRA_ELEMENT' | 'ANIMATION' | 'INTERACTION';
  element?: string;
  description: string;
  suggestedPatch?: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface AgentLog {
  id: string;
  projectId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'agent';
  message: string;
  details?: any;
}
