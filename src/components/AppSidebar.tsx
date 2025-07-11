import {
  BookOpen,
  Users,
  Github,
  BarChart3,
  Settings,
  Home,
  Calculator,
  HelpCircle,
  Gift,
  Trophy,
  Target,
  MessageSquare
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
  useSidebar
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Estudantes", url: "/dashboard/students", icon: Users },
  { title: "Calculadora de Investimento", url: "/dashboard/calculator", icon: Calculator },
  { title: "Jornada Gamificada", url: "/dashboard/journey", icon: Trophy },
  { title: "GitHub Student Pack", url: "/dashboard/github-benefits", icon: Gift },
  { title: "Guias e Tutoriais", url: "/dashboard/guides", icon: BookOpen },
  { title: "Validação de Ideia", url: "/dashboard/validation", icon: Target },
  { title: "Chatbot IA", url: "/dashboard/chatbot", icon: MessageSquare },
  { title: "Suporte", url: "/dashboard/support", icon: HelpCircle },
  { title: "Relatórios", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { open: isSidebarOpen, state: sidebarState } = useSidebar();

  return (
    <Sidebar
      className={`
        bg-white dark:bg-[#143b32] dark:border-gray-700 mt-[9svh] fixed left-0 z-40 transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-[10vw]'} /* AQUI: Largura colapsada ajustada para 10vw */
        h-[calc(100vh-9svh)] flex flex-col
      `}
      collapsible="icon"
    >
      {/* AQUI: Ajuste no SidebarHeader para torná-lo mais compacto */}
      {/* Reduzi o padding de p-6 para p-4 e removi o mt-2, ou ajuste p-y para ser mais específico */}
      <SidebarHeader className="py-3 px-4 border-b border-gray-200 dark:border-gray-700"> {/* Ajustado o padding */}
        <a href="/dashboard" className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${sidebarState === 'collapsed' && 'justify-center'}`}>
            <div className="border rounded-lg flex items-center justify-center">
              <img
                src="/img/icons/logo.png"
                alt="Logo"
                className='z-20 w-10 h-10'
              />
            </div>
            {sidebarState === 'expanded' && (
              <div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">EstudaMais.tech</span>
                <p className="text-xs text-gray-500 dark:text-gray-300">Invista na sua carreira</p>
              </div>
            )}
          </div>
        </a>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-2 pb-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-gray-500 dark:text-gray-400 ${sidebarState === 'collapsed' && 'text-center'}`}>
            {sidebarState === 'expanded' ? 'Navegação Principal' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'text-blue-700 font-medium dark:text-blue-200'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-transparent dark:hover:bg-transparent'
                        }
                        ${sidebarState === 'collapsed' && 'justify-center'}
                        `
                      }
                    >
                      <item.icon className="w-6 h-6" />
                      {sidebarState === 'expanded' && (
                        <span className="text-sm">{item.title}</span>
                      )}
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