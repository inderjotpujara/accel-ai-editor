'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { FileTabs, FileItem } from './FileTabs';
import { ChatPanel } from './ChatPanel';
import { Button } from '@/components/ui/Button';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(m => m.Editor),
  { ssr: false }
);
const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then(m => m.DiffEditor),
  { ssr: false }
);

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
    setFiles([
      ...files,
      { name: `file${files.length + 1}.txt`, language: 'typescript', code: '' },
    ]);
    setActive(files.length);
  };

  return (
    <div className="grid grid-cols-[200px_1fr_300px] h-[80vh] border rounded overflow-hidden">
      <div
        className={clsx(
          theme === 'vs-dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100',
          'p-2 space-y-1'
        )}
      >
        <div className="font-semibold text-sm mb-1">Explorer</div>
        {files.map((file, idx) => (
          <div
            key={file.name + idx}
            className={clsx(
              'cursor-pointer px-2 py-1 rounded',
              idx === active
                ? theme === 'vs-dark'
                  ? 'bg-gray-700'
                  : 'bg-white'
                : 'hover:bg-gray-700/50'
            )}
            onClick={() => setActive(idx)}
          >
            {file.name}
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={addFile}
        >
          Add File
        </Button>
      </div>
      <div className="flex flex-col border-r">
        <FileTabs
          files={files}
          active={active}
          onSelect={setActive}
          onAdd={addFile}
          theme={theme === 'vs-dark' ? 'dark' : 'light'}
        />
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme(t => (t === 'light' ? 'vs-dark' : 'light'))}
          >
            Theme: {theme}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDiff(d => !d)}
          >
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
      <div
        className={clsx(
          'flex flex-col',
          theme === 'vs-dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'
        )}
      >
        <ChatPanel />
      </div>
    </div>
  );
};
