import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, 
  FaGamepad, 
  FaBook, 
  FaBrain, 
  FaFilter, 
  FaCalculator,
  FaStar,
  FaChild,
  FaRocket,
  FaLightbulb,
  FaClock,
  FaChalkboardTeacher,
  FaTrophy,
  FaGraduationCap,
  FaArrowRight,
  FaBookOpen,
  FaMedal,
  FaChartLine,
  FaGlobe,
  FaFlask,
  FaLanguage,
  FaHeart,
  FaUsers,
  FaBookReader,
  FaAtom,
  FaMapMarkedAlt
} from 'react-icons/fa'

// Oyun kategorileri
const categories = [
  { 
    id: 'all', 
    name: 'Tümü', 
    icon: <FaGamepad />, 
    color: 'text-blue-400',
    description: 'Tüm oyunları görüntüle'
  },
  { 
    id: 'math', 
    name: 'Matematik', 
    icon: <FaCalculator />, 
    color: 'text-emerald-400',
    description: 'Matematik becerilerini geliştir'
  },
  { 
    id: 'language', 
    name: 'Dil', 
    icon: <FaBook />, 
    color: 'text-purple-400',
    description: 'Dil öğrenme oyunları'
  },
  { 
    id: 'logic', 
    name: 'Mantık', 
    icon: <FaBrain />, 
    color: 'text-amber-400',
    description: 'Mantık ve hafıza oyunları'
  },
  { 
    id: 'science', 
    name: 'Fen Bilgisi', 
    icon: <FaFlask />, 
    color: 'text-red-400',
    description: 'Bilimsel bilgileri test et'
  },
  { 
    id: 'geography', 
    name: 'Coğrafya', 
    icon: <FaGlobe />, 
    color: 'text-sky-400',
    description: 'Coğrafya bilgilerini geliştir'
  }
]

// Tüm oyunlar
const allGames = [
  {
    id: 1,
    title: 'Matematik Macerası',
    description: 'Matematik becerilerinizi geliştirin ve eğlenceli problemler çözün.',
    difficulty: 'Kolay',
    ageRange: '6-9 yaş',
    category: 'math',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    path: '/games/math',
    color: 'from-blue-500 to-indigo-600',
    icon: <FaCalculator />,
    features: [
      'Farklı zorluk seviyeleri',
      'Çeşitli matematik işlemleri',
      'Süre sınırı',
      'Can sistemi',
      'Performans analizi'
    ],
    iconBg: 'bg-blue-500/20',
    stats: {
      players: 1234,
      rating: 4.8,
      playCount: 5678
    }
  },
  {
    id: 2,
    title: 'Hafıza Kartları',
    description: 'Görsel hafızanı geliştir, eşleşen kartları bul ve konsantrasyon becerilerini güçlendir.',
    difficulty: 'Orta',
    ageRange: '7-12 yaş',
    category: 'logic',
    imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    path: '/games/memory',
    color: 'from-purple-500 to-pink-600',
    icon: <FaBrain />,
    features: [
      'Hafıza geliştirme',
      'Odaklanma becerileri',
      'Eşleştirme oyunu',
      'Süre sınırı',
      'Can sistemi'
    ],
    iconBg: 'bg-purple-500/20',
    stats: {
      players: 2345,
      rating: 4.9,
      playCount: 6789
    }
  },
  {
    id: 3,
    title: 'Kelime Avı',
    description: 'Yeni kelimeler öğren, yazım becerilerini geliştir ve kelime hazneni zenginleştir.',
    difficulty: 'Orta',
    ageRange: '8-12 yaş',
    category: 'language',
    imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    path: '/games/word',
    color: 'from-emerald-500 to-teal-600',
    icon: <FaBook />,
    features: [
      'Kelime hazinesi',
      'Yazım geliştirme',
      'Dil becerileri',
      'Süre sınırı',
      'Can sistemi'
    ],
    iconBg: 'bg-emerald-500/20',
    stats: {
      players: 3456,
      rating: 4.7,
      playCount: 7890
    }
  },
  {
    id: 4,
    title: 'İngilizce Kelime Eşleştirme',
    description: 'İngilizce kelimeleri Türkçe karşılıklarıyla eşleştirerek dil öğren.',
    difficulty: 'Orta',
    ageRange: '8-12 yaş',
    category: 'language',
    imageUrl: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    path: '/games/english',
    color: 'from-amber-500 to-orange-600',
    icon: <FaLanguage />,
    features: [
      'Kelime eşleştirme',
      'Dil öğrenme',
      'Pratik yapma',
      'Süre sınırı',
      'Can sistemi'
    ],
    iconBg: 'bg-amber-500/20',
    stats: {
      players: 4567,
      rating: 4.6,
      playCount: 8901
    }
  },
  {
    id: 5,
    title: 'Fen Bilgisi Quiz',
    description: 'Bilimsel bilgilerini test et ve yeni şeyler öğren.',
    difficulty: 'Orta',
    ageRange: '9-13 yaş',
    category: 'science',
    imageUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    path: '/games/science',
    color: 'from-red-500 to-rose-600',
    icon: <FaFlask />,
    features: [
      'Bilimsel bilgiler',
      'Quiz formatı',
      'Öğrenme',
      'Süre sınırı',
      'Can sistemi'
    ],
    iconBg: 'bg-red-500/20',
    stats: {
      players: 5678,
      rating: 4.8,
      playCount: 9012
    }
  },
  {
    id: 6,
    title: 'Coğrafya Bulmaca',
    description: 'Ülkeler ve başkentleri hakkında bilgilerini test et.',
    difficulty: 'Orta',
    ageRange: '9-13 yaş',
    category: 'geography',
    imageUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    path: '/games/geography',
    color: 'from-sky-500 to-blue-600',
    icon: <FaGlobe />,
    features: [
      'Coğrafya bilgisi',
      'Ülkeler ve başkentler',
      'Dünya kültürü',
      'Süre sınırı',
      'Can sistemi'
    ],
    iconBg: 'bg-sky-500/20',
    stats: {
      players: 6789,
      rating: 4.7,
      playCount: 1234
    }
  }
]

// Animasyon varyantları
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
}

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
}

function GamesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [filteredGames, setFilteredGames] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedAgeRange, setSelectedAgeRange] = useState('all')
  
  // Sayfa kaydırma olayını izleme
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Filtreleme fonksiyonu
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      const filtered = allGames.filter(game => {
        const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             game.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
        const matchesAgeRange = selectedAgeRange === 'all' || game.ageRange === selectedAgeRange;
        return matchesCategory && matchesSearch && matchesDifficulty && matchesAgeRange;
      });
      setFilteredGames(filtered);
      setIsFiltering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, selectedDifficulty, selectedAgeRange]);

  // Zorluk seviyesine göre renk belirleme
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Kolay': return 'bg-emerald-600/30 text-emerald-400 border-emerald-500/30'
      case 'Orta': return 'bg-amber-600/30 text-amber-400 border-amber-500/30'
      case 'Zor': return 'bg-red-600/30 text-red-400 border-red-500/30'
      default: return 'bg-gray-700/50 text-gray-300 border-gray-600/30'
    }
  }

  // Zorluk seviyesine göre ikon belirleme
  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case 'Kolay': return <FaChild className="mr-1" />
      case 'Orta': return <FaGraduationCap className="mr-1" />
      case 'Zor': return <FaTrophy className="mr-1" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen relative pb-20">
      {/* Arkaplan dekorasyonu */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-blue-900/20 to-transparent opacity-60"></div>
        <div className="absolute top-[20vh] left-0 w-2/3 h-[30vh] bg-gradient-to-r from-purple-900/20 to-transparent opacity-40"></div>
        <div className="absolute top-[60vh] right-0 w-1/2 h-[40vh] bg-gradient-to-l from-indigo-900/20 to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[80px] opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[80px] opacity-30"></div>
      </div>
      
      {/* Sayfa Başlığı */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30"></div>
            <div className="relative px-6 py-1 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-2 text-blue-400">
                <FaGamepad />
                <span className="text-sm font-semibold">EĞİTİCİ OYUNLAR KOLEKSİYONU</span>
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"
          >
            Oyna, Öğren ve Keşfet
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-300/90 max-w-3xl mx-auto mb-10"
          >
            Çocukların zihinsel gelişimini destekleyen, eğlenceli ve interaktif oyunlarla bilgiyi 
            eğlenceye dönüştürüyoruz.
          </motion.p>

          {/* Arama ve Filtreleme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-gray-700/30 hover:border-blue-500/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`text-2xl mb-2 ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-white font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filtreler */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">Tüm Zorluk Seviyeleri</option>
              <option value="Kolay">Kolay</option>
              <option value="Orta">Orta</option>
              <option value="Zor">Zor</option>
            </select>

            <select
              value={selectedAgeRange}
              onChange={(e) => setSelectedAgeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">Tüm Yaş Aralıkları</option>
              <option value="6-9 yaş">6-9 yaş</option>
              <option value="7-12 yaş">7-12 yaş</option>
              <option value="8-12 yaş">8-12 yaş</option>
              <option value="9-13 yaş">9-13 yaş</option>
            </select>
          </motion.div>
        </div>
      </section>

      {/* Oyun Kartları */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isFiltering ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-20"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group relative h-full"
                  >
                    <Link to={game.path} className="h-full block">
                      <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 transition-all duration-300 group-hover:border-blue-500/50 h-full flex flex-col">
                        {/* Oyun Görseli */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={game.imageUrl}
                            alt={game.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.difficulty)}`}>
                                {getDifficultyIcon(game.difficulty)}
                                {game.difficulty}
                              </div>
                              <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-300">
                                {game.ageRange}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Oyun Bilgileri */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${game.iconBg}`}>
                              <div className="text-2xl text-white">
                                {game.icon}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                            </div>
                          </div>

                          {/* Özellikler */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {game.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-700/50 text-gray-300"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* İstatistikler */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-700/30 mt-auto">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-gray-400">
                                <FaUsers className="text-sm" />
                                <span className="text-sm">{game.stats.players}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400">
                                <FaStar className="text-sm text-yellow-400" />
                                <span className="text-sm">{game.stats.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-blue-400">
                              <span className="text-sm font-medium">Oyna</span>
                              <FaArrowRight className="text-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default GamesPage 