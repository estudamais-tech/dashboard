
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  Clock,
  Award
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral da sua plataforma educacional</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total de Estudantes"
          value="2,847"
          change="+12.5%"
          icon={Users}
          trend="up"
        />
        <MetricCard 
          title="Cursos Ativos"
          value="156"
          change="+3.2%"
          icon={BookOpen}
          trend="up"
        />
        <MetricCard 
          title="Instrutores"
          value="89"
          change="+5.1%"
          icon={GraduationCap}
          trend="up"
        />
        <MetricCard 
          title="Taxa de Conclusão"
          value="78.4%"
          change="+2.1%"
          icon={Award}
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
                  <p className="font-medium">Maria Silva se inscreveu em "React Avançado"</p>
                  <p className="text-sm text-gray-500">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">João Santos completou "JavaScript Básico"</p>
                  <p className="text-sm text-gray-500">Há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novo curso "Python para Iniciantes" foi publicado</p>
                  <p className="text-sm text-gray-500">Há 6 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ana Costa se tornou instrutora</p>
                  <p className="text-sm text-gray-500">Ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cursos Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Cursos Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Desenvolvimento Web Completo</p>
                  <p className="text-sm text-gray-500">1,234 estudantes</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">4.8★</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Python para Data Science</p>
                  <p className="text-sm text-gray-500">987 estudantes</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">4.7★</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Design UI/UX Moderno</p>
                  <p className="text-sm text-gray-500">756 estudantes</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">4.9★</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Marketing Digital</p>
                  <p className="text-sm text-gray-500">654 estudantes</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">4.6★</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
