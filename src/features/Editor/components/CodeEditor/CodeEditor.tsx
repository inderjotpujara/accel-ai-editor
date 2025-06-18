import React from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
}) => {
  return (
    <div className="h-full bg-gray-900 text-green-400 font-mono">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-400 capitalize">
            {language}
          </div>
        </div>
      </div>
      <div className="p-4 h-full">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-green-400 font-mono text-sm leading-relaxed resize-none focus:outline-none"
          spellCheck={false}
          placeholder="Start coding..."
        />
      </div>
    </div>
  );
};
