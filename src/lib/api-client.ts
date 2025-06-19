import {
  ProjectStructureResponse,
  FileContentResponse,
  FileSaveResponse,
  EditorError,
} from './types';

/**
 * Simple API client for the web editor - instant responses
 */
export class EditorApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch project structure from API (instant)
   */
  async getProjectStructure(): Promise<ProjectStructureResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load project structure');
      }

      return data as ProjectStructureResponse;
    } catch (error) {
      console.error('Error fetching project structure:', error);
      throw this.createError('PROJECT_STRUCTURE_FETCH_ERROR', error);
    }
  }

  /**
   * Fetch file content from API (instant)
   */
  async getFileContent(path: string): Promise<FileContentResponse> {
    if (!path) {
      throw new Error('File path is required');
    }

    try {
      const url = `${this.baseUrl}/api/files/content?path=${encodeURIComponent(path)}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load file content');
      }

      return data as FileContentResponse;
    } catch (error) {
      console.error(`Error fetching file content for ${path}:`, error);
      throw this.createError('FILE_CONTENT_FETCH_ERROR', error);
    }
  }

  /**
   * Save file content to API (instant)
   */
  async saveFileContent(
    path: string,
    content: string
  ): Promise<FileSaveResponse> {
    if (!path || content === undefined) {
      throw new Error('File path and content are required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/files/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, content }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save file');
      }

      return data as FileSaveResponse;
    } catch (error) {
      console.error(`Error saving file content for ${path}:`, error);
      throw this.createError('FILE_SAVE_ERROR', error);
    }
  }

  /**
   * Create standardized error object
   */
  private createError(code: string, originalError: any): EditorError {
    return {
      code,
      message:
        originalError instanceof Error
          ? originalError.message
          : String(originalError),
      details: originalError,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Health check endpoint (instant)
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw this.createError('HEALTH_CHECK_ERROR', error);
    }
  }
}

// Create singleton instance
export const apiClient = new EditorApiClient();

// Export convenience functions for backward compatibility
export const fetchProjectStructure = () => apiClient.getProjectStructure();
export const fetchFileContent = (path: string) =>
  apiClient.getFileContent(path);
export const saveFileContent = (path: string, content: string) =>
  apiClient.saveFileContent(path, content);

// Export types for consumers
export type {
  ProjectStructureResponse,
  FileContentResponse,
  FileSaveResponse,
  EditorError,
};
