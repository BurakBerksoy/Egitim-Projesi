import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBrain, FaRedo, FaClock, FaChartLine, FaChartBar, FaTrophy } from 'react-icons/fa'

const gridSizes = {
  small: { rows: 2, cols: 2, pairs: 2 },
  medium: { rows: 2, cols: 4, pairs: 4 },
  large: { rows: 4, cols: 4, pairs: 8 }
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔']

export default function MemoryGame() {
  const [gridSize, setGridSize] = useState(null)
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(null)
  const [cardTimes, setCardTimes] = useState([])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const generateCards = (pairs) => {
    const selectedEmojis = emojis.slice(0, pairs)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
    return cardPairs.sort(() => Math.random() - 0.5)
  }

  const startGame = (size) => {
    setGridSize(size)
    setCards(generateCards(gridSizes[size].pairs))
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setScore(0)
    setStartTime(Date.now())
    setEndTime(null)
    setStats(null)
    setCardTimes([])
  }

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)) return

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = newFlippedCards
      const isMatch = cards[first] === cards[second]

      if (isMatch) {
        setMatchedPairs(prev => [...prev, first, second])
        setScore(prev => prev + 100)
        setFlippedCards([])
        setCardTimes(prev => [...prev, Date.now() - startTime])

        if (matchedPairs.length + 2 === cards.length) {
          endGame()
        }
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const endGame = () => {
    setEndTime(Date.now())
    const timeSpent = (Date.now() - startTime) / 1000
    const accuracy = (score / (moves * 100)) * 100

    const performanceAnalysis = {
      timeSpent,
      accuracy,
      totalPairs: gridSizes[gridSize].pairs,
      score,
      moves,
      cardTimes,
      averageTime: cardTimes.reduce((a, b) => a + b, 0) / cardTimes.length,
      fastestPair: Math.min(...cardTimes),
      slowestPair: Math.max(...cardTimes),
      timeDistribution: {
        fast: cardTimes.filter(t => t < 5000).length,
        medium: cardTimes.filter(t => t >= 5000 && t < 10000).length,
        slow: cardTimes.filter(t => t >= 10000).length
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

  if (!gridSize) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Hafıza Kartları
            </h1>
            <p className="text-gray-400 text-xl">
              Grid boyutunu seçin ve hafızanızı test edin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(gridSizes).map(([key, value], index) => (
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
                  <FaBrain />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {key === 'small' ? 'Küçük Grid' : key === 'medium' ? 'Orta Grid' : 'Büyük Grid'}
                </h2>
                <div className="space-y-2 text-left">
                  <p className="text-gray-400">
                    <span className="text-purple-400">•</span> {value.pairs} çift kart
                  </p>
                  <p className="text-gray-400">
                    <span className="text-purple-400">•</span> {value.rows}x{value.cols} grid
                  </p>
                  <p className="text-gray-400">
                    <span className="text-purple-400">•</span> {key === 'small' ? 'Başlangıç için ideal' : key === 'medium' ? 'Orta seviye zorluk' : 'Uzman seviyesi'}
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
                  <span className="text-gray-400">Toplam Çift</span>
                  <span className="text-white font-semibold">{stats.totalPairs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Toplam Puan</span>
                  <span className="text-white font-semibold">{stats.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Başarı Oranı</span>
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
                  <span className="text-gray-400">Toplam Süre</span>
                  <span className="text-white font-semibold">{stats.timeSpent.toFixed(1)} saniye</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ortalama Süre</span>
                  <span className="text-white font-semibold">{(stats.averageTime / 1000).toFixed(1)} saniye</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">En Hızlı Çift</span>
                  <span className="text-green-400 font-semibold">{(stats.fastestPair / 1000).toFixed(1)} saniye</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">En Yavaş Çift</span>
                  <span className="text-red-400 font-semibold">{(stats.slowestPair / 1000).toFixed(1)} saniye</span>
                </div>
              </div>
            </motion.div>

            {/* Çift Dağılımı */}
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
                <h3 className="text-xl font-bold text-white">Çift Dağılımı</h3>
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

            {/* Başarı Grafiği */}
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
                <h3 className="text-xl font-bold text-white">Başarı Grafiği</h3>
              </div>
              <div className="h-32 flex items-end justify-between gap-1">
                {stats.cardTimes.map((time, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(time / stats.slowestPair) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-4 rounded-t-full ${
                      time < 5000 ? 'bg-green-400' :
                      time < 10000 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setGridSize(null)}
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Hafıza Kartları
          </h1>
          <p className="text-gray-400 text-xl">
            {gridSize === 'small' ? 'Küçük Grid' : gridSize === 'medium' ? 'Orta Grid' : 'Büyük Grid'}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-700/50 rounded-2xl p-6">
              <div className="text-sm text-gray-400 mb-2">Çift</div>
              <div className="text-2xl font-bold text-white">
                {matchedPairs.length / 2}/{gridSizes[gridSize].pairs}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-2xl p-6">
              <div className="text-sm text-gray-400 mb-2">Skor</div>
              <div className="text-2xl font-bold text-white">
                {score}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-2xl p-6">
              <div className="text-sm text-gray-400 mb-2">Hamle</div>
              <div className="text-2xl font-bold text-white">
                {moves}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-2xl p-6">
              <div className="text-sm text-gray-400 mb-2">Süre</div>
              <div className="flex items-center gap-3 text-2xl font-bold">
                <FaClock className="text-purple-400" />
                <span className="text-purple-400">
                  {Math.floor((Date.now() - startTime) / 1000)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4" style={{
            gridTemplateColumns: `repeat(${gridSizes[gridSize].cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSizes[gridSize].rows}, 1fr)`
          }}>
            {cards.map((card, index) => (
              <motion.button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)}
                className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 ${
                  flippedCards.includes(index) || matchedPairs.includes(index)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {flippedCards.includes(index) || matchedPairs.includes(index) ? card : '?'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 