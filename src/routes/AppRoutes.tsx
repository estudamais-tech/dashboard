import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from '../hooks/useAuth';

import Login from '../pages/login/login';
import Index from "../pages/Index";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import NotFound from "../pages/NotFound";


import OnboardingForm from '../components/OnboardingForm';
import GitHubProTrack from '@/pages/GitHubPro/GitHubProTrack';
import Journey from "@/pages/Journey/Journey";
import PrivacyPolicy from "@/pages/PrivacyPolicy/PrivacyPolicy";


const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const isGitHubCallback = location.pathname === '/dashboard' && new URLSearchParams(location.search).has('code');

  if (isLoadingAuth || isGitHubCallback) {
    if (isGitHubCallback) {
      return children;
    }
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans dark:bg-gray-900">
        <div className="text-center p-10 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Verificando autenticação...</h2>
          <p className="text-gray-600 mt-2 dark:text-gray-300">Por favor, aguarde.</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/" replace />;
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Rota da Política de Privacidade NÃO PROTEGIDA */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Rotas PROTEGIDAS pela PrivateRoute */}
      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <OnboardingForm />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/students"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Students />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/students/journey"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Journey />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/github-pro-track"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <GitHubProTrack />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/calculator"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Calculadora de Investimento</h1>
                <p className="text-gray-600 dark:text-gray-300">Descubra quanto você pode "ganhar" com o GitHub Student Pack</p>
                <div className="mt-8 p-6 bg-blue-50 rounded-lg max-w-md mx-auto dark:bg-blue-900">
                  <div className="text-4xl font-bold text-blue-600 mb-2 dark:text-blue-400">US$ 3,313.16</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Valor total disponível para investir na sua carreira</p>
                </div>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/github-benefits"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">GitHub Student Pack</h1>
                <p className="text-gray-600 dark:text-gray-300">Mais de 100 ferramentas gratuitas para estudantes</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/guides"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Guias e Tutoriais</h1>
                <p className="text-gray-600 dark:text-gray-300">Aprenda a maximizar seus benefícios GitHub</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/validation"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Validação de Ideia</h1>
                <p className="text-gray-600 dark:text-gray-300">Formulários e pesquisas com estudantes da Estácio</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/chatbot"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Chatbot IA</h1>
                <p className="text-gray-600 dark:text-gray-300">Suporte inteligente alimentado por documentos do projeto</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/support"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Suporte</h1>
                <p className="text-gray-600 dark:text-gray-300">Ajuda para estudantes da Estácio</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/reports"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <p className="text-gray-600 dark:text-gray-300">Métricas de validação e engagement</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12 dark:text-white">
                <h1 className="text-2xl font-bold">Configurações</h1>
                <p className="text-gray-600 dark:text-gray-300">Configurações da plataforma</p>
              </div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;