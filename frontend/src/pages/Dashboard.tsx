
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Github, 
  DollarSign, 
  TrendingUp,
  Clock,
  Gift,
  GraduationCap,
  Trophy,
  Target,
  Star
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard EstudaMais.tech</h1>
        <p className="text-gray-600">Transformando o GitHub Student Pack em investimento na sua carreira - Mais de  US$ 200.000 disponíveis!</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Estudantes Ativos"
          value="1,247"
          change="+18.5%"
          icon={Users}
          trend="up"
        />
        <MetricCard 
          title="Investimento Total Liberado"
          value="US$ 892,340"
          change="+22.3%"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard 
          title="GitHub Student Packs Ativados"
          value="634"
          change="+15.2%"
          icon={Github}
          trend="up"
        />
        <MetricCard 
          title="Taxa de Conclusão da Jornada"
          value="71.2%"
          change="+4.1%"
          icon={Trophy}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculadora de Investimento em Destaque */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Calculadora de Investimento - Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">US$ 3,313.16</div>
                <p className="text-sm text-gray-600">Valor Total Disponível</p>
                <p className="text-xs text-gray-500">GitHub Student Pack + Extras</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">US$ 2,156.24</div>
                <p className="text-sm text-gray-600">Já Investido (Média)</p>
                <Progress value={65} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">US$ 1,156.92</div>
                <p className="text-sm text-gray-600">Saldo Disponível</p>
                <p className="text-xs text-gray-500">Para liberar com estudo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maria Silva ativou GitHub Copilot</p>
                  <p className="text-sm text-gray-500">+US$ 480 liberados • Há 1 hora</p>
                </div>
                <div className="text-green-600 font-bold">+US$ 480</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">João Santos completou 20h de estudo</p>
                  <p className="text-sm text-gray-500">Créditos acumulados • Há 2 horas</p>
                </div>
                <div className="text-blue-600 font-bold">+20 créditos</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ana Costa ativou JetBrains IDEs</p>
                  <p className="text-sm text-gray-500">+US$ 1,195 liberados • Há 4 horas</p>
                </div>
                <div className="text-green-600 font-bold">+US$ 1,195</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pedro Oliveira conquistou certificação</p>
                  <p className="text-sm text-gray-500">GitHub Foundations • Ontem</p>
                </div>
                <div className="text-purple-600 font-bold">+US$ 49</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ferramentas Mais Valiosas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Ferramentas Mais Valiosas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">JetBrains IDEs</p>
                  <p className="text-sm text-gray-500">321 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 1,195.20</p>
                  <p className="text-xs text-gray-500">por estudante</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Copilot</p>
                  <p className="text-sm text-gray-500">456 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 480.00</p>
                  <p className="text-xs text-gray-500">por estudante</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Notion Education</p>
                  <p className="text-sm text-gray-500">287 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 384.00</p>
                  <p className="text-xs text-gray-500">por estudante</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Pro</p>
                  <p className="text-sm text-gray-500">198 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">US$ 336.00</p>
                  <p className="text-xs text-gray-500">por estudante</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jornada Gamificada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Progresso da Jornada Gamificada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Etapa 1</div>
              <p className="text-sm font-medium">Conta GitHub</p>
              <p className="text-xs text-gray-500">892 estudantes</p>
              <Progress value={71} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">Etapa 2</div>
              <p className="text-sm font-medium">Student Pack</p>
              <p className="text-xs text-gray-500">634 estudantes</p>
              <Progress value={51} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Etapa 3</div>
              <p className="text-sm font-medium">Ferramentas Premium</p>
              <p className="text-xs text-gray-500">456 estudantes</p>
              <Progress value={37} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Etapa 4</div>
              <p className="text-sm font-medium">Certificações</p>
              <p className="text-xs text-gray-500">287 estudantes</p>
              <Progress value={23} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
