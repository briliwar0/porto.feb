import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";
import { generateColorPalette } from "./openai";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      const username = req.query.username || 'febrideveloper';
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

  // Color palette generator endpoint
  app.post("/api/generate-palette", async (req, res) => {
    try {
      const { description, mood, numColors } = req.body;
      
      if (!description || !mood) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required parameters: description and mood" 
        });
      }

      // Generate color palette using OpenAI
      const colors = await generateColorPalette(
        description, 
        mood, 
        numColors || 5
      );

      // Return the generated colors
      res.json({ 
        success: true, 
        colors 
      });
    } catch (error: any) {
      console.error("Error generating color palette:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error generating color palette: " + error.message 
      });
    }
  });

  // Stripe payment intent endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, productId, productName } = req.body;
      
      if (!amount || !productId) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required parameters: amount and productId" 
        });
      }

      // Create a new payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: "usd",
        description: `Purchase of ${productName || 'Product #' + productId}`,
        metadata: {
          productId: productId.toString(),
          productName: productName || 'Product #' + productId
        }
      });

      // Return the client secret
      res.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
