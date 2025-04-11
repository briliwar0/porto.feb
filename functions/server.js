// @ts-nocheck
import express from 'express';
import serverless from 'serverless-http';
import { json } from 'body-parser';
import cors from 'cors';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const app = express();
app.use(cors({
  origin: '*', // Allow all origins for Pages development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(json());

// DATABASE CONNECTION
let pool, db;

function initDb() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool);
  }
  return { pool, db };
}

// API ROUTES
app.get('/api/messages', async (req, res) => {
  try {
    const { db } = initDb();
    const messages = await db.select().from({ messages: { name: 'messages' } });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { db } = initDb();
    const { name, email, subject, message } = req.body;
    
    const newMessage = await db.insert({ messages: { name: 'messages' } })
      .values({ name, email, subject, message })
      .returning();
      
    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message', error: error.message });
  }
});

// Analytics endpoints
app.get('/api/visitors', async (req, res) => {
  try {
    const { db } = initDb();
    
    // Basic visitor stats
    const visitorCount = await db.select({ count: { count: 'id' } })
      .from({ visitors: { name: 'visitors' } });
      
    // Unique visitors
    const uniqueVisitorCount = await db.select({ count: { count: 'id' } })
      .from({ visitors: { name: 'visitors' } })
      .where({ is_unique: true });
      
    // Group by country
    const visitorsByCountry = await db.select({
      country: 'country',
      count: { count: 'id' }
    })
    .from({ visitors: { name: 'visitors' } })
    .groupBy('country')
    .orderBy(desc => desc.count);
    
    res.json({
      totalVisitors: visitorCount[0]?.count || 0,
      uniqueVisitors: uniqueVisitorCount[0]?.count || 0,
      visitorsByCountry
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ message: 'Error fetching visitor stats', error: error.message });
  }
});

app.get('/api/pagevisits', async (req, res) => {
  try {
    const { db } = initDb();
    
    // Total page visits
    const totalPageVisits = await db.select({ count: { count: 'id' } })
      .from({ page_visits: { name: 'page_visits' } });
      
    // Most visited pages
    const mostVisitedPages = await db.select({
      path: 'path',
      count: { count: 'id' }
    })
    .from({ page_visits: { name: 'page_visits' } })
    .groupBy('path')
    .orderBy(desc => desc.count)
    .limit(10);
    
    // Avg time on page
    const timeOnPage = await db.select({
      path: 'path',
      avgTime: { avg: 'time_spent' }
    })
    .from({ page_visits: { name: 'page_visits' } })
    .groupBy('path')
    .orderBy(desc => desc.avgTime);
    
    res.json({
      totalPageVisits: totalPageVisits[0]?.count || 0,
      mostVisitedPages,
      averageTimeOnPage: timeOnPage
    });
  } catch (error) {
    console.error('Error fetching page visit stats:', error);
    res.status(500).json({ message: 'Error fetching page visit stats', error: error.message });
  }
});

app.get('/api/pagevisits/list', async (req, res) => {
  try {
    const { db } = initDb();
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const pageVisits = await db.select()
      .from({ page_visits: { name: 'page_visits' } })
      .orderBy(desc => desc.timestamp)
      .limit(limit)
      .offset(offset);
    
    res.json(pageVisits);
  } catch (error) {
    console.error('Error fetching page visits list:', error);
    res.status(500).json({ message: 'Error fetching page visits list', error: error.message });
  }
});

app.post('/api/pagevisits/update-time', async (req, res) => {
  try {
    const { db } = initDb();
    const { visitorId, path, timeSpent } = req.body;
    
    if (!visitorId || !path || typeof timeSpent !== 'number') {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    
    // Find the page visit
    const pageVisit = await db.select()
      .from({ page_visits: { name: 'page_visits' } })
      .where({ visitor_id: visitorId, path })
      .orderBy(desc => desc.timestamp)
      .limit(1);
    
    if (!pageVisit || pageVisit.length === 0) {
      return res.status(404).json({ message: 'Page visit not found' });
    }
    
    // Update the time spent
    const updated = await db.update({ page_visits: { name: 'page_visits' } })
      .set({ time_spent: timeSpent })
      .where({ id: pageVisit[0].id })
      .returning();
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating page visit time:', error);
    res.status(500).json({ message: 'Error updating page visit time', error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Handle preflight requests for Cloudflare
app.options('*', cors());

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Export the serverless function for Netlify and Cloudflare Pages
export const handler = serverless(app);