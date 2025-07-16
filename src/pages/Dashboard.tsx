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
    Star
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
    user: string;
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

    const [totalInvestmentLiberated, setTotalInvestmentLiberated] = useState<number | null>(null);
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

    // Mock data for most valuable tools (replace with API calls if available)
    const [mostValuableTools] = useState<any[]>([
        { name: 'JetBrains IDEs', activations: 321, value: 1195.20 },
        { name: 'GitHub Copilot', activations: 456, value: 480.00 },
        { name: 'Notion Education', activations: 287, value: 384.00 },
        { name: 'GitHub Pro', activations: 198, value: 336.00 },
    ]);

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

    // Effect for fetching authenticated dashboard data
    useEffect(() => {
        if (isAuthenticated && !authCodeProcessed.current) {
            const fetchData = async () => {
                // Fetch Global Stats
                try {
                    setLoadingTotalStudents(true);
                    setLoadingTotalInvestment(true);
                    setLoadingGithubUsers(true);

                    const stats = await statsService.getGlobalStats();
                    setTotalStudentsCount(stats.total_usuarios);
                    setTotalInvestmentLiberated(parseFloat(stats.total_unlocked_value));
                } catch (err: unknown) {
                    console.error('Erro ao buscar estatísticas globais:', err);
                    setErrorTotalStudents('Falha ao carregar');
                    setErrorTotalInvestment('Falha ao carregar');
                    setTotalStudentsCount(null);
                    setTotalInvestmentLiberated(null);
                } finally {
                    setLoadingTotalStudents(false);
                    setLoadingTotalInvestment(false);
                }

                // Fetch GitHub Users Count Separately
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

                // Fetch Student Dashboard Data
                try {
                    setLoadingCalculatorData(true);
                    setErrorCalculatorData(null);
                    if (user?.id) {
                        const data: User = await userService.getStudentDashboardData();
                        const totalPossible = data.totalPossibleBenefits || 0;
                        const totalSaved = data.totalSaved || 0;
                        setCalculatorTotalAvailable(totalPossible);
                        setCalculatorAlreadyInvested(totalSaved);
                        const balance = totalPossible - totalSaved;
                        setCalculatorBalance(balance);
                        const progress = totalPossible > 0 ? Math.round((totalSaved / totalPossible) * 100) : 0;
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

                // Fetch Tracks and generate Recent Activities
                try {
                    setLoadingTracks(true);
                    setLoadingCompletionRate(true);
                    setLoadingRecentActivities(true); // Inicia loading para atividades recentes
                    setErrorTracks(null);
                    setErrorCompletionRate(null);
                    setErrorRecentActivities(null); // Limpa erro anterior

                    const fetchedTracks = await trackService.getTracksForUser();
                    const totalTracks = fetchedTracks.length;
                    const completedTracks = fetchedTracks.filter(track => track.status === 'completed').length;
                    const currentCompletionRate = totalTracks > 0 ? (completedTracks / totalTracks) * 100 : 0;
                    setCompletionRate(currentCompletionRate);
                    setTracks(fetchedTracks);

                    // Gerar atividades recentes a partir das trilhas
                    const activities: RecentActivity[] = [];
                    const userName = user?.name || user?.github_login || 'Um estudante';

                    fetchedTracks.forEach(track => {
                        if (track.started_at) {
                            activities.push({
                                id: `${track.id}-start`,
                                user: userName,
                                action: `iniciou a trilha "${track.title}"`,
                                value: track.reward_value,
                                timestamp: new Date(track.started_at).getTime(),
                                type: 'track_start',
                                trackTitle: track.title,
                            });
                        }
                        if (track.completed_at && track.status === 'completed') {
                            activities.push({
                                id: `${track.id}-complete`,
                                user: userName,
                                action: `completou a trilha "${track.title}"`,
                                value: track.reward_value,
                                timestamp: new Date(track.completed_at).getTime(),
                                type: 'track_complete',
                                trackTitle: track.title,
                            });
                        }
                    });

                    // Ordenar atividades da mais recente para a mais antiga
                    const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp);
                    setRecentActivities(sortedActivities);

                } catch (err: unknown) {
                    console.error('Erro ao buscar trilhas ou gerar atividades recentes:', err);
                    setErrorTracks('Não disponível');
                    setErrorCompletionRate('Falha ao carregar');
                    setErrorRecentActivities('Falha ao carregar atividades'); // Define erro para atividades
                    setTracks([]);
                    setCompletionRate(null);
                    setRecentActivities([]); // Limpa atividades em caso de erro
                } finally {
                    setLoadingTracks(false);
                    setLoadingCompletionRate(false);
                    setLoadingRecentActivities(false); // Finaliza loading para atividades recentes
                }
            };
            fetchData();
        }
    }, [isAuthenticated, isLoadingAuth, authCodeProcessed.current, user?.id, user?.name, user?.github_login]); // Adicionado user?.name e user?.github_login para o useCallback

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

    if (isLoadingAuth) {
        return <div className="flex justify-center items-center h-screen text-xl">Carregando autenticação...</div>;
    }

    if (!isAuthenticated) {
        return <div className="flex justify-center items-center h-screen text-xl">Você precisa estar logado para acessar o dashboard.</div>;
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

            <section className="space-y-6 p-6 mt-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard EstudaMais.tech - Bem-vindo(a), {user?.name || user?.github_login}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Transformando o GitHub Student Pack em investimento na sua carreira - Mais de US$ 200.000 disponíveis!
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
                        title="Investimento Global Liberado"
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

                    <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Clock className="w-5 h-5" />
                                Atividade Recente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loadingRecentActivities ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Carregando atividades...</p>
                                ) : errorRecentActivities ? (
                                    <p className="text-center text-red-500">{errorRecentActivities}</p>
                                ) : recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{activity.user} {activity.action}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {activity.type === 'track_complete' ? `+US$ ${activity.value} liberados` : activity.type === 'track_start' ? `Trilha iniciada` : ''} • {formatTimeAgo(activity.timestamp)}
                                                </p>
                                            </div>
                                            <div className={`font-bold ${activity.type === 'track_complete' ? 'text-green-600' : 'text-blue-600'}`}>
                                                {activity.type === 'track_complete' ? `+US$ ${activity.value}` : ''}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma atividade recente.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Star className="w-5 h-5" />
                                Ferramentas Mais Valiosas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mostValuableTools.map((tool, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">{tool.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{tool.activations} ativações</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600">US$ {tool.value.toFixed(2)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">por estudante</p>
                                        </div>
                                    </div>
                                ))}
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
