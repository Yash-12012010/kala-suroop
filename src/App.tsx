
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Announcements from "./pages/Announcements";
import Timetable from "./pages/Timetable";
import Store from "./pages/Store";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import LiveClassRoom from "./pages/LiveClassRoom";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className={isDarkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected Routes */}
                  <Route path="/courses" element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  } />
                  <Route path="/announcements" element={
                    <ProtectedRoute>
                      <Announcements />
                    </ProtectedRoute>
                  } />
                  <Route path="/timetable" element={
                    <ProtectedRoute>
                      <Timetable />
                    </ProtectedRoute>
                  } />
                  <Route path="/store" element={
                    <ProtectedRoute>
                      <Store />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/live-class" element={
                    <ProtectedRoute>
                      <LiveClassRoom />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
