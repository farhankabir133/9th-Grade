# 🚀 9Th Grade AI

[![Static Analysis](https://img.shields.io/badge/Linter-tsc%20--noEmit-emerald?style=flat-hard)](https://github.com/farhankabir-dev/ninthgrade-ai)
[![Framework](https://img.shields.io/badge/React-19.0.1-bg-blue?style=flat-hard&logo=react)](https://react.dev)
[![Styles](https://img.shields.io/badge/Tailwind--CSS-v4.0-38bdf8?style=flat-hard&logo=tailwind-css)](https://tailwindcss.com)
[![Engine](https://img.shields.io/badge/Express--Node-v4.21-darkgreen?style=flat-hard&logo=node.js)](https://expressjs.com)
[![Database](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-hard&logo=firebase)](https://firebase.google.com)
[![AI--Engine](https://img.shields.io/badge/Google--GenAI-Gemini--Flash-8e44ad?style=flat-hard&logo=google-cloud)](https://ai.google.dev/)

> ### 📢 Live Soon! (শীঘ্রই লাইভ হচ্ছে!)
> **9Th Grade AI is launching soon!** We are putting the final touches on our production pipelines, cloud scalability features, and multi-modal models. **Stay tuned!** ✨

**9Th Grade AI** is an advanced, AI-powered intelligent Learning Operating System designed specifically for competitive exam seekers, university aspirants, and job candidates in Bangladesh. Powered by React 19, Tailwind v4, Express Node.js, and Google's multi-modal Gemini API, it provides real-time rank simulations, personalized guidance, and persistent preparation metrics.

This platform re-imagines competitive learning from the ground up, delivering deep analytics, spaced-repetition revisions, and written answer evaluations instead of generic quiz pages.

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [Core Features](#-core-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Installation & Setup](#-installation--setup)
6. [Configuration & Environment](#-configuration--environment)
7. [Enterprise Architecture](#-enterprise-architecture)
8. [Offline Sandbox Mode](#-offline-sandbox-mode)
9. [Roadmap](#-roadmap)
10. [Contributing](#-contributing)
11. [License](#-license)
12. [Author](#-author)

---

## 🔍 Overview

Historically, candidates preparing for high-stakes examinations in Bangladesh (such as the **BCS (Bangladesh Civil Service)**, **University Admissions**, and bank recruitments) have relied on bulky paper question banks, rigid offline coaching centers, and unautomated evaluation. These structures offer zero individual analytics, lack personalized correction, and fail to track individual subject retention over time.

**9Th Grade AI** steps in to solve these deficits by functioning as a complete **personal learning operating system**:
* **Predictive Competency Engine:** Analyzes speed, raw accuracy, and topic strengths across standard practice exams to project real-time competitive ranks.
* **Bangla AI Tutor Integration:** Leverages Gemini to give instant, context-aware translations, sub-topic deep dives, and grammatical logic explained entirely in clean Bengali.
* **Memory & Spaced Repetition Rails:** Helps prevent memory decay with active-recall flashcard setups tailored to high-density syllabus areas.
* **Handwritten/Written estimation:** Estimates exam readiness for non-MCQ structured written parts utilizing multi-modal vision prompts.

---

## ✨ Core Features

### ⏱️ 1. 9Th Grade Exam Practice Engine
* **Dynamic Practice Modes:** Standard adaptive tests, live focus-timed mock screens, and customizable exam configurations (with target subjects).
* **Instant Solutions:** Staggered answer panels showing English and Bengali solutions instantly, paired with interactive visual indicators.
* **Fault Tolerant Exports:** Export prepared sets directly as formatted Google Docs. Integrated with an offline fallback option to save `.txt` practice sheets directly to the user's hard drive if Google integration is offline.

### 🤖 2. Personalized Bangla AI Tutor
* **Interactive Dynamic Sidebar:** Real-time conversational tutor designed to assist students with vocabulary, history details, math rules, or scientific formulae.
* **Smart Prompt suggestions:** Generates context-based preparation tips, syllabus shortcuts, and practice questions.

### 🧠 3. Memory Revision (Spaced Repetitive Retention)
* **Custom Cue cards:** Standard flashcard system powered by a spaced execution simulator.
* **Dynamic Metrics:** Pinpoints exactly when knowledge decay is imminent, alerting candidates to revise at the perfect psychological interval.

### 📝 4. Vision Written Exam Evaluator
* **Multi-Modal written grading mockup:** Users can simulate input, upload handwriting images, or paste written answers.
* **Analytical Marksheets:** Breaks down grading benchmarks based on logic adequacy, structure, language style, and accuracy.

---

## 🛠️ Tech Stack

| Domain | Integrated Technologies |
| :--- | :--- |
| **Frontend Framework** | **React [19.0.1](https://react.dev/)** (with TypeScript, ES Modules, and modern React hook design patterns) |
| **Styles & Theme** | **[Tailwind CSS v4.0](https://tailwindcss.com/)** (integrated with explicit fluid responsive variables, custom ambient glass filters, and dark cosmic slate accents) |
| **Server Engine** | **[Express.js](https://expressjs.com/) (v4.21.2)** (routing backend proxies and static build hosting) |
| **Authentication** | **[Firebase Auth](https://firebase.google.com/docs/auth)** (supporting Email/Password, Google OAuth popups, and full guest-session bypass) |
| **Durable Database** | **[Firebase Firestore](https://firebase.google.com/docs/firestore)** (storing custom user progress, mock test logs, and personalized profile identity metrics) |
| **AI Multi-Modal Interface** | **[@google/genai](https://www.npmjs.com/package/@google/genai)** (utilizing models like `gemini-3.5-flash` with backend secret keys for secure queries) |
| **Visual Analytics** | **[Recharts](https://recharts.org/)** (high-performance interactive canvas components for competency timelines and subject grids) |
| **Animations** | **[Motion](https://motion.dev/) (Framer Motion v12)** (optimized layout triggers, cards transition routines, and micro-hover states) |

---

## 📁 Project Structure

```bash
ninthgrade-ai/
├── .env.example                # Schema template for backend keys & server secrets
├── .gitignore                  # Production Git ignore exceptions (dist, node_modules)
├── firebase-blueprint.json     # Firestore collections and bootstrap schemas
├── firestore.rules             # Secure, validated Firebase collection access rules
├── index.html                  # Core application mounting webpage template
├── package.json                # Project dependencies, dev servers, & automated build workflows
├── server.ts                   # Custom production-ready Express server entrypoint
├── tsconfig.json               # Configured TypeScript rules and strict compiler settings
├── vite.config.ts              # Vite configuration with embedded Tailwind compiler 
├── src/                        # Core Application Source Code
│   ├── App.tsx                 # Base parent orchestrator and routing layout
│   ├── index.css               # Global imported Google fonts & design variable theme overrides
│   ├── main.tsx                # Client mounting bootstrap
│   ├── types.ts                # Rigid shared TypeScript definitions, enums, & data profiles
│   ├── components/             # Reusable UX Components
│   │   ├── AITutor.tsx         # Bengali custom chatbot using Google GenAI SDK
│   │   ├── Analytics.tsx       # Timeline charts, strength maps, and progress logs
│   │   ├── AuthModal.tsx       # Secured login/signup control with Google/Guest tabs
│   │   ├── CareerOS.tsx        # BCS exam streams mapping & goal management
│   │   ├── Dashboard.tsx       # Base dashboard pane showing overview numbers and logs
│   │   ├── ExamEngine.tsx      # Comprehensive custom exam simulation engine
│   │   ├── LandingPage.tsx     # Modern interactive intro portal showcasing premium aesthetic
│   │   ├── MemoryRevision.tsx  # Spaced repetition cue engine for syllabus areas
│   │   ├── ProfileIdentity.tsx # Student identity detail inspector & stats
│   │   └── WrittenEvaluator.tsx# Multi-modal handwriting response estimator UI
│   └── lib/                    # SDK initializations & Core Drivers
│       ├── AuthContext.tsx     # Session provider, persistent handlers, and sandbox engines
│       └── firebase.ts         # Secure Firebase DB & authentication setup
```

---

## ⚙️ Configuration & Environment

9Th Grade AI uses environment variables for secure server operations. Create a `.env` file in the root directory by mirroring `.env.example`:

```bash
# Duplicate the example config file
cp .env.example .env
```

Open the newly created `.env` file and configure these variables:

```env
# Google Gemini API Key - Retrieve this directly from Google AI Studio
# Crucial: Must be kept server-side to hide it from the frontend client console.
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# App Deployment Host URL - Injected dynamically on hosting setups.
# Used for OAuth loops, reverse-proxies, and target headers.
APP_URL="http://localhost:3000"
```

---

## 📦 Installation & Setup

Ensure you have **Node.js LTS (v18 or higher)** installed on your machine.

### 1. Position into directory & install packages
```bash
# Clone or move into the repository root
cd ninthgrade-ai

# Fetch and install required server/client packages
npm install
```

### 2. Prepare the database & secure rules
Set up your Firebase project from your [Firebase Console](https://console.firebase.google.com/) and update `firebase-applet-config.json` with your real keys. Then deploy your rules:
```bash
# Generates and persists the firestore security rules
npm run deploy-firebase-rules
```

### 3. Launch the development environment
Start the server in development mode. The custom Express back-end intercepts request APIs while hosting hot-reloading Vite assets in the background.
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Enterprise Architecture

9Th Grade AI has been built from the ground up for high-performance production workloads.

```
                      +-------------------------------------------------+
                      |                 Client Browser                  |
                      +-------------------------------------------------+
                                      |                   |
                     Asset Serving &  |                   | Auth & DB Logs 
                      Express Proxy   |                   | (Direct SDK)
                                      v                   v
+-------------------------------+-----------+    +----------------------+
|            Backend            |  Express  |    |       Firebase       |
|          Credentials          |  Service  |    |      Infrastructure  |
|  +-------------------------+  |  (CJS)    |    |  +----------------+  |
|  | GEMINI_API_KEY          |  |           |    |  | Firestore      |  |
|  +-------------------------+  |           |    |  +----------------+  |
|  | Google GenAI SDK Client |  |           |    |  | Firebase Auth  |  |
|  +-------------------------+  +-----------+    |  +----------------+  |
+-------------------------------+----------------+----------------------+
```

### Server Compilation System
Vite serves assets in development, but the production build pipeline is compiled cleanly into a single unified output pattern.
* **Vite Static Bundling:** Client JavaScript and CSS variables are bundled on target builds into high-efficiency chunks inside `dist/`.
* **esbuild Server Bundling:** The main `server.ts` file is compiled to `dist/server.cjs` using esbuild:
  ```bash
  esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
  ```
* **Why CJS bundling?** Packaging `server.ts` down to a single `.cjs` file completely avoids Node's runtime ES Module resolution loops while maintaining clean backtracks through sourcemaps. This reduces container cold-start times inside serverless ecosystems.

---

## 🛡️ Offline Sandbox Mode

To cater to developers running the application locally without active Google Workspace accounts or Firebase OAuth configurations, **9Th Grade AI** features a **Full Guest Sandbox Mode**:
* **Zero Firebase Blockers:** If Email/Password registration returns `auth/operation-not-allowed` (due to disabled services in a console), the UI guides the user on how to enable them or offers a **Guest Practice Bypass**.
* **Local Storage Persistence:** Enables complete local simulation of persistent data models using the browser's `localStorage` state engine. Everything—from mock exam scores to profile identity updates—stores locally on your device without breaking.
* **Local Document Downloads:** If Google Drive exports error out, clicking **"টেক্সট ফাইল (.txt) ডাউনলোড করুন"** directly compiles and downloads a structured question sheet with step-by-step explanations straight to your local PC.

---

## 🗺️ Roadmap

- [ ] **Live Mock Tournaments:** Live timed examinations where candidates compete in real-time.
- [ ] **Native OCR Integration:** True client-side image cropping and OCR text extraction for written assessments.
- [ ] **Peer Comparison Panels:** Comparative analytical dashboard charts comparing student progress against global toppers.
- [ ] **Extended Spaced Repetition (SRS) Customization:** Ability to import personal spreadsheets directly into spaced repetition flashcards.

---

## 🤝 Contributing

Contributions are welcomed! Follow these simple steps:
1. **Fork** the repository.
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

---

## 🌟 Support & Author

Created with 🤍 by **Farhan Kabir**. 

* **Tech Space:** AI Engineering, Full-Stack Development & Open Source building.
* **Portfolio:** [farhankabir.dev](https://farhankabir.dev)
* **GitHub:** [@farhankabir](https://github.com/farhankabir)
* **Email:** [farhankabir236@gmail.com](mailto:farhankabir236@gmail.com)

*Prep intelligently, measure accurately, succeed brilliantly.* 🚀
