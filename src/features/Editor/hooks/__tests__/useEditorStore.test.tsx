import { act, renderHook } from '@testing-library/react';
import { useEditorStore } from '../useEditorStore';

describe('useEditorStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useEditorStore());
    act(() => {
      result.current.resetEditor();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useEditorStore());

    expect(result.current.code).toContain('// Welcome to Accel AI Editor');
    expect(result.current.language).toBe('javascript');
    expect(result.current.theme).toBe('light');
    expect(result.current.fontSize).toBe(14);
    expect(result.current.isAiAssistEnabled).toBe(true);
  });

  it('should update code', () => {
    const { result } = renderHook(() => useEditorStore());

    act(() => {
      result.current.setCode('console.log("Hello World");');
    });

    expect(result.current.code).toBe('console.log("Hello World");');
  });

  it('should update language', () => {
    const { result } = renderHook(() => useEditorStore());

    act(() => {
      result.current.setLanguage('python');
    });

    expect(result.current.language).toBe('python');
  });

  it('should update theme', () => {
    const { result } = renderHook(() => useEditorStore());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should update font size', () => {
    const { result } = renderHook(() => useEditorStore());

    act(() => {
      result.current.setFontSize(16);
    });

    expect(result.current.fontSize).toBe(16);
  });

  it('should toggle AI assist', () => {
    const { result } = renderHook(() => useEditorStore());

    act(() => {
      result.current.toggleAiAssist();
    });

    expect(result.current.isAiAssistEnabled).toBe(false);

    act(() => {
      result.current.toggleAiAssist();
    });

    expect(result.current.isAiAssistEnabled).toBe(true);
  });

  it('should reset editor to initial state', () => {
    const { result } = renderHook(() => useEditorStore());

    // Make some changes
    act(() => {
      result.current.setCode('new code');
      result.current.setLanguage('python');
      result.current.setTheme('dark');
      result.current.setFontSize(18);
      result.current.toggleAiAssist();
    });

    // Reset
    act(() => {
      result.current.resetEditor();
    });

    expect(result.current.code).toContain('// Welcome to Accel AI Editor');
    expect(result.current.language).toBe('javascript');
    expect(result.current.theme).toBe('light');
    expect(result.current.fontSize).toBe(14);
    expect(result.current.isAiAssistEnabled).toBe(true);
  });
});
