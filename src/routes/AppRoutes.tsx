import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from '../contexts/AuthContext'; 

import Login from '../pages/login/login';
import Index from "../pages/Index"; 
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import NotFound from "../pages/NotFound";

// Componente de Rota Privada
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth } = useAuth(); // Obtém estados do contexto

  // Verifica se a URL atual é o dashboard E contém o parâmetro 'code' do GitHub
  const isGitHubCallback = location.pathname === '/dashboard' && new URLSearchParams(location.search).has('code');

  console.log('PrivateRoute: Verificando autenticação.');
  console.log('  - isAuthenticated do Context:', isAuthenticated);
  console.log('  - isLoadingAuth do Context:', isLoadingAuth);
  console.log('  - Caminho atual:', location.pathname);
  console.log('  - É um callback do GitHub?', isGitHubCallback);

  // Se o AuthContext ainda está carregando (verificando localStorage)
  // OU se é um callback do GitHub (precisa renderizar o Dashboard para processar o código)
  if (isLoadingAuth || isGitHubCallback) {
    console.log('PrivateRoute: AuthContext está carregando OU é um callback do GitHub. Exibindo tela de verificação/permitindo Dashboard.');
    // Se for um callback do GitHub, permitimos o children para que o Dashboard possa processar o código.
    // A tela de carregamento será exibida pelo Dashboard se ele estiver processando.
    if (isGitHubCallback) {
      return children; // Permite que o Dashboard seja renderizado para processar o código
    }
    // Caso contrário, se apenas isLoadingAuth, mostra a tela de verificação genérica
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <div className="text-center p-10 rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Verificando autenticação...</h2>
          <p className="text-gray-600 mt-2">Por favor, aguarde.</p>
        </div>
      </div>
    );
  }

  // Se o AuthContext terminou de carregar e o usuário está autenticado
  if (isAuthenticated) {
    console.log('PrivateRoute: Autenticado, renderizando children.');
    return children;
  }

  // Se não estiver autenticado e não for um callback do GitHub, redireciona para o login
  console.log('PrivateRoute: Não autenticado, redirecionando para o login.');
  return <Navigate to="/" replace />;
};


const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota para a tela de Login na raiz do seu projeto */}
      <Route path="/" element={<Login />} />

      {/* Rotas protegidas que exigem autenticação */}
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
        path="/dashboard/calculator"
        element={
          <PrivateRoute>
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
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/journey"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Jornada Gamificada</h1>
                <p className="text-gray-600">Acompanhe seu progresso e libere mais investimentos</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">GitHub Student Pack</h1>
                <p className="text-gray-600">Mais de 100 ferramentas gratuitas para estudantes</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Guias e Tutoriais</h1>
                <p className="text-gray-600">Aprenda a maximizar seus benefícios GitHub</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Validação de Ideia</h1>
                <p className="text-gray-600">Formulários e pesquisas com estudantes da Estácio</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Chatbot IA</h1>
                <p className="text-gray-600">Suporte inteligente alimentado por documentos do projeto</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Suporte</h1>
                <p className="text-gray-600">Ajuda para estudantes da Estácio</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <p className="text-gray-600">Métricas de validação e engagement</p>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Configurações</h1>
                <p className="text-gray-600">Configurações da plataforma</p>
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
