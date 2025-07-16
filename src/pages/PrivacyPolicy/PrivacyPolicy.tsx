import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

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

  const handleGoBack = () => {
    navigate('/'); // Redireciona para a página de login
  };

  return (
    <section
      className="relative flex justify-center items-center min-h-screen font-sans overflow-hidden py-8"
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

      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Política de Privacidade</h1>
        
        <p className="mb-4">
          A sua privacidade é de suma importância para nós. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso aplicativo.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">1. Coleta de Informações</h2>
        <p className="mb-4">
          Coletamos informações que você nos fornece diretamente, como seu nome de <b>Usuário e avatar do GitHub </b>, ao se cadastrar ou fazer login em nosso aplicativo, especialmente através da autenticação via GitHub para melhorar a funcionalidade e a segurança do aplicativo.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">2. Uso das Informações</h2>
        <p className="mb-4">
          Utilizamos as informações coletadas para os seguintes propósitos:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Para autenticá-lo e permitir o acesso ao aplicativo.</li>
          <li>Para personalizar sua experiência e fornecer recursos relevantes.</li>
          <li>Para analisar e melhorar o desempenho e a funcionalidade do aplicativo.</li>
          <li>Para garantir a segurança do aplicativo e prevenir fraudes.</li>
          <li>Para cumprir obrigações legais.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">3. Compartilhamento de Informações</h2>
        <p className="mb-4">
          Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes circunstâncias:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Com provedores de serviços que nos auxiliam na operação do aplicativo (e.g., serviços de hospedagem), sob rigorosos acordos de confidencialidade.</li>
          <li>Quando exigido por lei ou em resposta a processos legais válidos.</li>
          <li>Para proteger nossos direitos, privacidade, segurança ou propriedade.</li>
          </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">4. Segurança dos Dados</h2>
        <p className="mb-4">
          Implementamos medidas de segurança robustas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, lembre-se de que nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">5. Seus Direitos</h2>
        <p className="mb-4">
          Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato conosco através dos canais fornecidos no aplicativo.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">6. Alterações a Esta Política</h2>
        <p className="mb-4">
          Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações significativas publicando a nova política nesta página. Recomendamos revisar esta Política de Privacidade regularmente para quaisquer alterações.
        </p>
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Última atualização: 14 de Julho de 2025
        </p>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out"
          >
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
}
