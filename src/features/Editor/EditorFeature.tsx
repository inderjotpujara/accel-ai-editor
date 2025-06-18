'use client';

import React, { useState, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { ToolPanel } from './components/ToolPanel';
import { useEditorStore } from './hooks/useEditorStore';

export const EditorFeature: React.FC = () => {
  const { code, setCode, language, setLanguage } = useEditorStore();
  const [isToolPanelOpen, setIsToolPanelOpen] = useState(true);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
    },
    [setCode]
  );

  const toggleToolPanel = useCallback(() => {
    setIsToolPanelOpen(prev => !prev);
  }, []);

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex h-96">
        <div className="flex-1">
          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
          />
        </div>
        {isToolPanelOpen && (
          <div className="w-80 border-l border-gray-200">
            <ToolPanel
              language={language}
              onLanguageChange={setLanguage}
              onClose={toggleToolPanel}
            />
          </div>
        )}
      </div>
    </div>
  );
};
