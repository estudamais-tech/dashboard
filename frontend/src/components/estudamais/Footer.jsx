
import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-estudamais-gray-light py-12 border-t border-estudamais-blue-green/30">
      <div className="container text-center">
        <div className="flex justify-center items-center space-x-6 mb-6">
          <a
            href="https://github.com/92username"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub da EstudaMais.tech"
            className="text-estudamais-gray-light hover:text-estudamais-yellow transition-colors duration-300"
          >
            <Github size={28} />
          </a>
        </div>
        <p className="text-sm mb-2 text-estudamais-gray-light">
          EstudaMais.tech - Guiando você ao sucesso com o GitHub Student Pack.
        </p>
        <p className="text-xs text-estudamais-blue-green">
          © {currentYear} EstudaMais.tech. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-1 text-estudamais-blue-green">
          Uma iniciativa para estudantes da Estácio e além.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
