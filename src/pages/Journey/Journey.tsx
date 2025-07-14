// src/pages/Journey.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Github, Linkedin, CheckCircle, Clock } from "lucide-react"; // Adicionado Clock
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import trackService, { Track } from '@/services/trackService';
import { useToast } from "@/components/ui/use-toast";

export default function Journey() {
    const navigate = useNavigate();
    const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
    const [inProgressTracks, setInProgressTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated, isLoadingAuth } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchTracks = async () => {
            if (!isLoadingAuth && isAuthenticated) {
                try {
                    setIsLoading(true);
                    const data = await trackService.getTracksForUser();
                    console.log("Tracks fetched from backend:", data); // Para depuração

                    // Filtra as trilhas baseadas no status
                    const available = data.filter(track => track.status === 'available');
                    const inProgress = data.filter(track => track.status === 'in-progress');

                    setAvailableTracks(available);
                    setInProgressTracks(inProgress);
                } catch (e: any) {
                    setError(e.message);
                    console.error("Failed to fetch tracks:", e);
                    toast({
                        title: "Erro ao carregar trilhas",
                        description: e.message || "Não foi possível carregar as trilhas.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            } else if (!isLoadingAuth && !isAuthenticated) {
                setIsLoading(false);
                // Não mostra mais erro persistente na tela, o toast já avisa.
                // setError("Usuário não autenticado. Não foi possível carregar as trilhas.");
                toast({
                    title: "Não autenticado",
                    description: "Por favor, faça login para ver suas trilhas.",
                    variant: "default",
                });
            }
        };

        fetchTracks();
    }, [isAuthenticated, isLoadingAuth, toast]); // Dependências atualizadas

    const handleStartTrack = async (track: Track) => {
        try {
            setIsLoading(true); // Desabilita botões enquanto a requisição está em andamento
            const rewardValue = typeof track.reward_value === 'number' && !isNaN(track.reward_value)
                ? track.reward_value
                : 0;

            await trackService.startTrackAndUnlockReward(track.id, rewardValue);

            // Atualiza os estados locais: move a trilha de 'available' para 'in-progress'
            setAvailableTracks(prev => prev.filter(t => t.id !== track.id));
            setInProgressTracks(prev => [...prev, { ...track, status: 'in-progress' }]);

            toast({
                title: "Trilha iniciada!",
                description: `Você começou a trilha "${track.title}". Boa jornada!`,
                variant: "success",
            });

            // Navega para a página da trilha APÓS o toast
            navigate(track.path);

        } catch (e: any) {
            console.error("Error starting track or unlocking reward:", e);
            toast({
                title: "Erro ao iniciar trilha",
                description: `Não foi possível iniciar a trilha: ${e.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // Reabilita botões
        }
    };

    const handleCompleteTrack = async (trackId: string) => {
        // Encontra a trilha pelo ID para pegar o título para o toast e para remover do estado
        const completedTrack = inProgressTracks.find(t => t.id === trackId);
        if (!completedTrack) {
            toast({
                title: "Erro",
                description: "Trilha não encontrada para concluir.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true); // Desabilita botões
            await trackService.completeTrackAndUnlockReward(trackId);

            // Remove a trilha das trilhas em progresso
            setInProgressTracks(prev => prev.filter(t => t.id !== trackId));

            toast({
                title: "Trilha Concluída!",
                description: `Parabéns! A trilha "${completedTrack.title}" foi marcada como completa.`,
                variant: "success",
            });
            // Não há navegação aqui, a trilha simplesmente some desta lista.
            // Ela aparecerá no dashboard do Students.tsx como concluída.

        } catch (e: any) {
            console.error("Error completing track:", e);
            toast({
                title: "Erro ao concluir trilha",
                description: `Não foi possível marcar a trilha como completa: ${e.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // Reabilita botões
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
            case 'check-circle': // Adicionado para ícone de conclusão
                return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />;
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
                                <CardContent className="p-5 flex flex-col items-start">
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-purple-100 dark:bg-purple-900">
                                        {renderIcon(track.icon_name)}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                                        {track.description}
                                    </p>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
                                        onClick={() => handleStartTrack(track)}
                                        disabled={isLoading} // Desabilita o botão enquanto a requisição está em andamento
                                    >
                                        Desbloquear R$
                                        {typeof track.reward_value === 'number'
                                            ? track.reward_value.toFixed(2)
                                            : '0.00'
                                        }
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
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
                                <CardContent className="p-5 flex flex-col items-start">
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-orange-100 dark:bg-orange-900"> {/* Cor ajustada para 'in-progress' */}
                                        <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" /> {/* Ícone de relógio para 'em progresso' */}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                                        {track.description}
                                    </p>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                                            onClick={() => navigate(track.path)}
                                            disabled={isLoading} // Desabilita o botão
                                        >
                                            Continuar Trilha <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <Button
                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600"
                                            onClick={() => handleCompleteTrack(track.id)}
                                            disabled={isLoading} // Desabilita o botão
                                        >
                                            Marcar como Concluída <CheckCircle className="w-4 h-4 ml-2" />
                                        </Button>
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