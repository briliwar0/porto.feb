import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { getClientIp } from "request-ip";
import { initGeoIp, getGeoIpInfo, isPrivateIP } from "./geoip";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { pageVisits } from "../shared/schema";

// Export untuk serverless function
export function initDb() {
  // Initialize GeoIP database
  initGeoIp();
  log("Database initialized");
}

// Initialize di sini untuk server development
initDb();

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API route for visitors
app.get("/api/visitors", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getVisitorStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ error: "Failed to fetch visitor statistics" });
  }
});

// API route for visitor list with pagination
app.get("/api/visitors/list", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const visitors = await storage.getVisitors(limit, offset);
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ error: "Failed to fetch visitor list" });
  }
});

// API route for page visit statistics
app.get("/api/pagevisits", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getPageVisitStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching page visit stats:", error);
    res.status(500).json({ error: "Failed to fetch page visit statistics" });
  }
});

// API route for page visit list with pagination
app.get("/api/pagevisits/list", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const visits = await storage.getPageVisits(limit, offset);
    res.json(visits);
  } catch (error) {
    console.error("Error fetching page visits:", error);
    res.status(500).json({ error: "Failed to fetch page visit list" });
  }
});

// API route for updating page visit time spent
app.post("/api/pagevisits/update-time", express.json(), async (req: Request, res: Response) => {
  try {
    const { timeSpent, path, visitorId } = req.body;
    
    if (!timeSpent || !path) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Find the most recent page visit for this visitor and path
    const visits = await db
      .select()
      .from(pageVisits)
      .where(
        and(
          eq(pageVisits.path, path),
          visitorId ? eq(pageVisits.visitorId, visitorId) : undefined
        )
      )
      .orderBy(desc(pageVisits.timestamp))
      .limit(1);
    
    if (visits.length === 0) {
      return res.status(404).json({ error: "Page visit not found" });
    }
    
    const pageVisit = visits[0];
    
    // Update the time spent
    await db
      .update(pageVisits)
      .set({ timeSpent: timeSpent })
      .where(eq(pageVisits.id, pageVisit.id));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating page visit time:", error);
    res.status(500).json({ error: "Failed to update page visit time" });
  }
});

// Middleware for tracking visitors
app.use(async (req: Request, res: Response, next: NextFunction) => {
  // Skip API requests and static assets to avoid duplicated tracking
  if (req.path.startsWith("/api") || 
      req.path.includes(".") || 
      req.path.includes("favicon") || 
      req.path === "/robots.txt") {
    return next();
  }
  
  try {
    // Get visitor IP
    const ipAddress = getClientIp(req) || "unknown";
    
    // Simplified user agent parsing without using third-party libraries
    const userAgent = req.headers["user-agent"] || "";
    
    // Parse browser
    let browser = "Unknown";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
    else if (userAgent.includes("Edg")) browser = "Edge";
    else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) browser = "Internet Explorer";
    
    // Parse OS
    let os = "Unknown";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "MacOS";
    else if (userAgent.includes("Linux") && !userAgent.includes("Android")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";
    
    // Parse device type
    let device = "Desktop";
    if (userAgent.includes("Mobile")) device = "Mobile";
    else if (userAgent.includes("Tablet")) device = "Tablet";
    
    // Get GeoIP data (if it's not a private IP)
    let geoData = {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
      latitude: "0",
      longitude: "0"
    };
    
    if (!isPrivateIP(ipAddress)) {
      geoData = getGeoIpInfo(ipAddress);
    }
    
    // Store visitor data
    let visitorId: number;
    
    // Check if visitor already exists
    const existingVisitor = await storage.getVisitorByIp(ipAddress);
    
    if (existingVisitor) {
      // Update existing visitor
      const updatedVisitor = await storage.updateVisitor(existingVisitor.id, {
        userAgent: userAgent,
        referrer: req.headers.referer || "",
        language: req.headers["accept-language"] || "",
        browser: browser,
        os: os,
        device: device,
        country: geoData.country,
        city: geoData.city,
        region: geoData.region,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      });
      visitorId = updatedVisitor.id;
    } else {
      // Create new visitor
      const newVisitor = await storage.createVisitor({
        ipAddress,
        userAgent: userAgent,
        referrer: req.headers.referer || "",
        language: req.headers["accept-language"] || "",
        browser: browser,
        os: os,
        device: device,
        country: geoData.country,
        city: geoData.city,
        region: geoData.region,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      });
      visitorId = newVisitor.id;
    }
    
    // Track page visit
    // Get page title from query params (will be set by frontend JS)
    const pageTitle = req.query.title as string || 'Unknown Page';
    
    // Determine if this is an entry page (first page in session)
    // You would need session tracking for this; for now we'll use a simple approximation
    const isEntryPage = !req.headers.referer || 
                        !req.headers.referer.includes(req.headers.host || '');
    
    // Track the page visit
    await storage.createPageVisit({
      visitorId: visitorId,
      path: req.path,
      title: pageTitle,
      referrer: req.headers.referer || '',
      entryPage: isEntryPage,
      // exitPage will be set later when session ends or on next page view
      // timeSpent will be updated by frontend JS
    });
    
    // Store visitor ID in request for later use
    (req as any).visitorId = visitorId;
    
  } catch (error) {
    // Just log the error and continue - visitor tracking should not block the application
    console.error("Error tracking visitor:", error);
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Fungsi untuk memulai server
export async function startServer() {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return server;
}

// Hanya jalankan server jika tidak diimpor sebagai modul (untuk environment non-serverless)
// Di Cloudflare Pages (serverless), kita menggunakan file functions/server.js
if (require.main === module) {
  (async () => {
    const server = await startServer();
    
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
}
