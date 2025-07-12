import React, { useEffect, useState, useCallback } from 'react';
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
    ExternalLink, // Import ExternalLink for the button
    Linkedin,
    Link
} from "lucide-react";

import userService from '../services/userService';
import trackService from '@/services/trackService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Interface for student data (maintained)
interface StudentData {
    id: string;
    name: string;
    course: string | null;
    currentSemester: number | null;
    totalSemesters: number | null;
    areasOfInterest: string[];
    totalSaved: number;
    totalPossibleBenefits: number;
    redeemedBenefits: string[];
}

// Interface for a product/benefit (maintained)
interface Product {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    monthlyValueUSD: number;
    redemptionLink: string;
    area: string;
}

// Interface for track data structure (maintained)
interface Track {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string; // Ensure 'path' is included for navigation
    rewardValue: number;
    status: 'available' | 'in-progress' | 'completed';
}

// Mock products (maintained)
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        logoUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=GC',
        description: 'Seu assistente de codificação com IA.',
        monthlyValueUSD: 10,
        redemptionLink: 'https://education.github.com/pack',
        area: 'Full Stack',
    },
    {
        id: 'travis-ci',
        name: 'Travis CI',
        logoUrl: 'https://placehold.co/40x40/FF4E00/FFFFFF?text=TC',
        description: 'Integração contínua e entrega contínua para seus projetos.',
        monthlyValueUSD: 69,
        redemptionLink: 'https://education.github.com/pack',
        area: 'DevOps',
    },
    {
        id: 'mongodb-atlas',
        name: 'MongoDB Atlas',
        logoUrl: 'https://placehold.co/40x40/47A248/FFFFFF?text=MA',
        description: 'Banco de dados NoSQL na nuvem, escalável e flexível.',
        monthlyValueUSD: 25,
        redemptionLink: 'https://education.github.com/pack',
        area: 'Backend',
    },
    {
        id: 'railway',
        name: 'Railway',
        logoUrl: 'https://placehold.co/40x40/0B111A/FFFFFF?text=RW',
        description: 'Plataforma de deploy para suas aplicações.',
        monthlyValueUSD: 50,
        redemptionLink: 'https://education.github.com/pack',
        area: 'Backend',
    },
    {
        id: 'netlify',
        name: 'Netlify',
        logoUrl: 'https://placehold.co/40x40/00C7B7/FFFFFF?text=NF',
        description: 'Plataforma para deploy e hospedagem de frontends modernos.',
        monthlyValueUSD: 19,
        redemptionLink: 'https://education.github.com/pack',
        area: 'Frontend',
    },
    {
        id: 'digitalocean',
        name: 'DigitalOcean',
        logoUrl: 'https://placehold.co/40x40/0080FF/FFFFFF?text=DO',
        description: 'Créditos para VMs, bancos de dados e mais na nuvem.',
        monthlyValueUSD: 100,
        redemptionLink: 'https://education.github.com/pack',
        area: 'DevOps',
    },
];

export default function Students() {
    const { userName, githubLogin, isAuthenticated, isLoadingAuth } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // States for general counters (maintained)
    const [totalStudentsCount, setTotalStudentsCount] = useState<number | string>('...');
    const [loadingTotalStudents, setLoadingTotalStudents] = useState<boolean>(true);
    const [errorTotalStudents, setErrorTotalStudents] = useState<string | null>(null);

    const [githubStudentsCount, setGithubStudentsCount] = useState<number | string>('...');
    const [loadingGithubStudents, setLoadingGithubStudents] = useState<boolean>(true);
    const [errorGithubStudents, setErrorGithubStudents] = useState<string | null>(null);

    const [activeBenefitsCount, setActiveBenefitsCount] = useState<number | string>('...');
    const [loadingActiveBenefits, setLoadingActiveBenefits] = useState<boolean>(true);
    const [errorActiveBenefits, setErrorActiveBenefits] = useState<string | null>(null);

    const [pendingStudentsCount, setPendingStudentsCount] = useState<number | string>('...');
    const [loadingPendingStudents, setLoadingPendingStudents] = useState<boolean>(true);
    const [errorPendingStudents, setErrorPendingStudents] = useState<string | null>(null);

    // New states for student dashboard data
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [loadingStudentData, setLoadingStudentData] = useState<boolean>(true);
    const [errorStudentData, setErrorStudentData] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // NEW STATES FOR TRACKS
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [completedTracks, setCompletedTracks] = useState<Track[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [errorTracks, setErrorTracks] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Calculation functions (reused from StudentDashboard) - Maintained for other calculations if necessary
    const calculateRemainingMonths = useCallback((current: number | null, total: number | null) => {
        if (current === null || total === null || isNaN(current) || isNaN(total) || total <= 0 || current > total) {
            return 0;
        }
        return (total - current) * 6;
    }, []);

    const calculateTotalPossibleBenefits = useCallback((areas: string[], remainingMonths: number) => {
        let total = 0;
        areas.forEach(area => {
            const productsInArea = MOCK_PRODUCTS.filter(p => p.area === area);
            total += productsInArea.reduce((sum, product) => sum + (product.monthlyValueUSD * remainingMonths), 0);
        });
        return total;
    }, []);

    // Effect to fetch general counters (maintained)
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

            try {
                setLoadingActiveBenefits(true);
                const count = await userService.getStudentsWithActiveBenefitsCount();
                setActiveBenefitsCount(count);
            } catch (err: any) {
                console.error('Error fetching students with active benefits:', err);
                setErrorActiveBenefits('N/A');
            } finally {
                setLoadingActiveBenefits(false);
            }

            try {
                setLoadingPendingStudents(true);
                const count = await userService.getPendingStudentsCount();
                setPendingStudentsCount(count);
            } catch (err: any) {
                console.error('Error fetching pending students:', err);
                setErrorPendingStudents('N/A');
            } finally {
                setLoadingPendingStudents(false);
            }
        };
        fetchCounts();
    }, []);

    // New useEffect to fetch logged-in student dashboard data
    useEffect(() => {
        const fetchStudentDashboardData = async () => {
            if (!isAuthenticated || isLoadingAuth) {
                if (!isLoadingAuth) {
                    navigate('/');
                }
                return;
            }

            setLoadingStudentData(true);
            try {
                const data: StudentData = await userService.getStudentDashboardData();
                console.log('Students.tsx (Dashboard): Data received from userService.getStudentDashboardData:', JSON.stringify(data, null, 2));

                if (!data.course || String(data.course).trim() === '' || data.currentSemester === null || data.totalSemesters === null || data.areasOfInterest.length === 0) {
                    console.log('Students.tsx (Dashboard): Incomplete onboarding data, redirecting to /onboarding.');
                    navigate('/onboarding');
                    return;
                }

                const FIXED_HIGH_BENEFITS_VALUE = 200000;

                const updatedData = { ...data, totalPossibleBenefits: FIXED_HIGH_BENEFITS_VALUE };
                setStudentData(updatedData);

                const products = MOCK_PRODUCTS.filter(product =>
                    data.areasOfInterest.includes(product.area)
                );
                setFilteredProducts(products);

            } catch (err: any) {
                console.error("Error loading student dashboard data:", err);
                setErrorStudentData("Could not load your dashboard data.");
                toast({
                    title: "Error loading data",
                    description: "Check your connection or try again.",
                    variant: "destructive",
                });
            } finally {
                setLoadingStudentData(false);
            }
        };

        fetchStudentDashboardData();
    }, [isAuthenticated, isLoadingAuth, calculateRemainingMonths, calculateTotalPossibleBenefits, toast, navigate]);


    // NEW useEffect to fetch TRACKS (maintained)
    useEffect(() => {
        const fetchTracks = async () => {
            if (!isLoadingAuth && isAuthenticated) {
                try {
                    setLoadingTracks(true);
                    const data = await trackService.getTracksForUser();
                    setAllTracks(data);
                    setCompletedTracks(data.filter(track => track.status === 'completed'));
                } catch (e: any) {
                    setErrorTracks(e.message);
                    console.error("Failed to fetch tracks for dashboard:", e);
                } finally {
                    setLoadingTracks(false);
                }
            } else if (!isLoadingAuth && !isAuthenticated) {
                setLoadingTracks(false);
                setErrorTracks("User not authenticated. Could not load tracks.");
            }
        };

        fetchTracks();
    }, [isAuthenticated, isLoadingAuth]);


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

            setStudentData(prev => {
                if (!prev) return null;
                const newTotalSaved = prev.totalSaved + (redeemedProduct.monthlyValueUSD * monthsRemaining);

                return {
                    ...prev,
                    redeemedBenefits: [...prev.redeemedBenefits, productId],
                    totalSaved: newTotalSaved,
                };
            });
            toast({
                title: "Benefit Redeemed!",
                description: "Benefit status updated successfully.",
                variant: "success",
            });

            window.open(redemptionLink, '_blank');

        } catch (error: any) {
            console.error("Error redeeming benefit:", error);
            toast({
                title: "Error Redeeming",
                description: `Failed to update benefit: ${error.message || 'Unknown error'}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to render track icons (maintained)
    const renderTrackIcon = (iconName: string) => {
        switch (iconName) {
            case 'github':
                return <Github className="w-5 h-5 text-purple-600 dark:text-purple-300" />;
            case 'linkedin':
                return <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-300" />;
            case 'arrow-right':
                return <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-300" />;
            // Add 'ExternalLink' for consistency if you use it directly as an icon name.
            case 'external-link':
                return <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
            default:
                return <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
        }
    };

    // Conditional rendering for loading and errors (maintained)
    if (loadingStudentData || loadingTracks) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-gray-700 dark:text-gray-300">Carregando sua dashboard e trilhas...</p>
            </div>
        );
    }

    if (errorStudentData || errorTracks) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-red-500">
                    Erro ao carregar dados: {errorStudentData || errorTracks}
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

    // Calculation of benefits saving progress (maintained)
    const benefitsProgressPercentage = studentData.totalPossibleBenefits > 0
        ? (studentData.totalSaved / studentData.totalPossibleBenefits) * 100
        : 0;

    // Calculation of track progress (maintained)
    const totalTracksCount = allTracks.length;
    const completedTracksCount = completedTracks.length;
    const trackProgressPercentage = totalTracksCount > 0
        ? (completedTracksCount / totalTracksCount) * 100
        : 0;


    return (
        <div className="space-y-6 p-6 mt-14 max-w-6xl mx-auto">
            {/* Dashboard Header (maintained) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        Olá, {userName || 'Estudante'}!
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                        Bem-vindo(a) à sua dashboard Estudamais.tech.
                    </p>
                    <p className="text-md text-gray-500 dark:text-gray-400">
                        Curso: <span className="font-semibold">{studentData.course || 'N/A'}</span> | Semestre: <span className="font-semibold">{studentData.currentSemester || 'N/A'}/{studentData.totalSemesters || 'N/A'}</span> | Área(s): <span className="font-semibold">{studentData.areasOfInterest.join(', ') || 'N/A'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
                    <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">@{githubLogin || 'N/A'}</span>
                </div>
            </div>

            {/* General counter cards (maintained) */}
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
                                    {loadingActiveBenefits ? '...' : errorActiveBenefits ? errorActiveBenefits : activeBenefitsCount.toLocaleString('pt-BR')}
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
                                <p className="text-sm text-gray-400">Pendentes</p>
                                <p className="text-2xl font-bold">
                                    {loadingPendingStudents ? '...' : errorPendingStudents ? errorPendingStudents : pendingStudentsCount.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TRACK JOURNEY PROGRESS SECTION (maintained) */}
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

            {/* Savings and Benefits Section - Gauge Meter (maintained) */}
            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                <CardContent className="p-6 text-start">
                    <CardTitle className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-green-500" /> Sua Economia de Benefícios
                    </CardTitle>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        Você já desbloqueou: <span className="font-extrabold text-green-500">${studentData.totalSaved.toLocaleString('en-US')}</span> de <span className="font-extrabold text-blue-500">${studentData.totalPossibleBenefits.toLocaleString('en-US')}</span> disponíveis
                    </p>
                    <Progress value={benefitsProgressPercentage} className="w-full h-2 bg-gray-300 dark:bg-gray-600 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-blue-500 [&::-webkit-progress-value]:to-green-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Progresso: {benefitsProgressPercentage.toFixed(2)}%
                    </p>
                </CardContent>
            </Card>

            {/* NEW SECTION: Completed Tracks */}
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
                                <CardContent className="p-5 flex flex-col items-start min-h-full justify-between"> {/* ADDED min-h and justify-between */}
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-green-100 dark:bg-green-900">
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                                        {track.description}
                                    </p>
                                    <Badge variant="default" className="bg-green-500 text-white dark:bg-green-700 mb-4">Concluída</Badge>
                                    {/* ADDED BUTTON */}
                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
                                        onClick={() => navigate(track.path)} // Assuming track.path is the route to the track details
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" /> Ver Trilha
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}
            {/* End of NEW SECTION: Completed Tracks */}

            {/* Product Recommendations Section (maintained) */}
            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-bold dark:text-white">Recomendações de Produtos para sua Área</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                        Baseado em sua(s) área(s) de interesse ({studentData.areasOfInterest.join(', ') || 'N/A'}).
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
                                    {studentData.redeemedBenefits.includes(product.id) ? (
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
        </div>
    );
}