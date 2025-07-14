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


export default function Dashboard() {
    const { isAuthenticated, setIsLoadingAuth, login, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const authProcessed = useRef(false);

    const [totalStudentsCount, setTotalStudentsCount] = useState<number | string>('...');
    const [loadingTotalStudents, setLoadingTotalStudents] = useState<boolean>(true);
    const [errorTotalStudents, setErrorTotalStudents] = useState<string | null>(null);

    const [totalInvestmentLiberated, setTotalInvestmentLiberated] = useState<number | string>('...');
    const [loadingTotalInvestment, setLoadingTotalInvestment] = useState<boolean>(true);
    const [errorTotalInvestment, setErrorTotalInvestment] = useState<string | null>(null);

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

    const [recentActivities, setRecentActivities] = useState<any[]>([
        { id: 1, user: 'Maria Silva', action: 'ativou GitHub Copilot', value: 480, time: 'Há 1 hora', type: 'benefit' },
        { id: 2, user: 'João Santos', action: 'completou 20h de estudo', value: 20, time: 'Há 2 horas', type: 'credits' },
        { id: 3, user: 'Ana Costa', action: 'ativou JetBrains IDEs', value: 1195, time: 'Há 4 horas', type: 'benefit' },
        { id: 4, user: 'Pedro Oliveira', action: 'conquistou certificação', value: 49, time: 'Ontem', type: 'certification' },
    ]);
    const [mostValuableTools, setMostValuableTools] = useState<any[]>([
        { name: 'JetBrains IDEs', activations: 321, value: 1195.20 },
        { name: 'GitHub Copilot', activations: 456, value: 480.00 },
        { name: 'Notion Education', activations: 287, value: 384.00 },
        { name: 'GitHub Pro', activations: 198, value: 336.00 },
    ]);


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


    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                setLoadingTotalStudents(true);
                setLoadingTotalInvestment(true);
                setErrorTotalStudents(null);
                setErrorTotalInvestment(null);

                const stats = await statsService.getGlobalStats();

                setTotalStudentsCount(stats.total_users);
                setTotalInvestmentLiberated(parseFloat(stats.total_unlocked_value));

            } catch (err: any) {
                console.error('Erro ao buscar estatísticas globais:', err);
                const errorMessage = 'N/A';
                setErrorTotalStudents(errorMessage);
                setErrorTotalInvestment(errorMessage);
                setTotalStudentsCount(errorMessage);
                setTotalInvestmentLiberated(errorMessage);
            } finally {
                setLoadingTotalStudents(false);
                setLoadingTotalInvestment(false);
            }
        };
        fetchGlobalStats();
    }, []);


    useEffect(() => {
        const fetchStudentDashboardData = async () => {
            try {
                setLoadingCalculatorData(true);
                setErrorCalculatorData(null);

                const data: User = await userService.getStudentDashboardData();

                const totalPossible = data.totalPossibleBenefits || 0;
                const totalSaved = data.totalSaved || 0;

                setCalculatorTotalAvailable(totalPossible);
                setCalculatorAlreadyInvested(totalSaved);

                const balance = totalPossible - totalSaved;
                setCalculatorBalance(balance);

                const progress = totalPossible > 0
                    ? Math.round((totalSaved / totalPossible) * 100)
                    : 0;
                setCalculatorProgressValue(progress);

            } catch (err: any) {
                console.error('Erro ao buscar dados do dashboard do estudante:', err);
                const errorMessage = 'N/A';
                setErrorCalculatorData(errorMessage);
                setCalculatorTotalAvailable(errorMessage);
                setCalculatorAlreadyInvested(errorMessage);
                setCalculatorBalance(errorMessage);
                setCalculatorProgressValue(0);
            } finally {
                setLoadingCalculatorData(false);
            }
        };

        if (isAuthenticated) {
            fetchStudentDashboardData();
        }
    }, [isAuthenticated]);


    useEffect(() => {
        const fetchTracks = async () => {
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

        if (isAuthenticated) {
            fetchTracks();
        }
    }, [isAuthenticated]);


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
        const stageTracks = getTracksForStage(stageName);
        if (stageTracks.length === 0) {
            return '0 estudantes';
        }

        if (typeof totalStudentsCount === 'number' && !loadingTotalStudents && !errorTotalStudents) {
            if (stageName === 'Conta GitHub') {
                return `${Math.round(totalStudentsCount * 0.95).toLocaleString('pt-BR')} estudantes`;
            } else if (stageName === 'Student Pack') {
                return `${Math.round(totalStudentsCount * 0.80).toLocaleString('pt-BR')} estudantes`;
            } else if (stageName === 'Ferramentas Premium') {
                return `${Math.round(totalStudentsCount * 0.60).toLocaleString('pt-BR')} estudantes`;
            } else if (stageName === 'Certificações') {
                return `${Math.round(totalStudentsCount * 0.30).toLocaleString('pt-BR')} estudantes`;
            }
        }
        return 'N/A';
    };

    return (
        <div className="space-y-6 p-6 mt-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard EstudaMais.tech</h1>
                    <p className="text-gray-600 dark:text-gray-300">Transformando o GitHub Student Pack em investimento na sua carreira - Mais de US$ 200.000 disponíveis!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Estudantes Ativos"
                    value={loadingTotalStudents ? 'Carregando...' : errorTotalStudents ? errorTotalStudents : totalStudentsCount.toLocaleString('pt-BR')}
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
                    value={loadingTotalStudents ? 'Carregando...' : errorTotalStudents ? errorTotalStudents : totalStudentsCount.toLocaleString('pt-BR')}
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