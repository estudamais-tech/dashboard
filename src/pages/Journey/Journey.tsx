import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Github, Linkedin, CheckCircle } from "lucide-react"; // Import CheckCircle icon
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import trackService from '@/services/trackService';

// Define a interface para a estrutura dos dados da trilha
interface Track {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
    rewardValue: number;
    status: 'available' | 'in-progress' | 'completed';
}

export default function Journey() {
    const navigate = useNavigate();
    const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
    const [inProgressTracks, setInProgressTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated, isLoadingAuth } = useAuth();

    // useEffect para buscar as trilhas do backend
    useEffect(() => {
        const fetchTracks = async () => {
            if (!isLoadingAuth && isAuthenticated) {
                try {
                    setIsLoading(true);
                    const data = await trackService.getTracksForUser();

                    setAvailableTracks(data.filter(track => track.status === 'available'));
                    setInProgressTracks(data.filter(track => track.status === 'in-progress'));
                } catch (e: any) {
                    setError(e.message);
                    console.error("Failed to fetch tracks:", e);
                } finally {
                    setIsLoading(false);
                }
            } else if (!isLoadingAuth && !isAuthenticated) {
                setIsLoading(false);
                setError("Usuário não autenticado. Não foi possível carregar as trilhas.");
            }
        };

        fetchTracks();
    }, [isAuthenticated, isLoadingAuth]);

    const handleStartTrack = async (track: Track) => {
        try {
            const rewardValueAsNumber = parseFloat(track.rewardValue.toString());
            if (isNaN(rewardValueAsNumber)) {
                throw new Error("Valor de recompensa inválido.");
            }
            await trackService.startTrackAndUnlockReward(track.id, rewardValueAsNumber);

            setAvailableTracks(prev => prev.filter(t => t.id !== track.id));
            setInProgressTracks(prev => [...prev, { ...track, status: 'in-progress' }]);

            navigate(track.path);

        } catch (e: any) {
            console.error("Error starting track or unlocking reward:", e);
            alert(`Erro ao iniciar a trilha: ${e.message}`);
        }
    };

    // --- NOVA FUNÇÃO: Marcar Trilha como Completa ---
    const handleCompleteTrack = async (trackId: string) => {
        try {
            await trackService.completeTrack(trackId); // Chama o novo método no service

            // Remove a trilha da lista de "Em Progresso"
            setInProgressTracks(prev => prev.filter(t => t.id !== trackId));

            // Opcional: Se você tiver uma lista de trilhas "Completas" no frontend, adicione-a aqui.
            // setCompletedTracks(prev => [...prev, { ...track, status: 'completed' }]);

            alert("Trilha marcada como completa com sucesso!");
        } catch (e: any) {
            console.error("Error completing track:", e);
            alert(`Erro ao marcar a trilha como completa: ${e.message}`);
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
            default:
                return <ArrowRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
        }
    };

    if (isLoadingAuth) {
        return <div className="text-center mt-20 dark:text-white">Verificando autenticação e carregando trilhas...</div>;
    }

    if (isLoading) {
        return <div className="text-center mt-20 dark:text-white">Carregando trilhas...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500 dark:text-red-400">Erro ao carregar trilhas: {error}</div>;
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
                                        {renderIcon(track.icon)}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                                        {track.description}
                                    </p>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
                                        onClick={() => handleStartTrack(track)}
                                    >
                                        Desbloquear R${typeof track.rewardValue === 'number' ? track.rewardValue.toFixed(2) : parseFloat(track.rewardValue as any || '0').toFixed(2)} <ArrowRight className="w-4 h-4 ml-2" />
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
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-green-100 dark:bg-green-900">
                                        {renderIcon(track.icon)}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                                        {track.description}
                                    </p>
                                    <div className="flex flex-col gap-2 w-full"> {/* Adicionado um container para os botões */}
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                                            onClick={() => navigate(track.path)}
                                        >
                                            Continuar Trilha <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <Button
                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600"
                                            onClick={() => handleCompleteTrack(track.id)} // Chamada para a nova função
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
        </div>
    );
}