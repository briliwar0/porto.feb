import { messages, type Message, type InsertMessage } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";
import { visitors, type Visitor, type InsertVisitor } from "@shared/schema";
import { pageVisits, type PageVisit, type InsertPageVisit } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count, sum, avg } from "drizzle-orm";

// Define storage interface with required CRUD methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  
  // Visitor methods
  createVisitor(visitor: InsertVisitor): Promise<Visitor>;
  getVisitors(limit?: number, offset?: number): Promise<Visitor[]>;
  getVisitor(id: number): Promise<Visitor | undefined>;
  getVisitorByIp(ipAddress: string): Promise<Visitor | undefined>;
  getVisitorStats(): Promise<{
    totalVisitors: number;
    uniqueVisitors: number;
    todayVisitors: number;
    lastWeekVisitors: number;
    visitorsByCountry: { country: string; count: number }[];
    visitorsByDevice: { device: string; count: number }[];
    visitorsByBrowser: { browser: string; count: number }[];
    visitorsByOs: { os: string; count: number }[];
  }>;
  updateVisitor(id: number, visitor: Partial<InsertVisitor>): Promise<Visitor>;
  
  // Page Visit methods
  createPageVisit(pageVisit: InsertPageVisit): Promise<PageVisit>;
  getPageVisits(limit?: number, offset?: number): Promise<PageVisit[]>;
  getPageVisitsByVisitor(visitorId: number): Promise<PageVisit[]>;
  getPageVisitStats(): Promise<{
    totalPageVisits: number;
    uniquePageVisits: number;
    mostVisitedPages: { path: string; count: number }[];
    averageTimeOnPage: { path: string; avgTime: number }[];
    entryPages: { path: string; count: number }[];
    exitPages: { path: string; count: number }[];
    bounceRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }
  
  // Visitor methods implementation
  async createVisitor(insertVisitor: InsertVisitor): Promise<Visitor> {
    const [visitor] = await db
      .insert(visitors)
      .values(insertVisitor)
      .returning();
    return visitor;
  }
  
  async getVisitors(limit: number = 100, offset: number = 0): Promise<Visitor[]> {
    return await db
      .select()
      .from(visitors)
      .orderBy(desc(visitors.lastVisit))
      .limit(limit)
      .offset(offset);
  }
  
  async getVisitor(id: number): Promise<Visitor | undefined> {
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, id));
    return visitor || undefined;
  }
  
  async getVisitorByIp(ipAddress: string): Promise<Visitor | undefined> {
    const [visitor] = await db
      .select()
      .from(visitors)
      .where(eq(visitors.ipAddress, ipAddress));
    return visitor || undefined;
  }
  
  async updateVisitor(id: number, visitorData: Partial<InsertVisitor>): Promise<Visitor> {
    const [visitor] = await db
      .update(visitors)
      .set({
        ...visitorData,
        lastVisit: new Date(),
        visitCount: sql`${visitors.visitCount} + 1`,
      })
      .where(eq(visitors.id, id))
      .returning();
    return visitor;
  }
  
  async getVisitorStats() {
    // Get total visitors
    const [totalVisitorsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors);
    const totalVisitors = totalVisitorsResult?.count || 0;
    
    // Get unique visitors
    const [uniqueVisitorsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(eq(visitors.isUnique, true));
    const uniqueVisitors = uniqueVisitorsResult?.count || 0;
    
    // Get today's visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [todayVisitorsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(sql`DATE(${visitors.lastVisit}) = CURRENT_DATE`);
    const todayVisitors = todayVisitorsResult?.count || 0;
    
    // Get last week visitors
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const [lastWeekVisitorsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(sql`${visitors.lastVisit} >= ${lastWeek}`);
    const lastWeekVisitors = lastWeekVisitorsResult?.count || 0;
    
    // Get visitors by country (handling nulls)
    const visitorsByCountryRaw = await db
      .select({ 
        country: visitors.country,
        count: sql<number>`count(*)`
      })
      .from(visitors)
      .where(sql`${visitors.country} IS NOT NULL`)
      .groupBy(visitors.country)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    // Convert null countries to "Unknown" to satisfy TypeScript
    const visitorsByCountry = visitorsByCountryRaw.map(item => ({
      country: item.country || "Unknown",
      count: item.count
    }));
    
    // Get visitors by device (handling nulls)
    const visitorsByDeviceRaw = await db
      .select({ 
        device: visitors.device,
        count: sql<number>`count(*)`
      })
      .from(visitors)
      .where(sql`${visitors.device} IS NOT NULL`)
      .groupBy(visitors.device)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    // Convert null devices to "Unknown" to satisfy TypeScript
    const visitorsByDevice = visitorsByDeviceRaw.map(item => ({
      device: item.device || "Unknown",
      count: item.count
    }));
    
    // Get visitors by browser (handling nulls)
    const visitorsByBrowserRaw = await db
      .select({ 
        browser: visitors.browser,
        count: sql<number>`count(*)`
      })
      .from(visitors)
      .where(sql`${visitors.browser} IS NOT NULL`)
      .groupBy(visitors.browser)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    // Convert null browsers to "Unknown" to satisfy TypeScript
    const visitorsByBrowser = visitorsByBrowserRaw.map(item => ({
      browser: item.browser || "Unknown",
      count: item.count
    }));
    
    // Get visitors by OS (handling nulls)
    const visitorsByOsRaw = await db
      .select({ 
        os: visitors.os,
        count: sql<number>`count(*)`
      })
      .from(visitors)
      .where(sql`${visitors.os} IS NOT NULL`)
      .groupBy(visitors.os)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    // Convert null OS to "Unknown" to satisfy TypeScript
    const visitorsByOs = visitorsByOsRaw.map(item => ({
      os: item.os || "Unknown",
      count: item.count
    }));
    
    return {
      totalVisitors,
      uniqueVisitors,
      todayVisitors,
      lastWeekVisitors,
      visitorsByCountry,
      visitorsByDevice,
      visitorsByBrowser,
      visitorsByOs
    };
  }
  
  // Page Visit methods implementation
  async createPageVisit(insertPageVisit: InsertPageVisit): Promise<PageVisit> {
    const [pageVisit] = await db
      .insert(pageVisits)
      .values(insertPageVisit)
      .returning();
    return pageVisit;
  }
  
  async getPageVisits(limit: number = 100, offset: number = 0): Promise<PageVisit[]> {
    return await db
      .select()
      .from(pageVisits)
      .orderBy(desc(pageVisits.timestamp))
      .limit(limit)
      .offset(offset);
  }
  
  async getPageVisitsByVisitor(visitorId: number): Promise<PageVisit[]> {
    return await db
      .select()
      .from(pageVisits)
      .where(eq(pageVisits.visitorId, visitorId))
      .orderBy(desc(pageVisits.timestamp));
  }
  
  async getPageVisitStats() {
    // Get total page visits
    const [totalPageVisitsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(pageVisits);
    const totalPageVisits = totalPageVisitsResult?.count || 0;
    
    // Get unique page visits (distinct paths)
    const [uniquePageVisitsResult] = await db
      .select({ count: sql<number>`count(distinct ${pageVisits.path})` })
      .from(pageVisits);
    const uniquePageVisits = uniquePageVisitsResult?.count || 0;
    
    // Get most visited pages
    const mostVisitedPagesRaw = await db
      .select({
        path: pageVisits.path,
        count: sql<number>`count(*)`
      })
      .from(pageVisits)
      .groupBy(pageVisits.path)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    const mostVisitedPages = mostVisitedPagesRaw.map(item => ({
      path: item.path,
      count: item.count
    }));
    
    // Get average time on page
    const averageTimeOnPageRaw = await db
      .select({
        path: pageVisits.path,
        avgTime: sql<number>`avg(${pageVisits.timeSpent})`
      })
      .from(pageVisits)
      .where(sql`${pageVisits.timeSpent} IS NOT NULL`)
      .groupBy(pageVisits.path)
      .orderBy(desc(sql`avg(${pageVisits.timeSpent})`))
      .limit(10);
      
    const averageTimeOnPage = averageTimeOnPageRaw.map(item => ({
      path: item.path,
      avgTime: Math.round(item.avgTime || 0)
    }));
    
    // Get entry pages
    const entryPagesRaw = await db
      .select({
        path: pageVisits.path,
        count: sql<number>`count(*)`
      })
      .from(pageVisits)
      .where(eq(pageVisits.entryPage, true))
      .groupBy(pageVisits.path)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    const entryPages = entryPagesRaw.map(item => ({
      path: item.path,
      count: item.count
    }));
    
    // Get exit pages
    const exitPagesRaw = await db
      .select({
        path: pageVisits.path,
        count: sql<number>`count(*)`
      })
      .from(pageVisits)
      .where(eq(pageVisits.exitPage, true))
      .groupBy(pageVisits.path)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
      
    const exitPages = exitPagesRaw.map(item => ({
      path: item.path,
      count: item.count
    }));
    
    // Calculate bounce rate (percentage of sessions with only one page visit)
    const [bouncedSessionsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(pageVisits)
      .where(eq(pageVisits.bounced, true));
    
    const [totalSessionsResult] = await db
      .select({ count: sql<number>`count(distinct ${pageVisits.visitorId})` })
      .from(pageVisits);
    
    const bouncedSessions = bouncedSessionsResult?.count || 0;
    const totalSessions = totalSessionsResult?.count || 0;
    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;
    
    return {
      totalPageVisits,
      uniquePageVisits,
      mostVisitedPages,
      averageTimeOnPage,
      entryPages,
      exitPages,
      bounceRate: parseFloat(bounceRate.toFixed(2))
    };
  }
}

export const storage = new DatabaseStorage();
