// API client for making requests to the backend
const API_BASE_URL = '/api';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: string | null;
  level: string;
  status: string;
  instructor: string;
  featured: boolean;
  enrolledStudents: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  category: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  targetAudience: string;
  isActive: boolean;
  isPinned: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

export interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  subject: string;
  className: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  agoraChannel: string | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Courses
  getCourses: (): Promise<Course[]> => fetchAPI('/courses'),
  getCourse: (id: string): Promise<Course> => fetchAPI(`/courses/${id}`),
  
  // Products
  getProducts: (): Promise<Product[]> => fetchAPI('/products'),
  
  // Announcements
  getAnnouncements: (): Promise<Announcement[]> => fetchAPI('/announcements'),
  
  // Timetable
  getTimetable: (): Promise<TimetableEntry[]> => fetchAPI('/timetable'),
  
  // Live Sessions
  getLiveSessions: (): Promise<LiveSession[]> => fetchAPI('/live-sessions'),
  getLiveSession: (id: string): Promise<LiveSession> => fetchAPI(`/live-sessions/${id}`),
};