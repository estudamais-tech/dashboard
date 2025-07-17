// src/pages/Journey.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Github, Linkedin, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import trackService, { Track } from '@/services/trackService';
import userService from '@/services/userService'; // Import userService
import { useToast } from "@/components/ui/use-toast";

export default function Journey() {
    const navigate = useNavigate();
    const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
    const [inProgressTracks, setInProgressTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userTotalSaved, setUserTotalSaved] = useState<number>(0); // New state for user's total saved
    const MAX_INVESTMENT_LIMIT = 3000; // Define the investment limit

    const { isAuthenticated, isLoadingAuth } = useAuth();
    const { toast } = useToast();

    // Function to fetch all necessary data
    const fetchAllData = async () => {
        if (!isLoadingAuth && isAuthenticated) {
            try {
                setIsLoading(true);
                // Fetch user-specific data to get totalSaved
                const studentData = await userService.getStudentDashboardData();
                setUserTotalSaved(studentData.totalSaved || 0);
                console.log("fetchAllData: Fetched userTotalSaved:", studentData.totalSaved); // Debugging log
                console.log("fetchAllData: Current MAX_INVESTMENT_LIMIT:", MAX_INVESTMENT_LIMIT); // Debugging log

                // Fetch tracks for the user
                const { tracks: fetchedTracks } = await trackService.getTracksForUser();
                
                const available = fetchedTracks.filter(track => track.status === 'available');
                const inProgress = fetchedTracks.filter(track => track.status === 'in-progress');

                setAvailableTracks(available);
                setInProgressTracks(inProgress);
            } catch (e: any) {
                setError(e.message);
                console.error("Failed to fetch tracks or user data:", e);
                toast({
                    title: "Erro ao carregar dados",
                    description: e.message || "Não foi possível carregar as informações.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        } else if (!isLoadingAuth && !isAuthenticated) {
            setIsLoading(false);
            toast({
                title: "Não autenticado",
                description: "Por favor, faça login para ver suas trilhas.",
                variant: "default",
            });
        }
    };

    useEffect(() => {
        fetchAllData(); // Initial data fetch
    }, [isAuthenticated, isLoadingAuth, toast]);

    const handleStartTrack = async (track: Track) => {
        const trackReward = typeof track.reward_value === 'number' && !isNaN(track.reward_value) ? track.reward_value : 0;
        const potentialNewTotalSaved = userTotalSaved + trackReward;

        console.log("handleStartTrack: userTotalSaved BEFORE check:", userTotalSaved); // Debugging log
        console.log("handleStartTrack: trackReward:", trackReward); // Debugging log
        console.log("handleStartTrack: potentialNewTotalSaved:", potentialNewTotalSaved); // Debugging log
        console.log("handleStartTrack: MAX_INVESTMENT_LIMIT:", MAX_INVESTMENT_LIMIT); // Debugging log

        if (potentialNewTotalSaved > MAX_INVESTMENT_LIMIT) {
            console.log("handleStartTrack: LIMIT EXCEEDED. Preventing action."); // Debugging log
            toast({
                title: "Limite de Investimento Atingido!",
                description: `Você já atingiu o limite de US$ ${MAX_INVESTMENT_LIMIT.toFixed(2)}. Para adicionar uma nova trilha, por favor, remova uma trilha existente do seu cartão de estudante.`,
                variant: "destructive",
            });
            return; // Prevent starting the track
        }
        console.log("handleStartTrack: LIMIT NOT EXCEEDED. Proceeding with action."); // Debugging log

        try {
            setIsLoading(true);
            await trackService.startTrackAndUnlockReward(track.id, trackReward);

            // Re-fetch all data to ensure UI is updated with latest totalSaved and track statuses
            await fetchAllData();

            toast({
                title: "Trilha iniciada!",
                description: `Você começou a trilha "${track.title}". Boa jornada!`,
                variant: "success",
            });

            navigate(track.path);

        } catch (e: any) {
            console.error("Error starting track or unlocking reward:", e);
            toast({
                title: "Erro ao iniciar trilha",
                description: `Não foi possível iniciar a trilha: ${e.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteTrack = async (trackId: string) => {
        const completedTrack = inProgressTracks.find(t => t.id === trackId);
        if (!completedTrack) {
            toast({
                title: "Erro",
                description: "Trilha não encontrada para concluir.",
                variant: "destructive",
            });
            return;
        }

        const trackReward = typeof completedTrack.reward_value === 'number' && !isNaN(completedTrack.reward_value) ? completedTrack.reward_value : 0;
        const potentialNewTotalSaved = userTotalSaved + trackReward;

        console.log("handleCompleteTrack: userTotalSaved BEFORE check:", userTotalSaved); // Debugging log
        console.log("handleCompleteTrack: trackReward:", trackReward); // Debugging log
        console.log("handleCompleteTrack: potentialNewTotalSaved:", potentialNewTotalSaved); // Debugging log
        console.log("handleCompleteTrack: MAX_INVESTMENT_LIMIT:", MAX_INVESTMENT_LIMIT); // Debugging log

        if (potentialNewTotalSaved > MAX_INVESTMENT_LIMIT) {
            console.log("handleCompleteTrack: LIMIT EXCEEDED. Preventing action."); // Debugging log
            toast({
                title: "Limite de Investimento Atingido!",
                description: `Concluir esta trilha excederia o limite de US$ ${MAX_INVESTMENT_LIMIT.toFixed(2)}. Para adicionar uma nova trilha, por favor, remova uma trilha existente do seu cartão de estudante.`,
                variant: "destructive",
            });
            return; // Prevent completing the track if it would exceed the limit
        }
        console.log("handleCompleteTrack: LIMIT NOT EXCEEDED. Proceeding with action."); // Debugging log

        try {
            setIsLoading(true);
            await trackService.completeTrackAndUnlockReward(trackId);

            // Re-fetch all data to ensure UI is updated with latest totalSaved and track statuses
            await fetchAllData();

            toast({
                title: "Trilha Concluída!",
                description: `Parabéns! A trilha "${completedTrack.title}" foi marcada como completa.`,
                variant: "success",
            });

        } catch (e: any) {
            console.error("Error completing track:", e);
            toast({
                title: "Erro ao concluir trilha",
                description: `Não foi possível marcar a trilha como completa: ${e.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'github':
                return <Github className="w-6 h-6 text-purple-600 dark:text-purple-300" />;
            case 'linkedin':
                return <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-300" />;
            case 'arrow-right':
                return <ArrowRight className="w-6 h-6 text-green-600 dark:text-green-300" />;
            case 'check-circle':
                return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />;
            case 'code': // Added for JetBrains
                return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code w-6 h-6 text-purple-600 dark:text-purple-300"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
            case 'cloud': // Added for AWS Educate
                return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud w-6 h-6 text-blue-600 dark:text-blue-300"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
            case 'bar-chart-2': // Added for Tableau
                return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 w-6 h-6 text-green-600 dark:text-green-300"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20V14"/></svg>;
            case 'layout': // Added for Figma
                return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout w-6 h-6 text-orange-600 dark:text-orange-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>;
            default:
                return <ArrowRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
        }
    };

    if (isLoadingAuth) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <p className="text-xl text-gray-700 dark:text-gray-300">Verificando autenticação e carregando trilhas...</p>
        </div>;
    }

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <p className="text-xl text-gray-700 dark:text-gray-300">Carregando trilhas...</p>
        </div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500 dark:text-red-400">
            <p>Ocorreu um erro: {error}</p>
            <p>Por favor, tente novamente mais tarde.</p>
        </div>;
    }

    return (
        <div className="space-y-8 p-6 mt-14 max-w-6xl mx-auto">
            <div className="text-start mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-start gap-3">
                    <Trophy className="w-10 h-10 text-yellow-500" /> Jornada Gamificada
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    Acompanhe seu progresso e libere mais investimentos em sua carreira!
                </p>
            </div>

            {availableTracks.length > 0 && (
                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold dark:text-white">Trilhas Disponíveis</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300">
                            Escolha uma trilha para começar a aprender e desbloquear benefícios.
                        </p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableTracks.map((track) => (
                            <Card key={track.id} className="dark:bg-gray-900 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-5 flex flex-col items-start justify-between  h-full">
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-purple-100 dark:bg-purple-900">
                                        {renderIcon(track.icon_name)}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow"> {/* Adicionado flex-grow */}
                                        {track.description}
                                    </p>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
                                        onClick={() => handleStartTrack(track)}
                                        disabled={isLoading || userTotalSaved >= MAX_INVESTMENT_LIMIT} // Disable if limit reached
                                    >
                                        Desbloquear US$
                                        {typeof track.reward_value === 'number'
                                            ? track.reward_value.toFixed(2)
                                            : '0.00'
                                        }
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    {userTotalSaved >= MAX_INVESTMENT_LIMIT && (
                                        <p className="text-red-500 text-xs mt-2 text-center w-full">
                                            Limite de investimento atingido! Para adicionar uma nova trilha, por favor, remova uma trilha existente.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {inProgressTracks.length > 0 && (
                <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold dark:text-white">Trilhas em Progresso</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300">
                            Continue de onde parou e conquiste mais benefícios.
                        </p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inProgressTracks.map((track) => (
                            <Card key={track.id} className="dark:bg-gray-900 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-5 flex flex-col items-start justify-between">
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-orange-100 dark:bg-orange-900">
                                        <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow"> {/* Adicionado flex-grow */}
                                        {track.description}
                                    </p>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                                            onClick={() => navigate(track.path)}
                                            disabled={isLoading}
                                        >
                                            Continuar Trilha <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <Button
                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600"
                                            onClick={() => handleCompleteTrack(track.id)}
                                            disabled={isLoading || userTotalSaved >= MAX_INVESTMENT_LIMIT} // Disable if limit reached
                                        >
                                            Marcar como Concluída <CheckCircle className="w-4 h-4 ml-2" />
                                        </Button>
                                        {userTotalSaved >= MAX_INVESTMENT_LIMIT && (
                                            <p className="text-red-500 text-xs mt-2 text-center w-full">
                                                Limite de investimento atingido! Para adicionar uma nova trilha, por favor, remova uma trilha existente.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {availableTracks.length === 0 && inProgressTracks.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        Nenhuma trilha disponível ou em progresso no momento. Volte mais tarde!
                    </p>
                </div>
            )}
        </div>
    );
}
