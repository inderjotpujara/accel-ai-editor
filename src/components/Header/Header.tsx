'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Accel Editor</h1>
          </div>
          <nav className="flex items-center space-x-4" role="navigation">
            <Button variant="secondary" size="sm">
              Settings
            </Button>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
