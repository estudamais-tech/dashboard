// src/pages/Students.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    Github,
    CheckCircle,
    Clock,
    DollarSign,
    Trophy,
    ArrowRight,
    ExternalLink,
    Linkedin,
    Link,
    Trash2 // Adicionado ícone de lixeira
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import userService, { User } from '../services/userService';
import trackService, { Track } from '@/services/trackService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    monthlyValueUSD: number;
    redemptionLink: string;
    area: string;
}

const MOCK_PRODUCTS: Product[] = [
    // Seus produtos mockados aqui
];

interface StudentDashboardData extends User {
    totalSaved: number;
    totalPossibleBenefits: number;
}

export default function Students() {
    // AJUSTE: Desestruturar o objeto 'user' completo do useAuth
    const { user, isAuthenticated, isLoadingAuth } = useAuth();
    // Acessar as propriedades do usuário a partir do objeto 'user'
    const userName = user?.name;
    const githubLogin = user?.github_login;
    const userAvatar = user?.avatar_url; // Adicionado para consistência, embora não usado diretamente aqui no Students.tsx para exibição principal

    const { toast } = useToast();
    const navigate = useNavigate();

    // NOVO LOG: Para depurar os valores recebidos no Students.tsx
    useEffect(() => {
        console.log('Students.tsx: user object from useAuth:', user);
        console.log('Students.tsx: userName:', userName);
        console.log('Students.tsx: githubLogin:', githubLogin);
    }, [user, userName, githubLogin]);


    const [totalStudentsCount, setTotalStudentsCount] = useState<number | string>('...');
    const [loadingTotalStudents, setLoadingTotalStudents] = useState<boolean>(true);
    const [errorTotalStudents, setErrorTotalStudents] = useState<string | null>(null);

    const [githubStudentsCount, setGithubStudentsCount] = useState<number | string>('...');
    const [loadingGithubStudents, setLoadingGithubStudents] = useState<boolean>(true);
    const [errorGithubStudents, setErrorGithubStudents] = useState<string | null>(null);

    const [inProgressTracksCount, setInProgressTracksCount] = useState<number | string>('...');
    const [loadingInProgressTracks, setLoadingInProgressTracks] = useState<boolean>(true);
    const [errorInProgressTracks, setErrorInProgressTracks] = useState<string | null>(null);

    const [studentData, setStudentData] = useState<StudentDashboardData | null>(null);
    const [loadingStudentData, setLoadingStudentData] = useState<boolean>(true);
    const [errorStudentData, setErrorStudentData] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [completedTracks, setCompletedTracks] = useState<Track[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [errorTracks, setErrorTracks] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false); // Para botões de benefício
    const [isRemovingTrack, setIsRemovingTrack] = useState<boolean>(false); // Novo estado para carregamento da remoção

    // Estados para o modal de remover trilha
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [trackToRemoveId, setTrackToRemoveId] = useState<string | null>(null);
    const [trackToRemoveName, setTrackToRemoveName] = useState<string>('');
    const [confirmTrackName, setConfirmTrackName] = useState<string>(''); // Para o input de confirmação


    const calculateRemainingMonths = useCallback((current: number | null, total: number | null) => {
        if (current === null || total === null || isNaN(current) || isNaN(total) || total <= 0 || current > total) {
            return 0;
        }
        return (total - current) * 6; // Considerando 6 meses por semestre
    }, []);

    const calculateTotalPossibleBenefits = useCallback((areas: string[], remainingMonths: number) => {
        let total = 200000; // Ajustado para número, pois o valor original '200.000' é uma string e causaria NaN
        areas.forEach(area => {
            const productsInArea = MOCK_PRODUCTS.filter(p => p.area === area);
            total += productsInArea.reduce((sum, product) => sum + (product.monthlyValueUSD * remainingMonths), 0);
        });
        return total;
    }, []);

    // Função para buscar todos os dados (Student e Tracks)
    const fetchData = useCallback(async () => {
        if (isLoadingAuth) {
            console.log('Students.tsx: Waiting for AuthProvider to finish loading authentication status.');
            return;
        }

        if (!isAuthenticated) {
            console.log('Students.tsx: Not authenticated, redirecting to home.');
            navigate('/');
            return;
        }

        setLoadingStudentData(true);
        setLoadingTracks(true);
        setLoadingInProgressTracks(true);
        setErrorStudentData(null);
        setErrorTracks(null);
        setErrorInProgressTracks(null);


        let studentDataFetched: User | null = null;
        let tracksFetched: Track[] = [];

        try {
            studentDataFetched = await userService.getStudentDashboardData();
            console.log('Students.tsx (Dashboard): Data received from userService.getStudentDashboardData:', JSON.stringify(studentDataFetched, null, 2));

            const isAreasOfInterestInvalid = !Array.isArray(studentDataFetched.areasOfInterest);

            if (studentDataFetched.onboarding_complete !== 1 || studentDataFetched.course === null || studentDataFetched.currentSemester === null || studentDataFetched.totalSemesters === null || isAreasOfInterestInvalid) {
                console.log('Students.tsx (Dashboard): Incomplete onboarding data detected, redirecting to /onboarding.');
                navigate('/onboarding');
                return;
            }

            const areasOfInterest = studentDataFetched.areasOfInterest || [];

            setStudentData({
                ...studentDataFetched,
                areasOfInterest,
                redeemedBenefits: studentDataFetched.redeemedBenefits || [],
                totalSaved: parseFloat(studentDataFetched.totalEconomy) || 0,
                totalPossibleBenefits: calculateTotalPossibleBenefits(areasOfInterest, calculateRemainingMonths(studentDataFetched.currentSemester, studentDataFetched.totalSemesters))
            });

            const products = MOCK_PRODUCTS.filter(product =>
                areasOfInterest.includes(product.area)
            );
            setFilteredProducts(products);

            tracksFetched = await trackService.getTracksForUser();
            console.log('Students.tsx (Dashboard): Tracks received from trackService.getTracksForUser():', JSON.stringify(tracksFetched, null, 2));

            setAllTracks(tracksFetched);

            const completed = tracksFetched.filter(track => track.status === 'completed');
            setCompletedTracks(completed);

            const inProgress = tracksFetched.filter(track => track.status === 'in-progress');
            setInProgressTracksCount(inProgress.length);

        } catch (err: any) {
            console.error("Error fetching student data or tracks:", err);
            setErrorStudentData(err.message || "Failed to load student data.");
            setErrorTracks(err.message || "Failed to load tracks.");
            setErrorInProgressTracks(err.message || "Failed to load in-progress tracks.");
            setStudentData(null);
            setAllTracks([]);
            setCompletedTracks([]);
            setInProgressTracksCount('N/A');
        } finally {
            setLoadingStudentData(false);
            setLoadingTracks(false);
            setLoadingInProgressTracks(false);
        }
    }, [isAuthenticated, isLoadingAuth, navigate, calculateRemainingMonths, calculateTotalPossibleBenefits]);


    // Effect for dashboard counts (independent of studentData)
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                setLoadingTotalStudents(true);
                const count = await userService.getTotalUsersCount();
                setTotalStudentsCount(count);
            } catch (err: any) {
                console.error('Error fetching total students:', err);
                setErrorTotalStudents('N/A');
            } finally {
                setLoadingTotalStudents(false);
            }

            try {
                setLoadingGithubStudents(true);
                const count = await userService.getGithubUsersCount();
                setGithubStudentsCount(count);
            } catch (err: any) {
                console.error('Error fetching students with GitHub:', err);
                setErrorGithubStudents('N/A');
            } finally {
                setLoadingGithubStudents(false);
            }
        };
        fetchCounts();
    }, []);


    // Effect para buscar os dados iniciais quando o componente é montado ou auth muda
    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleRedeemBenefit = async (productId: string, redemptionLink: string) => {
        if (!studentData) return;

        setIsLoading(true);
        try {
            const redeemedProduct = MOCK_PRODUCTS.find(p => p.id === productId);
            const monthsRemaining = calculateRemainingMonths(studentData.currentSemester, studentData.totalSemesters);

            if (!redeemedProduct) {
                toast({
                    title: "Error",
                    description: "Product not found.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            await userService.updateBenefitStatus(productId, true, redeemedProduct.monthlyValueUSD, monthsRemaining);

            // Re-fetch data to ensure all counts and lists are accurate
            await fetchData();

            toast({
                title: "Benefício Resgatado!",
                description: "O status do benefício foi atualizado com sucesso.",
                variant: "success",
            });

            window.open(redemptionLink, '_blank');

        } catch (error: any) {
            console.error("Error redeeming benefit:", error);
            toast({
                title: "Erro ao Resgatar",
                description: `Falha ao atualizar benefício: ${error.message || 'Unknown error'}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Função para abrir o modal de remoção
    const openRemoveModal = (trackId: string, trackName: string) => {
        setTrackToRemoveId(trackId);
        setTrackToRemoveName(trackName);
        setConfirmTrackName(''); // Limpa o input de confirmação
        setIsRemoveModalOpen(true);
    };

    // Função para remover a trilha
    const handleRemoveTrack = async () => {
        if (!trackToRemoveId || confirmTrackName !== trackToRemoveName) {
            toast({
                title: "Erro de Confirmação",
                description: "Por favor, digite o nome da trilha exatamente como mostrado para confirmar a remoção.",
                variant: "destructive",
            });
            return;
        }

        setIsRemovingTrack(true);
        try {
            await trackService.removeTrackProgress(trackToRemoveId);
            toast({
                title: "Sucesso",
                description: "Progresso da trilha removido com sucesso!",
                variant: "success",
            });
            setIsRemoveModalOpen(false); // Fecha o modal
            await fetchData(); // Re-fetch all data to update UI

        } catch (error: any) {
            console.error("Error removing track:", error);
            toast({
                title: "Erro ao Remover Trilha",
                description: `Falha ao remover progresso da trilha: ${error.message || 'Unknown error'}`,
                variant: "destructive",
            });
        } finally {
            setIsRemovingTrack(false);
        }
    };


    const renderTrackIcon = (iconName: string) => {
        switch (iconName) {
            case 'github':
                return <Github className="w-5 h-5 text-purple-600 dark:text-purple-300" />;
            case 'linkedin':
                return <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-300" />;
            case 'arrow-right':
                return <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-300" />;
            case 'external-link':
                return <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            default:
                return <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
        }
    };

    if (isLoadingAuth || loadingStudentData || loadingTracks || loadingInProgressTracks) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-gray-700 dark:text-gray-300">Carregando sua dashboard e trilhas...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate('/');
        return null;
    }

    if (errorStudentData || errorTracks || errorInProgressTracks) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-red-500">
                    Erro ao carregar dados: {errorStudentData || errorTracks || errorInProgressTracks}
                </p>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-gray-700 dark:text-gray-300">Nenhum dado de estudante encontrado. Por favor, faça login novamente ou complete o onboarding.</p>
            </div>
        );
    }

    // AQUI É O LUGAR CORRETO PARA DECLARAR displayedName
    const displayedName = userName || githubLogin || 'Estudante';

    const benefitsProgressPercentage = studentData.totalPossibleBenefits > 0
        ? (studentData.totalSaved / studentData.totalPossibleBenefits) * 100
        : 0;

    const totalTracksCount = allTracks.length;
    const completedTracksCount = completedTracks.length;
    const trackProgressPercentage = totalTracksCount > 0
        ? (completedTracksCount / totalTracksCount) * 100
        : 0;

    return (
        <div className="space-y-6 p-6 mt-14 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        Olá, {displayedName}!
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                        Bem-vindo(a) à sua dashboard Estudamais.tech.
                    </p>
                    <p className="text-md text-gray-500 dark:text-gray-400">
                        Curso: <span className="font-semibold">{studentData.course || 'N/A'}</span> | Semestre: <span className="font-semibold">{studentData.currentSemester || 'N/A'}/{studentData.totalSemesters || 'N/A'}</span> | Área(s): <span className="font-semibold">{(studentData.areasOfInterest || []).join(', ')}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg">
                    <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">@{githubLogin || 'N/A'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Estudantes</p>
                                <p className="text-2xl font-bold">
                                    {loadingTotalStudents ? '...' : errorTotalStudents ? errorTotalStudents : totalStudentsCount.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Com GitHub</p>
                                <p className="text-2xl font-bold">
                                    {loadingGithubStudents ? '...' : errorGithubStudents ? errorGithubStudents : githubStudentsCount.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <Github className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Benefícios Ativos</p>
                                <p className="text-2xl font-bold">
                                    {completedTracksCount.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Trilhas em Andamento</p>
                                <p className="text-2xl font-bold">
                                    {loadingInProgressTracks ? '...' : errorInProgressTracks ? errorInProgressTracks : inProgressTracksCount.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                <CardContent className="p-6 text-start">
                    <CardTitle className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" /> Seu Progresso nas Trilhas
                    </CardTitle>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        Você concluiu: <span className="font-extrabold text-green-500">{completedTracksCount}</span> de <span className="font-extrabold text-blue-500">{totalTracksCount}</span> trilhas.
                    </p>
                    <Progress value={trackProgressPercentage} className="w-full h-2 bg-gray-300 dark:bg-gray-600 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-yellow-500 [&::-webkit-progress-value]:to-orange-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Progresso da Jornada: {trackProgressPercentage.toFixed(2)}%
                    </p>
                </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                <CardContent className="p-6 text-start">
                    <CardTitle className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-green-500" /> Sua Economia de Benefícios
                    </CardTitle>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        Você já desbloqueou: <span className="font-extrabold text-green-500">${(studentData.totalSaved || 0).toLocaleString('en-US')}</span> de <span className="font-extrabold text-blue-500">${(studentData.totalPossibleBenefits || 0).toLocaleString('en-US')}</span> disponíveis
                    </p>
                    <Progress value={benefitsProgressPercentage} className="w-full h-2 bg-gray-300 dark:bg-gray-600 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-blue-500 [&::-webkit-progress-value]:to-green-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Progresso: {benefitsProgressPercentage.toFixed(2)}%
                    </p>
                </CardContent>
            </Card>

            {/* Seção de Trilhas Concluídas */}
            {completedTracks.length > 0 && (
                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md ">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold dark:text-white">Trilhas Concluídas</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300">
                            Parabéns! Você concluiu as seguintes trilhas:
                        </p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {completedTracks.map((track) => (
                            <Card key={track.id} className="dark:bg-gray-900 dark:border-gray-600 opacity-80">
                                <CardContent className="p-5 flex flex-col items-start min-h-full justify-between">
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-green-100 dark:bg-green-900">
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                                        {track.description}
                                    </p>
                                    <Badge variant="default" className="bg-green-500 text-white dark:bg-green-700 mb-4">Concluída</Badge>
                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600 mb-2"
                                        onClick={() => navigate(track.path)}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" /> Ver Trilha
                                    </Button>
                                    {/* Botão para Remover Trilha */}
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                        onClick={() => openRemoveModal(track.id, track.title)}
                                        disabled={isRemovingTrack}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Remover Trilha
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Seção de Recomendações de Produtos */}
            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-bold dark:text-white">Recomendações de Produtos para sua Área</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                        Baseado em sua(s) área(s) de interesse ({(studentData.areasOfInterest || []).join(', ') || 'N/A'}).
                    </p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                            Nenhum produto encontrado para suas áreas de interesse.
                        </p>
                    ) : (
                        filteredProducts.map((product) => (
                            <Card key={product.id} className="dark:bg-gray-900 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-5 flex flex-col items-start">
                                    <img src={product.logoUrl} alt={`${product.name} logo`} className="w-12 h-12 rounded-full mb-3 border border-gray-200 dark:border-gray-700" />
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{product.name}</h3>
                                    <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">{product.area}</Badge>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">{product.description}</p>
                                    <div className="flex items-center justify-between w-full mb-4">
                                        <div className="flex items-center gap-1 text-lg font-bold text-green-600 dark:text-green-400">
                                            <DollarSign className="w-5 h-5" />
                                            <span>{product.monthlyValueUSD} USD/mês</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Economia Estimada: <span className="font-semibold">${(product.monthlyValueUSD * calculateRemainingMonths(studentData.currentSemester, studentData.totalSemesters)).toLocaleString('en-US')}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {(studentData.redeemedBenefits || []).includes(product.id) ? (
                                        <Button className="w-full bg-green-500 text-white cursor-not-allowed dark:bg-green-600" disabled>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Resgatado
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
                                            onClick={() => handleRedeemBenefit(product.id, product.redemptionLink)}
                                            disabled={isLoading}
                                        >
                                            <Link className="w-4 h-4 mr-2" /> Resgatar Benefício
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Modal de Confirmação de Remoção de Trilha */}
            <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
                <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Remover Progresso da Trilha</DialogTitle>
                        <DialogDescription>
                            Para confirmar a remoção do progresso da trilha, digite o nome completo da trilha abaixo. Esta ação é irreversível e deduzirá a recompensa associada da sua economia total.
                        </DialogDescription>
                    </DialogHeader>
                    {/* ADICIONADO: Margem inferior para espaçar as labels dos inputs */}
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2"> {/* Alterado para flex-col para colocar Label acima do Input */}
                            <Label htmlFor="trackName" className="text-left dark:text-gray-300">
                                Nome da Trilha: <span className="font-semibold text-blue-400">{trackToRemoveName}</span>
                            </Label>
                            <Input
                                id="trackName"
                                value={confirmTrackName}
                                onChange={(e) => setConfirmTrackName(e.target.value)}
                                className="col-span-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRemoveModalOpen(false)}
                            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                            disabled={isRemovingTrack}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemoveTrack}
                            disabled={isRemovingTrack || confirmTrackName !== trackToRemoveName}
                        >
                            {isRemovingTrack ? 'Removendo...' : 'Confirmar Remoção'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
