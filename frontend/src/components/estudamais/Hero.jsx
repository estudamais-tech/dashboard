
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain,TrendingUp } from 'lucide-react';

const Hero = () => {
  const scrollToBenefits = () => {
    const benefitsSection = document.getElementById('benefits');
    if (benefitsSection) {
      window.scrollTo({
        top: benefitsSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 bg-estudamais-green-dark text-estudamais-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-estudamais-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-estudamais-green-support/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-estudamais-white mb-8 leading-tight">
            Quero investir <span className="bg-clip-text text-transparent bg-gradient-to-r from-estudamais-orange to-estudamais-yellow">3000 USD</span> em você agora! <br className="hidden md:block"/> Vamos?
          </h1>
          <p className="text-lg md:text-xl text-estudamais-gray-light max-w-3xl mx-auto mb-12">
            A EstudaMais.tech guia estudantes da Estácio a destravar o potencial máximo do GitHub Student Pack, utilizando créditos de forma estratégica para decolar sua carreira.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => { /* Lógica para Acessar Plataforma */ }}
                className="cta-button-gradient text-estudamais-green-dark px-10 py-7 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform"
                size="lg"
              >
                Acessar Plataforma <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={scrollToBenefits}
                className="text-estudamais-yellow border-estudamais-yellow hover:bg-estudamais-yellow/10 hover:text-estudamais-yellow px-8 py-7 text-lg rounded-xl shadow-lg"
                size="lg"
              >
                Descobrir Benefícios
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="mt-16 md:mt-24 flex justify-center gap-8 md:gap-16">
          <motion.div 
            initial={{ opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{delay:0.4, duration:0.5}}
            className="flex flex-col items-center text-estudamais-gray-light"
          >
            <BookOpen size={40} className="text-estudamais-blue mb-2"/>
            <span className="font-medium">Conhecimento</span>
          </motion.div>
          <motion.div 
            initial={{ opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{delay:0.6, duration:0.5}}
            className="flex flex-col items-center text-estudamais-gray-light"
          >
            <Brain size={40} className="text-estudamais-green-support mb-2"/>
            <span className="font-medium">Estratégia</span>
          </motion.div>
          <motion.div 
            initial={{ opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{delay:0.8, duration:0.5}}
            className="flex flex-col items-center text-estudamais-gray-light"
          >
            <TrendingUp size={40} className="text-estudamais-orange mb-2"/>
            <span className="font-medium">Crescimento</span>
          </motion.div>
        </div>
         <div className="relative mt-12 md:mt-16 w-full max-w-3xl mx-auto">
          <img  alt="Estudante universitário usando laptop com ícones de tecnologia ao redor, com tema escuro" className="w-full h-auto rounded-lg" src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
