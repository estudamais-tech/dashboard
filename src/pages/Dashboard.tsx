import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Ensure this path is correct
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

import githubAuthService from '../services/githubAuthService'; // Service to call your backend auth endpoint
import userService, { User } from '../services/userService'; // Ensure User interface is imported
import trackService, { Track } from '../services/trackService'; // Ensure Track interface is imported
import statsService, { GlobalStats } from '../services/statsService'; // Ensure GlobalStats interface is imported
import OnboardingForm from '../components/OnboardingForm'; // Assuming you have this component

export default function Dashboard() {
    const { isAuthenticated, user, isLoadingAuth, login, logout, checkAuthStatus } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const authCodeProcessed = useRef(false); // To ensure GitHub code is processed only once

    // States for dashboard data
    const [totalStudentsCount, setTotalStudentsCount] = useState<number | string>('...');
    const [loadingTotalStudents, setLoadingTotalStudents] = useState<boolean>(true);
    const [errorTotalStudents, setErrorTotalStudents] = useState<string | null>(null);

    const [totalInvestmentLiberated, setTotalInvestmentLiberated] = useState<number | string>('...');
    const [loadingTotalInvestment, setLoadingTotalInvestment] = useState<boolean>(true);
    const [errorTotalInvestment, setErrorTotalInvestment] = useState<string | null>(null);

    // NOVO ESTADO PARA CONTAGEM DE USUÁRIOS DO GITHUB
    const [githubUsersCount, setGithubUsersCount] = useState<number | string>('...');
    const [loadingGithubUsers, setLoadingGithubUsers] = useState<boolean>(true);
    const [errorGithubUsers, setErrorGithubUsers] = useState<string | null>(null);


    const [completionRate, setCompletionRate] = useState<number | string>('...');
    const [loadingCompletionRate, setLoadingCompletionRate] = useState<boolean>(true);
    const [errorCompletionRate, setErrorCompletionRate] = useState<string | null>(null);

    const [calculatorTotalAvailable, setCalculatorTotalAvailable] = useState<number | string>('...');
    const [calculatorAlreadyInvested, setCalculatorAlreadyInvested] = useState<number | string>('...');
    const [calculatorProgressValue, setCalculatorProgressValue] = useState<number>(0);
    const [calculatorBalance, setCalculatorBalance] = useState<number | string>('...');
    const [loadingCalculatorData, setLoadingCalculatorData] = useState<boolean>(true);
    const [errorCalculatorData, setErrorCalculatorData] = useState<string | null>(null);

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loadingTracks, setLoadingTracks] = useState<boolean>(true);
    const [errorTracks, setErrorTracks] = useState<string | null>(null);

    // Mock data for recent activities and valuable tools (replace with API calls if available)
    const [recentActivities] = useState<any[]>([
        { id: 1, user: 'Maria Silva', action: 'ativou GitHub Copilot', value: 480, time: 'Há 1 hora', type: 'benefit' },
        { id: 2, user: 'João Santos', action: 'completou 20h de estudo', value: 20, time: 'Há 2 horas', type: 'credits' },
        { id: 3, user: 'Ana Costa', action: 'ativou JetBrains IDEs', value: 1195, time: 'Há 4 horas', type: 'benefit' },
        { id: 4, user: 'Pedro Oliveira', action: 'conquistou certificação', value: 49, time: 'Ontem', type: 'certification' },
    ]);
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

        console.log('Dashboard useEffect (Auth Code): Início.');
        console.log(' - Código na URL:', code);
        console.log(' - authCodeProcessed.current:', authCodeProcessed.current);
        console.log(' - isAuthenticated do Context:', isAuthenticated);
        console.log(' - isLoadingAuth do Context:', isLoadingAuth);

        // Process code ONLY if it exists, hasn't been processed, and we are not already authenticated
        if (code && !authCodeProcessed.current && !isAuthenticated) {
            authCodeProcessed.current = true; // Mark as processing
            console.log('Dashboard useEffect (Auth Code): Processando novo código de autorização do GitHub via backend.');

            const processGitHubCode = async () => {
                try {
                    // Call your service to exchange the code with the backend
                    const backendResponse = await githubAuthService.exchangeCodeForToken(code);
                    console.log('Dashboard: Resposta COMPLETA do backend em exchangeCodeForToken:', backendResponse);

                    if (backendResponse && backendResponse.user) {
                        // Pass the received user data to the AuthContext's login function
                        await login(backendResponse.user); // Await login to ensure state updates
                        console.log('Dashboard: Dados do usuário passados para a função login do AuthContext.');
                    } else {
                        console.error('Dashboard: Resposta do backend não contém dados de usuário válidos.', backendResponse);
                        throw new Error('Dados de usuário inválidos recebidos do backend.');
                    }

                    // Clean the URL, but let AuthContext handle the navigation based on onboarding status
                    navigate(location.pathname, { replace: true });
                    console.log('Dashboard: URL limpa.');

                } catch (error) {
                    console.error('Dashboard: Erro ao processar o código do GitHub:', error);
                    logout(); // Log out on error
                    navigate('/', { replace: true }); // Redirect to home on auth error
                } finally {
                    // isLoadingAuth will be handled by AuthContext.
                    // No need to set it here explicitly as login/checkAuthStatus already do.
                    console.log('Dashboard: Processamento de código GitHub finalizado.');
                }
            };
            processGitHubCode();
        } else if (code && isAuthenticated && !authCodeProcessed.current) { // Already authenticated but still has code in URL
            console.log('Dashboard useEffect (Auth Code): Código na URL, mas já autenticado. Limpando URL.');
            navigate(location.pathname, { replace: true });
            authCodeProcessed.current = true; // Mark as processed to prevent re-runs
        } else {
            console.log('Dashboard useEffect (Auth Code): Nenhuma ação de autenticação necessária neste ciclo ou já processado.');
        }
    }, [location.search, navigate, location.pathname, isAuthenticated, login, logout]);


    // Effect for fetching authenticated dashboard data
    useEffect(() => {
        // Fetch data ONLY if isAuthenticated is true and AuthContext is not still loading auth status
        // and we are not in the middle of processing a new GitHub auth code
        if (isAuthenticated && !isLoadingAuth && !authCodeProcessed.current) {
            console.log('Dashboard useEffect (Data Fetch): Usuário autenticado, buscando dados...');

            const fetchData = async () => {
                // Fetch Global Stats
                try {
                    setLoadingTotalStudents(true);
                    setLoadingTotalInvestment(true);
                    // NOVO: Também carrega a contagem de usuários do GitHub
                    setLoadingGithubUsers(true);

                    const stats = await statsService.getGlobalStats();
                    console.log('DEBUG: statsService.getGlobalStats() returned:', stats);
                    setTotalStudentsCount(stats.total_usuarios);
                    console.log('DEBUG: totalStudentsCount state set to:', stats.total_usuarios);
                    setTotalInvestmentLiberated(parseFloat(stats.total_unlocked_value));
                } catch (err: any) {
                    console.error('Erro ao buscar estatísticas globais:', err);
                    setErrorTotalStudents('N/A');
                    setErrorTotalInvestment('N/A');
                    setTotalStudentsCount('N/A');
                    setTotalInvestmentLiberated('N/A');
                } finally {
                    setLoadingTotalStudents(false);
                    setLoadingTotalInvestment(false);
                }

                // Fetch GitHub Users Count Separately
                try {
                    const githubCount = await userService.getGithubUsersCount();
                    setGithubUsersCount(githubCount);
                } catch (err: any) {
                    console.error('Erro ao buscar contagem de usuários GitHub:', err);
                    setErrorGithubUsers('N/A');
                    setGithubUsersCount('N/A');
                } finally {
                    setLoadingGithubUsers(false);
                }


                // Fetch Student Dashboard Data
                try {
                    setLoadingCalculatorData(true);
                    setErrorCalculatorData(null);
                    if (user?.id) { // Ensure user ID exists before fetching user-specific data
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
                } catch (err: any) {
                    console.error('Erro ao buscar dados do dashboard do estudante:', err);
                    setErrorCalculatorData('N/A');
                    setCalculatorTotalAvailable('N/A');
                    setCalculatorAlreadyInvested('N/A');
                    setCalculatorBalance('N/A');
                    setCalculatorProgressValue(0);
                } finally {
                    setLoadingCalculatorData(false);
                }

                // Fetch Tracks
                try {
                    setLoadingTracks(true);
                    setLoadingCompletionRate(true);
                    setErrorTracks(null);
                    setErrorCompletionRate(null);
                    const fetchedTracks = await trackService.getTracksForUser();
                    const totalTracks = fetchedTracks.length;
                    const completedTracks = fetchedTracks.filter(track => track.status === 'completed').length;
                    const currentCompletionRate = totalTracks > 0 ? (completedTracks / totalTracks) * 100 : 0;
                    setCompletionRate(currentCompletionRate);
                    setTracks(fetchedTracks);
                } catch (err: any) {
                    console.error('Erro ao buscar trilhas da jornada:', err);
                    setErrorTracks('Não disponível');
                    setErrorCompletionRate('N/A');
                    setTracks([]);
                    setCompletionRate('N/A');
                } finally {
                    setLoadingTracks(false);
                    setLoadingCompletionRate(false);
                }
            };
            fetchData();
        } else if (!isAuthenticated && !isLoadingAuth) {
            console.log('Dashboard useEffect (Data Fetch): Não autenticado, não buscando dados.');
        } else if (isLoadingAuth) {
            console.log('Dashboard useEffect (Data Fetch): Autenticação ainda em progresso, aguardando...');
        } else if (authCodeProcessed.current) {
            console.log('Dashboard useEffect (Data Fetch): Processando código de autenticação, aguardando...');
        }
    }, [isAuthenticated, isLoadingAuth, authCodeProcessed.current, user?.id]); // Depend on relevant auth states and user.id

    const formatCurrency = (value: number | string) => {
        if (typeof value === 'number') {
            return `US$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return value;
    };

    const formatPercentage = (value: number | string) => {
        if (typeof value === 'number') {
            return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
        }
        return value;
    };

    const getTracksForStage = (stageName: string): Track[] => {
        // Implement logic based on your Track structure to filter by stage
        // This is simplified based on your previous code
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

    // This function likely needs to pull student counts from an API,
    // or be removed if it's mock data. Using `totalStudentsCount` for now.
    const getStageStudentCount = (stageName: string): string => {
        console.log(`DEBUG: getStageStudentCount called for ${stageName}. totalStudentsCount:`, totalStudentsCount); // NEW DEBUG LOG
        // NOVO: Usa githubUsersCount para a etapa "Conta GitHub"
        if (stageName === 'Conta GitHub') {
            if (typeof githubUsersCount === 'number' && !loadingGithubUsers && !errorGithubUsers) {
                return `${githubUsersCount.toLocaleString('pt-BR')} estudantes`;
            }
            return 'N/A';
        }

        // Para as outras etapas, continua usando totalStudentsCount (que agora vem do COUNT(*) da tabela usuarios)
        if (typeof totalStudentsCount === 'number' && !loadingTotalStudents && !errorTotalStudents) {
            // These percentages are hardcoded. Ideally, they'd come from backend stats specific to stages.
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


    // Render logic based on authentication status and loading state
    if (isLoadingAuth) {
        return <div className="flex justify-center items-center h-screen text-xl">Carregando autenticação...</div>;
    }

    if (!isAuthenticated) {
        // If not authenticated and not loading, redirect to home (login page)
        // This should be handled by AuthContext or a ProtectedRoute
        return <div className="flex justify-center items-center h-screen text-xl">Você precisa estar logado para acessar o dashboard.</div>;
    }

    // Now, if we reach here, isAuthenticated is true and isLoadingAuth is false
    // We can conditionally render the onboarding form or the dashboard content
    if (user && !user.onboarding_complete) {
        // Removed the check for typeof checkAuthStatus === 'function' and the onComplete prop
        // OnboardingForm now directly gets checkAuthStatus from its own useAuth hook.
        return <OnboardingForm userId={user.id} />; 
    }

    // If isAuthenticated is true AND onboarding is complete
    return (
        <div className="space-y-6 p-6 mt-20">
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
                        (typeof totalStudentsCount === 'number' ? totalStudentsCount.toLocaleString('pt-BR') : totalStudentsCount)
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
                        loadingGithubUsers ? 'Carregando...' : // AGORA USA O NOVO ESTADO
                        errorGithubUsers ? errorGithubUsers : // AGORA USA O NOVO ESTADO
                        (typeof githubUsersCount === 'number' ? githubUsersCount.toLocaleString('pt-BR') : githubUsersCount) // AGORA USA O NOVO ESTADO
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
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{activity.user} {activity.action}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {activity.type === 'benefit' ? `+US$ ${activity.value} liberados` : activity.type === 'credits' ? `+${activity.value} créditos` : ''} • {activity.time}
                                        </p>
                                    </div>
                                    <div className={`font-bold ${activity.type === 'benefit' ? 'text-green-600' : activity.type === 'credits' ? 'text-blue-600' : 'text-purple-600'}`}>
                                        {activity.type === 'benefit' ? `+US$ ${activity.value}` : activity.type === 'credits' ? `+${activity.value}` : `+US$ ${activity.value}`}
                                    </div>
                                </div>
                            ))}
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
        </div>
    );
}
// corret