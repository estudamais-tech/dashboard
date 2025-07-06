import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers, Code, Cloud, Cpu, Book, Edit3, Shield } from 'lucide-react';

const Benefits = () => {
  const benefitsList = [
    { name: "Notion", icon: <Edit3 size={32} className="text-estudamais-blue" />, description: "Organize suas ideias, projetos e estudos em um só lugar." },
    { name: "GitHub Copilot", icon: <Code size={32} className="text-estudamais-green-support" />, description: "Seu par programador IA para acelerar o desenvolvimento." },
    { name: "DigitalOcean", icon: <Cloud size={32} className="text-estudamais-blue-green" />, description: "Créditos para hospedar seus projetos na nuvem." },
    { name: "Microsoft Azure", icon: <Cpu size={32} className="text-estudamais-orange" />, description: "Acesso a serviços de nuvem poderosos para estudantes." },
    { name: "Canva Pro", icon: <Layers size={32} className="text-estudamais-yellow" />, description: "Crie designs incríveis para seus projetos e apresentações." },
    { name: "JetBrains IDEs", icon: <Book size={32} className="text-estudamais-blue" />, description: "Ferramentas de desenvolvimento profissionais gratuitas." },
    { name: "Namecheap", icon: <Shield size={32} className="text-estudamais-white" />, description: "Registre seu domínio .me gratuitamente por um ano." },
    { name: "Frontend Masters", icon: <Code size={32} className="text-estudamais-green-support" />, description: "Cursos avançados de desenvolvimento frontend." },

  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section id="benefits" className="section-padding bg-background text-foreground">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-estudamais-white mb-4">
            Benefícios que Esperam por Você
          </h2>
          <div className="w-24 h-1.5 bg-estudamais-blue mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-estudamais-gray-light max-w-3xl mx-auto">
            O GitHub Student Pack oferece um arsenal de ferramentas. Com a EstudaMais.tech, você aprende a usar cada uma delas para construir um futuro brilhante.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {benefitsList.map((benefit, index) => (
            <motion.div
              key={benefit.name}
              className="benefit-card flex flex-col items-center text-center card-hover p-6 bg-card text-card-foreground"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={cardVariants}
            >
              <div className="p-4 bg-estudamais-green-dark rounded-full mb-5 shadow-md">
                {React.cloneElement(benefit.icon, { className: benefit.icon.props.className.replace("text-estudamais-green-dark", "text-estudamais-white") })}
              </div>
              <h3 className="text-xl font-semibold text-[#457a8e] mb-2">{benefit.name}</h3>
              <p className="text-[#1c4145] text-sm flex-grow">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <Button
            onClick={() => { /* Lógica para Acessar Plataforma */ }}
            className="bg-[#457a8e] text-white border border-[#fbdd41] hover:bg-[#fbdd41] hover:text-[#1c4145] transition-colors duration-200 px-10 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105"
            size="lg"
          >
            Quero Explorar Todos os Benefícios
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
