import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// AJUSTE: Corrigido o caminho do import para o hook useAuth
import { useAuth } from '../../hooks/useAuth'; // Importa o hook useAuth

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const getGridColor = () => {
    return theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  };

  const getBackgroundColor = () => {
    return theme === 'dark' ? '#081814' : '#F8F8F8';
  };

  const handleGitHubLogin = () => {
    setIsLoading(true);

    const GITHUB_CLIENT_ID = import.meta.env.VITE_REACT_APP_GITHUB_CLIENT_ID;
    const GITHUB_REDIRECT_URI = import.meta.env.VITE_REACT_APP_GITHUB_REDIRECT_URI;
    const GITHUB_SCOPE = 'user:email';

    if (!GITHUB_CLIENT_ID || !GITHUB_REDIRECT_URI) {
      console.error('Erro de configuração: Client ID ou Redirect URI do GitHub não definidos no .env.');
      setIsLoading(false);
      return;
    }

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=${GITHUB_SCOPE}`;

    console.log("Redirecionando para GitHub Auth URL:", githubAuthUrl);
    window.location.href = githubAuthUrl;
  };

  return (
    <section
      className="relative flex justify-center items-center min-h-screen font-sans overflow-hidden"
      style={{
        backgroundColor: getBackgroundColor(),
        backgroundImage: `
          linear-gradient(to right, ${getGridColor()} 1px, transparent 1px),
          linear-gradient(to bottom, ${getGridColor()} 1px, transparent 1px)
        `,
        backgroundSize: '45px 45px'
      }}
    >
      <div
        className="w-[80%] h-[25vh] rounded-[50%] bg-[#00A895] absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ filter: "blur(200px) " }}
      ></div>
      {/* Efeito de grão */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(https://beserragoadv.com/images/Grain-effect-3.gif)',
          backgroundPosition: '0px 0px',
          backgroundSize: 'auto',
          mixBlendMode: theme === 'dark' ? 'overlay' : 'soft-light',
          opacity: theme === 'dark' ? 0.15 : 0.08,
        }}
      ></div>

      
      {/* A logo agora está DENTRO da div do cartão, mas posicionada de forma absoluta em relação a ela */}
      <div className="relative bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-md z-10 pt-20"> {/* Adicionado 'relative' e 'pt-20' aqui */}
        <img
          src="/img/icons/logo.png"
          alt="Logo"
          className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16' // Tamanho w-24 h-24 (96px)
          style={{ top: '0' }} // Posiciona o topo da logo no topo da div pai (o cartão)
        />
        <h1 className="mb-5 text-3xl font-bold text-[var(--bg-color)] dark:text-gray-900">Bem-vindo!</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-700">Faça login para continuar.</p>
        <button
          onClick={handleGitHubLogin}
          className="inline-flex items-center justify-center bg-gray-800 text-white py-3 px-6 rounded-md text-base cursor-pointer transition-colors duration-300 hover:bg-gray-700 mb-4 w-full dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Carregando...
            </>
          ) : (
            'Entrar com GitHub'
          )}
        </button>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-600">
          Ao fazer login, você concorda com nossos Termos de Serviço e. <a href="#" className='text-blue-500 dark:text-blue-700'>Política de Privacidade</a>
        </p>
      </div>
    </section>
  );
}
