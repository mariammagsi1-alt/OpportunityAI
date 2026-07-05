# OpportunityAI - Architectural Specification & Design Docs

OpportunityAI is designed as a highly modular, secure, and beginner-friendly multi-agent system built in Python.

---

## 🏗 Core Design Principles
1. **Clear Separation of Concerns**: Data ingestion (`services/`), entity definition (`models/`), AI orchestration (`agents/`), and system security (`security/`) are strictly decoupled.
2. **Deterministic-First Foundation**: Matching, searching, and recommendation logics are developed deterministically to ensure baseline reliability and repeatability before introducing AI.
3. **Pluggable Architecture**: Multiple execution adapters—such as the Model Context Protocol (MCP) server, the Command-Line Interface (CLI), and the API Server (`app.py`)—can interact with the central coordinator without duplicating code.

---

## 🔄 Updated System Architecture Diagram

```
                 +----------------------+        +-------------------+
                 | Model Context (MCP)  |        |  Terminal CLI     |
                 |      Client / IDE    |        | (cli/agents_cli)  |
                 +----------+-----------+        +---------+---------+
                            |                              |
                   (JSON-RPC over stdio)             (Direct Exec)
                            v                              v
  +-------------------------------------------------------------------------+
  |                              SECURITY LAYER                             |
  |  - Rate Limiter (SimpleRateLimiter): Prevents DoS/excessive agent calls  |
  |  - Sanitizer (sanitize_student_profile): Strips injection & tags         |
  |  - Auth (verify_api_key): Restricts sensitive operations                |
  +------------------------------------+------------------------------------+
                                       |
                                       v
                     +----------------------------------+
                     |         CoordinatorAgent         |  <--- Main Orchestration
                     +----------------------------------+
                       /       |              |       \
                      /        |              |        \
                     v         v              v         v
         +--------------+ +----------+ +----------+ +--------------+
         | ProfileAgent | |SearchAgent| | MatchAgent | | AdvisorAgent |
         +--------------+ +----+-----+ +----+-----+ +--------------+
                |              |            |              |
         (Extracts Resume)     |            |       (Follow-up Q&A)
                |              v            v              |
                |        +-----------+ +----------+        |
                +------->|SearchSvc  | |ScoringSvc|        |
                         +-----------+ +----------+        |
                               |            |              |
                               v            v              |
                         [/data/*.json] (0-100% Fit)       |
                                            |              |
                                            v              v
                                       +------------------------+
                                       |      ReportAgent       |
                                       +-----------+------------+
                                                   |
                                                   v
                                         +-------------------+
                                         |  ActionTimeline / |
                                         |    Final Report   |
                                         +-------------------+
```

---

## 🔌 Integration Specifications

### 1. How the MCP Server Connects to CoordinatorAgent
The **Model Context Protocol (MCP)** server (`mcp/server.py`) acts as an external interface wrapper. 
- **Tool Expiry and Binding**: The MCP server maps JSON-RPC method queries from external clients (e.g., Cursor, Claude Desktop, or custom scripts) to semantic tools defined in `mcp/tools.py`.
- **Coordinator Invoke**: When an MCP tool like `match_student` is invoked, the `MCPServer` sanitizes incoming parameters and hands execution over to `CoordinatorAgent`.
- **Direct Orchestration**: The `CoordinatorAgent` resolves the request by invoking `ProfileAgent`, querying matching programs, calculating scores, and returning the structured outcome back through the MCP JSON-RPC protocol.

### 2. How the Security Layer Protects the Application
Security sits at the entrance gate of all external adapter requests, protecting agent flows:
- **Rate Limiting (`SimpleRateLimiter`)**: Blocks automated scripts from exhausting server resources or API credits by tracking client transaction timestamps using a sliding token bucket concepts.
- **Data Sanitization (`sanitizer.py`)**: Sanitizes and standardizes all text parameters inside student profiles. It strips off potential HTML markup and mitigates "ignore previous instruction" injection-style payloads before they reach downstream matching algorithms or AI text engines.
- **Authentication (`auth.py`)**: Establishes API-key validation procedures (`verify_api_key`), securing the platform boundaries so that only authorized MCP endpoints or front-end pipelines can access user-specific evaluations.

### 3. How the CLI Demonstrates Agent Skills
The interactive Command Line Interface (`cli/agents_cli.py`) serves as a developer and sandbox environment to exercise and demonstrate OpportunityAI's agent capabilities:
- **Zero-Dependency Interface**: Allows manual execution of the end-to-end agentic workflow without requiring a web browser or React front-end.
- **Workflow Simulation**: Demonstrates how `ProfileAgent` parses mock academic profiles, how `SearchAgent` filters available fellowships, and how `ReportAgent` packages recommended timelines, logging diagnostic metrics directly to the terminal.
