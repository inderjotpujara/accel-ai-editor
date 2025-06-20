'use client';

import React, { useMemo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { useEditorStore } from '../../hooks/useEditorStore';

// Map language names to CodeMirror language extensions
const getLanguageExtension = (language: string) => {
  const languageMap: Record<string, any> = {
    python: python(),
    java: java(),
    javascript: javascript({ jsx: false }),
    jsx: javascript({ jsx: true }),
    typescript: javascript({ typescript: true }),
    tsx: javascript({ jsx: true, typescript: true }),
    json: json(),
    markdown: markdown(),
    html: html(),
    css: css(),
    scss: css(),
    sql: sql(),
    xml: xml(),
    yaml: yaml(),
    yml: yaml(),
  };

  return languageMap[language] || [];
};

const getFileIcon = (fileName: string, language: string) => {
  // Check language first, then fallback to extension
  switch (language) {
    case 'java':
      return '☕';
    case 'python':
      return '🐍';
    case 'javascript':
    case 'typescript':
      return '⚡';
    case 'json':
      return '📋';
    case 'markdown':
      return '📝';
    case 'html':
      return '🌐';
    case 'css':
    case 'scss':
      return '🎨';
    case 'xml':
      return '📄';
    case 'yaml':
      return '⚙️';
    case 'shell':
      return '💻';
    case 'sql':
      return '🗃️';
    default:
      return '📄';
  }
};

export const CodeEditor: React.FC = () => {
  const { openFiles, activeFileId, updateFileContent, fontSize } =
    useEditorStore();

  const activeFile = openFiles.find(file => file.id === activeFileId);

  const handleEditorChange = useCallback(
    (value: string) => {
      if (activeFileId) {
        updateFileContent(activeFileId, value);
      }
    },
    [activeFileId, updateFileContent]
  );

  // Create CodeMirror extensions
  const extensions = useMemo(() => {
    const exts = [
      EditorView.theme({
        '&': {
          fontSize: `${fontSize}px`,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          height: '100%',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '100%',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-scroller': {
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          overflow: 'auto !important',
        },
      }),
      EditorView.lineWrapping,
    ];

    if (activeFile) {
      const langExtension = getLanguageExtension(activeFile.language);
      if (langExtension) {
        exts.push(langExtension);
      }
    }

    return exts;
  }, [activeFile, fontSize]);

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-medium text-gray-300 mb-2">
            No File Open
          </h2>
          <p className="text-gray-400">
            Select a file from the explorer to start editing
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Or use Ctrl+O to open a file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* File header with path and actions */}
      <div className="px-4 py-2 border-b bg-gray-800 border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              {getFileIcon(activeFile.name, activeFile.language)}
            </span>
            <span className="text-sm font-medium text-gray-200">
              {activeFile.name}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                activeFile.language === 'java'
                  ? 'bg-orange-900 text-orange-200'
                  : activeFile.language === 'python'
                    ? 'bg-blue-900 text-blue-200'
                    : activeFile.language === 'javascript' ||
                        activeFile.language === 'typescript'
                      ? 'bg-yellow-900 text-yellow-200'
                      : activeFile.language === 'html'
                        ? 'bg-red-900 text-red-200'
                        : activeFile.language === 'css' ||
                            activeFile.language === 'scss'
                          ? 'bg-pink-900 text-pink-200'
                          : 'bg-gray-700 text-gray-200'
              }`}
            >
              {activeFile.language.toUpperCase()}
            </span>

            {/* Dirty state indicator (read-only) */}
            {activeFile.isDirty && (
              <div className="flex items-center space-x-1">
                <span className="text-orange-400 text-xs">
                  ● (unsaved changes)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">{activeFile.path}</div>
          </div>
        </div>
      </div>

      {/* CodeMirror Editor */}
      <div className="h-[calc(100%-3rem)]">
        <CodeMirror
          value={activeFile.content}
          onChange={handleEditorChange}
          theme={oneDark}
          extensions={extensions}
          editable={true}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
            searchKeymap: true,
          }}
          height="100%"
          style={{
            fontSize: `${fontSize}px`,
          }}
        />
      </div>
    </div>
  );
};
