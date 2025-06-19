import { NextRequest, NextResponse } from 'next/server';

// Content generators for different file types - generates content on demand
const CONTENT_GENERATORS: Record<string, () => string> = {
  'src/main/java/com/example/demo/DemoApplication.java':
    () => `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}`,

  'src/main/java/com/example/demo/controller/UserController.java':
    () => `package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}`,

  'src/main/java/com/example/demo/controller/ApiController.java':
    () => `package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "demo-application");
        return response;
    }

    @GetMapping("/version")
    public Map<String, String> getVersion() {
        Map<String, String> version = new HashMap<>();
        version.put("version", "1.0.0");
        version.put("build", "2024.01.01");
        return version;
    }
}`,

  'src/main/java/com/example/demo/model/User.java': () =>
    generateJavaEntity('User', [
      {
        name: 'id',
        type: 'Long',
        annotations: [
          '@Id',
          '@GeneratedValue(strategy = GenerationType.IDENTITY)',
        ],
      },
      {
        name: 'username',
        type: 'String',
        annotations: ['@Column(nullable = false, unique = true)'],
      },
      {
        name: 'email',
        type: 'String',
        annotations: ['@Column(nullable = false)'],
      },
      {
        name: 'firstName',
        type: 'String',
        annotations: ['@Column(name = "first_name")'],
      },
      {
        name: 'lastName',
        type: 'String',
        annotations: ['@Column(name = "last_name")'],
      },
      {
        name: 'createdAt',
        type: 'LocalDateTime',
        annotations: ['@Column(name = "created_at")'],
      },
      {
        name: 'updatedAt',
        type: 'LocalDateTime',
        annotations: ['@Column(name = "updated_at")'],
      },
    ]),

  'src/main/java/com/example/demo/model/Product.java': () =>
    generateJavaEntity('Product', [
      {
        name: 'id',
        type: 'Long',
        annotations: [
          '@Id',
          '@GeneratedValue(strategy = GenerationType.IDENTITY)',
        ],
      },
      {
        name: 'name',
        type: 'String',
        annotations: ['@Column(nullable = false)'],
      },
      {
        name: 'description',
        type: 'String',
        annotations: ['@Column(columnDefinition = "TEXT")'],
      },
      {
        name: 'price',
        type: 'BigDecimal',
        annotations: ['@Column(nullable = false, precision = 10, scale = 2)'],
      },
      {
        name: 'stockQuantity',
        type: 'Integer',
        annotations: ['@Column(name = "stock_quantity")'],
      },
      {
        name: 'createdAt',
        type: 'LocalDateTime',
        annotations: ['@Column(name = "created_at")'],
      },
      {
        name: 'updatedAt',
        type: 'LocalDateTime',
        annotations: ['@Column(name = "updated_at")'],
      },
    ]),

  'src/main/java/com/example/demo/service/UserService.java': () =>
    generateJavaService('UserService', 'User'),

  'src/test/java/com/example/demo/DemoApplicationTests.java':
    () => `package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

    @Test
    void contextLoads() {
        // This test will pass if the application context loads successfully
    }

    @Test
    void mainMethodTest() {
        // Test that main method can be called without issues
        DemoApplication.main(new String[]{});
    }
}`,

  'python-scripts/data-processing/main.py': () =>
    generatePythonScript('main', 'data_processing'),
  'python-scripts/data-processing/utils.py': () =>
    generatePythonModule('utils', 'data_processing'),
  'python-scripts/data-processing/config.py': () => generatePythonConfig(),
  'python-scripts/web-scraping/scraper.py': () =>
    generatePythonScript('scraper', 'web_scraping'),
  'python-scripts/web-scraping/models.py': () =>
    generatePythonModule('models', 'web_scraping'),
  'python-scripts/requirements.txt': () => generateRequirementsTxt(),
  'README.md': () => generateReadme(),
  'pom.xml': () => generatePomXml(),
};

// Simple storage for modified content (no caching, just direct storage)
const modifiedContent: Record<string, string> = {};

// Content generators for different file types
function generateJavaEntity(
  className: string,
  fields: Array<{ name: string; type: string; annotations: string[] }>
): string {
  const imports = fields.some(f => f.type === 'LocalDateTime')
    ? 'import java.time.LocalDateTime;\n'
    : '';
  const bigDecimalImport = fields.some(f => f.type === 'BigDecimal')
    ? 'import java.math.BigDecimal;\n'
    : '';

  return `package com.example.demo.model;

import javax.persistence.*;
${imports}${bigDecimalImport}
@Entity
@Table(name = "${className.toLowerCase()}s")
public class ${className} {

${fields.map(field => `    ${field.annotations.join('\n    ')}\n    private ${field.type} ${field.name};`).join('\n\n')}

    public ${className}() {
        ${fields
          .filter(f => f.type === 'LocalDateTime')
          .map(f => `this.${f.name} = LocalDateTime.now();`)
          .join('\n        ')}
    }

${fields
  .map(
    field => `    // Getter and Setter for ${field.name}
    public ${field.type} get${field.name.charAt(0).toUpperCase() + field.name.slice(1)}() {
        return ${field.name};
    }

    public void set${field.name.charAt(0).toUpperCase() + field.name.slice(1)}(${field.type} ${field.name}) {
        this.${field.name} = ${field.name};
    }`
  )
  .join('\n\n')}
}`;
}

function generateJavaService(serviceName: string, entityName: string): string {
  return `package com.example.demo.service;

import com.example.demo.model.${entityName};
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ${serviceName} {

    private List<${entityName}> ${entityName.toLowerCase()}s = new ArrayList<>();
    private Long nextId = 1L;

    public ${serviceName}() {
        // Initialize with sample data
        initializeSampleData();
    }

    private void initializeSampleData() {
        // Sample data initialization would go here
    }

    public List<${entityName}> getAll${entityName}s() {
        return new ArrayList<>(${entityName.toLowerCase()}s);
    }

    public ${entityName} get${entityName}ById(Long id) {
        return ${entityName.toLowerCase()}s.stream()
                .filter(entity -> entity.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public ${entityName} create${entityName}(${entityName} entity) {
        entity.setId(nextId++);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        ${entityName.toLowerCase()}s.add(entity);
        return entity;
    }

    public boolean delete${entityName}(Long id) {
        return ${entityName.toLowerCase()}s.removeIf(entity -> entity.getId().equals(id));
    }
}`;
}

function generatePythonScript(scriptName: string, moduleType: string): string {
  const templates = {
    main: `#!/usr/bin/env python3
"""
Main ${moduleType.replace('_', ' ')} script.
"""

import logging
from typing import Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    """Main function."""
    logger.info("Starting ${moduleType.replace('_', ' ')} pipeline...")
    
    try:
        # Main logic here
        process_data()
        logger.info("Pipeline completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in pipeline: {str(e)}")
        raise


def process_data():
    """Process data logic."""
    # Implementation would go here
    pass


if __name__ == "__main__":
    main()
`,
    scraper: `#!/usr/bin/env python3
"""
Web scraping utility.
"""

import requests
from bs4 import BeautifulSoup
import time
import random
from typing import List, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Main scraping function."""
    logger.info("Starting web scraper...")
    
    try:
        # Scraping logic here
        scrape_data()
        logger.info("Scraping completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in scraper: {str(e)}")
        raise


def scrape_data():
    """Scraping logic."""
    # Implementation would go here
    pass


if __name__ == "__main__":
    main()
`,
  };

  return templates[scriptName as keyof typeof templates] || templates.main;
}

function generatePythonModule(moduleName: string, moduleType: string): string {
  return `"""
${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} module for ${moduleType.replace('_', ' ')}.
"""

from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)


class ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Handler:
    """Handler class for ${moduleName}."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
    def process(self, data: Any) -> Any:
        """Process data."""
        # Implementation would go here
        return data
`;
}

function generatePythonConfig(): string {
  return `"""
Configuration settings.
"""

DEFAULT_CONFIG = {
    'data_path': 'data/',
    'output_path': 'output/',
    'batch_size': 1000,
    'log_level': 'INFO'
}

# Additional config sections would go here
`;
}

function generateRequirementsTxt(): string {
  return `# Core Dependencies
requests>=2.28.0
beautifulsoup4>=4.11.0
pandas>=1.5.0
numpy>=1.21.0

# Development Dependencies
pytest>=7.0.0
black>=22.0.0
flake8>=5.0.0
`;
}

function generateReadme(): string {
  return `# Demo Multi-Language Project

This is a demonstration project showcasing modern development practices.

## Features

- Spring Boot Java application
- Python data processing scripts
- Modern web interface
- Production-ready architecture

## Getting Started

### Prerequisites
- Java 11+
- Python 3.8+
- Node.js 16+

### Installation

1. Clone the repository
2. Install dependencies
3. Run the application

## Contributing

Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.
`;
}

function generatePomXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.0</version>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    </dependencies>
</project>`;
}

// Security check to ensure path is safe
function isPathSafe(filePath: string): boolean {
  return (
    !filePath.includes('..') &&
    !filePath.startsWith('/') &&
    filePath in CONTENT_GENERATORS
  );
}

// GET - Read file content (instant response)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    if (!isPathSafe(filePath)) {
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      );
    }

    // Check if content has been modified
    let content: string;
    if (modifiedContent[filePath]) {
      content = modifiedContent[filePath];
    } else {
      // Generate content on demand
      const generator = CONTENT_GENERATORS[filePath];
      content = generator();
    }

    return NextResponse.json({
      success: true,
      data: {
        path: filePath,
        content: content,
        size: content.length,
        lastModified: new Date().toISOString(),
        encoding: 'utf-8',
      },
    });
  } catch (error) {
    console.error('Error in file content API:', error);
    return NextResponse.json(
      { error: 'Failed to read file content' },
      { status: 500 }
    );
  }
}

// POST - Save file content (instant response)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: filePath, content } = body;

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'File path and content are required' },
        { status: 400 }
      );
    }

    if (!isPathSafe(filePath)) {
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      );
    }

    // Store modified content
    modifiedContent[filePath] = content;

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
      data: {
        path: filePath,
        size: content.length,
        lastModified: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in file save API:', error);
    return NextResponse.json(
      { error: 'Failed to save file content' },
      { status: 500 }
    );
  }
}
