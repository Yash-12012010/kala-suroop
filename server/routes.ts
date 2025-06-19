import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the application
  
  // Courses endpoints
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Announcements endpoints
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // Timetable endpoints
  app.get("/api/timetable", async (req, res) => {
    try {
      const timetable = await storage.getTimetable();
      res.json(timetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(500).json({ error: "Failed to fetch timetable" });
    }
  });

  // Live sessions endpoints
  app.get("/api/live-sessions", async (req, res) => {
    try {
      const sessions = await storage.getLiveSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching live sessions:", error);
      res.status(500).json({ error: "Failed to fetch live sessions" });
    }
  });

  app.get("/api/live-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getLiveSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Live session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching live session:", error);
      res.status(500).json({ error: "Failed to fetch live session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
