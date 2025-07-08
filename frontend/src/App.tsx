
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
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
          <Route path="/dashboard/calculator" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Calculadora de Investimento</h1>
                <p className="text-gray-600">Descubra quanto você pode "ganhar" com o GitHub Student Pack</p>
                <div className="mt-8 p-6 bg-blue-50 rounded-lg max-w-md mx-auto">
                  <div className="text-4xl font-bold text-blue-600 mb-2">US$ 3,313.16</div>
                  <p className="text-sm text-gray-600">Valor total disponível para investir na sua carreira</p>
                </div>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/journey" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Jornada Gamificada</h1>
                <p className="text-gray-600">Acompanhe seu progresso e libere mais investimentos</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/github-benefits" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">GitHub Student Pack</h1>
                <p className="text-gray-600">Mais de 100 ferramentas gratuitas para estudantes</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/guides" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Guias e Tutoriais</h1>
                <p className="text-gray-600">Aprenda a maximizar seus benefícios GitHub</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/validation" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Validação de Ideia</h1>
                <p className="text-gray-600">Formulários e pesquisas com estudantes da Estácio</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/chatbot" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Chatbot IA</h1>
                <p className="text-gray-600">Suporte inteligente alimentado por documentos do projeto</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/support" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Suporte</h1>
                <p className="text-gray-600">Ajuda para estudantes da Estácio</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/reports" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <p className="text-gray-600">Métricas de validação e engagement</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/dashboard/settings" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Configurações</h1>
                <p className="text-gray-600">Configurações da plataforma</p>
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
