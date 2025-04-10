import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  language: varchar("language", { length: 50 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  device: varchar("device", { length: 50 }),
  browser: varchar("browser", { length: 50 }),
  os: varchar("os", { length: 50 }),
  isUnique: boolean("is_unique").default(true),
  visitCount: integer("visit_count").default(1),
  lastVisit: timestamp("last_visit").defaultNow().notNull(),
  firstVisit: timestamp("first_visit").defaultNow().notNull(),
});

export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  visitorId: integer("visitor_id").references(() => visitors.id, { onDelete: 'cascade' }),
  path: text("path").notNull(),
  title: text("title"),
  timeSpent: integer("time_spent"),
  referrer: text("referrer"),
  entryPage: boolean("entry_page").default(false),
  exitPage: boolean("exit_page").default(false),
  bounced: boolean("bounced").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertVisitorSchema = createInsertSchema(visitors).pick({
  ipAddress: true,
  userAgent: true,
  referrer: true,
  language: true,
  country: true,
  city: true,
  region: true,
  latitude: true,
  longitude: true,
  device: true,
  browser: true,
  os: true,
}).partial();

export const insertPageVisitSchema = createInsertSchema(pageVisits).pick({
  visitorId: true,
  path: true,
  title: true,
  timeSpent: true,
  referrer: true,
  entryPage: true,
  exitPage: true,
  bounced: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;

export type InsertPageVisit = z.infer<typeof insertPageVisitSchema>;
export type PageVisit = typeof pageVisits.$inferSelect;
