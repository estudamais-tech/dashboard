import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// Se você já integrou Lottie, mantenha os imports relacionados:
// import Lottie from 'lottie-react';
// import animationData from '../public/animations/404-student-error.json'; // Substitua pelo caminho do seu JSON

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black p-4">
      {/* Container principal com card flutuante */}
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Seção da Imagem do Estudante */}
        <div className="flex-shrink-0">
          <img
            src="/img/404/erro-404-1024x684.webp" 
            alt="Estudante olhando confuso para uma página não encontrada"
            className="w-64 h-auto md:w-80 lg:w-96 object-contain"
          />
         
        </div>

        {/* Seção do Conteúdo do Texto */}
        <div className="text-center md:text-left">
          <h1 className="text-6xl md:text-8xl font-extrabold text-[#067cf4] dark:text-purple-400 mb-4 animate-bouncing-404"> {/* <-- ALTERADO AQUI */}
            404
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Oops! Página não encontrada, estudante!
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Parece que você se perdeu no caminho da sua jornada do conhecimento.
            Não se preocupe, até os melhores exploradores se perdem!
          </p>
          <a
            href="/dashboard/students"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#2196F3] hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Voltar para o Início
            {/* Ícone de seta para melhor UX */}
            <svg
              className="ml-2 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586L8.293 4.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;