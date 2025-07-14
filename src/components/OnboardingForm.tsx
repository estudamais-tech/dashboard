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
import { useAuth } from '../hooks/useAuth';

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

  const [currentSemesterError, setCurrentSemesterError] = useState<string | null>(null);
  const [totalSemestersError, setTotalSemestersError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthStatus } = useAuth();

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

  useEffect(() => {
    const current = parseInt(currentSemester);
    const total = parseInt(totalSemesters);

    if (!isNaN(current) && current > 0 && !isNaN(total) && total > 0 && current <= total) {
      const semestersRemaining = total - current;
      setRemainingMonths(semestersRemaining * 6);
    } else {
      setRemainingMonths(null);
    }
  }, [currentSemester, totalSemesters]);

  // Função de validação para os inputs de número
  const validateNumberInput = (value: string, fieldName: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} deve ser um número inteiro positivo.`;
    }
    return null;
  };

  const ALL_TECH_INTEREST_AREAS = [
    'Backend Development', 'Frontend Development', 'Full Stack Development', 'DevOps',
    'Mobile Development (Android/iOS)', 'Data Science & Analytics',
    'Artificial Intelligence (AI) / Machine Learning (ML)', 'Cybersecurity',
    'Cloud Computing (AWS, Azure, GCP)', 'Game Development', 'UI/UX Design',
    'Embedded Systems', 'Network Engineering', 'Database Administration',
    'Quality Assurance (QA)', 'Project Management (Tech)', 'Product Management (Tech)',
    'Robotics', 'Blockchain', 'IoT (Internet of Things)', 'Big Data',
    'Virtual Reality (VR) / Augmented Reality (AR)', 'Quantum Computing',
    'Outro (Tecnologia)',
  ];

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

    let hasError = false;

    // Validação de Semestre Atual (positivo e não zero)
    const currentSemError = validateNumberInput(currentSemester, 'Semestre Atual');
    setCurrentSemesterError(currentSemError);
    if (currentSemError) hasError = true;

    // Validação de Total de Semestres (positivo e não zero)
    const totalSemError = validateNumberInput(totalSemesters, 'Total de Semestres');
    setTotalSemestersError(totalSemError);
    if (totalSemError) hasError = true;

    // Se houver erros básicos de "não é número ou é <= 0", pare aqui
    if (hasError) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha os campos de semestre com números inteiros positivos.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validação adicional: semestre atual não pode ser maior que o total de semestres
    const current = parseInt(currentSemester);
    const total = parseInt(totalSemesters);

    if (current > total) {
      setCurrentSemesterError("Semestre atual não pode ser maior que o total de semestres.");
      setTotalSemestersError("Total de semestres não pode ser menor que o semestre atual.");
      toast({
        title: "Erro de Validação",
        description: "O semestre atual não pode ser maior que o total de semestres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }


    const data: OnboardingData = {
      course,
      currentSemester: current,
      totalSemesters: total,
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
      className="relative flex justify-center items-center min-h-screen font-sans overflow-hidden p-4 sm:p-6 lg:p-8"
      style={{
        backgroundColor: getBackgroundColor(),
        backgroundImage: `
          linear-gradient(to right, ${getGridColor()} 1px, transparent 1px),
          linear-gradient(to bottom, ${getGridColor()} 1px, transparent 1px)
        `,
        backgroundSize: '45px 45px'
      }}
    >
      {/* Elemento de fundo com blur (z-index baixo) */}
      <div
        className="w-[80%] h-[25vh] rounded-[50%] bg-[#00A895] absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ filter: "blur(200px) " }}
      ></div>

      {/* Efeito de grão (z-index baixo) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url(https://beserragoadv.com/images/Grain-effect-3.gif)',
          backgroundPosition: '0px 0px',
          backgroundSize: 'auto',
          mixBlendMode: theme === 'dark' ? 'overlay' : 'soft-light',
          opacity: theme === 'dark' ? 0.15 : 0.08,
        }}
      ></div>

      {/* Logo grande no centro do background com opacidade baixa */}
      <img
        src="/img/icons/logo.webp"
        alt="Logo de fundo suave"
        className="absolute mx-auto w-[40vw] inset-0 mt-28 object-contain opacity-5 pointer-events-none z-[2]" // Alterado z-index para 2
      />

      {/* Container relativo para o Card (o formulário), com o z-index mais alto */}
      <div className="relative w-full max-w-3xl xl:max-w-4xl z-[3]">
        <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-lg p-4 md:p-8 lg:p-10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold dark:text-white">Bem-vindo(a) à Estudamais.tech!</CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Por favor, preencha algumas informações para personalizar sua experiência.</p>
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
                  className="dark:bg-gray-900 dark:text-white dark:border-gray-600 mt-1 focus-visible:ring-0 focus-visible:ring-offset-0" // Adicionado para remover outline
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
                    onChange={(e) => {
                      // Permite limpar o campo para digitar, mas valida no submit
                      setCurrentSemester(e.target.value);
                      // Limpa o erro assim que o usuário começa a digitar novamente
                      setCurrentSemesterError(null);
                    }}
                    onBlur={() => { // Adicionado onBlur para validar ao sair do campo
                        setCurrentSemesterError(validateNumberInput(currentSemester, 'Semestre Atual'));
                    }}
                    required
                    className={`dark:bg-gray-900 dark:text-white dark:border-gray-600 mt-1 focus-visible:ring-0 focus-visible:ring-offset-0 ${currentSemesterError ? 'border-red-500' : ''}`}
                  />
                  {currentSemesterError && (
                    <p className="text-red-500 text-xs mt-1">{currentSemesterError}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalSemesters" className="dark:text-gray-200">Quantos semestres o curso possui?</Label>
                  <Input
                    id="totalSemesters"
                    type="number"
                    placeholder="Ex: 6"
                    min="1"
                    value={totalSemesters}
                    onChange={(e) => {
                        // Permite limpar o campo para digitar, mas valida no submit
                        setTotalSemesters(e.target.value);
                        // Limpa o erro assim que o usuário começa a digitar novamente
                        setTotalSemestersError(null);
                    }}
                    onBlur={() => { // Adicionado onBlur para validar ao sair do campo
                        setTotalSemestersError(validateNumberInput(totalSemesters, 'Total de Semestres'));
                    }}
                    required
                    className={`dark:bg-gray-900 dark:text-white dark:border-gray-600 mt-1 focus-visible:ring-0 focus-visible:ring-offset-0 ${totalSemestersError ? 'border-red-500' : ''}`}
                  />
                  {totalSemestersError && (
                    <p className="text-red-500 text-xs mt-1">{totalSemestersError}</p>
                  )}
                </div>
              </div>

              {remainingMonths !== null && (
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Faltam aproximadamente <span className="font-semibold">{remainingMonths} meses</span> para concluir seu curso.
                </p>
              )}

              {/* Área de Interesse */}
              <div>
                <Label className="dark:text-gray-200 mb-2 block">Área(s) de Interesse</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {ALL_TECH_INTEREST_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={areasOfInterest.includes(area)}
                        onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                        className="dark:border-gray-500 data-[state=checked]:dark:bg-blue-600 data-[state=checked]:dark:text-white"
                      />
                      <Label htmlFor={area} className="dark:text-gray-300 text-sm cursor-pointer">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-md mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Começar a Explorar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}