import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    Github,
    DollarSign,
    Clock,
    GraduationCap,
    Trophy,
    Target,
    Star,
    ArrowLeft, // Adicionado para os botões de paginação
    ArrowRight, // Adicionado para os botões de paginação
    Award // Novo ícone para o ranking
} from "lucide-react";

import githubAuthService from '../services/githubAuthService';
import userService, { User } from '../services/userService';
import trackService, { Track } from '../services/trackService';
import statsService, { GlobalStats } from '../services/statsService';
import OnboardingForm from '../components/OnboardingForm';
import { ConfettiEffect } from '@/components/ui/confettiEffect';

// Nova interface para as atividades recentes, baseada nos dados das trilhas
interface RecentActivity {
    id: string; // Pode ser o ID da trilha + um sufixo para diferenciar start/complete
    user: string; // Nome do usuário
    avatar_url?: string | null; // Adicionado avatar_url
    action: string; // Ex: 'iniciou a trilha', 'completou a trilha'
    value: number; // Valor da recompensa
    timestamp: number; // Timestamp para ordenação e formatação
    type: 'track_start' | 'track_complete'; // Tipo de atividade
    trackTitle: string; // Título da trilha
}

export default function Dashboard() {
    const { isAuthenticated, user, isLoadingAuth, login, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const authCodeProcessed = useRef(false);

    // States for dashboard data
    const [totalStudentsCount, setTotalStudentsCount] = useState<number | null>(null);
    const [loadingTotalStudents, setLoadingTotalStudents] = useState<boolean>(true);
    const [errorTotalStudents, setErrorTotalStudents] = useState<string | null>(null);

    const [totalInvestmentLiberated, setTotalInvestmentLiberated] = useState<number | null>(null); // Este será o valor TOTAL liberado globalmente
    const [loadingTotalInvestment, setLoadingTotalInvestment] = useState<boolean>(true);
    const [errorTotalInvestment, setErrorTotalInvestment] = useState<string | null>(null);

    const [githubUsersCount, setGithubUsersCount] = useState<number | null>(null);
    const [loadingGithubUsers, setLoadingGithubUsers] = useState<boolean>(true);
    const [errorGithubUsers, setErrorGithubUsers] = useState<string | null>(null);

    const [completionRate, setCompletionRate] = useState<number | null>(null);
    const [loadingCompletionRate, setLoadingCompletionRate] = useState<boolean>(true);
    const [errorCompletionRate, setErrorCompletionRate] = useState<string | null>(null);

    const [calculatorTotalAvailable, setCalculatorTotalAvailable] = useState<number | null>(null);
    const [calculatorAlreadyInvested, setCalculatorAlreadyInvested] = useState<number | null>(null);
    const [calculatorProgressValue, setCalculatorProgressValue] = useState<number>(0);
    const [calculatorBalance, setCalculatorBalance] = useState<number | null>(null);
    const [loadingCalculatorData, setLoadingCalculatorData] = useState<boolean>(true);
    const [errorCalculatorData, setErrorCalculatorData] = useState<string | null>(null);

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loadingTracks, setLoadingTracks] = useState<boolean>(true);
    const [errorTracks, setErrorTracks] = useState<string | null>(null);

    // Estados para Atividade Recente (agora populados por dados reais das trilhas)
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loadingRecentActivities, setLoadingRecentActivities] = useState<boolean>(true);
    const [errorRecentActivities, setErrorRecentActivities] = useState<string | null>(null);
    const [activitiesCurrentPage, setActivitiesCurrentPage] = useState(1); // Novo estado para a página atual das atividades
    const activitiesItemsPerPage = 10; // Exibir 10 atividades por página

    // Estado para armazenar as estatísticas globais
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

    // Novos estados para o ranking de estudantes
    const [rankedStudents, setRankedStudents] = useState<User[]>([]);
    const [loadingRankedStudents, setLoadingRankedStudents] = useState<boolean>(true);
    const [errorRankedStudents, setErrorRankedStudents] = useState<string | null>(null);
    const [rankingCurrentPage, setRankingCurrentPage] = useState(1);
    const rankingItemsPerPage = 10; // Exibir 10 estudantes por página no ranking

    // Mock data for most valuable tools (replace with API calls if available)
    const [mostValuableTools] = useState<any[]>([
        { name: 'JetBrains IDEs', activations: 321, value: 1195.20, category: 'Desenvolvimento' },
        { name: 'GitHub Copilot', activations: 456, value: 480.00, category: 'Produtividade' },
        { name: 'Notion Education', activations: 287, value: 384.00, category: 'Organização' },
        { name: 'GitHub Pro', activations: 198, value: 336.00, category: 'Desenvolvimento' },
        { name: 'Microsoft Azure Dev Tools', activations: 150, value: 250.00, category: 'Cloud' },
        { name: 'Figma Education', activations: 200, value: 180.00, category: 'Design' },
        { name: 'DigitalOcean Student Pack', activations: 120, value: 100.00, category: 'Infraestrutura' },
        { name: 'Canva Pro Education', activations: 180, value: 90.00, category: 'Design' },
        { name: 'Visual Studio Enterprise', activations: 90, value: 1500.00, category: 'Desenvolvimento' },
        { name: 'AWS Educate', activations: 110, value: 500.00, category: 'Cloud' },
        { name: 'Tableau Desktop', activations: 75, value: 800.00, category: 'Análise de Dados' },
        { name: 'Unity Student', activations: 130, value: 200.00, category: 'Game Dev' },
        { name: 'Autodesk Fusion 360', activations: 60, value: 300.00, category: 'Design 3D' },
        { name: 'Twilio', activations: 100, value: 50.00, category: 'Comunicações' },
        { name: 'Stripe', activations: 50, value: 75.00, category: 'Pagamentos' },
    ].sort((a, b) => b.value - a.value)); // Ordena por valor para simular "mais valiosas"

    // Effect for handling GitHub authorization code
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code && !authCodeProcessed.current && !isAuthenticated) {
            authCodeProcessed.current = true;

            const processGitHubCode = async () => {
                try {
                    const backendResponse = await githubAuthService.exchangeCodeForToken(code);

                    if (backendResponse && backendResponse.user) {
                        await login(backendResponse.user);
                    } else {
                        console.error('Dashboard: Resposta do backend não contém dados de usuário válidos.', backendResponse);
                        throw new Error('Dados de usuário inválidos recebidos do backend.');
                    }

                    navigate(location.pathname, { replace: true });

                } catch (error: unknown) {
                    console.error('Dashboard: Erro ao processar o código do GitHub:', error);
                    logout();
                    navigate('/', { replace: true });
                } finally {
                }
            };
            processGitHubCode();
        } else if (code && isAuthenticated && !authCodeProcessed.current) {
            navigate(location.pathname, { replace: true });
            authCodeProcessed.current = true;
        }
    }, [location.search, navigate, location.pathname, isAuthenticated, login, logout]);

    // NOVO useEffect para limpar o estado de navegação após o confete
    useEffect(() => {
        if (location.state?.fromOnboarding) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    // Effect for fetching GLOBAL dashboard data
    useEffect(() => {
        if (isAuthenticated && !isLoadingAuth && !authCodeProcessed.current) {
            const fetchGlobalData = async () => {
                console.log('Fetching global stats...');
                try {
                    setLoadingTotalStudents(true);
                    setLoadingTotalInvestment(true);
                    setLoadingGithubUsers(true);

                    const stats = await statsService.getGlobalStats();
                    setGlobalStats(stats); // Armazena as estatísticas globais no estado
                    setTotalStudentsCount(stats.total_usuarios);
                    // Alterado para mostrar o valor TOTAL liberado globalmente
                    setTotalInvestmentLiberated(parseFloat(stats.total_unlocked_value)); 
                } catch (err: unknown) {
                    console.error('Erro ao buscar estatísticas globais:', err);
                    setErrorTotalStudents('Falha ao carregar');
                    setErrorTotalInvestment('Falha ao carregar');
                    setTotalStudentsCount(null);
                    setTotalInvestmentLiberated(null);
                    setGlobalStats(null); // Limpa o estado em caso de erro
                } finally {
                    setLoadingTotalStudents(false);
                    setLoadingTotalInvestment(false);
                }

                try {
                    const githubCount = await userService.getGithubUsersCount();
                    setGithubUsersCount(githubCount);
                } catch (err: unknown) {
                    console.error('Erro ao buscar contagem de usuários GitHub:', err);
                    setErrorGithubUsers('Falha ao carregar');
                    setGithubUsersCount(null);
                } finally {
                    setLoadingGithubUsers(false);
                }
            };
            fetchGlobalData();
        }
    }, [isAuthenticated, isLoadingAuth, authCodeProcessed.current]); // Dependencies for global data fetch

    // Effect for fetching USER-SPECIFIC dashboard data (depends on globalStats)
    useEffect(() => {
        if (isAuthenticated && user?.id && globalStats) { // Only run if authenticated, user ID exists, and globalStats are loaded
            const fetchUserData = async () => {
                console.log('Fetching user-specific data...');
                // Fetch Student Dashboard Data
                try {
                    setLoadingCalculatorData(true);
                    setErrorCalculatorData(null);
                    if (user?.id) {
                        const data: User = await userService.getStudentDashboardData();
                        const totalPossible = 3000.00; // Valor fixo solicitado pelo usuário
                        
                        // O valor já investido pessoalmente é o totalEconomy do usuário
                        let calculatedAlreadyInvested = parseFloat(data.totalEconomy || '0');

                        setCalculatorTotalAvailable(totalPossible);
                        setCalculatorAlreadyInvested(calculatedAlreadyInvested);
                        const balance = totalPossible - calculatedAlreadyInvested;
                        setCalculatorBalance(balance);
                        const progress = totalPossible > 0 ? Math.round((calculatedAlreadyInvested / totalPossible) * 100) : 0;
                        setCalculatorProgressValue(progress);
                    }
                } catch (err: unknown) {
                    console.error('Erro ao buscar dados do dashboard do estudante:', err);
                    setErrorCalculatorData('Falha ao carregar');
                    setCalculatorTotalAvailable(null);
                    setCalculatorAlreadyInvested(null);
                    setCalculatorBalance(null);
                    setCalculatorProgressValue(0);
                } finally {
                    setLoadingCalculatorData(false);
                }

                // Fetch Tracks for user's personal progress (still needed for "Progresso da Jornada Gamificada")
                try {
                    setLoadingTracks(true);
                    setErrorTracks(null);
                    const { tracks: fetchedPersonalTracks } = await trackService.getTracksForUser();
                    setTracks(fetchedPersonalTracks); // Set personal tracks here
                    
                    const totalTracks = fetchedPersonalTracks.length;
                    const completedTracks = fetchedPersonalTracks.filter(track => track.status === 'completed').length;
                    const currentCompletionRate = totalTracks > 0 ? (completedTracks / totalTracks) * 100 : 0;
                    setCompletionRate(currentCompletionRate); // This completion rate is personal
                } catch (err: unknown) {
                    console.error('Erro ao buscar trilhas pessoais:', err);
                    setErrorTracks('Não disponível');
                    setTracks([]);
                    setCompletionRate(null);
                } finally {
                    setLoadingTracks(false);
                    setLoadingCompletionRate(false); // This is for the personal completion rate
                }

                // Fetch Global Recent Activities (for pagination)
                try {
                    setLoadingRecentActivities(true);
                    setErrorRecentActivities(null);
                    const globalActivities = await trackService.getGlobalRecentActivities();
                    const sortedActivities = globalActivities.sort((a, b) => b.timestamp - a.timestamp);
                    // Store all sorted activities for pagination
                    setRecentActivities(sortedActivities);
                } catch (err: unknown) {
                    console.error('Erro ao buscar atividades recentes globais:', err);
                    setErrorRecentActivities('Falha ao carregar atividades');
                    setRecentActivities([]);
                } finally {
                    setLoadingRecentActivities(false);
                }

                // Fetch all students for ranking
                try {
                    setLoadingRankedStudents(true);
                    setErrorRankedStudents(null);
                    const allStudents = await userService.getAllStudents();
                    // Filter students who have completed onboarding and have activated benefits
                    const filterAndSortStudents = allStudents
                        .filter(s => s.onboarding_complete === 1 && s.benefits_activated > 0)
                        .sort((a, b) => {
                            // Sort by benefits_activated descending
                            if (b.benefits_activated !== a.benefits_activated) {
                                return b.benefits_activated - a.benefits_activated;
                            }
                            // If benefits_activated are equal, sort by totalEconomy descending
                            return parseFloat(b.totalEconomy || '0') - parseFloat(a.totalEconomy || '0');
                        });
                    setRankedStudents(filterAndSortStudents);
                } catch (err: unknown) {
                    console.error('Erro ao buscar estudantes para o ranking:', err);
                    setErrorRankedStudents('Falha ao carregar ranking');
                    setRankedStudents([]);
                } finally {
                    setLoadingRankedStudents(false);
                }
            };
            fetchUserData();
        }
    }, [isAuthenticated, user?.id, globalStats]); // Dependencies for user-specific data fetch

    const formatCurrency = (value: number | null | string) => {
        if (typeof value === 'number') {
            return `US$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return value || 'N/A';
    };

    const formatPercentage = (value: number | null | string) => {
        if (typeof value === 'number') {
            return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
        }
        return value || 'N/A';
    };

    const formatTimeAgo = (timestamp: number): string => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);

        if (seconds < 60) return `Há ${seconds} segundo${seconds > 1 ? 's' : ''}`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `Há ${days} dia${days > 1 ? 's' : ''}`;
        
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getTracksForStage = (stageName: string): Track[] => {
        switch (stageName) {
            case 'Conta GitHub':
                return tracks.filter(track => track.title.includes('GitHub') || track.title.includes('Conta'));
            case 'Student Pack':
                return tracks.filter(track => track.title.includes('Student Pack') || track.title.includes('Pacote de Estudante'));
            case 'Ferramentas Premium':
                return tracks.filter(track => track.title.includes('Ferramentas Premium') || track.title.includes('JetBrains') || track.title.includes('Copilot'));
            case 'Certificações':
                return tracks.filter(track => track.title.includes('Certificação') || track.title.includes('Exame'));
            default:
                return [];
        }
    };

    const getStageProgress = (stageName: string): number => {
        const stageTracks = getTracksForStage(stageName);
        if (stageTracks.length === 0) {
            return 0;
        }
        const completedStageTracks = stageTracks.filter(track => track.status === 'completed').length;
        return Math.round((completedStageTracks / stageTracks.length) * 100);
    };

    const getStageStudentCount = (stageName: string): string => {
        if (stageName === 'Conta GitHub') {
            if (typeof githubUsersCount === 'number' && !loadingGithubUsers && !errorGithubUsers) {
                return `${githubUsersCount.toLocaleString('pt-BR')} estudantes`;
            }
            return loadingGithubUsers ? 'Carregando...' : errorGithubUsers ? 'Erro' : 'N/A';
        }

        if (typeof totalStudentsCount === 'number' && !loadingTotalStudents && !errorTotalStudents) {
            if (stageName === 'Student Pack') {
                return `${Math.round(totalStudentsCount * 0.80).toLocaleString('pt-BR')} estudantes`;
            } else if (stageName === 'Ferramentas Premium') {
                return `${Math.round(totalStudentsCount * 0.60).toLocaleString('pt-BR')} estudantes`;
            } else if (stageName === 'Certificações') {
                return `${Math.round(totalStudentsCount * 0.30).toLocaleString('pt-BR')} estudantes`;
            }
        }
        return 'N/A';
    };

    // Lógica de Paginação para o Ranking
    const totalRankingPages = Math.ceil(rankedStudents.length / rankingItemsPerPage);
    const indexOfLastRankingItem = rankingCurrentPage * rankingItemsPerPage;
    const indexOfFirstRankingItem = indexOfLastRankingItem - rankingItemsPerPage;
    const currentRankedStudents = rankedStudents.slice(indexOfFirstRankingItem, indexOfLastRankingItem);

    const paginateRanking = (pageNumber: number) => setRankingCurrentPage(pageNumber);

    // Lógica de Paginação para Atividades Recentes
    const totalActivitiesPages = Math.ceil(recentActivities.length / activitiesItemsPerPage);
    const indexOfLastActivityItem = activitiesCurrentPage * activitiesItemsPerPage;
    const indexOfFirstActivityItem = indexOfLastActivityItem - activitiesItemsPerPage;
    const currentActivities = recentActivities.slice(indexOfFirstActivityItem, indexOfLastActivityItem);

    const paginateActivities = (pageNumber: number) => setActivitiesCurrentPage(pageNumber);


    if (isLoadingAuth) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
                Carregando autenticação...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
                Você precisa estar logado para acessar o dashboard.
            </div>
        );
    }

    if (user && !user.onboarding_complete) {
        return <OnboardingForm userId={user.id} />;
    }

    return (
        <>
            <ConfettiEffect
                trigger={location.state?.fromOnboarding || false}
                onComplete={() => {
                    // Lógica para marcar que o confete foi visto, se necessário
                }}
                duration={5000}
            />

            <section className="space-y-6 p-6 mt-20 max-w-7xl mx-auto"> {/* Adicionado max-w-7xl e mx-auto para centralizar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard EstudaMais.tech - Bem-vindo(a), {user?.name || user?.github_login}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Transformando o GitHub Student Pack em investimento na sua carreira - Mais de US$ 3.000 disponíveis! {/* Texto atualizado */}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Estudantes Ativos"
                        value={
                            loadingTotalStudents ? 'Carregando...' :
                                errorTotalStudents ? errorTotalStudents :
                                    (typeof totalStudentsCount === 'number' ? totalStudentsCount.toLocaleString('pt-BR') : 'N/A')
                        }
                        change="+18.5%"
                        icon={Users}
                        trend="up"
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700 flex flex-col justify-between"
                    />
                    <MetricCard
                        title="Valor Total Liberado Globalmente"
                        value={loadingTotalInvestment ? 'Carregando...' : errorTotalInvestment ? errorTotalInvestment : formatCurrency(totalInvestmentLiberated)}
                        change="+22.3%"
                        icon={DollarSign}
                        trend="up"
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700 flex flex-col justify-between "
                    />
                    <MetricCard
                        title="GitHub Student Packs Ativados"
                        value={
                            loadingGithubUsers ? 'Carregando...' :
                                errorGithubUsers ? errorGithubUsers :
                                    (typeof githubUsersCount === 'number' ? githubUsersCount.toLocaleString('pt-BR') : 'N/A')
                        }
                        change="+15.2%"
                        icon={Github}
                        trend="up"
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700 flex flex-col justify-between"
                    />
                    <MetricCard
                        title="Taxa de Conclusão da Jornada"
                        value={loadingCompletionRate ? 'Carregando...' : errorCompletionRate ? errorCompletionRate : formatPercentage(completionRate)}
                        change="+4.1%"
                        icon={Trophy}
                        trend="up"
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700 flex flex-col justify-between"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    <div className="text-3xl font-bold text-green-600">
                                        {loadingCalculatorData ? 'Carregando...' : errorCalculatorData ? errorCalculatorData : formatCurrency(calculatorTotalAvailable)}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Valor Total Disponível</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">GitHub Student Pack + Extras</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {loadingCalculatorData ? 'Carregando...' : errorCalculatorData ? errorCalculatorData : formatCurrency(calculatorAlreadyInvested)}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Já Investido (Média)</p>
                                    <Progress value={loadingCalculatorData || errorCalculatorData ? 0 : calculatorProgressValue} className="mt-2" />
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">
                                        {loadingCalculatorData ? 'Carregando...' : errorCalculatorData ? errorCalculatorData : formatCurrency(calculatorBalance)}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Saldo Disponível</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Para liberar com estudo</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Atividade Recente - Exibindo com paginação */}
                    <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Clock className="w-5 h-5" />
                                Atividades Recentes Globais
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loadingRecentActivities ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Carregando atividades...</p>
                                ) : errorRecentActivities ? (
                                    <p className="text-center text-red-500">{errorRecentActivities}</p>
                                ) : currentActivities.length > 0 ? (
                                    <>
                                        {currentActivities.map((activity) => (
                                            <div 
                                                key={activity.id} 
                                                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                                            >
                                                {activity.avatar_url && (
                                                    <img 
                                                        src={activity.avatar_url} 
                                                        alt={activity.user} 
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-400" 
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{activity.user}</p>
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{activity.action}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {activity.type === 'track_complete' ? `+US$ ${activity.value.toFixed(2)} liberados` : ''} • {formatTimeAgo(activity.timestamp)}
                                                    </p>
                                                </div>
                                                {activity.type === 'track_complete' && (
                                                    <div className="font-bold text-green-600 dark:text-green-400 text-sm">
                                                        +US$ {activity.value.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {totalActivitiesPages > 1 && (
                                            <div className="flex justify-center items-center space-x-2 mt-4">
                                                <button
                                                    onClick={() => paginateActivities(activitiesCurrentPage - 1)}
                                                    disabled={activitiesCurrentPage === 1}
                                                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Página {activitiesCurrentPage} de {totalActivitiesPages}
                                                </span>
                                                <button
                                                    onClick={() => paginateActivities(activitiesCurrentPage + 1)}
                                                    disabled={activitiesCurrentPage === totalActivitiesPages}
                                                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma atividade recente.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Ranking Global por Trilhas Desbloqueadas */}
                    <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Award className="w-5 h-5 text-yellow-500" />
                                Ranking Global (Trilhas Desbloqueadas)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loadingRankedStudents ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Carregando ranking...</p>
                                ) : errorRankedStudents ? (
                                    <p className="text-center text-red-500">{errorRankedStudents}</p>
                                ) : currentRankedStudents.length > 0 ? (
                                    <>
                                        {currentRankedStudents.map((student, index) => (
                                            <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                                <span className="font-bold text-lg text-blue-600 dark:text-blue-400 w-8 text-center">
                                                    {indexOfFirstRankingItem + index + 1}.
                                                </span>
                                                {student.avatar_url && (
                                                    <img 
                                                        src={student.avatar_url} 
                                                        alt={student.name || student.github_login || 'Estudante'} 
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-green-400" 
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                        {student.name || student.github_login || 'Estudante'}
                                                    </p>
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                                                        {student.benefits_activated} Trilhas Desbloqueadas
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        Economia: {formatCurrency(parseFloat(student.totalEconomy || '0'))}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {totalRankingPages > 1 && (
                                            <div className="flex justify-center items-center space-x-2 mt-4">
                                                <button
                                                    onClick={() => paginateRanking(rankingCurrentPage - 1)}
                                                    disabled={rankingCurrentPage === 1}
                                                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Página {rankingCurrentPage} de {totalRankingPages}
                                                </span>
                                                <button
                                                    onClick={() => paginateRanking(rankingCurrentPage + 1)}
                                                    disabled={rankingCurrentPage === totalRankingPages}
                                                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Nenhum estudante no ranking ainda.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Ferramentas Mais Valiosas - Ocupando a largura total em telas grandes */}
                    <Card className="lg:col-span-2 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Star className="w-5 h-5" />
                                Ferramentas Mais Valiosas (Popularidade e Valor)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mostValuableTools.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Layout de duas colunas para ferramentas */}
                                        {mostValuableTools.map((tool, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{tool.name}</p>
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{tool.activations} ativações</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Categoria: {tool.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600 dark:text-green-400 text-sm">US$ {tool.value.toFixed(2)}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">por estudante</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma ferramenta valiosa encontrada.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <GraduationCap className="w-5 h-5" />
                            Progresso da Jornada Gamificada
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {loadingTracks ? (
                                <p className="col-span-full text-center text-gray-500 dark:text-gray-400">Carregando jornada...</p>
                            ) : errorTracks ? (
                                <p className="col-span-full text-center text-red-500">{errorTracks}</p>
                            ) : (
                                <>
                                    <div className="text-center p-4 border rounded-lg dark:border-gray-600">
                                        <div className="text-2xl font-bold text-blue-600">Etapa 1</div>
                                        <p className="text-sm font-medium">Conta GitHub</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{getStageStudentCount('Conta GitHub')}</p>
                                        <Progress value={getStageProgress('Conta GitHub')} className="mt-2" />
                                    </div>
                                    <div className="text-center p-4 border rounded-lg dark:border-gray-600">
                                        <div className="text-2xl font-bold text-green-600">Etapa 2</div>
                                        <p className="text-sm font-medium">Student Pack</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{getStageStudentCount('Student Pack')}</p>
                                        <Progress value={getStageProgress('Student Pack')} className="mt-2" />
                                    </div>
                                    <div className="text-center p-4 border rounded-lg dark:border-gray-600">
                                        <div className="text-2xl font-bold text-purple-600">Etapa 3</div>
                                        <p className="text-sm font-medium">Ferramentas Premium</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{getStageStudentCount('Ferramentas Premium')}</p>
                                        <Progress value={getStageProgress('Ferramentas Premium')} className="mt-2" />
                                    </div>
                                    <div className="text-center p-4 border rounded-lg dark:border-gray-600">
                                        <div className="text-2xl font-bold text-orange-600">Etapa 4</div>
                                        <p className="text-sm font-medium">Certificações</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{getStageStudentCount('Certificações')}</p>
                                        <Progress value={getStageProgress('Certificações')} className="mt-2" />
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
