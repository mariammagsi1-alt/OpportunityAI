import express from "express";
import path from "path";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

/**
 * Execute the python agents bridge script and return its parsed JSON response.
 */
async function runPythonAgentBridge(action: string, payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log(`[API Bridge] Spawning python3 agents_api_bridge.py with action: ${action}`);
    
    // Spawn python process
    const py = spawn("python3", ["agents_api_bridge.py", action]);

    let stdoutData = "";
    let stderrData = "";

    py.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    py.on("close", (code) => {
      if (stderrData.trim()) {
        console.warn(`[API Bridge Python Stderr]: ${stderrData}`);
      }
      
      if (code !== 0) {
        console.error(`[API Bridge] Python bridge script exited with code ${code}`);
        reject(new Error(`Python bridge failed (code ${code}). Errors: ${stderrData || stdoutData}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (err) {
        console.error(`[API Bridge] Failed to parse JSON from stdout. Raw:`, stdoutData);
        reject(new Error(`Failed to parse agent JSON response. Output was: ${stdoutData}`));
      }
    });

    // Write input JSON payload to stdin
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // --- API ROUTE ENDPOINTS ---

  // Health and Status Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get All Catalog Opportunities
  app.get("/api/opportunities", async (req, res) => {
    try {
      const result = await runPythonAgentBridge("get_all_opportunities", {});
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.json(result);
      }
    } catch (err: any) {
      console.error("[API] Error fetching catalog opportunities:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Extract StudentProfile from raw text input (e.g. uploaded resume text)
  app.post("/api/profile/extract", async (req, res) => {
    const { raw_text } = req.body;
    if (!raw_text) {
      return res.status(400).json({ error: "Missing raw_text parameter" });
    }

    try {
      const result = await runPythonAgentBridge("profile_extract", { raw_text });
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.json(result);
      }
    } catch (err: any) {
      console.error("[API] Error extracting profile:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Run matching, search & timeline generation pipeline on a student profile
  app.post("/api/pipeline/run", async (req, res) => {
    const { profile, raw_text } = req.body;
    try {
      const result = await runPythonAgentBridge("pipeline_run", { profile, raw_text });
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.json(result);
      }
    } catch (err: any) {
      console.error("[API] Error executing pipeline:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Ask continuous mentoring question to Advisor Agent
  app.post("/api/advisor/chat", async (req, res) => {
    const { message, profile } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message parameter" });
    }

    try {
      const result = await runPythonAgentBridge("advisor_chat", { message, profile });
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.json(result);
      }
    } catch (err: any) {
      console.error("[API] Error chatting with advisor agent:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- STATIC FILES AND DEV MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Mounting Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Serving production static files from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Full-stack OpportunityAI Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] Critical initialization failure:", err);
  process.exit(1);
});
