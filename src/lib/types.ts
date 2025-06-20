// Core data structures for the editor
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  children?: FileNode[];
}

export interface OpenFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  originalContent?: string;
  lastModified?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ProjectStructureResponse {
  success: boolean;
  data: FileNode[];
  rootPath: string;
  metadata: {
    timestamp: string;
    totalFiles: number;
    totalFolders: number;
  };
}

export interface FileContentResponse {
  success: boolean;
  data: {
    path: string;
    content: string;
    size: number;
    lastModified: string;
    encoding: string;
    cached?: boolean;
  };
}

// Editor state interfaces
export interface EditorState {
  fileTree: FileNode[];
  openFiles: OpenFile[];
  activeFileId: string | null;
  fontSize: number;
  isAiAssistEnabled: boolean;
  isFileExplorerOpen: boolean;
  isDiffViewOpen: boolean;
  isLoading: boolean;
  error: string | null;
  loadingFiles: boolean;
  errorFiles: string | null;
  loadingContent: Record<string, boolean>;
  activeOperations: Set<string>;
}

export interface EditorActions {
  // File tree operations
  loadFiles: () => Promise<void>;
  refreshFileTree: () => Promise<void>;

  // File operations
  openFile: (file: FileNode) => Promise<void>;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;

  // View operations
  toggleDiffView: () => void;
  getDirtyFiles: () => OpenFile[];

  // Settings
  setFontSize: (fontSize: number) => void;
  toggleAiAssist: () => void;
  toggleFileExplorer: () => void;

  // Utilities
  setError: (error: string | null) => void;
  resetEditor: () => void;
  clearError: () => void;
}

export type EditorStore = EditorState & EditorActions;

// API client types
export interface ApiClient {
  getProjectStructure: () => Promise<ProjectStructureResponse>;
  getFileContent: (path: string) => Promise<FileContentResponse>;
}

// Configuration types
export interface EditorConfig {
  apiBaseUrl: string;
  defaultFontSize: number;
  supportedLanguages: string[];
  theme: 'light' | 'dark';
}

// Error types
export interface EditorError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Language configuration
export interface LanguageConfig {
  id: string;
  name: string;
  extensions: string[];
  codemirrorLanguage: string;
  icon: string;
  defaultTabSize: number;
  supportsFormatting: boolean;
}
