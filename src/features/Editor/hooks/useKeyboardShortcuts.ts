import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  // Currently no keyboard shortcuts - placeholder for future features
}

export const useKeyboardShortcuts = ({}: UseKeyboardShortcutsProps = {}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Placeholder for future keyboard shortcuts
      // Currently no shortcuts implemented
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
