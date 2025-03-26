import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRedo, FaClock, FaChartLine, FaChartBar, FaTrophy, FaCheck } from 'react-icons/fa'

const difficulties = {
  easy: {
    letterCount: 4,
    timeLimit: 180,
    lives: 3
  },
  medium: {
    letterCount: 5,
    timeLimit: 240,
    lives: 3
  },
  hard: {
    letterCount: 6,
    timeLimit: 300,
    lives: 3
  }
}

const TURKISH_LETTERS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'

// Türkçe kelime listesi (örnek)
const TURKISH_WORDS = {
  3: ['KOL', 'KUL', 'KOK', 'KOK', 'KOK', 'KOK', 'KOK', 'KOK', 'KOK', 'KOK'],
  4: ['KALEM', 'KİTAP', 'MASA', 'SANDALYE', 'OKUL', 'TAHTA', 'KAPI', 'PENCERE', 'KUTU', 'KUTU'],
  5: ['BİLGİSAYAR', 'TELEFON', 'TABLET', 'İNTERNET', 'YAZILIM', 'DONANIM', 'KLAVYE', 'FARE', 'KUTU', 'KUTU'],
  6: ['PROGRAMLAMA', 'ALGORİTMA', 'VERİTABANI', 'AĞ', 'GÜVENLİK', 'ŞİFRELEME', 'KODLAMA', 'GELİŞTİRME', 'KUTU', 'KUTU']
}

// Her seviye için örnek kelimeler ve harfler
const WORD_SETS = {
  easy: [
    ['KALEM', 'K', 'A', 'L', 'E', 'M'],
    ['KİTAP', 'K', 'İ', 'T', 'A', 'P'],
    ['MASA', 'M', 'A', 'S', 'A'],
    ['OKUL', 'O', 'K', 'U', 'L'],
    ['KAPI', 'K', 'A', 'P', 'I']
  ],
  medium: [
    ['BİLGİSAYAR', 'B', 'İ', 'L', 'G', 'İ'],
    ['TELEFON', 'T', 'E', 'L', 'E', 'F'],
    ['TABLET', 'T', 'A', 'B', 'L', 'E'],
    ['İNTERNET', 'İ', 'N', 'T', 'E', 'R'],
    ['YAZILIM', 'Y', 'A', 'Z', 'İ', 'L']
  ],
  hard: [
    ['PROGRAMLAMA', 'P', 'R', 'O', 'G', 'R', 'A'],
    ['ALGORİTMA', 'A', 'L', 'G', 'O', 'R', 'İ'],
    ['VERİTABANI', 'V', 'E', 'R', 'İ', 'T', 'A'],
    ['GÜVENLİK', 'G', 'Ü', 'V', 'E', 'N', 'L'],
    ['ŞİFRELEME', 'Ş', 'İ', 'F', 'R', 'E', 'L']
  ]
}

export default function WordGame() {
  const [difficulty, setDifficulty] = useState(null)
  const [letters, setLetters] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(null)
  const [wordTimes, setWordTimes] = useState([])
  const [usedLetters, setUsedLetters] = useState([])
  const [isInvalidWord, setIsInvalidWord] = useState(false)
  const [lives, setLives] = useState(3)
  const [questionNumber, setQuestionNumber] = useState(1)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (timeLeft === null) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const generateLetters = (level) => {
    const wordSets = WORD_SETS[level]
    const randomSet = wordSets[Math.floor(Math.random() * wordSets.length)]
    const letters = randomSet.slice(1) // İlk eleman kelime, geri kalanı harfler
    
    // Harfleri karıştır
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    
    return letters
  }

  const startGame = (level) => {
    setDifficulty(level)
    setLetters(generateLetters(level))
    setFoundWords([])
    setScore(0)
    setTimeLeft(difficulties[level].timeLimit)
    setStartTime(Date.now())
    setEndTime(null)
    setStats(null)
    setWordTimes([])
    setCurrentWord('')
    setUsedLetters([])
    setIsInvalidWord(false)
    setLives(difficulties[level].lives)
    setQuestionNumber(1)
  }

  const handleLetterClick = (letter, index) => {
    if (usedLetters.includes(index)) return

    const newWord = currentWord + letter
    setCurrentWord(newWord)
    setUsedLetters(prev => [...prev, index])
    setIsInvalidWord(false)

    // Kelime kontrolü - minimum 3 harf olmalı
    if (newWord.length >= 3) {
      checkWord(newWord)
    }
  }

  const checkWord = (word) => {
    // Türkçe kelime kontrolü - kelime uzunluğuna göre kontrol et
    const isTurkishWord = TURKISH_WORDS[word.length]?.includes(word)
    
    if (isTurkishWord && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word])
      setScore(prev => prev + (word.length * 10))
      setWordTimes(prev => [...prev, Date.now() - startTime])
      
      // Tüm olası kelimeleri bulduysak yeni soruya geç
      if (foundWords.length >= 5) {
        nextQuestion()
      }
    } else {
      setIsInvalidWord(true)
      setTimeout(() => {
        setCurrentWord('')
        setUsedLetters([])
        setIsInvalidWord(false)
      }, 1500)
    }
  }

  const nextQuestion = () => {
    setQuestionNumber(prev => prev + 1)
    setLetters(generateLetters(difficulty))
    setFoundWords([])
    setCurrentWord('')
    setUsedLetters([])
    setIsInvalidWord(false)
    setTimeLeft(difficulties[difficulty].timeLimit)
    setStartTime(Date.now())
  }

  const clearWord = () => {
    setCurrentWord('')
    setUsedLetters([])
    setIsInvalidWord(false)
  }

  const endGame = () => {
    setEndTime(Date.now())
    const timeSpent = (Date.now() - startTime) / 1000
    const wordCount = foundWords.length

    const performanceAnalysis = {
      timeSpent,
      wordCount,
      score,
      wordTimes,
      averageTime: wordTimes.reduce((a, b) => a + b, 0) / wordTimes.length,
      fastestWord: Math.min(...wordTimes),
      slowestWord: Math.max(...wordTimes),
      timeDistribution: {
        fast: wordTimes.filter(t => t < 10000).length,
        medium: wordTimes.filter(t => t >= 10000 && t < 20000).length,
        slow: wordTimes.filter(t => t >= 20000).length
      }
    }

    setStats(performanceAnalysis)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 relative">
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
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Kelime Oluştur
            </h1>
            <p className="text-gray-400 text-xl">
              Verilen harflerden kelime oluşturun
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(difficulties).map(([key, value], index) => (
              <motion.button
                key={key}
                onClick={() => startGame(key)}
                className="p-8 rounded-3xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-5xl mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <FaCheck />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {key === 'easy' ? 'Kolay' : key === 'medium' ? 'Orta' : 'Zor'}
                </h2>
                <div className="space-y-2 text-left">
                  <p className="text-gray-400">
                    <span className="text-purple-400">•</span> {value.letterCount} harf
                  </p>
                  <p className="text-gray-400">
                    <span className="text-purple-400">•</span> {value.timeLimit} saniye
                  </p>
                  <p className="text-gray-400">
                    <span className="text-purple-400">•</span> {value.lives} can
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
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
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Genel Performans</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Toplam Kelime</span>
                  <span className="text-white font-semibold">{stats.wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Toplam Puan</span>
                  <span className="text-white font-semibold">{stats.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Toplam Süre</span>
                  <span className="text-white font-semibold">{stats.timeSpent.toFixed(1)} saniye</span>
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
                  <span className="text-gray-400">En Hızlı Kelime</span>
                  <span className="text-green-400 font-semibold">{(stats.fastestWord / 1000).toFixed(1)} saniye</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">En Yavaş Kelime</span>
                  <span className="text-red-400 font-semibold">{(stats.slowestWord / 1000).toFixed(1)} saniye</span>
                </div>
              </div>
            </motion.div>

            {/* Kelime Dağılımı */}
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
                <h3 className="text-xl font-bold text-white">Kelime Dağılımı</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-400">Hızlı (0-10 sn)</span>
                  <span className="ml-auto text-white font-semibold">{stats.timeDistribution.fast}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-gray-400">Orta (10-20 sn)</span>
                  <span className="ml-auto text-white font-semibold">{stats.timeDistribution.medium}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-gray-400">Yavaş (20+ sn)</span>
                  <span className="ml-auto text-white font-semibold">{stats.timeDistribution.slow}</span>
                </div>
              </div>
            </motion.div>

            {/* Bulunan Kelimeler */}
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
                <h3 className="text-xl font-bold text-white">Bulunan Kelimeler</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {foundWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg"
                  >
                    {word}
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
            className="mt-8 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <FaRedo className="w-5 h-5" />
            Tekrar Oyna
          </motion.button>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Kelime Oluştur
          </h1>
          <p className="text-gray-400 text-xl">
            {difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor'} Seviye
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
                <div className="text-sm text-gray-400 mb-2">Kelime</div>
                <div className="text-2xl font-bold text-white">
                  {foundWords.length}
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
                  <FaClock className="text-purple-400" />
                  <span className="text-purple-400">
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold mb-2 ${isInvalidWord ? 'text-red-400' : 'text-white'}`}>
                  {currentWord || 'Kelime oluşturun'}
                </div>
                <div className="text-sm text-gray-400">
                  En az 3 harfli kelime oluşturun
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {letters.map((letter, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleLetterClick(letter, index)}
                    disabled={usedLetters.includes(index)}
                    className={`w-16 h-16 rounded-xl text-2xl font-bold transition-all duration-300 ${
                      usedLetters.includes(index)
                        ? isInvalidWord
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {foundWords.map((word, index) => (
                <motion.div
                  key={index}
                  className="px-4 py-2 rounded-lg text-lg font-medium bg-green-500/20 text-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 