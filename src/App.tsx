
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PopupProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10">
              <Navbar />
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
              <Toaster />
            </div>
          </Router>
        </PopupProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
