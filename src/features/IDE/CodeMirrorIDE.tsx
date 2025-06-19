'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { FileTabs, FileItem } from './FileTabs';
import { ChatPanel } from './ChatPanel';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button } from '@/components/ui/Button';
import CodeMirrorMergeDefault from 'react-codemirror-merge';
const CodeMirrorMerge = CodeMirrorMergeDefault as any;
const MergeOriginal = (CodeMirrorMergeDefault as any).Original;
const MergeModified = (CodeMirrorMergeDefault as any).Modified;

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then(m => m.default),
  { ssr: false }
);

const languageLoaders: Record<string, () => Promise<any>> = {
  javascript: () =>
    import('@codemirror/lang-javascript').then(m =>
      m.javascript({ jsx: true })
    ),
  typescript: () =>
    import('@codemirror/lang-javascript').then(m =>
      m.javascript({ typescript: true })
    ),
  python: () => import('@codemirror/lang-python').then(m => m.python()),
  java: () => import('@codemirror/lang-java').then(m => m.java()),
  cpp: () => import('@codemirror/lang-cpp').then(m => m.cpp()),
  rust: () => import('@codemirror/lang-rust').then(m => m.rust()),
  go: () => import('@codemirror/lang-go').then(m => m.go()),
  xml: () => import('@codemirror/lang-xml').then(m => m.xml()),
  css: () => import('@codemirror/lang-css').then(m => m.css()),
};

const defaultFiles: FileItem[] = [
  { name: 'index.js', language: 'javascript', code: "console.log('Hello');" },
  { name: 'app.py', language: 'python', code: 'print("Hello")' },
];

export const CodeMirrorIDE: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [extensions, setExtensions] = useState<any[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const activeFile = files[active];

  useEffect(() => {
    languageLoaders[activeFile.language]().then(ext => setExtensions([ext]));
  }, [activeFile.language]);

  const onChange = (value: string) => {
    const updated = [...files];
    updated[active] = { ...activeFile, code: value };
    setFiles(updated);
  };

  const addFile = () => {
    setFiles([
      ...files,
      { name: `file${files.length + 1}.txt`, language: 'javascript', code: '' },
    ]);
    setActive(files.length);
  };

  return (
    <div className="grid grid-cols-[200px_1fr_300px] h-[80vh] border rounded overflow-hidden">
      <div
        className={clsx(
          theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100',
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
                ? theme === 'dark'
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
          theme={theme}
        />
        <div className="flex items-center space-x-2 p-2 border-b">
          <select
            value={activeFile.language}
            onChange={e => {
              const updated = [...files];
              updated[active] = { ...activeFile, language: e.target.value };
              setFiles(updated);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {Object.keys(languageLoaders).map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
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
            <CodeMirrorMerge theme={theme === 'dark' ? oneDark : 'light'}>
              <MergeOriginal value={activeFile.code} extensions={extensions} />
              <MergeModified value={activeFile.code} extensions={extensions} />
            </CodeMirrorMerge>
          ) : (
            <CodeMirror
              value={activeFile.code}
              height="100%"
              theme={theme === 'dark' ? oneDark : 'light'}
              extensions={extensions}
              onChange={onChange}
            />
          )}
        </div>
      </div>
      <div
        className={clsx(
          'flex flex-col',
          theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'
        )}
      >
        <ChatPanel />
      </div>
    </div>
  );
};
