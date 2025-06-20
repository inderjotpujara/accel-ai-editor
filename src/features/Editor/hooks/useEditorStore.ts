import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  FileNode,
  OpenFile,
  EditorState,
  EditorActions,
  EditorStore,
} from '../../../lib/types';
import {
  fetchProjectStructure,
  fetchFileContent,
} from '../../../lib/api-client';

const initialState: EditorState = {
  fileTree: [],
  openFiles: [],
  activeFileId: null,
  fontSize: 14,
  isAiAssistEnabled: true,
  isFileExplorerOpen: true,
  isDiffViewOpen: false,
  isLoading: false,
  error: null,
  loadingFiles: false,
  errorFiles: null,
  loadingContent: {},
  activeOperations: new Set(),
};

// Generate unique ID for file nodes
function generateFileId(path: string): string {
  return Buffer.from(path)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '');
}

// Map file extensions to language identifiers for syntax highlighting
function getLanguageFromExtension(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();

  const extensionMap: Record<string, string> = {
    // Python
    py: 'python',
    pyw: 'python',
    pyi: 'python',

    // Java
    java: 'java',

    // JavaScript/TypeScript
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',

    // Web
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',

    // Data formats
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',

    // Documentation
    md: 'markdown',
    markdown: 'markdown',
    txt: 'plaintext',
    rst: 'restructuredtext',

    // Configuration
    ini: 'ini',
    cfg: 'ini',
    conf: 'ini',
    properties: 'properties',

    // Shell/Scripts
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    bat: 'bat',
    cmd: 'bat',
    ps1: 'powershell',

    // Other languages
    sql: 'sql',
    r: 'r',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    clj: 'clojure',
    hs: 'haskell',
    ml: 'ocaml',
    fs: 'fsharp',
    vb: 'vb',
    pl: 'perl',
    lua: 'lua',
    dart: 'dart',
    elm: 'elm',
    ex: 'elixir',
    exs: 'elixir',
    erl: 'erlang',
  };

  return extensionMap[extension || ''] || 'plaintext';
}

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      loadFiles: async () => {
        const operationId = 'loadFiles';

        // Prevent duplicate requests
        if (get().activeOperations.has(operationId)) {
          return;
        }

        try {
          set(state => ({
            loadingFiles: true,
            errorFiles: null,
            activeOperations: new Set(state.activeOperations).add(operationId),
          }));

          const response = await fetchProjectStructure();

          set(state => ({
            fileTree: response.data,
            loadingFiles: false,
            activeOperations: new Set(
              Array.from(state.activeOperations).filter(
                id => id !== operationId
              )
            ),
          }));
        } catch (error) {
          console.error('Failed to load files:', error);
          set(state => ({
            errorFiles:
              error instanceof Error ? error.message : 'Failed to load files',
            loadingFiles: false,
            activeOperations: new Set(
              Array.from(state.activeOperations).filter(
                id => id !== operationId
              )
            ),
          }));
        }
      },

      openFile: async (file: FileNode) => {
        const operationId = `openFile:${file.path}`;

        // Prevent duplicate requests
        if (get().activeOperations.has(operationId)) {
          return;
        }

        // Check if file is already open
        const existingFile = get().openFiles.find(f => f.id === file.id);
        if (existingFile) {
          set({ activeFileId: file.id });
          return;
        }

        try {
          set(state => ({
            loadingContent: { ...state.loadingContent, [file.id]: true },
            activeOperations: new Set(state.activeOperations).add(operationId),
          }));

          const response = await fetchFileContent(file.path);

          const openFile: OpenFile = {
            id: file.id,
            name: file.name,
            path: file.path,
            content: response.data.content,
            language: getLanguageFromExtension(file.path),
            isDirty: false,
            originalContent: response.data.content,
            lastModified: response.data.lastModified,
          };

          set(state => ({
            openFiles: [...state.openFiles, openFile],
            activeFileId: file.id,
            loadingContent: { ...state.loadingContent, [file.id]: false },
            activeOperations: new Set(
              Array.from(state.activeOperations).filter(
                id => id !== operationId
              )
            ),
          }));
        } catch (error) {
          console.error('Failed to open file:', error);
          set(state => ({
            loadingContent: { ...state.loadingContent, [file.id]: false },
            activeOperations: new Set(
              Array.from(state.activeOperations).filter(
                id => id !== operationId
              )
            ),
          }));
        }
      },

      closeFile: (fileId: string) => {
        set(state => {
          const newOpenFiles = state.openFiles.filter(f => f.id !== fileId);
          let newActiveFileId = state.activeFileId;

          // If closing the active file, switch to another file
          if (state.activeFileId === fileId) {
            newActiveFileId =
              newOpenFiles.length > 0
                ? newOpenFiles[newOpenFiles.length - 1].id
                : null;
          }

          return {
            openFiles: newOpenFiles,
            activeFileId: newActiveFileId,
          };
        });
      },

      setActiveFile: (fileId: string) => {
        set({ activeFileId: fileId });
      },

      updateFileContent: (fileId: string, content: string) => {
        set(state => ({
          openFiles: state.openFiles.map(f =>
            f.id === fileId && f.content !== content
              ? { ...f, content, isDirty: true }
              : f
          ),
        }));
      },

      toggleDiffView: () => {
        set(state => ({
          isDiffViewOpen: !state.isDiffViewOpen,
        }));
      },

      getDirtyFiles: () => {
        return get().openFiles.filter(file => file.isDirty);
      },

      setFontSize: (fontSize: number) => {
        // Validate font size
        const validFontSize = Math.max(8, Math.min(32, fontSize));
        set({ fontSize: validFontSize });
      },

      toggleAiAssist: () =>
        set(state => ({
          isAiAssistEnabled: !state.isAiAssistEnabled,
        })),

      toggleFileExplorer: () =>
        set(state => ({
          isFileExplorerOpen: !state.isFileExplorerOpen,
        })),

      setError: (error: string | null) => set({ error }),

      resetEditor: () => {
        // Clear any active operations
        get().activeOperations.clear();

        set({
          ...initialState,
          fileTree: get().fileTree, // Keep the file tree
        });
      },

      clearError: () => {
        set({ errorFiles: null });
      },

      refreshFileTree: async () => {
        await get().loadFiles();
      },
    }),
    {
      name: 'editor-store',
    }
  )
);
