import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';

const ChatLuiza = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="chat-luiza" className="section-padding bg-estudamais-blue text-estudamais-white">
      <div className="container">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="flex justify-center mb-6">
            <img  alt="Avatar da Luiza, a IA da EstudaMais.tech, com fundo escuro" className="w-32 h-32 rounded-full border-4 border-estudamais-yellow shadow-lg" src="/images/luiza2.jpeg" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-estudamais-white">
            Conheça Luiza, sua Guia Inteligente!
          </h2>
          <div className="w-24 h-1.5 bg-estudamais-yellow mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-estudamais-gray-light max-w-2xl mx-auto mb-10">
            Luiza é nossa assistente virtual com IA, pronta para tirar suas dúvidas sobre o GitHub Student Pack,
            sugerir os melhores usos para seus créditos e ajudar você a planejar seus próximos passos na carreira.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/luiza"
              className="inline-flex items-center justify-center bg-estudamais-yellow text-estudamais-blue hover:bg-estudamais-yellow/90 px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Falar com Luiza Agora
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatLuiza;
