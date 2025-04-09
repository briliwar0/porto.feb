const express = require('express');
const serverless = require('serverless-http');
const { json } = require('body-parser');
const cors = require('cors');
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');

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
exports.handler = serverless(app);