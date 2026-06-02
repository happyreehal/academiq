Markdown# 🏫 AcademiQ

A comprehensive, full-stack academic management platform featuring a secure 3-tier role-based access system (Student, Admin, and Super Admin) and an intelligent AI-powered question prediction engine that analyzes past exam papers and syllabi. 

The application is built using a decoupled architecture with a Python-based robust API backend and a blazing-fast React + Vite modern frontend ecosystem.

## 🚀 Live Demo
🎉 The dynamic platform web application is fully deployed and production-ready:
🔗 [Launch AcademiQ Platform](https://academiq-sigma.vercel.app)

---

## ✅ What You Need First

Install these core development runtimes on your machine before initiating local configuration:
| Tool | Purpose & Resource |
| :--- | :--- |
| **Node.js (LTS)** | https://nodejs.org → Drives the React/Vite development server |
| **Python 3.10+** | https://www.python.org → Runs the backend prediction engine & API routers |
| **Git** | https://git-scm.com/downloads → Source control configuration |

---

## 📁 Complete Project Architecture Tree

Based on your local workspace setup, the directory structure maps out systematically:

### 1. Root Directory & Backend Ecosystem (`backend`)
```text
academiq/
├── backend/
│   ├── models/
│   │   └── user.py             # User schema models and profiles
│   ├── routes/
│   │   ├── ai.py               # AI paper analytics & prediction handlers
│   │   ├── auth.py             # User signup, login, and registration modules
│   │   ├── papers.py           # Previous year paper uploads & tracking managers
│   │   └── settings.css        # Account management parameters routing
│   ├── utils/
│   │   ├── dependencies.py     # Middleware and injection dependencies
│   │   └── jwt_handler.py      # Secure HS256 JWT generation and validation
│   ├── .env                    # System private database keys & secrets
│   ├── .gitignore              # Files to exclude from tracking
│   ├── main.py                 # Core backend API entry execution script
│   └── requirements.txt        # Backend dependencies (FastAPI/Flask, JWT, etc.)
2. Frontend Ecosystem (frontend)Plaintext├── frontend/
│   ├── dist/                   # Bundled production distribution build
│   │   └── assets/             # Optimized minified scripts and styles
│   ├── node_modules/           # Node environment compiled tracking modules
│   ├── public/                 # Static global assets
│   │   ├── models/             # Local data structures reference
│   │   ├── favicon.svg         # Application icon asset
│   │   └── icons.svg           # Scalable vectors dictionary
│   ├── src/                    # Source application code modules
│   │   ├── components/
│   │   │   └── landing/        # Landing page sections (home, HowItWorks.jsx, etc.)
│   │   ├── .env                # Public connection environment API targets
│   │   ├── .gitignore          # Client-side skip guidelines
│   │   ├── eslint.config.js    # Linting syntax code criteria
│   │   ├── index.html          # SPA master layout application base entry
│   │   ├── package-lock.json   # Exact hard-locked dependencies tree
│   │   ├── package.json        # Frontend commands, building scripts & modules
│   │   ├── vercel.json         # Rewrites routing layout rules for Vercel deployment
│   │   └── vite.config.js      # Core compilation configuration properties for Vite
```

 ## 🚀 Step-by-Step Local Workspace Configuration
Follow these command groups sequentially in isolated terminals to run the ecosystem:

## STEP 1 — Launch the API Microservice Backend

1.  Open a new terminal window on your desktop.

2.  Navigate directly inside the backend working environment:
Bash   cd C:\Users\happy\Desktop\academiq\backend

3.  Install required Python packages listed in your setup schema:
Bash   pip install -r requirements.txt

4.  Fire up the core backend microservice instance:
Bash   python main.py
The backend engine starts running, exposing API access arrays locally.

## STEP 2 — Launch the React + Vite Frontend UI
1.  Open a completely secondary independent terminal window.

2.  Change paths directly into the client folder structure:
Bash   cd C:\Users\happy\Desktop\academiq\frontend

3.  Fetch the required node modules package structures securely:
Bash   npm install

4.  Initiate the blazing-fast Vite local runtime environment:
Bash   npm run dev
Your terminal will prompt a local IP stream link (usually http://localhost:5173). Launch it in your browser!

## 🎮 Core Application Features & Workflows
 ## 🔐 Secure 3-Tier Multi-Role Authorization: Users register natively.
 The request checks against utils/jwt_handler.py to encrypt credentials. Access rights cascade into specific dashboards for Students, Admins, or Super Admins.
 
## 🔮 AI Exam Question Analytics: 
Utilizing the core processing routines in routes/ai.py, the system calculates patterns from prior syllabus files and structural papers to output predictive highly-probable upcoming exam matrices.  

## ✨ Smooth Framer Motion UI:
The landing blocks (like HowItWorks.jsx) utilize advanced UI physics engine calls (motion.div) to create interactive layout scaling and 3D rotations dynamically while loading views.

## ❓ Common Troubleshooting & Issues

## 📌 Error: JWT Secret Missing or Server Terminating on Run
# Reason: 
The backend scripts cannot bind private configuration variables.
# Fix:
Ensure a .env file exists directly inside your backend/ folder specifying valid server keys and database connectivity string properties.

## 📌 Error: CORS Blocked when React requests backend assets
Reason: Cross-Origin rules are blocking local calls across port 5173 and the backend execution port.
# Fix:
Ensure your backend configuration setup registers standard CORS allow-origin parameters accepting localized inputs.

## 📌 Error: Vite command not found or build script crash
Reason: node_modules are absent or incorrectly cached in the directory.
# Fix: 
Run npm install directly inside your frontend/ folder, then re-trigger npm run dev.

## 🛠️ Complete Full-Stack Tech Stack
| Layer | Framework / Tech Used | Implementation Scope |
| :--- | :--- | :--- |
| **Frontend UI Core** | `React.js 18` + `Vite Engine` | Drives modular UI components, ultra-fast compilation, and smooth page states. |
| **Motion Physics** | `Framer Motion Scripting` | Manages asynchronous interactive page scaling, rotations, and UI loading transitions. |
| **Backend API** | `Python (FastAPI / Flask Framework)` | Drives multi-tier endpoints, routes handling pipelines, and powers predictive logic. |
| **Security Operations** | `PyJWT Routing Architecture` | Drives secure cookie states, access payload encryption, and user authorization. |
| **Cloud Infrastructure**| `Vercel Engine Ecosystem` | Distributes high-speed static frontend routes and handles dynamic redirection rules. |

## 📝 LicenseMIT — 
Available completely for personal portfolio staging, educational scaling, and code modification.
