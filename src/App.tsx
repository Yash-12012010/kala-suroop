
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Store from "./pages/Store";
import Checkout from "./pages/Checkout";
import Timetable from "./pages/Timetable";
import AdminManagement from "./pages/AdminManagement";
import LiveClassRoom from "./pages/LiveClassRoom";
import Announcements from "./pages/Announcements";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store"
                  element={
                    <ProtectedRoute>
                      <Store />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/timetable"
                  element={
                    <ProtectedRoute>
                      <Timetable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/live/:sessionId"
                  element={
                    <ProtectedRoute>
                      <LiveClassRoom />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/announcements"
                  element={
                    <ProtectedRoute>
                      <Announcements />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
