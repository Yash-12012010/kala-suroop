
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { PopupProvider } from './contexts/PopupContext';
import Navbar from './components/Navbar';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Store from './pages/Store';
import Timetable from './pages/Timetable';
import Announcements from './pages/Announcements';
import AdminManagement from './pages/AdminManagement';
import LiveClassRoom from './pages/LiveClassRoom';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import CourseDetail from '@/pages/CourseDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PopupProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
              {/* Premium Background Effects */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
                <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
                
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent" 
                     style={{ 
                       backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                       backgroundSize: '50px 50px'
                     }} />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-30" />
              </div>
              
              {/* Main Content */}
              <div className="relative z-10">
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                    <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
                    <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
                    <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
                    <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
                    <Route path="/live-classroom" element={<ProtectedRoute><LiveClassRoom /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              
              {/* Enhanced Toaster */}
              <Toaster />
              
              {/* Premium loading overlay for route transitions */}
              <div id="route-transition-overlay" className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300">
                <div className="flex items-center justify-center min-h-screen">
                  <div className="relative">
                    <div className="loading-spinner" />
                    <div className="absolute inset-0 loading-spinner opacity-50" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              </div>
            </div>
          </Router>
        </PopupProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
