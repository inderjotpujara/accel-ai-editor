'use client';
import React from 'react';
import clsx from 'clsx';
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
  theme?: 'light' | 'dark';
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  active,
  onSelect,
  onAdd,
  theme = 'light',
}) => {
  return (
    <div
      className={clsx(
        'flex items-center space-x-2 border-b p-2',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      {files.map((file, idx) => (
        <button
          key={file.name + idx}
          className={clsx(
            'px-3 py-1 text-sm rounded-t',
            idx === active
              ? theme === 'dark'
                ? 'bg-gray-900 border border-gray-700 border-b-0 text-white'
                : 'bg-white border border-gray-200 border-b-0'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100'
          )}
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
