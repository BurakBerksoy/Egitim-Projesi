import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaCheck, FaTimes, FaClock, FaTrophy, FaHeart, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MathGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [difficulty, setDifficulty] = useState('kolay');
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Oyun başladığında geri sayım
  useEffect(() => {
    if (gameStarted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && countdown === 0) {
      generateQuestion();
    }
  }, [gameStarted, countdown]);

  // Sayaç 
  useEffect(() => {
    if (gameStarted && countdown === 0 && !gameOver && !showAnswer) {
      const timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          handleTimeout();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameStarted, countdown, gameOver, showAnswer]);

  // Doğru cevap sonrası kutlama animasyonu
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  // Soru üretimi
  const generateQuestion = () => {
    let num1, num2, operation, answer, options;

    // Zorluk seviyesine göre soru oluştur
    switch (difficulty) {
      case 'kolay':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = Math.random() < 0.5 ? '+' : '-';
        
        // Çıkarma işleminde ilk sayının her zaman büyük olmasını sağla
        if (operation === '-' && num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        
        answer = operation === '+' ? num1 + num2 : num1 - num2;
        break;
        
      case 'orta':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        const ops = ['+', '-', '*'];
        operation = ops[Math.floor(Math.random() * ops.length)];
        
        // Çıkarma işleminde ilk sayının her zaman büyük olmasını sağla
        if (operation === '-' && num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        
        // Çarpma işleminde daha küçük sayılar kullan
        if (operation === '*') {
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
        }
        
        answer = operation === '+' ? num1 + num2 : 
                operation === '-' ? num1 - num2 : num1 * num2;
        break;
        
      case 'zor':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 30) + 1;
        const hardOps = ['+', '-', '*', '/'];
        operation = hardOps[Math.floor(Math.random() * hardOps.length)];
        
        // Çıkarma işleminde ilk sayının her zaman büyük olmasını sağla
        if (operation === '-' && num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        
        // Çarpma işleminde daha küçük sayılar kullan
        if (operation === '*') {
          num1 = Math.floor(Math.random() * 15) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
        }
        
        // Bölme işleminde tam bölünebilir sayılar oluştur
        if (operation === '/') {
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = Math.floor(Math.random() * 10) + 1;
          num1 = num2 * answer;
        } else {
          answer = operation === '+' ? num1 + num2 : 
                  operation === '-' ? num1 - num2 : num1 * num2;
        }
        break;
        
      default:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = '+';
        answer = num1 + num2;
    }

    // Cevap seçenekleri oluştur
    options = generateOptions(answer);
    setCorrectAnswer(answer);
    
    setCurrentQuestion({
      question: `${num1} ${operation} ${num2} = ?`,
      num1,
      num2,
      operation,
      answer,
      options
    });
    
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // Cevap seçenekleri oluşturma
  const generateOptions = (correctAnswer) => {
    const options = [correctAnswer];
    
    while (options.length < 4) {
      // Zorluk seviyesine göre yanlış cevap aralığını ayarla
      let range = difficulty === 'kolay' ? 5 : difficulty === 'orta' ? 10 : 20;
      let wrongAnswer = correctAnswer + Math.floor(Math.random() * range) - Math.floor(range / 2);
      
      // Negatif sayı veya doğru cevapla aynı olmadığından emin ol
      if (wrongAnswer !== correctAnswer && wrongAnswer >= 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Seçenekleri karıştır
    return options.sort(() => Math.random() - 0.5);
  };

  // Zaman dolduğunda
  const handleTimeout = () => {
    setShowAnswer(true);
    setLives(lives - 1);
    setStreak(0);
    
    if (lives <= 1) {
      setGameOver(true);
    } else {
      // 2 saniye sonra yeni soru
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    }
  };

  // Cevap seçildiğinde
  const handleAnswer = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    setShowAnswer(true);
    
    if (selectedOption === correctAnswer) {
      setScore(score + calculatePoints());
      setStreak(streak + 1);
      setHighestStreak(Math.max(highestStreak, streak + 1));
      setShowCelebration(true);
      
      // 2 saniye sonra yeni soru
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    } else {
      setLives(lives - 1);
      setStreak(0);
      
      if (lives <= 1) {
        setGameOver(true);
      } else {
        // 2 saniye sonra yeni soru
        setTimeout(() => {
          generateQuestion();
        }, 2000);
      }
    }
  };

  // Puanlama sistemi
  const calculatePoints = () => {
    // Zorluk seviyesi ve kalan süreye göre puan hesapla
    let points = 10;
    
    // Zorluk katsayısı
    const difficultyMultiplier = difficulty === 'kolay' ? 1 : 
                                difficulty === 'orta' ? 1.5 : 2;
    
    // Süre katsayısı (kalan süre ne kadar fazlaysa o kadar çok puan)
    const timeMultiplier = timeLeft / 15;
    
    // Seri katsayısı (seri ne kadar uzunsa o kadar çok puan)
    const streakMultiplier = 1 + (streak * 0.1);
    
    // Toplam puan
    points = Math.round(points * difficultyMultiplier * timeMultiplier * streakMultiplier);
    
    return points;
  };

  // Oyunu başlat
  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setLives(3);
    setStreak(0);
    setHighestStreak(0);
    setGameOver(false);
    setGameStarted(true);
    setCountdown(3);
  };

  // Oyunu yeniden başlat
  const restartGame = () => {
    setScore(0);
    setLives(3);
    setStreak(0);
    setGameOver(false);
    setGameStarted(true);
    setCountdown(3);
  };

  // Ana sayfaya dön
  const goToGames = () => {
    navigate('/games');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {!gameStarted ? (
        // Oyun başlangıç ekranı
        <div className="text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl mb-4">
              <FaCalculator className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Matematik Macerası</h1>
            <p className="text-gray-300 max-w-lg mx-auto">
              Matematik becerilerinizi test edin ve eğlenceli problemler çözerek puanınızı artırın!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame('kolay')}
              className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-500/50 rounded-xl flex flex-col items-center justify-center transition-all"
            >
              <span className="text-green-500 font-medium text-lg mb-2">Kolay</span>
              <p className="text-gray-400 text-sm">Toplama ve çıkarma işlemleri (1-10)</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame('orta')}
              className="p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 hover:border-amber-500/50 rounded-xl flex flex-col items-center justify-center transition-all"
            >
              <span className="text-amber-500 font-medium text-lg mb-2">Orta</span>
              <p className="text-gray-400 text-sm">Toplama, çıkarma ve çarpma (1-20)</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame('zor')}
              className="p-6 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 hover:border-red-500/50 rounded-xl flex flex-col items-center justify-center transition-all"
            >
              <span className="text-red-500 font-medium text-lg mb-2">Zor</span>
              <p className="text-gray-400 text-sm">Dört işlem (1-50)</p>
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <h2 className="text-white font-medium text-lg mb-4">Nasıl Oynanır?</h2>
            <ul className="text-gray-300 text-sm space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Her bir soruyu cevaplamak için 15 saniyeniz vardır.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Doğru cevaplar için ne kadar hızlı cevaplarsanız o kadar çok puan kazanırsınız.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Arka arkaya doğru cevaplar vererek puan çarpanınızı artırabilirsiniz.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Yanlış cevap verdiğinizde veya süre dolduğunda bir can kaybedersiniz.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Üç canınızı da kaybettiğinizde oyun sona erer.
              </li>
            </ul>
          </motion.div>
        </div>
      ) : gameOver ? (
        // Oyun sonu ekranı
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6">
            <div className="relative">
              <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/20 mb-4 mx-auto">
                <FaTrophy className="text-white text-4xl" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-2 -right-2 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full border-4 border-gray-900 shadow-lg"
              >
                <FaCalculator className="text-white text-sm" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Oyun Bitti!</h2>
            <p className="text-gray-400 mb-4">İşte senin sonuçların:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-amber-500 mb-2">{score}</div>
              <div className="text-gray-400 text-sm">Toplam Puan</div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-blue-500 mb-2">{highestStreak}</div>
              <div className="text-gray-400 text-sm">En Uzun Seri</div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-green-500 mb-2">{difficulty}</div>
              <div className="text-gray-400 text-sm">Zorluk Seviyesi</div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <FaRedo className="mr-2" /> Tekrar Oyna
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToGames}
              className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-medium flex items-center justify-center hover:bg-gray-700 transition-all"
            >
              Oyunlara Dön
            </motion.button>
          </div>
        </motion.div>
      ) : countdown > 0 ? (
        // Geri sayım ekranı
        <div className="flex flex-col items-center justify-center h-96">
          <motion.div
            key={countdown}
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-bold text-white"
          >
            {countdown}
          </motion.div>
          <div className="text-gray-400 mt-8">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} seviye başlıyor...</div>
        </div>
      ) : (
        // Oyun ekranı
        <div>
          {/* Üst bilgi çubuğu */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex">
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={index < lives ? { scale: [1, 1.2, 1], color: ['#f87171', '#ef4444'] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-8 h-8 ${index < lives ? 'text-red-500' : 'text-gray-700'}`}
                  >
                    <FaHeart />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm px-3 py-1 bg-gray-800/70 rounded-lg border border-gray-700/50">
                <span className="font-medium text-white">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-gray-400">Puan</div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-400">Seri:</div>
                <div className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-sm font-medium">
                  {streak}
                </div>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <div className="text-sm text-gray-400">En yüksek:</div>
                <div className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 text-sm font-medium">
                  {highestStreak}
                </div>
              </div>
            </div>
          </div>
          
          {/* Zamanlayıcı */}
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-8">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-blue-500"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 15) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute -top-7 right-0 flex items-center">
              <FaClock className="text-gray-400 mr-1 text-xs" />
              <span className="text-sm text-gray-300">{timeLeft}</span>
            </div>
          </div>
          
          {/* Matematiksel ifade */}
          <motion.div
            key={currentQuestion?.question}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800/70 border border-gray-700/50 rounded-2xl p-8 mb-8 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {currentQuestion?.question}
            </h2>
            
            {/* Kutlama animasyonu */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-9xl text-yellow-500 opacity-20"
                  >
                    🎉
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Cevap seçenekleri */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4"
          >
            {currentQuestion?.options.map((option, index) => (
              <motion.button
                key={index}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { 
                    y: 0, 
                    opacity: 1,
                    transition: { delay: index * 0.1, duration: 0.3 }
                  }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={showAnswer}
                onClick={() => handleAnswer(option)}
                className={`relative p-6 rounded-xl text-xl font-medium transition-all ${
                  showAnswer 
                    ? option === correctAnswer
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : option === selectedAnswer
                        ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                        : 'bg-gray-800/50 border border-gray-700/50 text-gray-400'
                    : 'bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 hover:border-gray-600/50'
                }`}
              >
                {option}
                
                {showAnswer && option === correctAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-green-500 rounded-full"
                  >
                    <FaCheck className="text-white" />
                  </motion.div>
                )}
                
                {showAnswer && option === selectedAnswer && option !== correctAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-500 rounded-full"
                  >
                    <FaTimes className="text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MathGame; 