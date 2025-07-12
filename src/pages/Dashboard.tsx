import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// AJUSTE: Corrigido o caminho do import para o hook useAuth
import { useAuth } from '../hooks/useAuth'; // Importa o hook useAuth
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Github,
  DollarSign,
  TrendingUp,
  Clock,
  Gift,
  GraduationCap,
  Trophy,
  Target,
  Star
} from "lucide-react";

import githubAuthService from '../services/githubAuthService';
import userService from '../services/userService'; 


export default function Dashboard() {
  const { isAuthenticated, setIsLoadingAuth, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const authProcessed = useRef(false);

  // NOVO ESTADO: Para armazenar a quantidade total de alunos ativos
  const [totalStudentsCount, setTotalStudentsCount] = useState<number | string>('...');
  const [loadingTotalStudents, setLoadingTotalStudents] = useState<boolean>(true);
  const [errorTotalStudents, setErrorTotalStudents] = useState<string | null>(null);

  // NOVO ESTADO: Para armazenar a quantidade de alunos com GitHub Student Pack ativado
  const [githubStudentsCount, setGithubStudentsCount] = useState<number | string>('...');
  const [loadingGithubStudents, setLoadingGithubStudents] = useState<boolean>(true);
  const [errorGithubStudents, setErrorGithubStudents] = useState<string | null>(null);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    console.log('Dashboard useEffect (Callback): Início.');
    console.log('    - Código na URL:', code);
    console.log('    - authProcessed.current:', authProcessed.current);
    console.log('    - isAuthenticated do Context (Dashboard):', isAuthenticated);

    if (code && !authProcessed.current && !isAuthenticated) {
      setIsLoadingAuth(true);
      authProcessed.current = true;
      console.log('Dashboard useEffect (Callback): Processando novo código de autorização do GitHub via backend.');

      const processGitHubCode = async () => {
        try {
          const backendResponse = await githubAuthService.exchangeCodeForToken(code);

          console.log('Dashboard: Resposta COMPLETA do backend em exchangeCodeForToken:', backendResponse);

          if (backendResponse && backendResponse.user) {
            login(backendResponse.user);
            console.log('Dashboard: Dados do usuário passados para a função login do AuthContext.');
          } else {
            console.error('Dashboard: Resposta do backend não contém dados de usuário válidos.', backendResponse);
            throw new Error('Dados de usuário inválidos recebidos do backend.');
          }

          navigate(location.pathname, { replace: true });
          console.log('Dashboard: URL limpa e redirecionamento para o mesmo path concluído.');

        } catch (error) {
          console.error('Dashboard: Erro ao processar o código do GitHub:', error);
          console.error('Falha na autenticação com o GitHub.');
          logout();
          navigate('/', { replace: true });
        } finally {
          setIsLoadingAuth(false);
          console.log('Dashboard: Finalizada. isLoadingAuth = false.');
        }
      };

      processGitHubCode();
    } else if (code && isAuthenticated) {
      if (location.search.includes('code=')) {
        console.log('Dashboard useEffect (Callback): Código na URL, mas já autenticado. Limpando URL.');
        navigate(location.pathname, { replace: true });
      }
    } else {
      console.log('Dashboard useEffect (Callback): Nenhuma ação de autenticação necessária neste ciclo.');
    }

  }, [location.search, navigate, location.pathname, isAuthenticated, setIsLoadingAuth, login, logout]);


  // NOVO useEffect para buscar a contagem TOTAL de usuários ativos
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        setLoadingTotalStudents(true);
        setErrorTotalStudents(null);
        // Supondo que getTotalUsersCount() retorna a contagem total
        const count = await userService.getTotalUsersCount();
        setTotalStudentsCount(count);
      } catch (err: any) {
        console.error('Erro ao buscar a quantidade TOTAL de estudantes ativos:', err);
        setErrorTotalStudents('N/A');
        setTotalStudentsCount('N/A');
      } finally {
        setLoadingTotalStudents(false);
      }
    };

    fetchTotalStudents();
  }, []); // Executa apenas uma vez ao montar o componente


  // NOVO useEffect para buscar a contagem de usuários COM GITHUB
  useEffect(() => {
    const fetchGithubStudents = async () => {
      try {
        setLoadingGithubStudents(true);
        setErrorGithubStudents(null);
        // Supondo que getGithubUsersCount() retorna a contagem de usuários com GitHub
        const count = await userService.getGithubUsersCount(); // Nova função a ser criada/implementada no userService
        setGithubStudentsCount(count);
      } catch (err: any) {
        console.error('Erro ao buscar a quantidade de estudantes com GitHub:', err);
        setErrorGithubStudents('N/A');
        setGithubStudentsCount('N/A');
      } finally {
        setLoadingGithubStudents(false);
      }
    };

    fetchGithubStudents();
  }, []); // Executa apenas uma vez ao montar o componente

  return (
    <div className="space-y-6 p-6 mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard EstudaMais.tech</h1>
          <p className="text-gray-600 dark:text-gray-300">Transformando o GitHub Student Pack em investimento na sua carreira - Mais de US$ 200.000 disponíveis!</p>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MetricCard para Estudantes Ativos (Total) */}
        <MetricCard
          title="Estudantes Ativos"
          value={loadingTotalStudents ? 'Carregando...' : errorTotalStudents ? errorTotalStudents : totalStudentsCount.toLocaleString('pt-BR')}
          change="+18.5%"
          icon={Users}
          trend="up"
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <MetricCard
          title="Investimento Total Liberado"
          value="US$ 892,340" // Mantido mockado conforme sua solicitação anterior
          change="+22.3%"
          icon={DollarSign}
          trend="up"
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        {/* MetricCard para GitHub Student Packs Ativados (Com GitHub) */}
        <MetricCard
          title="GitHub Student Packs Ativados"
          value={loadingGithubStudents ? 'Carregando...' : errorGithubStudents ? errorGithubStudents : githubStudentsCount.toLocaleString('pt-BR')}
          change="+15.2%"
          icon={Github}
          trend="up"
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <MetricCard
          title="Taxa de Conclusão da Jornada"
          value="71.2%" // Mantido mockado
          change="+4.1%"
          icon={Trophy}
          trend="up"
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculadora de Investimento em Destaque */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:text-white dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Target className="w-5 h-5" />
              Calculadora de Investimento - Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">US$ 3,313.16</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Valor Total Disponível</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">GitHub Student Pack + Extras</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">US$ 2,156.24</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Já Investido (Média)</p>
                <Progress value={65} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">US$ 1,156.92</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Saldo Disponível</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Para liberar com estudo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maria Silva ativou GitHub Copilot</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+US$ 480 liberados • Há 1 hora</p>
                </div>
                <div className="text-green-600 font-bold">+US$ 480</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">João Santos completou 20h de estudo</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Créditos acumulados • Há 2 horas</p>
                </div>
                <div className="text-blue-600 font-bold">+20 créditos</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ana Costa ativou JetBrains IDEs</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+US$ 1,195 liberados • Há 4 horas</p>
                </div>
                <div className="text-green-600 font-bold">+US$ 1,195</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pedro Oliveira conquistou certificação</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">GitHub Foundations • Ontem</p>
                </div>
                <div className="text-purple-600 font-bold">+US$ 49</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ferramentas Mais Valiosas */}
        <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Star className="w-5 h-5" />
              Ferramentas Mais Valiosas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">JetBrains IDEs</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">321 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 1,195.20</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">por estudante</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Copilot</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">456 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 480.00</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">por estudante</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Notion Education</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">287 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 384.00</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">por estudante</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Pro</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">198 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 336.00</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">por estudante</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jornada Gamificada */}
      <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <GraduationCap className="w-5 h-5" />
            Progresso da Jornada Gamificada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg dark:border-gray-600">
              <div className="text-2xl font-bold text-blue-600">Etapa 1</div>
              <p className="text-sm font-medium">Conta GitHub</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">892 estudantes</p> {/* Este ainda está mockado */}
              <Progress value={71} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg dark:border-gray-600">
              <div className="text-2xl font-bold text-green-600">Etapa 2</div>
              <p className="text-sm font-medium">Student Pack</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">634 estudantes</p> {/* Este ainda está mockado */}
              <Progress value={51} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg dark:border-gray-600">
              <div className="text-2xl font-bold text-purple-600">Etapa 3</div>
              <p className="text-sm font-medium">Ferramentas Premium</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">456 estudantes</p> {/* Este ainda está mockado */}
              <Progress value={37} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg dark:border-gray-600">
              <div className="text-2xl font-bold text-orange-600">Etapa 4</div>
              <p className="text-sm font-medium">Certificações</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">287 estudantes</p> {/* Este ainda está mockado */}
              <Progress value={23} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
