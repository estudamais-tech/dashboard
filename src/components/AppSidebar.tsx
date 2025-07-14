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
    { title: "Estudante", url: "/dashboard/students", icon: Users },

    { title: "Jornada Gamificada", url: "/dashboard/students/journey", icon: Trophy },
    { title: "GitHub Student Pack", url: "/dashboard/github-benefits", icon: Gift },
    { title: "Guias e Tutoriais", url: "/dashboard/guides", icon: BookOpen },
    { title: "Validação de Ideia", url: "/dashboard/validation", icon: Target },
    { title: "Chatbot IA", url: "/dashboard/chatbot", icon: MessageSquare },
    { title: "Calculadora de Investimento", url: "/dashboard/calculator", icon: Calculator },
    { title: "Suporte", url: "/dashboard/support", icon: HelpCircle },
    { title: "Relatórios", url: "/dashboard/reports", icon: BarChart3 },
    { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
    const { open: isSidebarOpen, state: sidebarState } = useSidebar();

    return (
        <Sidebar
            className={`
                fixed left-0 top-[9svh] z-40 h-[calc(100vh-9svh)] flex flex-col
                w-64 transition-all duration-500 ease-in-out
                ${isSidebarOpen ? 'w-64' : 'w-20'} // Ajustado para controlar a largura da sidebar
                backdrop-blur-[10px] bg-white/30 dark:bg-[#143b32]/30 border-r border-gray-200 dark:border-gray-700
            `}
            collapsible="icon"
        >
            <SidebarHeader className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <a href="/dashboard" className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${sidebarState === 'collapsed' ? 'justify-center' : ''}`}>
                        <div className="border rounded-lg flex items-center justify-center">
                            <img
                                src="/img/icons/logo.webp"
                                alt="Logo"
                                // MODIFICAÇÃO AQUI: Adicionado transição e classes condicionais para o tamanho da logo
                                className={`
                                    z-20 transition-all duration-300 ease-in-out
                                    ${sidebarState === 'collapsed' ? 'w-8 h-8' : 'w-10 h-10'}
                                `}
                            />
                        </div>
                        {sidebarState === 'expanded' && (
                            <div className="overflow-hidden transition-all duration-300 ease-in-out opacity-100 max-w-xs"> {/* Mantido para os textos */}
                                <span className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">EstudaMais.tech</span>
                                <p className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">Invista na sua carreira</p>
                            </div>
                        )}
                    </div>
                </a>
            </SidebarHeader>

            <SidebarContent className="flex-1 overflow-y-auto px-2 pb-4">
                <SidebarGroup>
                    <SidebarGroupLabel
                        className={`
                            text-gray-500 dark:text-gray-400
                            transition-opacity duration-300 ease-in-out
                            ${sidebarState === 'collapsed' ? 'text-center opacity-0' : 'opacity-100'}
                        `}
                    >
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
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }
                                                hover:bg-gray-100 dark:hover:bg-gray-800/50
                                                ${sidebarState === 'collapsed' ? 'justify-center' : ''}
                                                `
                                            }
                                        >
                                            <item.icon className="w-6 h-6" />
                                            {sidebarState === 'expanded' && (
                                                <span className="text-sm transition-all duration-300 ease-in-out opacity-100 max-w-xs whitespace-nowrap"> {/* Mantido para os títulos */}
                                                    {item.title}
                                                </span>
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