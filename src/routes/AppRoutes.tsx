import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout"; // Seu layout de dashboard existente
// AJUSTE: Corrigido o caminho do import para o hook useAuth
import { useAuth } from '../hooks/useAuth'; // Importa o hook useAuth

// Importa os componentes existentes
import Login from '../pages/login/login';
import Index from "../pages/Index"; // Presumindo que Index é uma página inicial ou de boas-vindas
import Dashboard from "../pages/Dashboard"; // Dashboard principal (provavelmente admin)
import Students from "../pages/Students"; // Lista de estudantes (admin)
import NotFound from "../pages/NotFound";

// Importa os novos componentes para o fluxo do estudante
import OnboardingForm from '../components/OnboardingForm'; // Formulário de onboarding
import GitHubProTrack from '@/pages/GitHubPro/GitHubProTrack'; // Componente da trilha detalhada
import Journey from "@/pages/Journey/Journey";


// Componente de Rota Privada
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth } = useAuth(); // Obtém estados do contexto

  // Verifica se a URL atual é o dashboard E contém o parâmetro 'code' do GitHub
  // Isso é crucial para permitir que o Dashboard (ou qualquer componente que processe o callback)
  // seja renderizado mesmo antes do AuthContext ter finalizado a autenticação via cookie.
  const isGitHubCallback = location.pathname === '/dashboard' && new URLSearchParams(location.search).has('code');

  console.log('PrivateRoute: Verificando autenticação.');
  console.log('   - isAuthenticated do Context:', isAuthenticated);
  console.log('   - isLoadingAuth do Context:', isLoadingAuth);
  console.log('   - Caminho atual:', location.pathname);
  console.log('   - É um callback do GitHub?', isGitHubCallback);

  // Se o AuthContext ainda está carregando (verificando localStorage/cookie)
  // OU se é um callback do GitHub (precisa renderizar o componente para processar o código)
  if (isLoadingAuth || isGitHubCallback) {
    console.log('PrivateRoute: AuthContext está carregando OU é um callback do GitHub. Exibindo tela de verificação/permitindo componente.');
    // Se for um callback do GitHub, permitimos o children para que o componente possa processar o código.
    // A tela de carregamento será exibida pelo próprio componente se ele estiver processando.
    if (isGitHubCallback) {
      return children; // Permite que o componente seja renderizado para processar o código
    }
    // Caso contrário, se apenas isLoadingAuth, mostra a tela de verificação genérica
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans dark:bg-gray-900">
        <div className="text-center p-10 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Verificando autenticação...</h2>
          <p className="text-gray-600 mt-2 dark:text-gray-300">Por favor, aguarde.</p>
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

      {/* Rotas protegidas para o fluxo do estudante (sem DashboardLayout),
          acessíveis após o login e antes/depois do onboarding.
          A lógica de redirecionamento entre /onboarding e /dashboard/students
          será gerenciada no AuthContext.
      */}
      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <OnboardingForm />
          </PrivateRoute>
        }
      />
      {/* A rota /student-dashboard foi removida conforme sua solicitação */}

      {/* Rotas protegidas para o Dashboard Administrativo (com DashboardLayout),
          exigem autenticação.
      */}
      <Route
        path="/dashboard" // Rota principal do dashboard (provavelmente para admin)
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
              <Students /> {/* Este é o componente Students.tsx que você quer ver */}
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/students/journey" // Rota da Jornada Gamificada aninhada
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Journey /> {/* Renderiza o novo componente Journey */}
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

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
