import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditorFeature } from '../EditorFeature';

// Mock the child components
jest.mock('../components/CodeEditor', () => ({
  CodeEditor: ({ code, language, onChange }: any) => (
    <div data-testid="code-editor">
      <div>Language: {language}</div>
      <textarea
        data-testid="code-textarea"
        value={code}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  ),
}));

jest.mock('../components/ToolPanel', () => ({
  ToolPanel: ({ language, onLanguageChange, onClose }: any) => (
    <div data-testid="tool-panel">
      <div>Current Language: {language}</div>
      <button onClick={() => onLanguageChange('python')}>
        Change to Python
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('EditorFeature Component', () => {
  it('should render code editor and tool panel', () => {
    render(<EditorFeature />);

    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    expect(screen.getByTestId('tool-panel')).toBeInTheDocument();
  });

  it('should display default code and language', () => {
    render(<EditorFeature />);

    expect(screen.getByText('Language: javascript')).toBeInTheDocument();
    expect(
      screen.getByText('Current Language: javascript')
    ).toBeInTheDocument();
  });

  it('should update code when typing in editor', () => {
    render(<EditorFeature />);

    const textarea = screen.getByTestId('code-textarea');
    fireEvent.change(textarea, { target: { value: 'console.log("test");' } });

    expect(textarea).toHaveValue('console.log("test");');
  });

  it('should change language when language is updated', () => {
    render(<EditorFeature />);

    const changeButton = screen.getByText('Change to Python');
    fireEvent.click(changeButton);

    expect(screen.getByText('Language: python')).toBeInTheDocument();
    expect(screen.getByText('Current Language: python')).toBeInTheDocument();
  });

  it('should hide tool panel when close button is clicked', () => {
    render(<EditorFeature />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('tool-panel')).not.toBeInTheDocument();
  });

  it('should have proper CSS classes for layout', () => {
    render(<EditorFeature />);

    const container = screen.getByTestId('code-editor').closest('.card');
    expect(container).toHaveClass('card', 'p-0', 'overflow-hidden');
  });
});
