import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import userService from '../services/userService';
// AJUSTE: Corrigido o caminho do import para o hook useAuth
import { useAuth } from '../hooks/useAuth'; // Importa o hook useAuth

interface OnboardingData {
  course: string;
  currentSemester: number;
  totalSemesters: number;
  areasOfInterest: string[];
}

export default function OnboardingForm() {
  const [course, setCourse] = useState<string>('');
  const [currentSemester, setCurrentSemester] = useState<string>('');
  const [totalSemesters, setTotalSemesters] = useState<string>('');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [remainingMonths, setRemainingMonths] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthStatus } = useAuth();

  // Estados e funções para o tema e efeitos de fundo (copiado do Login.tsx)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const getGridColor = () => {
    return theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  };

  const getBackgroundColor = () => {
    return theme === 'dark' ? '#081814' : '#F8F8F8';
  };
  // Fim dos estados e funções para o tema e efeitos de fundo

  useEffect(() => {
    const current = parseInt(currentSemester);
    const total = parseInt(totalSemesters);

    if (!isNaN(current) && !isNaN(total) && total > 0 && current <= total) {
      const semestersRemaining = total - current;
      setRemainingMonths(semestersRemaining * 6);
    } else {
      setRemainingMonths(null);
    }
  }, [currentSemester, totalSemesters]);

  // Lista de áreas de interesse tech mais abrangente
  const ALL_TECH_INTEREST_AREAS = [
    'Backend Development',
    'Frontend Development',
    'Full Stack Development',
    'DevOps',
    'Mobile Development (Android/iOS)',
    'Data Science & Analytics',
    'Artificial Intelligence (AI) / Machine Learning (ML)',
    'Cybersecurity',
    'Cloud Computing (AWS, Azure, GCP)',
    'Game Development',
    'UI/UX Design',
    'Embedded Systems',
    'Network Engineering',
    'Database Administration',
    'Quality Assurance (QA)',
    'Project Management (Tech)',
    'Product Management (Tech)',
    'Robotics',
    'Blockchain',
    'IoT (Internet of Things)',
    'Big Data',
    'Virtual Reality (VR) / Augmented Reality (AR)',
    'Quantum Computing',
    'Outro (Tecnologia)', // Opção para outras áreas tech
  ];

  // Função para lidar com a mudança nos checkboxes de área de interesse
  const handleAreaChange = (area: string, checked: boolean) => {
    console.log(`[OnboardingForm] handleAreaChange: Area: ${area}, Checked: ${checked}`);
    setAreasOfInterest((prev) => {
      const newAreas = checked
        ? [...prev, area]
        : prev.filter((a) => a !== area);
      console.log(`[OnboardingForm] handleAreaChange: New areasOfInterest state: ${JSON.stringify(newAreas)}`);
      return newAreas;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data: OnboardingData = {
      course,
      currentSemester: parseInt(currentSemester),
      totalSemesters: parseInt(totalSemesters),
      areasOfInterest,
    };

    console.log(`[OnboardingForm] handleSubmit: Data being sent to backend: ${JSON.stringify(data)}`);

    try {
      await userService.saveOnboardingData(data);
      toast({
        title: "Sucesso!",
        description: "Seus dados de onboarding foram salvos.",
        variant: "success",
      });
      await checkAuthStatus();
      // A navegação para o dashboard é gerenciada pelo AuthContext.tsx após checkAuthStatus
    } catch (error: any) {
      console.error("Erro ao salvar dados de onboarding:", error);
      toast({
        title: "Erro",
        description: `Falha ao salvar seus dados: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="relative flex justify-center items-center min-h-screen font-sans overflow-hidden p-4"
      style={{
        backgroundColor: getBackgroundColor(),
        backgroundImage: `
          linear-gradient(to right, ${getGridColor()} 1px, transparent 1px),
          linear-gradient(to bottom, ${getGridColor()} 1px, transparent 1px)
        `,
        backgroundSize: '45px 45px'
      }}
    >
      <div
        className="w-[80%] h-[25vh] rounded-[50%] bg-[#00A895] absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ filter: "blur(200px) " }}
      ></div>
      {/* Efeito de grão */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(https://beserragoadv.com/images/Grain-effect-3.gif)',
          backgroundPosition: '0px 0px',
          backgroundSize: 'auto',
          mixBlendMode: theme === 'dark' ? 'overlay' : 'soft-light',
          opacity: theme === 'dark' ? 0.15 : 0.08,
        }}
      ></div>

      <Card className="w-full max-w-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-lg z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold dark:text-white">Bem-vindo(a) à Estudamais.tech!</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">Por favor, preencha algumas informações para personalizar sua experiência.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Curso */}
            <div>
              <Label htmlFor="course" className="dark:text-gray-200">Curso</Label>
              <Input
                id="course"
                type="text"
                placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Campos Semestre Atual e Total de Semestres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentSemester" className="dark:text-gray-200">Em qual semestre você está?</Label>
                <Input
                  id="currentSemester"
                  type="number"
                  placeholder="Ex: 3"
                  min="1"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  required
                  className="dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="totalSemesters" className="dark:text-gray-200">Quantos semestres o curso possui?</Label>
                <Input
                  id="totalSemesters"
                  type="number"
                  placeholder="Ex: 6"
                  min="1"
                  value={totalSemesters}
                  onChange={(e) => setTotalSemesters(e.target.value)}
                  required
                  className="dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            {/* Exibe meses restantes se calculados */}
            {remainingMonths !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Faltam aproximadamente <span className="font-semibold">{remainingMonths} meses</span> para concluir seu curso.
              </p>
            )}

            {/* Área de Interesse - Agora com Checkboxes novamente */}
            <div>
              <Label className="dark:text-gray-200 mb-2 block">Área(s) de Interesse</Label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2"> {/* Adicionado scroll para muitas opções */}
                {ALL_TECH_INTEREST_AREAS.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={areasOfInterest.includes(area)}
                      onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                      className="dark:border-gray-500 data-[state=checked]:dark:bg-blue-600 data-[state=checked]:dark:text-white"
                    />
                    <Label htmlFor={area} className="dark:text-gray-300">{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-md" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Começar a Explorar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
