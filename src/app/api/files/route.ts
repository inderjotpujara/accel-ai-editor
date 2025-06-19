import { NextRequest, NextResponse } from 'next/server';
import { FileNode } from '@/lib/types';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  children?: FileNode[];
}

// Generate unique ID for file nodes
function generateId(filePath: string): string {
  return Buffer.from(filePath)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '');
}

// Get language from file extension
function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    py: 'python',
    java: 'java',
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    json: 'json',
    md: 'markdown',
    txt: 'plaintext',
  };
  return languageMap[ext || ''] || 'plaintext';
}

// Mock project structure - represents a modern multi-language project
const mockProjectStructure: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        id: 'src/main',
        name: 'main',
        type: 'folder',
        path: 'src/main',
        children: [
          {
            id: 'src/main/java',
            name: 'java',
            type: 'folder',
            path: 'src/main/java',
            children: [
              {
                id: 'src/main/java/com',
                name: 'com',
                type: 'folder',
                path: 'src/main/java/com',
                children: [
                  {
                    id: 'src/main/java/com/example',
                    name: 'example',
                    type: 'folder',
                    path: 'src/main/java/com/example',
                    children: [
                      {
                        id: 'src/main/java/com/example/demo',
                        name: 'demo',
                        type: 'folder',
                        path: 'src/main/java/com/example/demo',
                        children: [
                          {
                            id: 'src/main/java/com/example/demo/DemoApplication.java',
                            name: 'DemoApplication.java',
                            type: 'file',
                            path: 'src/main/java/com/example/demo/DemoApplication.java',
                          },
                          {
                            id: 'src/main/java/com/example/demo/controller',
                            name: 'controller',
                            type: 'folder',
                            path: 'src/main/java/com/example/demo/controller',
                            children: [
                              {
                                id: 'src/main/java/com/example/demo/controller/UserController.java',
                                name: 'UserController.java',
                                type: 'file',
                                path: 'src/main/java/com/example/demo/controller/UserController.java',
                              },
                              {
                                id: 'src/main/java/com/example/demo/controller/ApiController.java',
                                name: 'ApiController.java',
                                type: 'file',
                                path: 'src/main/java/com/example/demo/controller/ApiController.java',
                              },
                            ],
                          },
                          {
                            id: 'src/main/java/com/example/demo/model',
                            name: 'model',
                            type: 'folder',
                            path: 'src/main/java/com/example/demo/model',
                            children: [
                              {
                                id: 'src/main/java/com/example/demo/model/User.java',
                                name: 'User.java',
                                type: 'file',
                                path: 'src/main/java/com/example/demo/model/User.java',
                              },
                              {
                                id: 'src/main/java/com/example/demo/model/Product.java',
                                name: 'Product.java',
                                type: 'file',
                                path: 'src/main/java/com/example/demo/model/Product.java',
                              },
                            ],
                          },
                          {
                            id: 'src/main/java/com/example/demo/service',
                            name: 'service',
                            type: 'folder',
                            path: 'src/main/java/com/example/demo/service',
                            children: [
                              {
                                id: 'src/main/java/com/example/demo/service/UserService.java',
                                name: 'UserService.java',
                                type: 'file',
                                path: 'src/main/java/com/example/demo/service/UserService.java',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'src/test',
        name: 'test',
        type: 'folder',
        path: 'src/test',
        children: [
          {
            id: 'src/test/java',
            name: 'java',
            type: 'folder',
            path: 'src/test/java',
            children: [
              {
                id: 'src/test/java/com',
                name: 'com',
                type: 'folder',
                path: 'src/test/java/com',
                children: [
                  {
                    id: 'src/test/java/com/example',
                    name: 'example',
                    type: 'folder',
                    path: 'src/test/java/com/example',
                    children: [
                      {
                        id: 'src/test/java/com/example/demo',
                        name: 'demo',
                        type: 'folder',
                        path: 'src/test/java/com/example/demo',
                        children: [
                          {
                            id: 'src/test/java/com/example/demo/DemoApplicationTests.java',
                            name: 'DemoApplicationTests.java',
                            type: 'file',
                            path: 'src/test/java/com/example/demo/DemoApplicationTests.java',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'python-scripts',
    name: 'python-scripts',
    type: 'folder',
    path: 'python-scripts',
    children: [
      {
        id: 'python-scripts/data-processing',
        name: 'data-processing',
        type: 'folder',
        path: 'python-scripts/data-processing',
        children: [
          {
            id: 'python-scripts/data-processing/main.py',
            name: 'main.py',
            type: 'file',
            path: 'python-scripts/data-processing/main.py',
          },
          {
            id: 'python-scripts/data-processing/utils.py',
            name: 'utils.py',
            type: 'file',
            path: 'python-scripts/data-processing/utils.py',
          },
          {
            id: 'python-scripts/data-processing/config.py',
            name: 'config.py',
            type: 'file',
            path: 'python-scripts/data-processing/config.py',
          },
        ],
      },
      {
        id: 'python-scripts/web-scraping',
        name: 'web-scraping',
        type: 'folder',
        path: 'python-scripts/web-scraping',
        children: [
          {
            id: 'python-scripts/web-scraping/scraper.py',
            name: 'scraper.py',
            type: 'file',
            path: 'python-scripts/web-scraping/scraper.py',
          },
          {
            id: 'python-scripts/web-scraping/models.py',
            name: 'models.py',
            type: 'file',
            path: 'python-scripts/web-scraping/models.py',
          },
        ],
      },
      {
        id: 'python-scripts/requirements.txt',
        name: 'requirements.txt',
        type: 'file',
        path: 'python-scripts/requirements.txt',
      },
    ],
  },
  {
    id: 'README.md',
    name: 'README.md',
    type: 'file',
    path: 'README.md',
  },
  {
    id: 'pom.xml',
    name: 'pom.xml',
    type: 'file',
    path: 'pom.xml',
  },
];

// GET - Fetch project structure (instant response)
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockProjectStructure,
    });
  } catch (error) {
    console.error('Error in files API:', error);
    return NextResponse.json(
      { error: 'Failed to load project structure' },
      { status: 500 }
    );
  }
}

// Helper functions to count files and folders
function countFiles(nodes: FileNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.type === 'file') {
      return count + 1;
    } else if (node.children) {
      return count + countFiles(node.children);
    }
    return count;
  }, 0);
}

function countFolders(nodes: FileNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.type === 'folder') {
      const childFolders = node.children ? countFolders(node.children) : 0;
      return count + 1 + childFolders;
    }
    return count;
  }, 0);
}
