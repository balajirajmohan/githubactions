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

**Live Deployment:** Automatically deployed to Vercel on every push (after tests pass)

### Features

✅ **Automated Testing** - Vitest runs on every push  
✅ **Continuous Deployment** - Auto-deploy to Vercel production  
✅ **Security First** - All credentials stored as GitHub Secrets  
✅ **Quality Gates** - Deployment only happens if tests pass  
✅ **Modern Stack** - React 18 + Vite + GitHub Actions

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

Builds and deploys the application to Vercel (only runs if tests pass):

```yaml
Deploy:
    needs: test  # Waits for tests to pass before deploying
    runs-on: ubuntu-latest
    steps:
        - name: Get code
          uses: actions/checkout@v4
        - name: Install dependencies
          run: npm install
        - name: Build npm
          run: npm run build
        - name: Deploy to Vercel
          uses: amondnet/vercel-action@v25
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.ORG_ID }}
            vercel-project-id: ${{ secrets.PROJECT_ID }}
            vercel-args: '--prod'
```

**What happens:**
1. ✅ Waits for tests to pass (due to `needs: test`)
2. ✅ Checks out your code
3. ✅ Installs dependencies
4. ✅ Builds production-ready static files (creates `dist/` folder)
5. ✅ Deploys to Vercel production environment
6. ✅ Returns deployment URL in workflow logs

### Sequential Execution

The jobs run **sequentially** to ensure code quality before deployment:
1. **Test job** runs first and must pass
2. **Deploy job** only runs if tests succeed
3. Failed tests prevent broken code from being deployed

## 🌐 How Deployment Works

### Current Setup

The application is automatically deployed to **Vercel** on every push to the repository (after tests pass).

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

### Vercel Deployment

The deployment uses the `amondnet/vercel-action@v25` GitHub Action which:
1. Takes the built `dist/` folder
2. Uploads it to Vercel's CDN
3. Deploys to production (`--prod` flag)
4. Provides a deployment URL in the workflow logs

### Required GitHub Secrets

For Vercel deployment to work, you need to set up these secrets in your repository:

**Go to:** `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret Name | Description | How to Get It |
|------------|-------------|---------------|
| `VERCEL_TOKEN` | Authentication token | [Vercel Account Tokens](https://vercel.com/account/tokens) |
| `ORG_ID` | Your Vercel organization ID | Run `vercel link` and check `.vercel/project.json` |
| `PROJECT_ID` | Your Vercel project ID | Run `vercel link` and check `.vercel/project.json` |

### Setting Up Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Link your project:**
   ```bash
   vercel login
   vercel link
   ```

3. **Get your credentials:**
   ```bash
   cat .vercel/project.json
   ```
   Copy the `orgId` and `projectId`

4. **Create a Vercel token:**
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Copy the token immediately

5. **Add secrets to GitHub:**
   - Go to your repo's Settings → Secrets and variables → Actions
   - Add `VERCEL_TOKEN`, `ORG_ID`, and `PROJECT_ID`

### Alternative Deployment Options

If you want to use a different platform, here are alternatives:

#### Deploy to GitHub Pages

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

#### Deploy to Netlify

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
- **Vercel** - Production hosting and deployment platform
- **jsdom** - JavaScript implementation of web standards for testing

## 🔒 Security

### Git Ignore Protection

The project includes a comprehensive `.gitignore` file that prevents committing:
- Environment variables and secrets (`.env` files)
- API keys and credentials
- SSL certificates and private keys
- Dependencies (`node_modules/`)
- Build outputs (`dist/`)
- Vercel configuration (`.vercel/` directory)
- System and IDE files

### GitHub Secrets

All sensitive deployment credentials are stored as **encrypted GitHub Secrets**:
- ✅ `VERCEL_TOKEN` - Never exposed in logs or code
- ✅ `ORG_ID` - Encrypted at rest
- ✅ `PROJECT_ID` - Only accessible to workflow runs

These secrets are:
- Encrypted using GitHub's libsodium sealed box
- Only exposed to the runner environment during workflow execution
- Never visible in workflow logs or pull requests
- Can be rotated anytime without changing code

**Never commit sensitive information to your repository!** Always use GitHub Secrets for credentials.

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
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🔑 Quick Setup Guide

### First Time Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/balajirajmohan/githubactions.git
   cd githubactions
   npm install
   ```

2. **Set up Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   ```

3. **Get your credentials:**
   ```bash
   cat .vercel/project.json
   ```

4. **Add GitHub Secrets:**
   - Go to `https://github.com/balajirajmohan/githubactions/settings/secrets/actions`
   - Add `VERCEL_TOKEN` (from https://vercel.com/account/tokens)
   - Add `ORG_ID` (from `.vercel/project.json`)
   - Add `PROJECT_ID` (from `.vercel/project.json`)

5. **Push to deploy:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

Your app will automatically test and deploy! 🎉

## 📄 License

This project is for educational purposes to learn GitHub Actions and modern React development.

---

**Happy Learning! 🚀**

