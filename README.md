# 🚀 OpportunityAI Platform

### *Cooperative Multi-Agent Student Opportunity Matching & Career Mentorship Platform*

[![Model: Gemini 2.5](https://img.shields.io/badge/Model-Gemini%202.5-blueviolet.svg?style=flat-square)](https://ai.google.dev/)
[![Runtime: Node + Python](https://img.shields.io/badge/Runtime-Node.js%20%2B%20Python%203.11-green.svg?style=flat-square)](https://nodejs.org/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4.svg?style=flat-square)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Solution Overview](#-solution-overview)
3. [Multi-Agent Cooperative Architecture](#-multi-agent-cooperative-architecture)
4. [Key Features](#-key-features)
5. [Interactive Walkthrough & System screenshots](#-interactive-walkthrough)
6. [Technology Stack](#-technology-stack)
7. [AI Integration Models](#-ai-integration-models)
8. [Security Architecture & Secret Management](#-security-architecture--secret-management)
9. [Project Directory Tree](#-project-directory-tree)
10. [Local Quickstart & Deployment](#-local-quickstart--deployment)
11. [Model Context Protocol (MCP) Readiness](#-model-context-protocol-mcp-readiness)
12. [Future Development Roadmap](#-future-development-roadmap)
13. [License](#-license)

---

## 🎯 Problem Statement

Students worldwide encounter a heavily fragmented and opaque landscape when looking for career-defining internships, hackathons, fellowships, and scholarships. Important opportunities are scattered across hundreds of isolated portal listings with confusing, verbose eligibility terms.

* **Eligibility Friction:** Overlooked constraints like GPA limits, geographic restrictions, or prerequisite coursework lead to wasted hours on incompatible applications.
* **Cold Start & Gap Anxiety:** Students rarely know how to close skill gaps before deadlines.
* **Absence of Actionable Timelines:** Discovering an opportunity is only half the battle; planning preparation milestones alongside classes is highly overwhelming.

---

## 💡 Solution Overview

**OpportunityAI** bridges this gap by acting as a highly sophisticated, AI-native career-matching and mentorship ecosystem. 

It implements a hierarchical team of **6 specialized cooperative AI agents** powered by **Google Gemini** that dynamically ingest student credentials, query multi-dimensional databases, calculate exact compatibility scores, compile a step-by-step action roadmap, and offer instant conversational advice.

```
       [ STUDENT USER ] <─── Interactive Dashboard (React + Tailwind)
              │
              ▼
    [ EXPRESS FULL-STACK PORT ] <─── http://localhost:3000
              │
        (Subprocess Pipe)
              ▼
   [ PYTHON SYSTEM BRIDGE ] <─── JSON Payload (Pydantic validated)
              │
              ▼
  ┌──────────────────────────────────────────────────────────┐
  │         CENTRAL COORDINATOR AGENT (Orchestrator)          │
  └────┬──────────────┬─────────────┬──────────────┬─────────┘
       │              │             │              │
       ▼              ▼             ▼              ▼
┌────────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐
│  Profile   │  │  Search   │  │   Match   │  │   Report   │
│   Agent    │  │   Agent   │  │   Agent   │  │   Agent    │
│  (Resume   │  │ (Catalog  │  │ (Weighted │  │ (Timeline  │
│  Parser)   │  │  Retriever)│  │ Compatibility│ │ Generator) │
└────────────┘  └───────────┘  └───────────┘  └────────────┘
       ▲                                             │
       └─────────────────────────────────────────────┘
                Interactive Chat: AdvisorAgent
```

---

## 🤖 Multi-Agent Cooperative Architecture

Rather than relying on a single monolith prompt, OpportunityAI divides cognitive tasks into deterministic agents:

1. **CoordinatorAgent (The Conductor):** Orchestrates structural pipeline routing. Resolves execution sequencing, delegates inputs to downstream agents, aggregates final payloads, and handles system-wide errors.
2. **ProfileAgent (The Profiler):** Ingests raw unstructured text (resumes, LinkedIn exports, or free-form bios) and maps attributes into a typed `StudentProfile` schema using Gemini's structured output.
3. **SearchAgent (The Scout):** Evaluates profile constraints (education, citizenship, interests) to query, filter, and fetch highly relevant candidate matches from local registries.
4. **MatchAgent (The Evaluator):** Conducts high-fidelity compatibility scoring. Computes a weighted 0-100% fit score, outlines distinct eligibility reasoning, and identifies key improvements.
5. **ReportAgent (The Planner):** Consolidates matching metadata to generate an executive preparation summary, highlighting precise skill gaps and a chronological milestone timeline.
6. **AdvisorAgent (The Mentor):** An active, conversational chat companion utilizing prior profile matrices to provide customized application guidance, essay reviews, and practice questions.

---

## ✨ Key Features

* **Instant AI CV Parsing:** Drag, drop, or copy-paste an unstructured resume text and instantly view a standardized profile card within seconds.
* **Weighted Opportunity Matrix:** View matching indices alongside color-coded difficulty (Beginner, Intermediate, Advanced) and modality tags (Remote, Hybrid, In-Person).
* **Automated Roadmap Generator:** Transcribe match outcomes into concrete, calendar-aligned preparation milestones.
* **Side-by-Side Opportunity Comparison:** Select multiple scholarships or hackathons and view them in a comparison ledger to contrast stipends, deadlines, and requirements.
* **Continuous Mentorship Chat:** Ask the Advisor Agent targeted questions about specific applications to receive instant action strategies.

---

## 📸 Interactive Walkthrough

### 1. Student Dashboard Overview
*A comprehensive overview detailing personalized profiles, high-probability matches, active timelines, and immediate notifications.*
> 🖼️ **[Screenshot Placeholder: Student Career Dashboard]**
> *Visual Description: Clean high-contrast grid featuring key metrics (GPA, Saved items, Completed roadmaps) and customized category tabs (Scholarships, Fellowships, Hackathons).*

### 2. Resume / CV Extractor Form
*Using the ProfileAgent, raw student input is mapped onto robust JSON schemas.*
> 🖼️ **[Screenshot Placeholder: AI Profiler Interface]**
> *Visual Description: Split-pane workspace with a raw text CV editor on the left and a live, dynamically updated React tag selector detailing parsed technical skills on the right.*

### 3. Application Comparison Matrix
*Direct breakdown comparing stipends, eligibility criteria, and preparation pathways.*
> 🖼️ **[Screenshot Placeholder: Side-by-Side Comparison Grid]**
> *Visual Description: A structured responsive table contrasting two different prestigious fellowships, highlighting GPA barriers and custom action routes.*

### 4. Interactive Advisor Consultation
*Conversational follow-ups regarding timeline milestones.*
> 🖼️ **[Screenshot Placeholder: AdvisorAgent Q&A Console]**
> *Visual Description: Fluid modern chat dialogue showcasing structured markdown responses, bold bullet recommendations, and contextual starter prompts.*

---

## 🛠️ Technology Stack

### Frontend Ecosystem
* **Core Framework:** React 18 with Vite build tool
* **Styling Engine:** Tailwind CSS with dynamic design guidelines
* **UI Controls:** Headless interactive custom components
* **Typography:** Inter Sans (General UI) paired with JetBrains Mono (Data states)
* **Animation Lib:** Framer Motion (smooth transitions & staggered lists)
* **Icons:** Lucide React

### Backend Ecosystem
* **Server Runtime:** Node.js with Express v4
* **Transpiler & Bundler:** esbuild (Bundles TypeScript to self-contained CommonJS `dist/server.cjs`)
* **Dev Runner:** `tsx` (TypeScript Execute)

### Python Subsystem
* **Core Language:** Python 3.11
* **Data Validation:** Pydantic (strict runtime data parsing)
* **API Bridge:** Stateless JSON standard I/O piping

---

## 🧠 AI Integration Models

The platform relies strictly on the official, next-generation **`google-genai`** SDK.

* **Primary Model:** `gemini-2.5-flash`
* **Orchestration Pattern:** 
  - **Structured JSON Schemas:** Leveraging Pydantic base models to force strict schema adherence in the `ProfileAgent`.
  - **System Instructions:** Custom personas initialized globally inside each agent file to manage response vocabulary and contextual parameters.
  - **Stateless Subprocess RPC:** The Express server triggers stateless execution pathways, eliminating Python server startup times and ensuring rapid response streaming.

---

## 🔒 Security Architecture & Secret Management

OpportunityAI enforces rigorous security principles to remain enterprise-safe:

1. **Server-Side Secret Gatekeeping:** All Gemini API keys (`GEMINI_API_KEY`) remain strictly server-side inside Node.js and Python. No API keys are ever exposed, requested, or compiled into client-side bundles.
2. **Subprocess Isolation:** Python scripts run within constrained subprocess shells with no network-facing ports, preventing unauthorized access.
3. **Pydantic Validation Guard:** JSON schemas passed between the Node.js API layer and Python are checked for malformed arrays, scripts, or malicious input vectors.

---

## 📂 Project Directory Tree

```text
├── server.ts                    # Full-Stack Express Server (Node API + Vite middleware)
├── agents_api_bridge.py         # Subprocess JSON RPC execution bridge
├── app.py                       # Python CLI Main Entry Point (Local Testing)
├── config.py                    # Python Environment & SDK Configuration
├── requirements.txt             # Python Package Declarations
├── package.json                 # Node.js Build Scripts & Dependencies
├── metadata.json                # Project Capabilities & Permissions
├── vite.config.ts               # Vite Compiler Specifications
│
├── agents/                      # cooperative AI Agent core definitions
│   ├── coordinator_agent.py     # Hierarchical Orchestrator
│   ├── profile_agent.py         # Structured CV extraction using Gemini
│   ├── search_agent.py          # Opportunity Catalog searcher
│   ├── match_agent.py           # Compatibility and gap analyst
│   ├── advisor_agent.py         # Interactive follow-up consultation
│   └── report_agent.py          # Preparation Roadmap compiler
│
├── models/                      # Python Data Classes
│   ├── student_profile.py       # Pydantic Student schema
│   └── opportunity.py           # Opportunity definition schema
│
├── services/                    # Python Core Logic Algorithms
│   ├── search_service.py        # Local filtering engine (JSON files)
│   ├── scoring_service.py       # Compatibility math
│   └── recommendation_service.py# Gap & timeline compiler
│
├── data/                        # JSON Data Stores (Local Registries)
│   ├── scholarships.json
│   ├── fellowships.json
│   ├── internships.json
│   └── hackathons.json
│
├── src/                         # Frontend React Ecosystem
│   ├── App.tsx                  # Core View Wrapper
│   ├── main.tsx                 # Web Ingress Hook
│   ├── index.css                # Global styles with Tailwind CSS
│   ├── lib/
│   │   └── api.ts               # Express Backend Client API Connector
│   ├── components/              # Modular High-Fidelity Components
│   │   ├── DashboardSimulation.tsx # Simulation & Page orchestrator
│   │   ├── DashboardView.tsx    # Primary stats & catalog lists
│   │   ├── ComparisonTable.tsx  # Dynamic side-by-side ledger
│   │   └── OpportunityDetailsView.tsx # Deep fit explanations
│   └── data/
│       └── blueprintData.ts     # Local static mock profiles & fallbacks
```

---

## 🚀 Local Quickstart & Deployment

### Prerequisites
* **Node.js** v18+
* **Python** 3.11+
* **pip** (Python package manager)

### 1. Environment Configurations
Create a `.env` file in the project root directory:
```env
# .env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
NODE_ENV=development
```
*(Declare your placeholder in `.env.example` as required by platform standards).*

### 2. Install Dependencies
```bash
# Install NPM packages
npm install

# Install Python modules (using PEP 668 bypass for dev container environments)
pip install --break-system-packages -r requirements.txt
```

### 3. Run the Development Server
```bash
npm run dev
```
The unified full-stack server will launch at **`http://localhost:3000`**, automatically initializing Vite dev tools alongside the Express backend API routing layer.

---

## ⚡ Model Context Protocol (MCP) Readiness

OpportunityAI is fully designed to plug directly into the **Model Context Protocol (MCP)** specification:

* **Resource Exposures:** Local catalogs residing under `/data` can be exported directly as custom MCP resources, exposing verified opportunities to standard model queries.
* **Tool Bindings:** The cooperative agent pipeline can be registered as an unified MCP tool definition (`runOpportunityPipeline`), allowing external platforms (e.g. Claude Desktop, Cursor, or Slack connectors) to query eligibility profiles on behalf of students.

---

## 🗺️ Future Development Roadmap

* [ ] **Google Workspace Synchronization:** Seamless sync to add generated action milestone timelines directly onto a student's Google Calendar.
* [ ] **Vector Database RAG Subsystem:** Shift the `SearchAgent` to query persistent vector indexers (e.g. Pinecone/ChromaDB) to fetch thousands of scrapable live opportunities.
* [ ] **Automated Document Drafter:** Enable the `AdvisorAgent` to output customized cover letters or scholarship essay drafts based on compatibility gaps.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to leverage the modular cooperative multi-agent patterns in your own custom agent workflows.

---
*Created with care for student equity and opportunity exploration. Powered by Google Gemini.*
