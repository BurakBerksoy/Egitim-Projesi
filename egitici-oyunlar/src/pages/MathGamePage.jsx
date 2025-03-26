import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MathGame from '../games/MathGame';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MathGamePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Oturum açmamış kullanıcıları giriş sayfasına yönlendir
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { 
        replace: true,
        state: { from: '/games/math', message: 'Oyunu oynamak için lütfen giriş yapın.' } 
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl text-white mb-2">Yönlendiriliyor...</h2>
          <p className="text-gray-400">Oyunu oynamak için giriş yapmanız gerekiyor.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 px-4"
    >
      <div className="container mx-auto">
        <MathGame />
      </div>
    </motion.div>
  );
};

export default MathGamePage; 