import React, { useState, useEffect } from 'react';
import { Bell, Search, User, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"; 
// AJUSTE: Corrigido o caminho do import para o hook useAuth
import { useAuth } from '../hooks/useAuth'; // Importado para obter dados do usuário logado

export function DashboardHeader() {
  // AJUSTE 1: Certifique-se de que 'githubLogin' é desestruturado do hook useAuth
  const { userName, userAvatar, userEmail, githubLogin, logout } = useAuth();

  const sidebarContext = useSidebar();
  const isSidebarOpen = sidebarContext && 'isOpen' in sidebarContext ? sidebarContext.isOpen : false;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
        root.style.backgroundColor = '#143b32';
      } else {
        root.classList.remove('dark');
        root.style.backgroundColor = '#f8f8f8';
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // NOVO useEffect para gerenciar o CSS da scrollbar
  useEffect(() => {
    const styleElementId = 'scrollbar-styles';
    let styleTag = document.getElementById(styleElementId);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleElementId;
      document.head.appendChild(styleTag);
    }

    // Define os gradientes com base no tema
    const lightThemeGradient = 'linear-gradient(90deg, #a0aec0, #cbd5e0, #a0aec0)'; // Exemplo de cores claras
    const darkThemeGradient = 'linear-gradient(90deg, #143b32, #397c7b, #143b32)'; // Cores escuras

    const currentGradient = theme === 'dark' ? darkThemeGradient : lightThemeGradient;

    styleTag.textContent = `
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background-image: ${currentGradient};
        border-radius: 3px;
        transition: 0.5s ease-in-out;
      }

      /* Opcional: Estilizar o track da scrollbar */
      ::-webkit-scrollbar-track {
        background: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        border-radius: 3px;
      }
    `;
  }, [theme]); // Re-executa sempre que o tema mudar

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  // AJUSTE 2: Variável para o nome a ser exibido, usando githubLogin como fallback
  const displayUserName = userName || githubLogin;
  // Opcional: Se quiser um fallback mais genérico caso ambos sejam nulos
  // const displayUserName = userName || githubLogin || 'Usuário';

  return (
    <header
      className={`
        bg-white border-b border-gray-200 px-6 py-2 fixed top-0 right-0 z-50 transition-all duration-300
        ${isSidebarOpen ? 'left-64' : 'left-0'}
         backdrop-blur-[10px] bg-white/30 dark:bg-[#143b32]/30 border-r border-gray-200 dark:border-gray-700
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 dark:text-gray-300" />
            <Input
              placeholder="Buscar estudantes, cursos..."
              className="pl-10 w-80 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-gray-700 dark:text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-white" />
            )}
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5 text-gray-700 dark:text-white" />
          </Button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleOpenProfileModal}
          >
            {userAvatar && (
              <img
                src={userAvatar}
                alt="Avatar do Usuário"
                className="rounded-full w-9 h-9 border-2 border-gray-300 dark:border-gray-500"
              />
            )}
            {/* AJUSTE 3: Usar 'displayUserName' para exibir o nome */}
            {displayUserName && (
              <span className="text-base font-semibold text-gray-800 hidden md:block dark:text-white">{displayUserName}</span>
            )}
          </div>

          <Button onClick={logout} variant="ghost" className="text-red-500 hover:text-red-700">
            <span className="ml-0 md:ml-2 hidden md:block">Sair</span>
          </Button>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="absolute mt-60 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative dark:bg-gray-700 dark:text-white">
            <button
              onClick={handleCloseProfileModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Seu Perfil</h2>
            {userAvatar && (
              <div className="flex justify-center mb-4">
                <img
                  src={userAvatar}
                  alt="Avatar do Usuário"
                  className="rounded-full w-32 h-32 border-4 border-purple-400 dark:border-purple-300"
                />
              </div>
            )}
            {/* AJUSTE 4: Usar 'displayUserName' para exibir o nome no modal também */}
            {displayUserName && (
              <p className="text-lg font-semibold text-gray-800 text-center mb-2 dark:text-white">
                Nome: <span className="font-normal">{displayUserName}</span>
              </p>
            )}
            {userEmail && (
              <p className="text-md text-gray-600 text-center mb-4 dark:text-gray-300">
                Email: <span className="font-normal">{userEmail}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}