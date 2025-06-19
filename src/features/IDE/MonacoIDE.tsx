'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FileTabs, FileItem } from './FileTabs';
import { ChatPanel } from './ChatPanel';
import { Button } from '@/components/ui/Button';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(m => m.Editor), { ssr: false });
const MonacoDiffEditor = dynamic(() => import('@monaco-editor/react').then(m => m.DiffEditor), { ssr: false });

const defaultFiles: FileItem[] = [
  { name: 'index.ts', language: 'typescript', code: "console.log('Hello');" },
  { name: 'main.go', language: 'go', code: 'package main\nfunc main() {}' },
];

export const MonacoIDE: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<'light' | 'vs-dark'>('light');
  const [showDiff, setShowDiff] = useState(false);
  const activeFile = files[active];

  const onChange = (value?: string) => {
    const updated = [...files];
    updated[active] = { ...activeFile, code: value || '' };
    setFiles(updated);
  };

  const addFile = () => {
    setFiles([...files, { name: `file${files.length + 1}.txt`, language: 'typescript', code: '' }]);
    setActive(files.length);
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-[80vh]">
      <div className="col-span-3 flex flex-col border">
        <FileTabs files={files} active={active} onSelect={setActive} onAdd={addFile} />
        <div className="flex items-center space-x-2 p-2 border-b">
          <input
            value={activeFile.language}
            onChange={e => {
              const updated = [...files];
              updated[active] = { ...activeFile, language: e.target.value };
              setFiles(updated);
            }}
            className="border rounded px-2 py-1 text-sm"
            placeholder="language"
          />
          <Button variant="secondary" size="sm" onClick={() => setTheme(t => (t === 'light' ? 'vs-dark' : 'light'))}>
            Theme: {theme}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowDiff(d => !d)}>
            {showDiff ? 'Hide Diff' : 'Show Diff'}
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {showDiff ? (
            <MonacoDiffEditor
              height="100%"
              original={activeFile.code}
              modified={activeFile.code}
              language={activeFile.language}
              theme={theme}
              onChange={onChange}
            />
          ) : (
            <MonacoEditor
              height="100%"
              language={activeFile.language}
              value={activeFile.code}
              theme={theme}
              onChange={onChange}
            />
          )}
        </div>
      </div>
      <div className="border flex flex-col">
        <ChatPanel />
      </div>
    </div>
  );
};
