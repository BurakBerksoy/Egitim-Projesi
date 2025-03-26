import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaBook, FaRedo, FaChartLine, FaCheck, FaTimes, FaClock, FaChartBar, FaTrophy, FaHeart } from 'react-icons/fa';

const difficulties = {
  easy: {
    name: 'Kolay',
    timeLimit: 180,
    lives: 3,
    countries: [
      {
        name: 'Türkiye',
        capital: 'Ankara',
        flag: '🇹🇷',
        continent: 'Asya ve Avrupa'
      },
      {
        name: 'Fransa',
        capital: 'Paris',
        flag: '🇫🇷',
        continent: 'Avrupa'
      },
      {
        name: 'Japonya',
        capital: 'Tokyo',
        flag: '🇯🇵',
        continent: 'Asya'
      },
      {
        name: 'Mısır',
        capital: 'Kahire',
        flag: '🇪🇬',
        continent: 'Afrika'
      },
      {
        name: 'Brezilya',
        capital: 'Brasília',
        flag: '🇧🇷',
        continent: 'Güney Amerika'
      }
    ]
  },
  medium: {
    name: 'Orta',
    timeLimit: 240,
    lives: 3,
    countries: [
      {
        name: 'Güney Kore',
        capital: 'Seul',
        flag: '🇰🇷',
        continent: 'Asya'
      },
      {
        name: 'İtalya',
        capital: 'Roma',
        flag: '🇮🇹',
        continent: 'Avrupa'
      },
      {
        name: 'Kenya',
        capital: 'Nairobi',
        flag: '🇰🇪',
        continent: 'Afrika'
      },
      {
        name: 'Kanada',
        capital: 'Ottawa',
        flag: '🇨🇦',
        continent: 'Kuzey Amerika'
      },
      {
        name: 'Avustralya',
        capital: 'Kanberra',
        flag: '🇦🇺',
        continent: 'Okyanusya'
      }
    ]
  },
  hard: {
    name: 'Zor',
    timeLimit: 300,
    lives: 3,
    countries: [
      {
        name: 'Kazakistan',
        capital: 'Astana',
        flag: '🇰🇿',
        continent: 'Asya'
      },
      {
        name: 'Letonya',
        capital: 'Riga',
        flag: '🇱🇻',
        continent: 'Avrupa'
      },
      {
        name: 'Etiyopya',
        capital: 'Addis Ababa',
        flag: '🇪🇹',
        continent: 'Afrika'
      },
      {
        name: 'Ekvador',
        capital: 'Quito',
        flag: '🇪🇨',
        continent: 'Güney Amerika'
      },
      {
        name: 'Vanuatu',
        capital: 'Port Vila',
        flag: '🇻🇺',
        continent: 'Okyanusya'
      }
    ]
  }
};

export default function GeographyGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [lives, setLives] = useState(3);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateOptions = (currentCountry, allCountries) => {
    const options = [currentCountry.capital];
    const otherCountries = allCountries.filter(c => c.name !== currentCountry.name);
    
    while (options.length < 4) {
      const randomCountry = otherCountries[Math.floor(Math.random() * otherCountries.length)];
      if (!options.includes(randomCountry.capital)) {
        options.push(randomCountry.capital);
      }
    }
    
    return shuffleArray(options);
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const shuffledCountries = shuffleArray(difficulties[selectedDifficulty].countries);
    setCountries(shuffledCountries);
    setCurrentCountryIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStartTime(Date.now());
    setEndTime(null);
    setStats(null);
    setTimeLeft(difficulties[selectedDifficulty].timeLimit);
    setLives(difficulties[selectedDifficulty].lives);
    setQuestionNumber(1);
    setAnswerTimes([]);
    setOptions(generateOptions(shuffledCountries[0], shuffledCountries));
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === countries[currentCountryIndex].capital;
    const answerTime = Date.now() - startTime;
    
    if (isCorrect) {
      setScore(score + 100);
      setAnswerTimes(prev => [...prev, answerTime]);
    } else {
      setLives(prev => prev - 1);
      if (lives <= 1) {
        endGame();
        return;
      }
    }
    
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentCountryIndex < countries.length - 1) {
        const nextIndex = currentCountryIndex + 1;
        setCurrentCountryIndex(nextIndex);
        setQuestionNumber(prev => prev + 1);
        setStartTime(Date.now());
        setOptions(generateOptions(countries[nextIndex], countries));
      } else {
        endGame();
      }
    }, 1500);
  };

  const endGame = () => {
    setEndTime(Date.now());
    const timeSpent = (Date.now() - startTime) / 1000;
    const accuracy = (score / (countries.length * 100)) * 100;
    
    const performanceAnalysis = {
      timeSpent,
      accuracy,
      totalCountries: countries.length,
      score,
      answerTimes,
      averageTime: answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length,
      fastestAnswer: Math.min(...answerTimes),
      slowestAnswer: Math.max(...answerTimes),
      timeDistribution: {
        fast: answerTimes.filter(t => t < 5000).length,
        medium: answerTimes.filter(t => t >= 5000 && t < 10000).length,
        slow: answerTimes.filter(t => t >= 10000).length
      }
    };

    setStats(performanceAnalysis);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Geri Butonu */}
          <motion.button
            onClick={() => window.history.back()}
            className="fixed top-40 left-24 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-white transition-colors duration-200 flex items-center gap-2 z-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-lg font-medium">Geri</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
              Coğrafya Bulmaca
            </h1>
            <p className="text-gray-400 text-xl">
              Zorluk seviyesini seçin ve coğrafya bilgilerinizi test edin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(difficulties).map(([key, value], index) => (
              <motion.button
                key={key}
                onClick={() => startGame(key)}
                className="p-8 rounded-3xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-green-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-5xl mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300">
                  <FaBook />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{value.name}</h2>
                <div className="space-y-2 text-left">
                  <p className="text-gray-400">
                    <span className="text-green-400">•</span> {value.countries.length} ülke
                  </p>
                  <p className="text-gray-400">
                    <span className="text-green-400">•</span> {value.timeLimit} saniye
                  </p>
                  <p className="text-gray-400">
                    <span className="text-green-400">•</span> {value.lives} can
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
              Oyun Tamamlandı!
            </h1>
            <p className="text-gray-400 text-lg">
              İşte performans analiziniz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genel Performans */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Genel Performans</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Toplam Ülke</span>
                  <span className="text-white font-semibold">{stats.totalCountries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Toplam Puan</span>
                  <span className="text-white font-semibold">{stats.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Doğruluk</span>
                  <span className="text-white font-semibold">%{stats.accuracy.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>

            {/* Zaman Analizi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FaClock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Zaman Analizi</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ortalama Süre</span>
                  <span className="text-white font-semibold">{(stats.averageTime / 1000).toFixed(1)} saniye</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">En Hızlı Cevap</span>
                  <span className="text-green-400 font-semibold">{(stats.fastestAnswer / 1000).toFixed(1)} saniye</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">En Yavaş Cevap</span>
                  <span className="text-red-400 font-semibold">{(stats.slowestAnswer / 1000).toFixed(1)} saniye</span>
                </div>
              </div>
            </motion.div>

            {/* Cevap Dağılımı */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <FaChartBar className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Cevap Dağılımı</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-400">Hızlı (0-5 sn)</span>
                  <span className="ml-auto text-white font-semibold">{stats.timeDistribution.fast}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-gray-400">Orta (5-10 sn)</span>
                  <span className="ml-auto text-white font-semibold">{stats.timeDistribution.medium}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-gray-400">Yavaş (10+ sn)</span>
                  <span className="ml-auto text-white font-semibold">{stats.timeDistribution.slow}</span>
                </div>
              </div>
            </motion.div>

            {/* Bulunan Ülkeler */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <FaTrophy className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Bulunan Ülkeler</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {countries.map((country, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg"
                  >
                    {country.flag} {country.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setDifficulty(null)}
            className="mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <FaRedo className="w-5 h-5" />
            Tekrar Oyna
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Geri Butonu */}
        <motion.button
          onClick={() => setDifficulty(null)}
          className="fixed top-40 left-24 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-white transition-colors duration-200 flex items-center gap-2 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-lg font-medium">Geri</span>
        </motion.button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
            Coğrafya Bulmaca
          </h1>
          <p className="text-gray-400 text-xl">
            {difficulties[difficulty].name} Seviye
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gray-700/50 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2">Soru</div>
                <div className="text-2xl font-bold text-white">
                  {questionNumber}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2">Can</div>
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <FaHeart className="text-red-400" />
                  <span>{lives}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2">Skor</div>
                <div className="text-2xl font-bold text-white">
                  {score}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2">Süre</div>
                <div className="flex items-center gap-3 text-2xl font-bold">
                  <FaClock className="text-green-400" />
                  <span className="text-green-400">
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-4xl mb-4">{countries[currentCountryIndex].flag}</div>
              <div className="text-2xl font-bold text-white mb-2">
                {countries[currentCountryIndex].name}
              </div>
              <div className="text-gray-400">
                {countries[currentCountryIndex].continent}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                    showResult
                      ? option === countries[currentCountryIndex].capital
                        ? 'bg-green-500 text-white'
                        : option === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 