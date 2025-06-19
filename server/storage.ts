import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  profiles, 
  courses, 
  products, 
  announcements, 
  timetable, 
  liveSessions, 
  courseFiles, 
  classRecordings,
  type Profile, 
  type Course, 
  type Product,
  type Announcement,
  type LiveSession
} from "@shared/schema";

export interface IStorage {
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  createProfile(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile>;
  
  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  
  // Announcement methods
  getAnnouncements(): Promise<Announcement[]>;
  
  // Timetable methods
  getTimetable(): Promise<any[]>;
  
  // Live session methods
  getLiveSessions(): Promise<LiveSession[]>;
  getLiveSession(id: string): Promise<LiveSession | undefined>;
}

export class PostgresStorage implements IStorage {
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async createProfile(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    const result = await db.insert(profiles).values({
      id: crypto.randomUUID(),
      fullName: profile.fullName,
    }).returning();
    return result[0];
  }

  async getCourses(): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.status, 'active'));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0];
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.isActive, true));
  }

  async getTimetable(): Promise<any[]> {
    return db.select().from(timetable);
  }

  async getLiveSessions(): Promise<LiveSession[]> {
    return db.select().from(liveSessions);
  }

  async getLiveSession(id: string): Promise<LiveSession | undefined> {
    const result = await db.select().from(liveSessions).where(eq(liveSessions.id, id)).limit(1);
    return result[0];
  }
}

export const storage = new PostgresStorage();
