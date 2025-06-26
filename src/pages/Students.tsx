
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";

const studentsData = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    courses: 3,
    progress: 85,
    status: "active",
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    courses: 2,
    progress: 92,
    status: "active",
    joinDate: "2024-02-20"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    courses: 1,
    progress: 45,
    status: "inactive",
    joinDate: "2024-03-10"
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    email: "pedro@email.com",
    courses: 4,
    progress: 78,
    status: "active",
    joinDate: "2024-01-30"
  }
];

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estudantes</h1>
          <p className="text-gray-600">Gerencie todos os estudantes da plataforma</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Estudante
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar estudantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-gray-600">{student.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Cursos</p>
                    <p className="font-semibold">{student.courses}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Progresso</p>
                    <p className="font-semibold">{student.progress}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
