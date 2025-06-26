
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/dashboard/students" element={
            <DashboardLayout>
              <Students />
            </DashboardLayout>
          } />
          <Route path="/dashboard/courses" element={
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          } />
          <Route path="/dashboard/instructors" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Instrutores</h1>
                <p className="text-gray-600">Página em desenvolvimento</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/calendar" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Calendário</h1>
                <p className="text-gray-600">Página em desenvolvimento</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/reports" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <p className="text-gray-600">Página em desenvolvimento</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/assessments" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Avaliações</h1>
                <p className="text-gray-600">Página em desenvolvimento</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/settings" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Configurações</h1>
                <p className="text-gray-600">Página em desenvolvimento</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
