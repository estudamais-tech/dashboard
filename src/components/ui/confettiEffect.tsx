import { useAuth } from '@/contexts/AuthContext';
import userService from '@/services/userService';
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';


interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
  duration?: number;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  trigger, 
  onComplete, 
  duration = 5000 
}) => {
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    // A condição já verifica user && !user.has_seen_confetti
    // Se trigger for true, user existe e user.has_seen_confetti for false, o confete será mostrado
    if (trigger && user && !user.has_seen_confetti) {
      setShowConfetti(true);
      
      // Chamar o serviço para marcar o confete como visto no backend
      userService.markConfettiAsSeen(user.id)
        .then(() => console.log('Confetti marked as seen in backend'))
        .catch(error => console.error('Failed to mark confetti as seen in backend:', error));
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete, duration, user]);

  if (!showConfetti) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 999999,
      pointerEvents: 'none' 
    }}>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        initialVelocityY={{ min: 0.5, max: 2 }}
        initialVelocityX={{ min: -5, max: 5 }}
        gravity={0.15}
        wind={0.02}
        confettiSource={{
          x: 0,
          y: 0,
          w: windowSize.width,
          h: 0,
        }}
      />
    </div>
  );
};
