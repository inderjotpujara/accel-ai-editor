# Accel AI Editor

AI-powered editor for accelerated development with intelligent code suggestions and seamless workflow integration.

## 🚀 Features 

- **AI-Powered Code Editor**: Intelligent code completion and suggestions
- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Rust, Go, and more
- **Modern UI**: Beautiful and responsive interface built with Next.js and Tailwind CSS
- **State Management**: Efficient state management with Zustand
- **Testing**: Comprehensive testing with Jest and Playwright
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Jest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier + Husky

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
│   ├── Header/
│   └── ui/
├── features/               # Feature-based modules
│   └── Editor/
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Feature-specific hooks
│       └── __tests__/      # Feature tests
├── lib/                    # Utility functions
└── styles/                 # Global styles
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:inderjotpujara/accel-ai-editor.git
   cd accel-ai-editor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🔧 Development

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 📦 Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🎯 Development Guidelines

### Code Style

- Use functional React components with hooks
- Follow hook order: useState → useCallback → useEffect
- Use TypeScript for type safety
- Follow naming conventions: PascalCase for components, camelCase for functions

### Testing

- Write tests first (TDD approach)
- Aim for 80% code coverage
- Test user interactions, not implementation details

### Commits

- Follow Conventional Commits format
- Use pre-commit hooks for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Implement your changes
5. Run tests and linting
6. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [GitHub Repository](https://github.com/inderjotpujara/accel-ai-editor)
- [Documentation](./docs)

---

Built with ❤️ for accelerated development
