
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/estudamais/Header';
import Hero from '@/components/estudamais/Hero';
import AboutPlatform from '@/components/estudamais/AboutPlatform';
import Benefits from '@/components/estudamais/Benefits';
import ChatLuiza from '@/components/estudamais/ChatLuiza';
import Footer from '@/components/estudamais/Footer';
import ScrollToTop from '@/components/estudamais/ScrollToTop';

function App() {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    setTimeout(() => {
      toast({
        title: "Bem-vindo à EstudaMais.tech!",
        description: "Descubra como acelerar sua carreira.",
        duration: 5000,
        className: "bg-estudamais-yellow text-estudamais-green-dark",
      });
    }, 1500);
  }, [toast]);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col bg-background text-foreground font-poppins"
        >
          <Header />
          <main>
            <Hero />
            <AboutPlatform />
            <Benefits />
            <ChatLuiza />
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
