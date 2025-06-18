import React from 'react';
import { Button } from '@/components/ui/Button';

interface ToolPanelProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onClose: () => void;
}

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'rust',
  'go',
  'html',
  'css',
  'json',
];

export const ToolPanel: React.FC<ToolPanelProps> = ({
  language,
  onLanguageChange,
  onClose,
}) => {
  return (
    <div className="h-full bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tools</h3>
        <Button variant="secondary" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI Assistant
          </h4>
          <div className="space-y-2">
            <Button variant="primary" size="sm" className="w-full">
              Generate Code
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Explain Code
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Fix Issues
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              Format Code
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Run Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
