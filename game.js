// Game State
let gameState = {
    mode: 'normal', // 'normal' or 'pro'
    currentLevel: 0,
    score: 0,
    startTime: null,
    timerInterval: null,
    ignoredFiles: [],
    wrongAttempts: 0,
    currentPreviewFile: null,
    openTabs: ['gitignore'],
    // Git terminal state
    stagedFiles: [],
    committed: false
};

// Levels configuration
const levels = [
    {
        name: "Beginner Basics",
        files: [
            { name: "index.html", icon: "📄", shouldIgnore: false, content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
            { name: "style.css", icon: "🎨", shouldIgnore: false, content: 'body {\n  font-family: Arial;\n  margin: 0;\n  padding: 20px;\n}' },
            { name: "node_modules/express", icon: "📁", shouldIgnore: true, content: '[Express.js package]\n\nFast, unopinionated web framework for Node.js' },
            { name: "node_modules/lodash", icon: "📁", shouldIgnore: true, content: '[Lodash package]\n\nA modern JavaScript utility library' },
            { name: ".env", icon: "⚙️", shouldIgnore: true, content: 'DATABASE_URL=postgres://localhost:5432/mydb\nAPI_KEY=sk_live_abc123xyz789\nSECRET_TOKEN=super_secret_value' },
            { name: "app.js", icon: "📜", shouldIgnore: false, content: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello!");\n});\n\napp.listen(3000);' }
        ]
    },
    {
        name: "Python Project",
        files: [
            { name: "main.py", icon: "🐍", shouldIgnore: false, content: 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return "Hello, World!"' },
            { name: "__pycache__", icon: "📁", shouldIgnore: true, content: '[Directory containing compiled Python bytecode]\n\nPython creates these automatically.\nShould always be gitignored.' },
            { name: "requirements.txt", icon: "📄", shouldIgnore: false, content: 'flask==2.0.1\nrequests==2.26.0\npython-dotenv==0.19.0' },
            { name: ".env", icon: "⚙️", shouldIgnore: true, content: 'FLASK_SECRET=xK9#mP2$vL5@nQ8\nOPENAI_API_KEY=sk-proj-abc123xyz\nDATABASE_PASSWORD=admin123' },
            { name: "venv", icon: "📁", shouldIgnore: true, content: '[Python virtual environment]\n\nContains Python interpreter and packages.\nNever commit to version control!' },
            { name: "README.md", icon: "📝", shouldIgnore: false, content: '# My Python App\n\nA simple Flask application.\n\n## Installation\n```\npip install -r requirements.txt\n```' }
        ]
    },
    {
        name: "Full Stack App",
        files: [
            { name: "package.json", icon: "📦", shouldIgnore: false, content: '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node server.js"\n  }\n}' },
            { name: "node_modules/react", icon: "📁", shouldIgnore: true, content: '[React package]\n\nA JavaScript library for building user interfaces' },
            { name: "node_modules/next", icon: "📁", shouldIgnore: true, content: '[Next.js package]\n\nThe React Framework for Production' },
            { name: "node_modules/.bin", icon: "📁", shouldIgnore: true, content: '[Binary executables]\n\nSymlinks to package binaries' },
            { name: ".env.local", icon: "⚙️", shouldIgnore: true, content: 'NEXT_PUBLIC_API_URL=http://localhost:3000\nSTRIPE_SECRET_KEY=sk_test_51ABC123\nJWT_SECRET=my-super-secret-jwt-key' },
            { name: "dist/bundle.js", icon: "📜", shouldIgnore: true, content: '// Webpack compiled bundle\n(function(modules){...})([...]);' },
            { name: "dist/bundle.css", icon: "🎨", shouldIgnore: true, content: '/* Compiled CSS */\nbody{margin:0}' },
            { name: ".next/cache", icon: "📁", shouldIgnore: true, content: '[Next.js build cache]\n\nAuto-generated, always ignore.' },
            { name: ".next/static", icon: "📁", shouldIgnore: true, content: '[Next.js static files]\n\nGenerated during build' },
            { name: "src/index.tsx", icon: "⚛️", shouldIgnore: false, content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));' },
            { name: "tsconfig.json", icon: "📄", shouldIgnore: false, content: '{\n  "compilerOptions": {\n    "target": "ES6",\n    "strict": true\n  }\n}' },
            { name: ".DS_Store", icon: "🍎", shouldIgnore: true, content: '[macOS system file]\n\nStores folder view settings.\nAlways ignore on all projects.' }
        ]
    },
    {
        name: "DevOps Config",
        files: [
            { name: "Dockerfile", icon: "🐳", shouldIgnore: false, content: 'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]' },
            { name: "docker-compose.yml", icon: "🐳", shouldIgnore: false, content: 'version: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"' },
            { name: ".env.production", icon: "⚙️", shouldIgnore: true, content: 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nDATABASE_URL=postgres://prod-db.aws.com/main' },
            { name: "secrets.yaml", icon: "🔐", shouldIgnore: true, content: 'api_keys:\n  stripe: sk_live_realkey123\n  sendgrid: SG.actualkey456\npasswords:\n  admin: supersecret789' },
            { name: "*.log", icon: "📋", shouldIgnore: true, content: '[2024-01-15 10:23:45] INFO: Server started\n[2024-01-15 10:23:46] DEBUG: Connected to DB\n[2024-01-15 10:23:47] ERROR: Something went wrong' },
            { name: ".terraform", icon: "📁", shouldIgnore: true, content: '[Terraform state and cache]\n\nContains sensitive state info.\nMust be gitignored!' },
            { name: "main.tf", icon: "🏗️", shouldIgnore: false, content: 'provider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_instance" "web" {\n  ami = "ami-123456"\n}' },
            { name: "coverage", icon: "📁", shouldIgnore: true, content: '[Test coverage reports]\n\nGenerated by test runner.\nShould be gitignored.' }
        ]
    },
    {
        name: "Pro Challenge",
        files: [
            { name: "config.js", icon: "📜", shouldIgnore: false, content: 'module.exports = {\n  port: process.env.PORT || 3000,\n  env: process.env.NODE_ENV || "development",\n  logLevel: "info"\n};' },
            { name: "settings.json", icon: "⚙️", shouldIgnore: true, content: '{\n  "apiKey": "pk_live_51HG8kw2eZvKYlo2CkqZ0x",\n  "secretKey": "sk_live_51HG8kwSecret123456",\n  "webhookSecret": "whsec_abcdef123456"\n}' },
            { name: "database.js", icon: "📜", shouldIgnore: false, content: 'const mongoose = require("mongoose");\n\nconst connectDB = async () => {\n  await mongoose.connect(process.env.DB_URI);\n};\n\nmodule.exports = connectDB;' },
            { name: "credentials.json", icon: "🔑", shouldIgnore: true, content: '{\n  "type": "service_account",\n  "project_id": "my-project-123",\n  "private_key_id": "abc123",\n  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBg..."\n}' },
            { name: "utils.js", icon: "📜", shouldIgnore: false, content: 'const formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n};\n\nconst slugify = (text) => {\n  return text.toLowerCase().replace(/\\s+/g, "-");\n};\n\nmodule.exports = { formatDate, slugify };' },
            { name: "temp_keys.txt", icon: "📄", shouldIgnore: true, content: 'TEMPORARY API KEYS - DELETE AFTER USE\n\nGitHub Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nNPM Token: npm_xyzABC123456789\nAWS Key: AKIA1234567890EXAMPLE' },
            { name: "server.js", icon: "📜", shouldIgnore: false, content: 'const express = require("express");\nconst config = require("./config");\nconst connectDB = require("./database");\n\nconst app = express();\nconnectDB();\n\napp.listen(config.port);' },
            { name: ".cache", icon: "📁", shouldIgnore: true, content: '[Application cache directory]\n\nTemporary files, should be ignored.' },
            { name: "id_rsa", icon: "🔑", shouldIgnore: true, content: '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAA...\nThis is a private SSH key!\nNEVER commit this!\n-----END OPENSSH PRIVATE KEY-----' },
            { name: "README.md", icon: "📝", shouldIgnore: false, content: '# My Awesome Project\n\nThis is a full-stack application.\n\n## Getting Started\n\n1. Clone the repo\n2. Run `npm install`\n3. Create `.env` file\n4. Run `npm start`' }
        ]
    },
    {
        name: "Config Chaos",
        files: [
            { name: "config/database.json", icon: "📦", shouldIgnore: false, content: '{\n  "host": "localhost",\n  "port": 5432,\n  "name": "myapp_db"\n}' },
            { name: "config/database.local.json", icon: "📦", shouldIgnore: true, content: '{\n  "host": "localhost",\n  "password": "dev_password_123",\n  "apiKey": "sk_test_localkey"\n}' },
            { name: "config/app.json", icon: "📦", shouldIgnore: false, content: '{\n  "name": "MyApp",\n  "version": "1.0.0",\n  "debug": false\n}' },
            { name: "config/secrets.json", icon: "🔑", shouldIgnore: true, content: '{\n  "jwt_secret": "super-secret-jwt-key-12345",\n  "encryption_key": "AES256-encryption-key"\n}' },
            { name: ".env", icon: "⚙️", shouldIgnore: true, content: 'NODE_ENV=development\nPORT=3000\nAPI_KEY=sk_live_production_key' },
            { name: ".env.example", icon: "⚙️", shouldIgnore: false, content: 'NODE_ENV=development\nPORT=3000\nAPI_KEY=your_api_key_here' },
            { name: "src/index.js", icon: "📜", shouldIgnore: false, content: 'const config = require("./config");\nconsole.log("Starting app...");' },
            { name: "logs/app.log", icon: "📋", shouldIgnore: true, content: '[INFO] 2024-01-15 Server started\n[DEBUG] Connection established' },
            { name: "logs/error.log", icon: "📋", shouldIgnore: true, content: '[ERROR] 2024-01-15 Something went wrong\n[ERROR] Stack trace...' },
            { name: "logs/.gitkeep", icon: "📄", shouldIgnore: false, content: '# This file keeps the logs folder in git\n# But actual log files should be ignored' }
        ]
    },
    {
        name: "Build Artifacts",
        files: [
            { name: "src/app.ts", icon: "📘", shouldIgnore: false, content: 'import express from "express";\nconst app = express();\nexport default app;' },
            { name: "src/utils.ts", icon: "📘", shouldIgnore: false, content: 'export const helper = () => "hello";' },
            { name: "dist/app.js", icon: "📜", shouldIgnore: true, content: '"use strict";\nvar express = require("express");\n// Compiled output' },
            { name: "dist/app.js.map", icon: "📄", shouldIgnore: true, content: '{"version":3,"sources":["app.ts"]...}' },
            { name: "dist/utils.js", icon: "📜", shouldIgnore: true, content: '"use strict";\nexports.helper = function() { return "hello"; };' },
            { name: "build/bundle.js", icon: "📜", shouldIgnore: true, content: '// Webpack bundle output\n(function(modules) { ... })([...]);' },
            { name: "build/bundle.min.js", icon: "📜", shouldIgnore: true, content: '!function(e){...}([...]);' },
            { name: "coverage/lcov.info", icon: "📋", shouldIgnore: true, content: 'TN:\nSF:src/app.ts\nFNF:0\nFNH:0' },
            { name: "coverage/index.html", icon: "📄", shouldIgnore: true, content: '<!DOCTYPE html><html>Coverage Report</html>' },
            { name: "tsconfig.json", icon: "📦", shouldIgnore: false, content: '{\n  "compilerOptions": {\n    "outDir": "./dist"\n  }\n}' },
            { name: "package.json", icon: "📦", shouldIgnore: false, content: '{\n  "name": "my-ts-app",\n  "scripts": { "build": "tsc" }\n}' }
        ]
    },
    {
        name: "Mixed Media",
        files: [
            { name: "assets/logo.svg", icon: "🎨", shouldIgnore: false, content: '<svg>...</svg>' },
            { name: "assets/icon.png", icon: "🖼️", shouldIgnore: false, content: '[PNG binary data]' },
            { name: "assets/hero.psd", icon: "🎨", shouldIgnore: true, content: '[Photoshop file - 45MB]\n\nLarge source file, keep out of git!' },
            { name: "assets/mockup.sketch", icon: "🎨", shouldIgnore: true, content: '[Sketch file - 28MB]\n\nDesign source file' },
            { name: "assets/video.mp4", icon: "🎬", shouldIgnore: true, content: '[Video file - 120MB]\n\nToo large for git!' },
            { name: "uploads/avatar_123.jpg", icon: "🖼️", shouldIgnore: true, content: '[User uploaded file]\n\nUser uploads should not be in git' },
            { name: "uploads/document.pdf", icon: "📄", shouldIgnore: true, content: '[User uploaded PDF]' },
            { name: "uploads/.gitkeep", icon: "📄", shouldIgnore: false, content: '# Keep uploads folder structure' },
            { name: "public/index.html", icon: "📄", shouldIgnore: false, content: '<!DOCTYPE html>\n<html>...</html>' },
            { name: "public/favicon.ico", icon: "🖼️", shouldIgnore: false, content: '[favicon binary]' },
            { name: "tmp/cache.json", icon: "📦", shouldIgnore: true, content: '{"cached": "data"}' },
            { name: "tmp/session_abc123", icon: "📄", shouldIgnore: true, content: '[Session data - temporary]' }
        ]
    },
    {
        name: "Monorepo Madness",
        files: [
            { name: "packages/core/src/index.ts", icon: "📘", shouldIgnore: false, content: 'export * from "./lib";' },
            { name: "packages/core/dist/index.js", icon: "📜", shouldIgnore: true, content: '"use strict";\n// compiled' },
            { name: "packages/core/node_modules/lodash", icon: "📁", shouldIgnore: true, content: '[Lodash package]' },
            { name: "packages/core/node_modules/typescript", icon: "📁", shouldIgnore: true, content: '[TypeScript compiler]' },
            { name: "packages/ui/src/Button.tsx", icon: "⚛️", shouldIgnore: false, content: 'export const Button = () => <button>Click</button>;' },
            { name: "packages/ui/dist/Button.js", icon: "📜", shouldIgnore: true, content: '"use strict";\n// compiled' },
            { name: "packages/ui/.env.local", icon: "⚙️", shouldIgnore: true, content: 'STORYBOOK_API_KEY=sb_key_123' },
            { name: "apps/web/src/App.tsx", icon: "⚛️", shouldIgnore: false, content: 'import { Button } from "@mono/ui";\nexport default App;' },
            { name: "apps/web/.next/cache", icon: "📁", shouldIgnore: true, content: '[Next.js cache]' },
            { name: "apps/web/.next/static", icon: "📁", shouldIgnore: true, content: '[Next.js static]' },
            { name: "apps/web/node_modules/react", icon: "📁", shouldIgnore: true, content: '[React package]' },
            { name: "apps/web/node_modules/next", icon: "📁", shouldIgnore: true, content: '[Next.js package]' },
            { name: "apps/api/src/server.ts", icon: "📘", shouldIgnore: false, content: 'import express from "express";' },
            { name: "apps/api/dist/server.js", icon: "📜", shouldIgnore: true, content: '"use strict";' },
            { name: "apps/api/.env", icon: "⚙️", shouldIgnore: true, content: 'DATABASE_URL=postgres://...\nJWT_SECRET=xxx' },
            { name: "pnpm-lock.yaml", icon: "📄", shouldIgnore: false, content: 'lockfileVersion: 5.4\n...' },
            { name: "turbo.json", icon: "📦", shouldIgnore: false, content: '{\n  "pipeline": { "build": {} }\n}' }
        ]
    }
];

// File icons based on extension
function getFileIcon(filename) {
    const icons = {
        '.js': '📜',
        '.ts': '📘',
        '.tsx': '⚛️',
        '.jsx': '⚛️',
        '.py': '🐍',
        '.html': '📄',
        '.css': '🎨',
        '.json': '📦',
        '.md': '📝',
        '.yml': '📋',
        '.yaml': '📋',
        '.env': '⚙️',
        '.log': '📋',
        '.txt': '📄',
        '.tf': '🏗️'
    };
    
    for (const [ext, icon] of Object.entries(icons)) {
        if (filename.endsWith(ext)) return icon;
    }
    
    if (filename.includes('.')) return '📄';
    return '📁';
}

// DOM Elements
const fileTree = document.getElementById('file-tree');
const gitignoreContent = document.getElementById('gitignore-content');
const gitignoreInput = document.getElementById('gitignore-input');
const gitignoreArea = document.getElementById('gitignore-area');
const lineNumbers = document.getElementById('line-numbers');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('progress');
const levelIndicator = document.getElementById('level-indicator');
const modeIndicator = document.getElementById('mode-indicator');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const overlayStats = document.getElementById('overlay-stats');
const startScreen = document.getElementById('start-screen');
const editorTabs = document.getElementById('editor-tabs');
const tabGitignore = document.getElementById('tab-gitignore');
const tabPreview = document.getElementById('tab-preview');
const filePreviewContent = document.getElementById('file-preview-content');

// Terminal elements
const terminalPanel = document.getElementById('terminal-panel');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalClose = document.getElementById('terminal-close');
const terminalBtn = document.getElementById('terminal-btn');

// Folder contents for display
const folderContents = {
    'node_modules': ['express/', 'lodash/', 'react/', 'next/', '.bin/', '... 1,244 more'],
    'node_modules/express': ['lib/', 'index.js', 'package.json'],
    'node_modules/lodash': ['lodash.js', 'package.json'],
    'node_modules/react': ['cjs/', 'umd/', 'index.js', 'package.json'],
    'node_modules/next': ['dist/', 'bin/', 'package.json'],
    'node_modules/.bin': ['next', 'react-scripts', 'tsc'],
    '__pycache__': ['main.cpython-39.pyc', 'utils.cpython-39.pyc'],
    'venv': ['bin/', 'lib/', 'include/', 'pyvenv.cfg'],
    'dist': ['bundle.js', 'bundle.css', 'index.html'],
    '.next': ['cache/', 'static/', 'server/', 'build-manifest.json'],
    '.next/cache': ['webpack/', 'images/'],
    '.next/static': ['chunks/', 'css/', 'media/'],
    '.terraform': ['providers/', 'modules/', 'terraform.tfstate'],
    'coverage': ['lcov.info', 'index.html', 'lcov-report/'],
    '.cache': ['babel-loader/', 'terser-webpack-plugin/'],
    'config': ['database.json', 'database.local.json', 'app.json', 'secrets.json'],
    'logs': ['app.log', 'error.log', '.gitkeep'],
    'src': ['index.js', 'index.tsx', 'app.ts', 'utils.ts'],
    'build': ['bundle.js', 'bundle.min.js'],
    'assets': ['logo.svg', 'icon.png', 'hero.psd', 'mockup.sketch', 'video.mp4'],
    'uploads': ['avatar_123.jpg', 'document.pdf', '.gitkeep'],
    'public': ['index.html', 'favicon.ico'],
    'tmp': ['cache.json', 'session_abc123'],
    'packages': ['core/', 'ui/'],
    'packages/core': ['src/', 'dist/', 'node_modules/'],
    'packages/core/node_modules': ['lodash/', 'typescript/'],
    'packages/core/node_modules/lodash': ['lodash.js', 'package.json'],
    'packages/core/node_modules/typescript': ['lib/', 'bin/', 'tsc.js'],
    'packages/ui': ['src/', 'dist/', '.env.local'],
    'apps': ['web/', 'api/'],
    'apps/web': ['src/', '.next/', 'node_modules/'],
    'apps/web/.next': ['cache/', 'static/'],
    'apps/web/.next/cache': ['webpack/', 'images/'],
    'apps/web/.next/static': ['chunks/', 'css/', 'media/'],
    'apps/web/node_modules': ['react/', 'next/'],
    'apps/web/node_modules/react': ['cjs/', 'umd/', 'index.js'],
    'apps/web/node_modules/next': ['dist/', 'bin/', 'package.json'],
    'apps/api': ['src/', 'dist/', '.env']
};

// Initialize game
function init() {
    document.getElementById('btn-normal').addEventListener('click', () => startGame('normal'));
    document.getElementById('btn-pro').addEventListener('click', () => startGame('pro'));
    document.getElementById('btn-retry').addEventListener('click', retryLevel);
    document.getElementById('btn-next').addEventListener('click', nextLevel);
    
    gitignoreInput.addEventListener('keydown', handleInput);
    
    // Click anywhere on gitignore area to focus input
    gitignoreArea.addEventListener('click', (e) => {
        if (e.target !== gitignoreInput) {
            gitignoreInput.focus();
        }
    });
    
    // Terminal event listeners
    terminalInput.addEventListener('keydown', handleTerminalInput);
    terminalClose.addEventListener('click', toggleTerminal);
    terminalBtn.addEventListener('click', toggleTerminal);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+M to skip level
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            // Only skip if game is active (not on start screen or overlay)
            if (startScreen.classList.contains('hidden') && overlay.classList.contains('hidden')) {
                gameState.currentLevel++;
                loadLevel(gameState.currentLevel);
            }
        }
        
        // Ctrl+ø to toggle terminal (ø is 'Dead' or 'ø' depending on keyboard)
        if (e.ctrlKey && (e.key === 'ø' || e.key === 'Dead' || e.code === 'BracketLeft')) {
            e.preventDefault();
            if (startScreen.classList.contains('hidden') && overlay.classList.contains('hidden')) {
                toggleTerminal();
            }
        }
    });
}

function startGame(mode) {
    gameState.mode = mode;
    gameState.currentLevel = 0;
    gameState.score = 0;
    startScreen.classList.add('hidden');
    
    if (mode === 'pro') {
        document.getElementById('game-container').classList.add('pro-mode');
        modeIndicator.textContent = '🔥 Pro Mode';
    } else {
        document.getElementById('game-container').classList.remove('pro-mode');
        modeIndicator.textContent = 'Normal Mode';
    }
    
    loadLevel(gameState.currentLevel);
}

function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    if (!level) {
        showGameComplete();
        return;
    }
    
    // Reset state
    gameState.ignoredFiles = [];
    gameState.wrongAttempts = 0;
    gameState.startTime = Date.now();
    gameState.currentPreviewFile = null;
    gameState.openTabs = ['gitignore'];
    gameState.stagedFiles = [];
    gameState.committed = false;
    
    // Reset terminal
    terminalOutput.innerHTML = '';
    terminalPanel.classList.add('hidden');
    terminalBtn.classList.remove('ready', 'bounce');
    terminalBtn.textContent = 'Terminal';
    
    // Clear UI
    gitignoreContent.innerHTML = '';
    fileTree.innerHTML = '';
    closePreviewTab();
    
    // Update indicators
    levelIndicator.textContent = `Level ${levelIndex + 1}: ${level.name}`;
    updateLineNumbers();
    updateProgress();
    
    // Add .gitignore file at the top of the tree
    const gitignoreFile = document.createElement('div');
    gitignoreFile.className = 'file-item gitignore-file';
    gitignoreFile.dataset.name = '.gitignore';
    gitignoreFile.innerHTML = `
        <span class="icon">📄</span>
        <span class="name">.gitignore</span>
    `;
    gitignoreFile.addEventListener('click', () => {
        switchToTab('gitignore');
    });
    fileTree.appendChild(gitignoreFile);
    
    // Group files by directory
    const filesByDir = new Map();
    const rootFiles = [];
    
    level.files.forEach(file => {
        if (file.name.includes('/')) {
            const parts = file.name.split('/');
            const dir = parts[0];
            if (!filesByDir.has(dir)) {
                filesByDir.set(dir, []);
            }
            filesByDir.get(dir).push(file);
        } else {
            rootFiles.push(file);
        }
    });
    
    // Render root-level files and standalone folders first
    rootFiles.forEach(file => {
        renderFileItem(file, fileTree, level);
    });
    
    // Render directory groups
    filesByDir.forEach((files, dirName) => {
        // Create folder element
        const folderEl = document.createElement('div');
        folderEl.className = 'file-item folder';
        folderEl.dataset.name = dirName;
        folderEl.innerHTML = `
            <span class="icon">📁</span>
            <span class="name">${dirName}</span>
        `;
        
        // Create folder contents
        const contentsEl = document.createElement('div');
        contentsEl.className = 'folder-contents';
        contentsEl.dataset.folder = dirName;
        
        // Render each file in the folder
        files.forEach(file => {
            const fileName = file.name.split('/').slice(1).join('/');
            const fileEl = document.createElement('div');
            fileEl.className = 'file-item nested-file';
            fileEl.dataset.name = file.name;
            fileEl.dataset.shouldIgnore = file.shouldIgnore;
            
            const icon = file.icon || getFileIcon(file.name);
            
            fileEl.innerHTML = `
                <span class="icon">${icon}</span>
                <span class="name">${fileName}</span>
                ${file.shouldIgnore 
                    ? '<span class="badge should-ignore">IGNORE</span>' 
                    : '<span class="badge keep">KEEP</span>'}
            `;
            
            fileEl.addEventListener('click', (e) => {
                e.stopPropagation();
                showFilePreview(file);
            });
            
            contentsEl.appendChild(fileEl);
        });
        
        folderEl.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFolder(folderEl, contentsEl);
        });
        
        fileTree.appendChild(folderEl);
        fileTree.appendChild(contentsEl);
    });
    
    // Start timer
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(updateTimer, 100);
    
    // Focus input
    switchToTab('gitignore');
    gitignoreInput.focus();
}

// Helper function to render a single file/folder item
function renderFileItem(file, container, level) {
    const isFolder = file.icon === '📁' || (!file.name.includes('.') && !file.name.includes('/'));
    
    const fileEl = document.createElement('div');
    fileEl.className = 'file-item' + (isFolder ? ' folder' : '');
    fileEl.dataset.name = file.name;
    fileEl.dataset.shouldIgnore = file.shouldIgnore;
    fileEl.dataset.isFolder = isFolder;
    
    const iconSpan = isFolder ? '📁' : (file.icon || getFileIcon(file.name));
    
    fileEl.innerHTML = `
        <span class="icon">${iconSpan}</span>
        <span class="name">${file.name}</span>
        ${file.shouldIgnore 
            ? '<span class="badge should-ignore">IGNORE</span>' 
            : '<span class="badge keep">KEEP</span>'}
    `;
    
    if (isFolder) {
        const contentsEl = document.createElement('div');
        contentsEl.className = 'folder-contents';
        contentsEl.dataset.folder = file.name;
        
        const contents = folderContents[file.name] || ['(contents not available)'];
        contents.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'file-item';
            const itemIcon = item.endsWith('/') ? '🔒' : '📄';
            itemEl.innerHTML = `<span class="icon">${itemIcon}</span><span class="name">${item}</span>`;
            contentsEl.appendChild(itemEl);
        });
        
        fileEl.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFolder(fileEl, contentsEl);
        });
        
        container.appendChild(fileEl);
        container.appendChild(contentsEl);
    } else {
        fileEl.addEventListener('click', () => showFilePreview(file));
        container.appendChild(fileEl);
    }
}

function toggleFolder(folderEl, contentsEl) {
    folderEl.classList.toggle('expanded');
    contentsEl.classList.toggle('expanded');
}

function handleInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const filename = gitignoreInput.value.trim();
        if (!filename) return;
        
        addToGitignore(filename);
        gitignoreInput.value = '';
    }
}

// Convert gitignore pattern to regex
function gitignorePatternToRegex(pattern) {
    let regexStr = '';
    let i = 0;
    
    // Check if pattern ends with / (directory pattern)
    const isDirectoryPattern = pattern.endsWith('/');
    const cleanPattern = isDirectoryPattern ? pattern.slice(0, -1) : pattern;
    
    while (i < cleanPattern.length) {
        const char = cleanPattern[i];
        const nextChar = cleanPattern[i + 1];
        
        if (char === '*' && nextChar === '*') {
            // ** matches everything including /
            regexStr += '.*';
            i += 2;
        } else if (char === '*') {
            // * matches everything except /
            regexStr += '[^/]*';
            i++;
        } else if (char === '?') {
            // ? matches single character except /
            regexStr += '[^/]';
            i++;
        } else if (char === '[') {
            // Character class - find closing bracket
            const closeIdx = cleanPattern.indexOf(']', i);
            if (closeIdx !== -1) {
                regexStr += cleanPattern.slice(i, closeIdx + 1);
                i = closeIdx + 1;
            } else {
                regexStr += '\\[';
                i++;
            }
        } else if ('.+^${}()|\\'.includes(char)) {
            // Escape regex special chars
            regexStr += '\\' + char;
            i++;
        } else {
            regexStr += char;
            i++;
        }
    }
    
    // Match exact name OR as a directory prefix (matches contents inside)
    // e.g., "node_modules" matches "node_modules" and "node_modules/express"
    return new RegExp(`^${regexStr}($|/)`, 'i');
}

// Check if a filename matches a gitignore pattern
function matchesGitignorePattern(filename, pattern) {
    // Handle negation
    if (pattern.startsWith('!')) {
        return false; // Negation patterns are handled separately
    }
    
    const regex = gitignorePatternToRegex(pattern);
    return regex.test(filename);
}

// Find all files that match a pattern
function findMatchingFiles(pattern, files) {
    const isNegation = pattern.startsWith('!');
    const actualPattern = isNegation ? pattern.slice(1) : pattern;
    
    return files.filter(file => {
        const regex = gitignorePatternToRegex(actualPattern);
        return regex.test(file.name);
    });
}

function addToGitignore(pattern) {
    const level = levels[gameState.currentLevel];
    const isNegation = pattern.startsWith('!');
    
    // Check if already in gitignore
    if (gameState.ignoredFiles.includes(pattern)) {
        showInputError('Already in .gitignore!');
        return;
    }
    
    // Find matching files
    const matchingFiles = findMatchingFiles(pattern, level.files);
    
    // Check if pattern matches anything
    if (matchingFiles.length === 0) {
        showInputError('No matching files!');
        gameState.wrongAttempts++;
        return;
    }
    
    // Add entry to .gitignore display
    const entry = document.createElement('div');
    entry.className = 'gitignore-entry';
    entry.textContent = pattern;
    
    // Check if any matched file shouldn't be ignored (or for negation, should be ignored)
    const wrongFiles = matchingFiles.filter(f => isNegation ? f.shouldIgnore : !f.shouldIgnore);
    const correctFiles = matchingFiles.filter(f => isNegation ? !f.shouldIgnore : f.shouldIgnore);
    
    // Fail entirely if ANY matched file is wrong (shouldn't be ignored)
    if (wrongFiles.length > 0) {
        // Pattern matches at least one file that should be kept - FAIL
        entry.classList.add('wrong');
        gameState.wrongAttempts++;
        gameState.score = Math.max(0, gameState.score - 50);
        
        // Mark all wrong files in tree
        wrongFiles.forEach(file => {
            const fileEl = document.querySelector(`.file-item[data-name="${file.name}"]`);
            if (fileEl) {
                fileEl.classList.add('wrong');
                setTimeout(() => fileEl.classList.remove('wrong'), 300);
            }
        });
        
        // Remove wrong entry after animation
        gitignoreContent.appendChild(entry);
        setTimeout(() => entry.remove(), 500);
    } else {
        // All matches are correct - SUCCESS
        gameState.ignoredFiles.push(pattern);
        gameState.score += correctFiles.length * 100;
        
        gitignoreContent.appendChild(entry);
        
        // Mark correct files as ignored in tree
        correctFiles.forEach(file => {
            const fileEl = document.querySelector(`.file-item[data-name="${file.name}"]`);
            if (fileEl) {
                fileEl.classList.add('ignored');
            }
        });
        
        updateLineNumbers();
        updateProgress();
        
        // Check if level complete - count unique ignored files
        const allIgnoredFileNames = new Set();
        gameState.ignoredFiles.forEach(pat => {
            const matches = findMatchingFiles(pat, level.files);
            matches.forEach(f => {
                if (f.shouldIgnore) allIgnoredFileNames.add(f.name);
            });
        });
        
        const filesToIgnore = level.files.filter(f => f.shouldIgnore).length;
        if (allIgnoredFileNames.size >= filesToIgnore) {
            checkLevelComplete();
        }
    }
    
    scoreDisplay.textContent = `Score: ${gameState.score}`;
}

function showInputError(message) {
    const originalPlaceholder = gitignoreInput.placeholder;
    gitignoreInput.placeholder = message;
    gitignoreInput.classList.add('error');
    
    setTimeout(() => {
        gitignoreInput.placeholder = originalPlaceholder;
        gitignoreInput.classList.remove('error');
    }, 1000);
}

function updateLineNumbers() {
    const count = gameState.ignoredFiles.length + 1;
    lineNumbers.innerHTML = Array.from({length: count}, (_, i) => i + 1).join('<br>');
}

function updateTimer() {
    const elapsed = (Date.now() - gameState.startTime) / 1000;
    timerDisplay.textContent = `Time: ${elapsed.toFixed(1)}s`;
}

function updateProgress() {
    const level = levels[gameState.currentLevel];
    const total = level.files.filter(f => f.shouldIgnore).length;
    
    // Count unique ignored files from all patterns
    const ignoredFileNames = new Set();
    gameState.ignoredFiles.forEach(pattern => {
        const matches = findMatchingFiles(pattern, level.files);
        matches.forEach(f => {
            if (f.shouldIgnore) ignoredFileNames.add(f.name);
        });
    });
    
    progressDisplay.textContent = `${ignoredFileNames.size} / ${total} files ignored`;
}

function showFilePreview(file) {
    gameState.currentPreviewFile = file;
    
    // Add or update preview tab
    let previewTab = document.querySelector('.tab[data-tab="preview"]');
    if (!previewTab) {
        previewTab = document.createElement('div');
        previewTab.className = 'tab preview-tab';
        previewTab.dataset.tab = 'preview';
        previewTab.innerHTML = `
            <span class="tab-icon">${file.icon || getFileIcon(file.name)}</span>
            <span class="tab-name">${file.name}</span>
            <span class="close-tab">×</span>
        `;
        previewTab.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-tab')) {
                closePreviewTab();
            } else {
                switchToTab('preview');
            }
        });
        editorTabs.appendChild(previewTab);
    } else {
        previewTab.querySelector('.tab-icon').textContent = file.icon || getFileIcon(file.name);
        previewTab.querySelector('.tab-name').textContent = file.name;
    }
    
    // Update preview content
    let content = file.content;
    
    // Create content area
    const contentArea = document.createElement('pre');
    contentArea.className = 'file-content-text';
    contentArea.textContent = content;
    
    // In pro mode, highlight potential API keys / secrets
    if (gameState.mode === 'pro') {
        // First escape HTML, then apply highlighting
        const escaped = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        contentArea.innerHTML = escaped.replace(
            /(sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+|sk-proj-[a-zA-Z0-9]+|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]+|npm_[a-zA-Z0-9]+|-----BEGIN[^-]+PRIVATE KEY-----|whsec_[a-zA-Z0-9]+|SG\.[a-zA-Z0-9]+)/g,
            '<span class="api-key">$1</span>'
        );
    }
    
    filePreviewContent.innerHTML = '';
    filePreviewContent.appendChild(contentArea);
    
    // Update line numbers for preview
    const lines = file.content.split('\n').length;
    const previewLineNumbers = document.querySelector('.preview-line-numbers');
    previewLineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
    
    // Switch to preview tab
    switchToTab('preview');
}

function switchToTab(tabName) {
    // Update tab active states
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update content visibility
    tabGitignore.classList.toggle('active', tabName === 'gitignore');
    tabPreview.classList.toggle('active', tabName === 'preview');
    
    if (tabName === 'gitignore') {
        gitignoreInput.focus();
    }
}

function closePreviewTab() {
    const previewTab = document.querySelector('.tab[data-tab="preview"]');
    if (previewTab) {
        previewTab.remove();
    }
    gameState.currentPreviewFile = null;
    switchToTab('gitignore');
}

// Keep gitignore tab clickable
document.querySelector('.tab[data-tab="gitignore"]').addEventListener('click', () => {
    switchToTab('gitignore');
});

function checkLevelComplete() {
    const level = levels[gameState.currentLevel];
    
    // Check if all files are ignored
    const allIgnoredFileNames = new Set();
    gameState.ignoredFiles.forEach(pat => {
        const matches = findMatchingFiles(pat, level.files);
        matches.forEach(f => {
            if (f.shouldIgnore) allIgnoredFileNames.add(f.name);
        });
    });
    
    const filesToIgnore = level.files.filter(f => f.shouldIgnore).length;
    const allFilesIgnored = allIgnoredFileNames.size >= filesToIgnore;
    
    // Update terminal button state
    if (allFilesIgnored && !gameState.committed) {
        // Only bounce if just became ready
        if (!terminalBtn.classList.contains('ready')) {
            terminalBtn.classList.add('ready', 'bounce');
            terminalBtn.textContent = '⚡ Commit Now!';
            // Remove bounce class after animation
            setTimeout(() => terminalBtn.classList.remove('bounce'), 500);
        }
    } else {
        terminalBtn.classList.remove('ready', 'bounce');
        terminalBtn.textContent = 'Terminal';
    }
    
    // Check if gitignore is committed
    if (allFilesIgnored && gameState.committed) {
        terminalBtn.classList.remove('ready', 'bounce');
        terminalBtn.textContent = 'Terminal';
        levelComplete();
    }
}

function levelComplete() {
    clearInterval(gameState.timerInterval);
    const elapsed = (Date.now() - gameState.startTime) / 1000;
    
    // Bonus points for speed
    const timeBonus = Math.max(0, Math.floor((60 - elapsed) * 10));
    // Penalty for wrong attempts
    const penalty = gameState.wrongAttempts * 25;
    // Penalty for verbose gitignore (more lines = less efficient)
    const lineCount = gameState.ignoredFiles.length;
    const linePenalty = lineCount > 1 ? (lineCount - 1) * 10 : 0;
    
    const levelScore = gameState.score + timeBonus - penalty - linePenalty;
    gameState.score = Math.max(0, levelScore);
    
    overlayTitle.textContent = '✅ Level Complete!';
    overlayTitle.style.color = '#4ec9b0';
    overlayMessage.textContent = `You completed "${levels[gameState.currentLevel].name}"`;
    overlayStats.innerHTML = `
        <div>⏱️ Time: ${elapsed.toFixed(1)}s</div>
        <div>🎯 Time Bonus: +${timeBonus}</div>
        <div>❌ Wrong Attempts: ${gameState.wrongAttempts} (-${penalty})</div>
        <div>📝 Lines Used: ${lineCount} (-${linePenalty})</div>
        <div style="font-size: 24px; margin-top: 15px;">🏆 Score: ${gameState.score}</div>
    `;
    
    const btnNext = document.getElementById('btn-next');
    if (gameState.currentLevel >= levels.length - 1) {
        btnNext.textContent = 'Finish Game';
    } else {
        btnNext.textContent = 'Next Level';
    }
    
    overlay.classList.remove('hidden');
}

function showGameComplete() {
    clearInterval(gameState.timerInterval);
    overlayTitle.textContent = '🎉 Congratulations!';
    overlayTitle.style.color = '#cca700';
    overlayMessage.textContent = 'You completed all levels!';
    overlayStats.innerHTML = `
        <div style="font-size: 28px;">🏆 Final Score: ${gameState.score}</div>
        <div style="margin-top: 20px; color: #858585;">
            ${gameState.mode === 'pro' ? '🔥 Pro Mode Completed!' : 'Try Pro Mode for an extra challenge!'}
        </div>
    `;
    
    document.getElementById('btn-next').style.display = 'none';
    document.getElementById('btn-retry').textContent = 'Play Again';
    
    overlay.classList.remove('hidden');
}

function retryLevel() {
    overlay.classList.add('hidden');
    document.getElementById('btn-next').style.display = '';
    document.getElementById('btn-retry').textContent = 'Retry';
    
    if (gameState.currentLevel >= levels.length) {
        // Restart game in pro mode
        gameState.currentLevel = 0;
        gameState.score = 0;
        gameState.mode = 'pro';
        document.getElementById('game-container').classList.add('pro-mode');
        modeIndicator.textContent = '🔥 Pro Mode';
    }
    
    loadLevel(gameState.currentLevel);
}

function nextLevel() {
    overlay.classList.add('hidden');
    gameState.currentLevel++;
    loadLevel(gameState.currentLevel);
}

// Terminal Functions
function toggleTerminal() {
    terminalPanel.classList.toggle('hidden');
    if (!terminalPanel.classList.contains('hidden')) {
        terminalInput.focus();
    }
}

function handleTerminalInput(e) {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (command) {
            processTerminalCommand(command);
            terminalInput.value = '';
        }
    }
}

function appendToTerminal(html, className = '') {
    const div = document.createElement('div');
    div.innerHTML = html;
    if (className) div.className = className;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function processTerminalCommand(command) {
    // Echo the command
    appendToTerminal(`<span class="cmd-line">~/my-project $ <span class="cmd">${escapeHtml(command)}</span></span>`);
    
    const parts = command.split(/\s+/);
    const cmd = parts[0];
    
    if (cmd === 'git') {
        processGitCommand(parts.slice(1));
    } else if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
    } else if (cmd === 'ls') {
        const level = levels[gameState.currentLevel];
        const files = level.files.map(f => f.name.split('/')[0]);
        const uniqueFiles = [...new Set(files)];
        appendToTerminal(uniqueFiles.join('  '), 'info');
    } else if (cmd === 'help') {
        appendToTerminal('Available commands:', 'info');
        appendToTerminal('  git status     - Show staged and unstaged files', 'info');
        appendToTerminal('  git add <file> - Stage a file for commit', 'info');
        appendToTerminal('  git commit -m "msg" - Commit staged files', 'info');
        appendToTerminal('  git commit -am "msg" - Stage all and commit', 'info');
        appendToTerminal('  ls             - List files', 'info');
        appendToTerminal('  clear          - Clear terminal', 'info');
    } else {
        appendToTerminal(`bash: ${cmd}: command not found`, 'error');
    }
}

function processGitCommand(args) {
    const subcommand = args[0];
    
    if (subcommand === 'status') {
        showGitStatus();
    } else if (subcommand === 'add') {
        const filename = args.slice(1).join(' ');
        gitAdd(filename);
    } else if (subcommand === 'commit') {
        gitCommit(args.slice(1));
    } else {
        appendToTerminal(`git: '${subcommand}' is not a git command.`, 'error');
    }
}

function showGitStatus() {
    appendToTerminal('On branch main', 'info');
    
    if (gameState.stagedFiles.length > 0) {
        appendToTerminal('Changes to be committed:', 'success');
        gameState.stagedFiles.forEach(f => {
            appendToTerminal(`  new file:   ${f}`, 'success');
        });
    }
    
    // Show .gitignore as modified if there are entries
    const unstagedChanges = [];
    if (gameState.ignoredFiles.length > 0 && !gameState.stagedFiles.includes('.gitignore')) {
        unstagedChanges.push('.gitignore');
    }
    
    if (unstagedChanges.length > 0) {
        appendToTerminal('Changes not staged for commit:', 'error');
        unstagedChanges.forEach(f => {
            appendToTerminal(`  modified:   ${f}`, 'error');
        });
    }
    
    if (gameState.stagedFiles.length === 0 && unstagedChanges.length === 0) {
        appendToTerminal('nothing to commit, working tree clean', 'info');
    }
}

function gitAdd(filename) {
    if (!filename) {
        appendToTerminal('Nothing specified, nothing added.', 'error');
        return;
    }
    
    // Handle "git add ." or "git add -A"
    if (filename === '.' || filename === '-A') {
        if (gameState.ignoredFiles.length > 0 && !gameState.stagedFiles.includes('.gitignore')) {
            gameState.stagedFiles.push('.gitignore');
            appendToTerminal('Added .gitignore to staging area', 'success');
        } else {
            appendToTerminal('No changes to add', 'info');
        }
        return;
    }
    
    // Check if file exists
    const validFiles = ['.gitignore'];
    const level = levels[gameState.currentLevel];
    level.files.forEach(f => validFiles.push(f.name));
    
    if (filename === '.gitignore') {
        if (gameState.ignoredFiles.length === 0) {
            appendToTerminal('No changes to .gitignore to stage', 'error');
            return;
        }
        if (gameState.stagedFiles.includes('.gitignore')) {
            appendToTerminal('.gitignore is already staged', 'info');
            return;
        }
        gameState.stagedFiles.push('.gitignore');
        appendToTerminal('Added .gitignore to staging area', 'success');
    } else if (validFiles.includes(filename)) {
        if (gameState.stagedFiles.includes(filename)) {
            appendToTerminal(`${filename} is already staged`, 'info');
            return;
        }
        gameState.stagedFiles.push(filename);
        appendToTerminal(`Added ${filename} to staging area`, 'success');
    } else {
        appendToTerminal(`fatal: pathspec '${filename}' did not match any files`, 'error');
    }
}

function gitCommit(args) {
    // Parse commit arguments
    let message = '';
    let stageAll = false;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-m') {
            // Get the message (could be in quotes)
            const remaining = args.slice(i + 1).join(' ');
            const match = remaining.match(/^["'](.*)["']$|^(\S+)$/);
            if (match) {
                message = match[1] || match[2] || remaining.replace(/^["']|["']$/g, '');
            } else {
                message = remaining.replace(/^["']|["']$/g, '');
            }
            break;
        } else if (args[i] === '-am') {
            stageAll = true;
        } else if (args[i].startsWith('-a')) {
            stageAll = true;
        }
    }
    
    // Stage all if -a flag
    if (stageAll) {
        if (gameState.ignoredFiles.length > 0 && !gameState.stagedFiles.includes('.gitignore')) {
            gameState.stagedFiles.push('.gitignore');
        }
    }
    
    if (gameState.stagedFiles.length === 0) {
        appendToTerminal('nothing to commit, working tree clean', 'error');
        return;
    }
    
    if (!message) {
        appendToTerminal('Aborting commit due to empty commit message.', 'error');
        return;
    }
    
    // Perform the commit
    const fileCount = gameState.stagedFiles.length;
    appendToTerminal(`[main abc1234] ${message}`, 'success');
    appendToTerminal(` ${fileCount} file${fileCount > 1 ? 's' : ''} changed`, 'info');
    
    // Check if .gitignore was committed
    if (gameState.stagedFiles.includes('.gitignore')) {
        gameState.committed = true;
    }
    
    // Clear staged files
    gameState.stagedFiles = [];
    
    // Check if level is complete
    checkLevelComplete();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on load
init();
