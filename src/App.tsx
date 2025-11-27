import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeLayout from "./components/HomeLayout";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/Index";
import Documents from "./pages/dashboard/Documents";
import DocumentEditor from "./pages/dashboard/DocumentEditor";
import AiChat from "./pages/dashboard/AiChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<HomeLayout />}>
                <Route path="/" element={<Index />} />
              </Route>
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard routes with sidebar */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="documents" element={<Documents />} />
                <Route path="ia" element={<AiChat />} />
              </Route>

              {/* Document editor route (full-screen) */}
              <Route
                path="/dashboard/documents/:id"
                element={
                  <ProtectedRoute>
                    <DocumentEditor />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;