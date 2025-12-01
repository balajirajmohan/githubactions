# Learn & Master GitHub Actions

A React + Vite application demonstrating GitHub Actions CI/CD workflows for automated testing and deployment.

## 📋 Table of Contents

- [Overview](#overview)
- [How the Code Works](#how-the-code-works)
- [Local Development](#local-development)
- [GitHub Actions Workflows](#github-actions-workflows)
- [How Deployment Works](#how-deployment-works)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## 🎯 Overview

This is a React application built with Vite that demonstrates modern CI/CD practices using GitHub Actions. The project includes automated testing and deployment workflows that run on every push to the repository.

## 🔧 How the Code Works

### Application Architecture

The application is a single-page React app that helps users learn about GitHub Actions:

1. **App.jsx** - The main application component that renders the header with logo and the main content
2. **MainContent.jsx** - The primary content component displaying help information
3. **HelpArea.jsx** - A reusable component for displaying help sections
4. **HelpBox.jsx** - Individual help item components

### Build System

- **Vite**: Lightning-fast build tool and dev server
- **React 18**: Modern React with latest features
- **Vitest**: Unit testing framework integrated with Vite

### Testing

The project uses:
- **Vitest** for running tests
- **@testing-library/react** for component testing
- **jsdom** for simulating browser environment

Tests are located in the `src/components/` directory (e.g., `MainContent.test.jsx`)

## 💻 Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The dev server runs at `http://localhost:5173` with hot module replacement (HMR) enabled for instant updates.

## 🚀 GitHub Actions Workflows

The project includes an automated CI/CD pipeline defined in `.github/workflows/reactworkflow.yaml`.

### Workflow Overview

The workflow triggers on every `push` to the repository and consists of two jobs:

#### 1. **Test Job** 

Runs automated tests to ensure code quality:

```yaml
test:
    runs-on: ubuntu-latest
    steps:
        - name: Get code
          uses: actions/checkout@v4
        - name: Install dependencies
          run: npm install
        - name: Run tests
          run: npm test
```

**What happens:**
1. ✅ Checks out your code from the repository
2. ✅ Installs all npm dependencies
3. ✅ Runs the test suite with Vitest
4. ✅ Fails if any tests don't pass

#### 2. **Deploy Job**

Builds the application and prepares it for deployment:

```yaml
Deploy:
    runs-on: ubuntu-latest
    steps:
        - name: Get code
          uses: actions/checkout@v4
        - name: Install dependencies
          run: npm install
        - name: Build npm
          run: npm run build
        - name: Deploy
          run: echo "Deployed"
```

**What happens:**
1. ✅ Checks out your code
2. ✅ Installs dependencies
3. ✅ Builds production-ready static files (creates `dist/` folder)
4. ✅ Runs deployment step (currently a placeholder)

### Jobs Run in Parallel

Both the `test` and `Deploy` jobs run **simultaneously** (in parallel) for faster CI/CD execution. This means:
- Deployment doesn't wait for tests to complete
- Both jobs run independently on separate runners
- Total workflow time is reduced

### Improving the Workflow

To make the deployment depend on successful tests, you can add:

```yaml
Deploy:
    needs: test  # This makes Deploy wait for test to succeed
    runs-on: ubuntu-latest
    # ... rest of the job
```

## 🌐 How Deployment Works

### Current Setup

The current deployment is a **placeholder** that outputs "Deployed" to demonstrate the workflow structure.

### Build Process

When `npm run build` runs:
1. Vite optimizes and bundles your React code
2. Assets are minified and optimized
3. Production-ready files are output to `dist/` directory
4. The build includes:
   - Optimized JavaScript bundles
   - Minified CSS
   - Optimized images and assets
   - Generated index.html

### Deployment Options

To actually deploy your application, you can replace the placeholder with real deployment steps:

#### Option 1: Deploy to GitHub Pages

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

#### Option 2: Deploy to Netlify

```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2
  with:
    publish-dir: './dist'
    production-branch: main
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

#### Option 3: Deploy to Vercel

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📁 Project Structure

```
githubactions/
├── .github/
│   └── workflows/
│       └── reactworkflow.yaml    # GitHub Actions CI/CD pipeline
├── public/
│   └── vite.svg                   # Public assets
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── logo.png           # App logo
│   ├── components/
│   │   ├── HelpArea.jsx           # Help section component
│   │   ├── HelpArea.css
│   │   ├── HelpBox.jsx            # Individual help items
│   │   ├── HelpBox.css
│   │   ├── MainContent.jsx        # Main content component
│   │   └── MainContent.test.jsx   # Tests for MainContent
│   ├── test/
│   │   └── setup.js               # Test configuration
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML template
├── package.json                   # Project dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## 🛠 Technologies Used

- **React 18.2.0** - UI library
- **Vite 3.0.7** - Build tool and dev server
- **Vitest 0.22.1** - Testing framework
- **@testing-library/react** - React component testing utilities
- **GitHub Actions** - CI/CD automation
- **jsdom** - JavaScript implementation of web standards for testing

## 🔒 Security

The project includes a comprehensive `.gitignore` file that prevents:
- Environment variables and secrets (`.env` files)
- API keys and credentials
- SSL certificates and private keys
- Dependencies (`node_modules/`)
- Build outputs
- System and IDE files

**Never commit sensitive information to your repository!**

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production-ready static files |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite with Vitest |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

The GitHub Actions workflow will automatically test your changes!

## 📖 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Vitest Documentation](https://vitest.dev/)

## 📄 License

This project is for educational purposes to learn GitHub Actions and modern React development.

---

**Happy Learning! 🚀**

