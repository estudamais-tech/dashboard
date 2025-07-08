import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = () => {
    const sections = ['home', 'about', 'benefits', 'chat-luiza'];
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop - 100 &&
          scrollPosition < offsetTop + offsetHeight - 100
        ) {
          setActiveSection(section);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'about', label: 'A Plataforma' },
    { id: 'benefits', label: 'Benefícios' },
    { id: 'chat-luiza', label: 'Fale com Luiza' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <a href="#home" className="text-2xl font-bold text-estudamais-white">
            EstudaMais<span className="text-estudamais-yellow">.tech</span>
          </a>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={`nav-link px-4 py-2 text-estudamais-gray-light hover:text-estudamais-yellow transition-colors duration-300 font-medium ${activeSection === item.id ? 'text-estudamais-yellow font-semibold active-nav-link' : ''}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {item.label}
            </motion.a>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => { /* Lógica para Acessar Plataforma */ }}
              className="ml-4 cta-button-gradient text-estudamais-green-dark px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              Acessar Plataforma
            </Button>
          </motion.div>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            className="text-estudamais-gray-light hover:text-estudamais-yellow"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md shadow-lg"
          >
            <nav className="container mx-auto px-6 py-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`text-lg py-2 font-medium ${
                    activeSection === item.id ? 'text-estudamais-yellow' : 'text-estudamais-gray-light hover:text-estudamais-yellow'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Button
                onClick={() => { /* Lógica para Acessar Plataforma */ }}
                className="w-full cta-button-gradient text-estudamais-green-dark py-3 mt-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                Acessar Plataforma
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
