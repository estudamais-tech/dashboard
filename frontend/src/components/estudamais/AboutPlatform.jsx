import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, Target } from 'lucide-react';

const AboutPlatform = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="about" className="section-padding bg-background text-foreground">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-estudamais-green-dark mb-4">
            Maximize Seus Créditos, Acelere Sua Carreira
          </h2>
          <div className="w-24 h-1.5 bg-estudamais-yellow mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-estudamais-green-dark max-w-3xl mx-auto">
            A EstudaMais.tech é sua aliada estratégica para transformar os benefícios do GitHub Student Pack em
            oportunidades reais de crescimento. Nossa plataforma descomplica o acesso e o uso dos
            créditos, mostrando como cada ferramenta pode impulsionar seus projetos e seu futuro profissional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <img  alt="Interface da plataforma EstudaMais.tech em um tablet, com tema escuro" className="rounded-xl shadow-2xl w-full h-auto object-cover" src="https://images.unsplash.com/photo-1702479743967-3dcccd4a671d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          </motion.div>
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-3 bg-estudamais-blue/20 rounded-full">
                  <Gift size={28} className="text-estudamais-blue" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-semibold text-estudamais-green-dark mb-1">Desbloqueie Benefícios Exclusivos</h3>
                <p className="text-estudamais-green-dark">
                  Navegue facilmente pelo GitHub Student Pack e entenda o valor de cada crédito disponível.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-3 bg-estudamais-green-support/20 rounded-full">
                  <Zap size={28} className="text-estudamais-green-support" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-semibold text-estudamais-green-dark mb-1">Uso Estratégico e Inteligente</h3>
                <p className="text-estudamais-green-dark">
                  Aprenda a aplicar seus créditos em projetos que realmente importam para sua formação e portfólio.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-3 bg-estudamais-orange/20 rounded-full">
                  <Target size={28} className="text-estudamais-orange" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-semibold text-estudamais-green-dark mb-1">Acelere Sua Jornada Profissional</h3>
                <p className="text-estudamais-green-dark">
                  Transforme ferramentas gratuitas em diferenciais competitivos para o mercado de trabalho.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPlatform;
