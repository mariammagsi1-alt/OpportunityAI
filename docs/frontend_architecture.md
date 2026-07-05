# OpportunityAI - Frontend Architectural Specification (Phase 2)

This specification defines the complete client-side architecture for OpportunityAI, structured as a modern, high-fidelity React Single Page Application (SPA) styled with Tailwind CSS and animated using `motion` (Framer Motion). It operates in tandem with the existing Python multi-agent backend.

---

## 🛠 Tech Stack & Core Dependencies

*   **UI Framework**: React (v18+) with TypeScript
*   **Build Tool**: Vite (for rapid, lightning-fast compilation)
*   **Styling Engine**: Tailwind CSS (utilizing a unified slate/charcoal dark-mode palette)
*   **Micro-Animations**: Framer Motion (`motion/react` or `framer-motion`)
*   **Data Visualization**: Recharts (for compatibility matching charts, radar skill graphs, and readiness progression curves)
*   **Icon Library**: Lucide React (`lucide-react`) for clean, vector-based symbols

---

## 🧭 Shell Layout & Navigation Concept

The user interface adopts a premium **Side Navigation Rail / Sidebar** architectural pattern.
*   **Sidebar Navigation**: Fixed left-side layout with collapsing state. Displays user metrics (e.g., Profile Completion bar) and a list of all 14 core views.
*   **Top Bar Actions**: Contains a search bar, Global Notification Center (bell indicator with real-time badges), Quick Profile Avatar, and an active **Resume Score Meter**.
*   **Responsive Breakpoints**:
    *   *Mobile (sm)*: Swaps to a bottom-docked navigation bar or hidden hamburger side-drawer with at least `44px` touch targets.
    *   *Desktop (lg)*: Solid side-navigation system with high-contrast layouts.

---

## 📊 Score Methodology Definition

The UI introduces and distinguishes two critical core metrics for each opportunity:

### 1. Match Score
*   **What it represents**: Compatibility fit. Measures how well the student's background (Major, GPA, Country, Interests, and Core Skills) matches the target opportunity's prerequisite filters.
*   **Visual Representation**: Radial green progress ring or speedometer (e.g., `84%`). Indicates whether the opportunity is academically and structurally suited for them.

### 2. Readiness Score
*   **What it represents**: Application preparation standing. Measures how many required items (resume documents, recommendation letters, essay statement drafts, certified portfolios) are fully ready relative to the opportunity's checklist.
*   **Visual Representation**: Standard linear indicator with segmented checklist milestones (e.g., `71%`). Outlines exactly how close the student is to clicking the "Submit" button with a highly competitive package.

---

## 🔔 Global Notification System
Mounted on the Top Bar as a slide-out overlay drawer (`Popover`). Tracks transactional logs, updates, and upcoming alerts:
*   **New scholarship found**: Alert when new items matching their major are indexed.
*   **Deadline warnings**: Triggers 5 days before any bookmarked deadline.
*   **Document actions**: "Resume parsed successfully by ProfileAgent!"
*   **Roadmap milestones**: "Completed Phase 1 milestone for NASA Fellowship!"
*   **Interactive trigger**: Clicking a notification automatically takes the student to the corresponding detail view or roadmap card.

---

## 🔮 AI Opportunity Predictor (Skill Simulator)
A prominent bento-box widget that acts as an **interactive career sandbox**:
*   **Dynamic Inputs**: Students check hypothetical skills or credentials they plan to acquire (e.g., *"Learn React"*, *"Build 2 Projects"*, *"Earn AWS Certificate"*).
*   **Predictive Simulation**: Real-time mock calculations predict how their **Match Score** and **Readiness Score** will improve upon completing these goals.
*   *Example State*: Current Match: `72%` ➔ Predicted Match: `91%` (visualized via overlapping dual arcs or staggered progressive bar animations).

---

## 📂 View-by-View Specifications (14 Key Pages)

### 1. Dashboard (The Career Hub)
*   **Purpose**: Central high-density command center presenting a 360-degree career preparation snapshot.
*   **Widgets**:
    *   *Match Score & Profile Completion Bento Grid*: High-impact progress rings.
    *   *AI Advisor Tip of the Day*: Empathetic text card with motivational coaching prompts.
    *   *Top Matches Carousel*: Top 3 matching opportunities based on Match Score.
    *   *Recent Notifications*: Summary of the latest 3 notification cards.
    *   *Saved Opportunities Tracker*: Horizontal bar with application progress.
*   **Data Source**: Connected to `CoordinatorAgent.get_action_report()` output.

### 2. Scholarships (Funding Directory)
*   **Purpose**: Search and filter academic funding, merit grants, and financial sponsorships.
*   **Widgets**: Standard grid layout of Scholarship cards with dual Match/Readiness meters.
*   **Filters**: GPA Threshold, Target Location, Application Deadline.
*   **Buttons**: *Save*, *View Details*, *Apply externally*.
*   **Data Source**: `SearchService.get_opportunities_by_category("Scholarship")`.

### 3. Hackathons (Development Challenges)
*   **Purpose**: Practical collaborative software design events.
*   **Widgets**: Interactive time countdown widgets for upcoming hackathons.
*   **Filters**: Remote vs. In-Person, Tech Stack, Team Size.
*   **Buttons**: *Find Team*, *Register*, *Talk to AI Mentor*.
*   **Data Source**: `SearchService.get_opportunities_by_category("Hackathon")`.

### 4. Competitions (Case Study & Performance Contests)
*   **Purpose**: STEM, case, and business tournaments.
*   **Widgets**: Leaderboard mockups, challenge details.
*   **Filters**: Team vs. Solo, Region, Subject Area.
*   **Data Source**: `SearchService.get_opportunities_by_category("Competition")`.

### 5. Fellowships (Prestige Research & Travel Grants)
*   **Purpose**: Premium post-graduate or undergraduate prestigious study research programs (e.g., Fulbright, Truman).
*   **Widgets**: Checklist requirements list, Essay prompts tracker.
*   **Filters**: Graduate vs. Undergraduate, Funding duration.
*   **Data Source**: `SearchService.get_opportunities_by_category("Fellowship")`.

### 6. Internships (Industry Placement)
*   **Purpose**: Practical work training placements at elite companies and labs.
*   **Widgets**: Position duration info cards, required technical skills indicators.
*   **Filters**: Location (Remote/Onsite), Tech Field, Salary/Paid filter.
*   **Data Source**: `SearchService.get_opportunities_by_category("Internship")`.

### 7. Leadership (Extracurricular Programs)
*   **Purpose**: Diversity summits, leadership retreats, and student advocate fellowships.
*   **Widgets**: Multi-track list, active application indicators.
*   **Data Source**: `SearchService.get_opportunities_by_category("Leadership")`.

### 8. Compare Opportunities (Analysis Dashboard)
*   **Purpose**: Side-by-side comparative grid to analyze up to 3 programs simultaneously.
*   **Widgets**: Horizontal tabular grid showing:
    *   *Match Score & Readiness Score comparison* (Visualized via vertical column charts).
    *   *Skill requirements matching list* (Highlighting overlapping skills vs. gaps).
    *   *Application Effort* (High/Medium/Low based on number of essay requirements).
*   **Buttons**: *Compare*, *Swap Opportunity*, *Remove from board*.

### 9. My Roadmap (Chronological Career Steps)
*   **Purpose**: Step-by-step career readiness schedule, mapping out actions from today to the program deadline.
*   **Widgets**: Vertical timeline tree styled with icons:
    *   *Phase 1: Foundation Building* (Target certifications, courses).
    *   *Phase 2: Portfolio Showcase* (GitHub personal projects).
    *   *Phase 3: Material Compilation* (Letters of recommendation, essay drafts).
*   **Buttons**: *Mark as Completed*, *Ask AI for Study Help*.
*   **Data Source**: `ReportAgent.build_action_timeline()`.

### 10. Student Profile (The Data Base)
*   **Purpose**: Comprehensive academic portfolio and resume storage.
*   **Widgets**:
    *   *Resume Score Meter*: Visual progress dial rating their uploaded resume file.
    *   *Profile Completion Gauge*: Visual meter showing profile data depth (target 100%).
    *   *Skills Cloud*: Lists current languages/competencies vs. Highlighted missing skills.
    *   *Verification badges*: GitHub profile connected, English level verified.
*   **Buttons**: *Upload Resume*, *Re-analyze Resume*, *Improve Resume with AI*.
*   **Data Source**: `ProfileAgent.build_student_summary()`.

### 11. AI Advisor (Conversational Mentor)
*   **Purpose**: Interactive multi-turn text chat with our empathetic career coach.
*   **Widgets**:
    *   *Coaching Chat Log*: Beautiful dialogue history container with user/assistant bubbles.
    *   *Mock Interview simulator panel*: Launches a set of interactive verbal exercises.
    *   *Essay Critique board*: Text area where students paste outlines to receive structural feedback.
*   **Buttons**: *Send Message*, *Paste Essay*, *Generate Practice Interview*.
    *   *Data Source*: `AdvisorAgent.chat_with_student()`.

### 12. Saved Opportunities (Personal Bookmark Folder)
*   **Purpose**: Track and update active pipelines.
*   **Widgets**:
    *   *Deadlines Countdown Tracker*: Alerts user if any milestone is approaching.
    *   *Pipelines Kanban Board*: Grouped by Status: *Not Started*, *In Progress*, *Submitted*.
*   **Buttons**: *Remove*, *Open Details*, *Ask AI Coach*.

### 13. Opportunity Details View (Comprehensive Deep-Dive)
*   **Purpose**: Deep overview of any individual program selected.
*   **Widgets**:
    *   *Eligibility Checker & Score metrics*.
    *   *Sponsor details, benefits, funding totals*.
    *   *Interactive Application Milestones list*.
    *   *AI Actionable Pitch advice*: Key statements to include in their resume.
*   **Buttons**: *Save/Unsave*, *Launch Roadmap*, *Discuss on Chat*.

### 14. Settings / Sandbox
*   **Purpose**: General parameters customization.
*   **Widgets**: API key configuration slots, theme preference toggle.
