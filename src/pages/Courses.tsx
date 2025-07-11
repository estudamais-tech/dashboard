
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock, Star } from "lucide-react";

const coursesData = [
  {
    id: 1,
    title: "Desenvolvimento Web Completo",
    instructor: "Prof. Carlos Lima",
    students: 1234,
    duration: "40h",
    rating: 4.8,
    price: "R$ 299,00",
    status: "published",
    category: "Tecnologia"
  },
  {
    id: 2,
    title: "Python para Data Science",
    instructor: "Dra. Ana Ferreira",
    students: 987,
    duration: "35h",
    rating: 4.7,
    price: "R$ 399,00",
    status: "published",
    category: "Data Science"
  },
  {
    id: 3,
    title: "Design UI/UX Moderno",
    instructor: "Prof. Bruno Costa",
    students: 756,
    duration: "25h",
    rating: 4.9,
    price: "R$ 249,00",
    status: "draft",
    category: "Design"
  },
  {
    id: 4,
    title: "Marketing Digital",
    instructor: "Profa. Lucia Santos",
    students: 654,
    duration: "30h",
    rating: 4.6,
    price: "R$ 199,00",
    status: "published",
    category: "Marketing"
  }
];

export default function Courses() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600">Gerencie todos os cursos da plataforma</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Criar Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                  {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <p className="text-gray-600">{course.instructor}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students} estudantes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <span className="font-bold text-lg text-green-600">{course.price}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1">
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
