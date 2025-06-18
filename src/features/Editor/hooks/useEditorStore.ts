import { create } from 'zustand';

interface EditorState {
  code: string;
  language: string;
  theme: 'light' | 'dark';
  fontSize: number;
  isAiAssistEnabled: boolean;
}

interface EditorActions {
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (fontSize: number) => void;
  toggleAiAssist: () => void;
  resetEditor: () => void;
}

type EditorStore = EditorState & EditorActions;

const initialState: EditorState = {
  code: `// Welcome to Accel AI Editor
// Start typing your code here...

function hello() {
  console.log('Hello, World!');
}

hello();`,
  language: 'javascript',
  theme: 'light',
  fontSize: 14,
  isAiAssistEnabled: true,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,
  
  setCode: (code: string) => set({ code }),
  
  setLanguage: (language: string) => set({ language }),
  
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  
  setFontSize: (fontSize: number) => set({ fontSize }),
  
  toggleAiAssist: () => set(state => ({ 
    isAiAssistEnabled: !state.isAiAssistEnabled 
  })),
  
  resetEditor: () => set(initialState),
}));
