import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaBookOpen, FaLightbulb, FaPuzzlePiece, FaGraduationCap, FaStar, FaChartLine, FaMedal, FaArrowRight, FaPlay, FaUsers, FaTrophy, FaClock, FaLock, FaUnlock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();
  
  // Ana sayfa için animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 70,
        damping: 10
      }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      }
    }
  };

  // Öne çıkan oyunlar dizisi
  const featuredGames = [
    {
      id: 1,
      title: "Matematik Macerası",
      description: "Sayıları keşfederek matematik dünyasında eğlenceli bir yolculuğa çıkın.",
      path: "/games/math",
      icon: <FaRocket />,
      color: "text-blue-400",
      gradient: "bg-gradient-to-br from-blue-600/20 to-indigo-700/30",
      border: "border-blue-500/30",
      shadow: "group-hover:shadow-blue-500/30"
    },
    {
      id: 2,
      title: "Dil Hazinesi",
      description: "Kelime bilginizi geliştirin ve yeni dil becerileri kazanın.",
      path: "/games",
      icon: <FaBookOpen />,
      color: "text-emerald-400",
      gradient: "bg-gradient-to-br from-emerald-600/20 to-teal-700/30",
      border: "border-emerald-500/30",
      shadow: "group-hover:shadow-emerald-500/30"
    },
    {
      id: 3,
      title: "Mantık Labirenti",
      description: "Mantıksal düşünme ve problem çözme becerilerinizi geliştirin.",
      path: "/games",
      icon: <FaBrain />,
      color: "text-amber-400",
      gradient: "bg-gradient-to-br from-amber-600/20 to-orange-700/30",
      border: "border-amber-500/30",
      shadow: "group-hover:shadow-amber-500/30"
    }
  ];

  // Özellik bölümü için veriler
  const features = [
    {
      icon: <FaStar className="text-amber-400" />,
      title: "Eğlenceli Öğrenme",
      description: "Oyun temelli eğitimle bilgiler daha kalıcı olur."
    },
    {
      icon: <FaBrain className="text-purple-400" />,
      title: "Bilişsel Gelişim",
      description: "Problem çözme ve eleştirel düşünmeyi geliştirir."
    },
    {
      icon: <FaChartLine className="text-emerald-400" />,
      title: "Hızlı İlerleme",
      description: "İnteraktif yöntemlerle daha hızlı öğrenme."
    },
    {
      icon: <FaMedal className="text-blue-400" />,
      title: "Başarı Motivasyonu",
      description: "Ödül sistemiyle öğrenme motivasyonu artar."
    }
  ];

  // İstatistikler için veriler
  const stats = [
    {
      icon: <FaUsers className="text-blue-400" />,
      value: "10,000+",
      label: "Aktif Öğrenci"
    },
    {
      icon: <FaTrophy className="text-amber-400" />,
      value: "50+",
      label: "Ödül"
    },
    {
      icon: <FaClock className="text-emerald-400" />,
      value: "1M+",
      label: "Öğrenme Saati"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Bölümü */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        {/* Animasyonlu arka plan öğeleri */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-10 left-0 w-full h-[100vh] bg-gradient-to-b from-blue-950/40 via-indigo-950/20 to-transparent"></div>
          <div className="absolute top-1/3 -left-24 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-32 -right-32 w-[35rem] h-[35rem] bg-purple-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/3 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-emerald-500/5 blur-[90px] rotate-12"></div>
          
          {/* Yüzen parlama noktaları */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-20 right-1/4 w-4 h-4 bg-blue-400 rounded-full shadow-xl shadow-blue-400/20"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute bottom-32 left-1/3 w-3 h-3 bg-purple-400 rounded-full shadow-xl shadow-purple-400/20"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full shadow-xl shadow-emerald-400/20"
          ></motion.div>
          
          {/* Yeni eklenmiş animasyonlu daire efektleri */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500/20 rounded-full"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/4 left-1/4 w-48 h-48 border border-purple-500/20 rounded-full"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-emerald-500/20 rounded-full"
          ></motion.div>
          
          {/* Arka plan desen */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC4xIiBkPSJNMzYgMzBoLTZWMGg2djMweiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Hero text bölümü */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
              className="w-full md:w-1/2 text-center md:text-left"
            >
              <div className="relative inline-flex items-center mb-6 px-4 py-2 bg-gray-800/70 backdrop-blur-sm rounded-full border border-gray-700/40 text-sm text-gray-300">
                <span className="absolute -left-1 -top-1 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <FaPlay className="text-white text-[10px] ml-0.5" />
                </span>
                <span className="ml-6">Eğlenceli öğrenme deneyimi</span>
              </div>
              
              {currentUser ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4 flex items-center bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-600/30"
                >
                  <FaUnlock className="mr-2" />
                  <span>Hoş geldin, <span className="font-semibold">{currentUser.username || currentUser.name || currentUser.displayName}</span>! Kaldığın yerden devam et.</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4 flex items-center bg-gray-800/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-700/30"
                >
                  <FaLock className="mr-2 text-gray-400" />
                  <span>Daha fazla içerik ve kişiselleştirilmiş deneyim için <Link to="/login" className="text-blue-400 hover:text-blue-300">giriş yapın</Link>.</span>
                </motion.div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-none">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                  Öğrenmeyi Yeniden 
                </span>
                <br />
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 mt-3">
                  Keşfedin
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300/80 mb-8 max-w-2xl leading-relaxed">
                Eğitici oyunlarımızla eğitimi <span className="text-blue-400 font-medium">eğlenceli bir deneyime</span> dönüştürüyoruz. Çocukların potansiyelini açığa çıkarın.
              </p>

              <motion.div 
                className="flex flex-wrap gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link 
                  to="/games" 
                  className="group relative overflow-hidden px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-medium rounded-xl shadow-xl shadow-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                    Oyunları Keşfet
                    <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                <Link 
                  to="/about" 
                  className="relative px-8 py-3.5 bg-gray-800/60 hover:bg-gray-800/80 text-white text-base font-medium rounded-xl border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  Hakkımızda
                </Link>
              </motion.div>

              {/* İstatistikler */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 text-center shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Hero görsel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full md:w-1/2"
            >
              <div className="relative perspective-1000">
                <div className="relative z-10">
                  <div className="relative p-3 bg-gradient-to-br from-blue-600/20 to-indigo-700/20 rounded-2xl border border-gray-700/20 shadow-2xl backdrop-blur-md hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:rotate-2 transform-gpu">
                    <img 
                      src="https://img.freepik.com/free-vector/kids-online-lessons_52683-36818.jpg" 
                      alt="Eğitici Oyunlar" 
                      className="rounded-xl w-full h-auto shadow-md"
                    />
                    
                    {/* Yüzen detay kartları */}
                    <motion.div 
                      className="absolute -top-10 -right-10 bg-gradient-to-br from-indigo-600/20 to-blue-700/20 rounded-2xl p-4 backdrop-blur-md border border-indigo-500/30 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <FaPuzzlePiece className="text-indigo-400 text-2xl" />
                    </motion.div>
                    
                    <motion.div 
                      className="absolute -bottom-8 -left-8 bg-gradient-to-br from-amber-600/20 to-orange-700/20 rounded-2xl p-4 backdrop-blur-md border border-amber-500/30 shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <FaRocket className="text-amber-400 text-2xl" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Neden Bizi Seçmelisiniz?
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Eğitici Oyunlar platformu, çocukların öğrenme sürecini eğlenceli ve etkili hale getirmek için tasarlanmıştır.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-6 bg-gray-800/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-700/50 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Öne Çıkan Oyunlar Bölümü */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Öne Çıkan Oyunlar
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              En popüler eğitici oyunlarımızı keşfedin ve öğrenme yolculuğunuza başlayın.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16"
          >
            {featuredGames.map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group p-6 rounded-2xl backdrop-blur-sm border ${game.border} ${game.gradient} hover:border-opacity-70 transition-all duration-300 shadow-xl hover:shadow-2xl ${game.shadow}`}
              >
                <div className={`w-14 h-14 mb-5 flex items-center justify-center rounded-xl ${game.gradient} border ${game.border} text-2xl ${game.color}`}>
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{game.description}</p>
                <Link 
                  to={game.path}
                  className="inline-flex items-center text-sm font-medium text-white bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <span>Oyna</span>
                  <FaArrowRight className="ml-2 text-xs opacity-70" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-20 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Öğrenmeye Başlayın
              </span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Eğitici oyunlarımızla çocuklarınızın öğrenme yolculuğuna bugün başlayın.
              Ücretsiz hesap oluşturun ve tüm oyunlara erişim sağlayın.
            </p>
            <Link
              to="/games"
              className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-medium rounded-xl shadow-xl shadow-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1"
            >
              Ücretsiz Başla
              <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Yeni Eklenen İçerik Bölümü */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-indigo-600/5 to-transparent"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px]"></div>
          
          {/* Animasyonlu arka plan öğeleri */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-600/5 rounded-full blur-[50px]"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-600/5 rounded-full blur-[60px]"
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Eğitici Teknolojiler
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              En son teknolojileri kullanarak interaktif eğitim deneyimleri sunuyoruz
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Yeni kart 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-md"
            >
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-500/10 rounded-full blur-[30px] group-hover:bg-purple-500/20 transition-all duration-700"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-pink-500/10 rounded-full blur-[30px] group-hover:bg-pink-500/20 transition-all duration-700"></div>
              
              <div className="w-16 h-16 mb-6 p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 shadow-lg">
                <FaLightbulb className="text-3xl text-purple-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Yapay Zeka Destekli</h3>
              <p className="text-gray-300 mb-6">Öğrencinin seviyesine uygun içerik öneren ve kişiselleştirilmiş eğitim yolculuğu sunan AI teknolojisi.</p>
              
              <div className="flex items-center space-x-1 text-purple-400 mt-auto">
                <span className="text-sm font-medium">Geleceğin öğrenme biçimi</span>
                <FaArrowRight className="text-xs" />
              </div>
            </motion.div>
            
            {/* Yeni kart 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-md"
            >
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-blue-500/10 rounded-full blur-[30px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-[30px] group-hover:bg-cyan-500/20 transition-all duration-700"></div>
              
              <div className="w-16 h-16 mb-6 p-3 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30 shadow-lg">
                <FaPuzzlePiece className="text-3xl text-blue-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Gamifikasyon</h3>
              <p className="text-gray-300 mb-6">Oyun mekanikleri ile öğrenmeyi daha eğlenceli ve bağımlayıcı hale getiren ileri düzey sistemler.</p>
              
              <div className="flex items-center space-x-1 text-blue-400 mt-auto">
                <span className="text-sm font-medium">Eğlenerek öğren</span>
                <FaArrowRight className="text-xs" />
              </div>
            </motion.div>
            
            {/* Yeni kart 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-md"
            >
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-[30px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-teal-500/10 rounded-full blur-[30px] group-hover:bg-teal-500/20 transition-all duration-700"></div>
              
              <div className="w-16 h-16 mb-6 p-3 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl border border-emerald-500/30 shadow-lg">
                <FaGraduationCap className="text-3xl text-emerald-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Milli Müfredat Uyumlu</h3>
              <p className="text-gray-300 mb-6">Milli Eğitim müfredatına uygun tasarlanmış içeriklerle okuldaki başarıyı destekleyen yapı.</p>
              
              <div className="flex items-center space-x-1 text-emerald-400 mt-auto">
                <span className="text-sm font-medium">Eğitimde kalite</span>
                <FaArrowRight className="text-xs" />
              </div>
            </motion.div>
          </div>
          
          {/* Başarı Ölçümü Bölümü */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 p-8 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  Gerçek Zamanlı İlerleme Takibi
                </h3>
                <p className="text-gray-300 mb-6">
                  Çocuğunuzun eğitim yolculuğunu anlık olarak takip edin. Güçlü ve geliştirilmesi gereken alanları görerek, kişiselleştirilmiş öğrenme deneyimi sunun.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30 text-sm">
                    <span className="font-semibold text-indigo-400">%92</span> <span className="text-gray-400">Kullanıcı Memnuniyeti</span>
                  </div>
                  <div className="px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-500/30 text-sm">
                    <span className="font-semibold text-purple-400">%85</span> <span className="text-gray-400">Başarı Artışı</span>
                  </div>
                  <div className="px-4 py-2 bg-blue-600/20 rounded-lg border border-blue-500/30 text-sm">
                    <span className="font-semibold text-blue-400">+45</span> <span className="text-gray-400">Ülkede Kullanım</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/30 shadow-lg"
                >
                  <img 
                    src="https://cdn.dribbble.com/users/1026227/screenshots/16029532/chart.png" 
                    alt="İlerleme Grafiği" 
                    className="rounded-xl w-full h-auto shadow-md"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 