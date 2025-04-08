import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const messageData = insertMessageSchema.parse(req.body);
      
      // Create message in storage
      const message = await storage.createMessage(messageData);
      
      res.status(201).json({ 
        success: true, 
        message: "Message sent successfully",
        data: message 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: validationError.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message" 
        });
      }
    }
  });

  // Get GitHub repositories - example of integrating with external APIs
  app.get("/api/github", async (req, res) => {
    try {
      const username = req.query.username || 'johndeveloper';
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub repositories');
      }
      
      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to fetch GitHub repositories" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
