
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus,
  Github,
  Mail,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react";

// Dados mockados dos estudantes
const students = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria.silva@estacio.br",
    githubUsername: "mariasilva23",
    registrationDate: "2024-01-15",
    githubStatus: "ativo",
    benefitsActivated: 3,
    course: "Análise e Desenvolvimento de Sistemas"
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao.santos@estacio.br",
    githubUsername: "joaosantos",
    registrationDate: "2024-01-10",
    githubStatus: "ativo",
    benefitsActivated: 2,
    course: "Engenharia de Software"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana.costa@estacio.br",
    githubUsername: "anacosta",
    registrationDate: "2024-01-20",
    githubStatus: "pendente",
    benefitsActivated: 0,
    course: "Ciência da Computação"
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@estacio.br",
    githubUsername: "pedrooliveira",
    registrationDate: "2024-01-05",
    githubStatus: "ativo",
    benefitsActivated: 4,
    course: "Sistemas de Informação"
  }
];

export default function Students() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estudantes</h1>
          <p className="text-gray-600">Gerencie os estudantes da Estácio e seus benefícios GitHub</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Estudante
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Com GitHub</p>
                <p className="text-2xl font-bold">892</p>
              </div>
              <Github className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Benefícios Ativos</p>
                <p className="text-2xl font-bold">634</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">213</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e pesquisa */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar por nome, email ou usuário GitHub..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de estudantes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <Badge 
                        variant={student.githubStatus === 'ativo' ? 'default' : 'secondary'}
                        className={student.githubStatus === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                      >
                        {student.githubStatus === 'ativo' ? 'GitHub Ativo' : 'Pendente'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        @{student.githubUsername}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(student.registrationDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Curso:</span> {student.course}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Benefícios ativados:</span> {student.benefitsActivated}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button size="sm">
                      Gerenciar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
