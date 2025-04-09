// @ts-nocheck
import express from 'express';
import serverless from 'serverless-http';
import { json } from 'body-parser';
import cors from 'cors';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const app = express();
app.use(cors());
app.use(json());

// DATABASE CONNECTION
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// API ROUTES
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await db.select().from({ messages: { name: 'messages' } });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newMessage = await db.insert({ messages: { name: 'messages' } })
      .values({ name, email, subject, message })
      .returning();
      
    res.status(201).json(newMessage[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating message', error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the serverless function
export const handler = serverless(app);