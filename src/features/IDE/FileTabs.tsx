'use client';
import React from 'react';
import { Button } from '@/components/ui/Button';

export interface FileItem {
  name: string;
  language: string;
  code: string;
}

interface FileTabsProps {
  files: FileItem[];
  active: number;
  onSelect: (idx: number) => void;
  onAdd: () => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({ files, active, onSelect, onAdd }) => {
  return (
    <div className="flex items-center space-x-2 border-b border-gray-200 p-2 bg-gray-50">
      {files.map((file, idx) => (
        <button
          key={file.name + idx}
          className={
            'px-3 py-1 text-sm rounded-t ' +
            (idx === active ? 'bg-white border border-gray-200 border-b-0' : 'bg-gray-100')
          }
          onClick={() => onSelect(idx)}
        >
          {file.name}
        </button>
      ))}
      <Button variant="secondary" size="sm" onClick={onAdd}>
        +
      </Button>
    </div>
  );
};
