
import { 
  BookOpen, 
  Users, 
  Github, 
  BarChart3, 
  Settings,
  Home,
  Calendar,
  HelpCircle,
  Gift
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Visão Geral",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Estudantes",
    url: "/dashboard/students",
    icon: Users,
  },
  {
    title: "Benefícios GitHub",
    url: "/dashboard/github-benefits",
    icon: Gift,
  },
  {
    title: "Guias e Tutoriais",
    url: "/dashboard/guides",
    icon: BookOpen,
  },
  {
    title: "Suporte",
    url: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Calendário",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Relatórios",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">EstudaMais.tech</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
