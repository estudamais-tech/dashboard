
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Github, 
  BookOpen, 
  TrendingUp,
  Clock,
  Gift,
  GraduationCap
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral da plataforma EstudaMais.tech - Ajudando estudantes da Estácio com benefícios do GitHub</p>
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
          title="Contas GitHub Criadas"
          value="892"
          change="+22.3%"
          icon={Github}
          trend="up"
        />
        <MetricCard 
          title="Benefícios Ativados"
          value="634"
          change="+15.2%"
          icon={Gift}
          trend="up"
        />
        <MetricCard 
          title="Taxa de Conclusão"
          value="71.2%"
          change="+4.1%"
          icon={GraduationCap}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <p className="font-medium">Maria Silva ativou GitHub Student Pack</p>
                  <p className="text-sm text-gray-500">Há 1 hora</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">João Santos completou tutorial de Git</p>
                  <p className="text-sm text-gray-500">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ana Costa criou conta no GitHub</p>
                  <p className="text-sm text-gray-500">Há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pedro Oliveira acessou benefícios Copilot</p>
                  <p className="text-sm text-gray-500">Ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios Mais Acessados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Benefícios Mais Acessados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Copilot</p>
                  <p className="text-sm text-gray-500">456 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">72%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Pro</p>
                  <p className="text-sm text-gray-500">321 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">51%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Repositórios Privados</p>
                  <p className="text-sm text-gray-500">287 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">45%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">GitHub Pages</p>
                  <p className="text-sm text-gray-500">198 ativações</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">31%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
