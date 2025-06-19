import { pgTable, text, serial, integer, boolean, uuid, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Auth-related tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  role: text("role").notNull().default("user"), // 'admin' | 'user'
  createdAt: timestamp("created_at").defaultNow(),
});

// Course-related tables
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull().default(0),
  duration: text("duration"),
  level: text("level").notNull().default("beginner"),
  status: text("status").notNull().default("active"),
  instructor: text("instructor").notNull(),
  featured: boolean("featured").default(false),
  enrolledStudents: integer("enrolled_students").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  courseId: text("course_id").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  accessGranted: boolean("access_granted").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const liveSessions = pgTable("live_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  agoraChannel: text("agora_channel"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courseFiles = pgTable("course_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: bigint("file_size", { mode: "number" }),
  uploadedBy: uuid("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const classRecordings = pgTable("class_recordings", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: text("course_id").notNull(),
  liveSessionId: uuid("live_session_id"),
  title: text("title").notNull(),
  recordingUrl: text("recording_url").notNull(),
  duration: integer("duration"),
  recordedBy: uuid("recorded_by"),
  recordedAt: timestamp("recorded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Store-related tables
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  category: text("category").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timetable
export const timetable = pgTable("timetable", {
  id: uuid("id").primaryKey().defaultRandom(),
  dayOfWeek: text("day_of_week").notNull(),
  timeSlot: text("time_slot").notNull(),
  subject: text("subject").notNull(),
  className: text("class_name").notNull(),
  teacher: text("teacher").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("info"),
  targetAudience: text("target_audience").notNull().default("all"),
  isActive: boolean("is_active").notNull().default(true),
  isPinned: boolean("is_pinned").notNull().default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: uuid("created_by"),
});

// Website settings
export const websiteSettings = pgTable("website_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  isPublic: boolean("is_public").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: uuid("updated_by"),
});

// Schema exports for validation
export const insertProfileSchema = createInsertSchema(profiles);
export const insertCourseSchema = createInsertSchema(courses);
export const insertProductSchema = createInsertSchema(products);

export type Profile = typeof profiles.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type LiveSession = typeof liveSessions.$inferSelect;
