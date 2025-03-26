import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { FaUser, FaChartBar, FaGamepad, FaTrophy, FaClock, FaMedal, FaCog, FaBell, FaBookmark } from 'react-icons/fa';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Demo veriler
  const userStats = {
    totalPlayTime: '24 saat',
    gamesPlayed: 12,
    highestScore: 950,
    achievements: 8,
    level: 5,
    xp: 2500,
    nextLevelXp: 3000,
    lastActive: '2 saat önce'
  };

  const recentGames = [
    { id: 1, name: 'Matematik Macerası', score: 850, date: '2 saat önce', progress: 80 },
    { id: 2, name: 'Hafıza Oyunu', score: 720, date: '1 gün önce', progress: 65 },
    { id: 3, name: 'Kelime Hazinesi', score: 930, date: '3 gün önce', progress: 90 }
  ];

  const achievements = [
    { id: 1, name: 'Matematik Ustası', icon: <FaMedal className="text-yellow-400" />, completed: true, description: '100 matematik sorusu çöz' },
    { id: 2, name: 'Hızlı Düşünür', icon: <FaClock className="text-blue-400" />, completed: true, description: 'Bir oyunu 2 dakikada tamamla' },
    { id: 3, name: 'Kelime Dehası', icon: <FaTrophy className="text-purple-400" />, completed: false, description: '500 kelime öğren', progress: 70 },
  ];

  // XP barının genişliğini hesapla
  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pb-20">
      {/* Profil Üst Kısım */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Arka plan desenleri */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar ve isim */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl shadow-blue-500/10">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                  <FaUser className="text-5xl" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-2 border-2 border-gray-700 shadow-lg">
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-full text-white">
                  <span className="text-xs font-bold">{userStats.level}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentUser.name}</h1>
              <p className="text-gray-400 mb-4">{currentUser.email}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center bg-gray-800/70 rounded-xl px-4 py-2 text-sm text-gray-300">
                  <FaClock className="mr-2 text-blue-400" />
                  <span>Son aktivite: {userStats.lastActive}</span>
                </div>
                <div className="flex items-center bg-gray-800/70 rounded-xl px-4 py-2 text-sm text-gray-300">
                  <FaGamepad className="mr-2 text-indigo-400" />
                  <span>{userStats.gamesPlayed} oyun oynandı</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="ml-auto hidden md:block"
            >
              <Link 
                to="/settings" 
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/70 rounded-xl text-gray-300 hover:bg-gray-800 transition-all duration-300"
              >
                <FaCog className="text-gray-400" />
                <span>Ayarlar</span>
              </Link>
            </motion.div>
          </div>

          {/* XP Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Seviye {userStats.level}</span>
              <span>{userStats.xp} / {userStats.nextLevelXp} XP</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              Bir sonraki seviyeye: {userStats.nextLevelXp - userStats.xp} XP
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profil İçerik */}
      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-3 md:flex border-b border-gray-800">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`py-4 px-6 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 transition-all duration-300 ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
              }`}
            >
              <FaChartBar />
              <span>Genel Bakış</span>
            </button>
            <button 
              onClick={() => setActiveTab('games')} 
              className={`py-4 px-6 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 transition-all duration-300 ${
                activeTab === 'games' 
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
              }`}
            >
              <FaGamepad />
              <span>Oyunlar</span>
            </button>
            <button 
              onClick={() => setActiveTab('achievements')} 
              className={`py-4 px-6 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 transition-all duration-300 ${
                activeTab === 'achievements' 
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
              }`}
            >
              <FaTrophy />
              <span>Başarılar</span>
            </button>
          </div>

          {/* Tab İçerikleri */}
          <div className="p-6">
            {/* Genel Bakış */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-900/50 rounded-lg mr-3">
                        <FaGamepad className="text-blue-400" />
                      </div>
                      <h3 className="text-gray-300 font-medium">Toplam Oyun</h3>
                    </div>
                    <p className="text-2xl text-white font-bold">{userStats.gamesPlayed}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-purple-900/50 rounded-lg mr-3">
                        <FaTrophy className="text-purple-400" />
                      </div>
                      <h3 className="text-gray-300 font-medium">En Yüksek Skor</h3>
                    </div>
                    <p className="text-2xl text-white font-bold">{userStats.highestScore}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-green-900/50 rounded-lg mr-3">
                        <FaClock className="text-green-400" />
                      </div>
                      <h3 className="text-gray-300 font-medium">Toplam Süre</h3>
                    </div>
                    <p className="text-2xl text-white font-bold">{userStats.totalPlayTime}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-yellow-900/50 rounded-lg mr-3">
                        <FaMedal className="text-yellow-400" />
                      </div>
                      <h3 className="text-gray-300 font-medium">Başarılar</h3>
                    </div>
                    <p className="text-2xl text-white font-bold">{userStats.achievements}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl text-white font-bold mb-4">Son Oyunlar</h2>
                  <div className="space-y-4">
                    {recentGames.map(game => (
                      <div key={game.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex items-center justify-center bg-indigo-900/50 rounded-lg mr-3">
                              <FaGamepad className="text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{game.name}</h3>
                              <p className="text-gray-400 text-sm">{game.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{game.score}</p>
                            <p className="text-gray-400 text-sm">puan</p>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            style={{ width: `${game.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-400 mt-1">
                          İlerleme: %{game.progress}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link 
                      to="/games" 
                      className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <FaGamepad className="mr-2" />
                      <span>Tüm Oyunlar</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Oyunlar */}
            {activeTab === 'games' && (
              <div className="space-y-6">
                <h2 className="text-xl text-white font-bold mb-4">Oyun İstatistiklerim</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matematik Oyunu */}
                  <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-5 border-b border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mr-4">
                          <span className="text-xl font-bold text-blue-400">M</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Matematik Oyunu</h3>
                          <p className="text-gray-400 text-sm">Son oynama: 2 saat önce</p>
                        </div>
                        <div className="ml-auto bg-blue-600/20 px-3 py-1 rounded-lg">
                          <span className="text-blue-400 text-sm font-medium">Seviye 4</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Skor:</span>
                        <span className="text-white font-bold">1,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doğru Cevaplar:</span>
                        <span className="text-green-400 font-bold">48</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Yanlış Cevaplar:</span>
                        <span className="text-red-400 font-bold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Oyun:</span>
                        <span className="text-white font-bold">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Süre:</span>
                        <span className="text-white font-bold">4.5 saat</span>
                      </div>
                      
                      <Link to="/games/math" className="block mt-4 text-center py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300">
                        Oyuna Git
                      </Link>
                    </div>
                  </div>
                  
                  {/* Hafıza Oyunu */}
                  <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-5 border-b border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-purple-900/50 rounded-lg mr-4">
                          <span className="text-xl font-bold text-purple-400">H</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Hafıza Oyunu</h3>
                          <p className="text-gray-400 text-sm">Son oynama: 1 gün önce</p>
                        </div>
                        <div className="ml-auto bg-purple-600/20 px-3 py-1 rounded-lg">
                          <span className="text-purple-400 text-sm font-medium">Seviye 3</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Skor:</span>
                        <span className="text-white font-bold">980</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eşleştirmeler:</span>
                        <span className="text-green-400 font-bold">142</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">En İyi Süre:</span>
                        <span className="text-white font-bold">1:24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Oyun:</span>
                        <span className="text-white font-bold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Süre:</span>
                        <span className="text-white font-bold">3.2 saat</span>
                      </div>
                      
                      <Link to="/games/memory" className="block mt-4 text-center py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                        Oyuna Git
                      </Link>
                    </div>
                  </div>
                  
                  {/* Kelime Oyunu */}
                  <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                    <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 p-5 border-b border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-green-900/50 rounded-lg mr-4">
                          <span className="text-xl font-bold text-green-400">K</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Kelime Oyunu</h3>
                          <p className="text-gray-400 text-sm">Son oynama: 3 gün önce</p>
                        </div>
                        <div className="ml-auto bg-green-600/20 px-3 py-1 rounded-lg">
                          <span className="text-green-400 text-sm font-medium">Seviye 2</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Skor:</span>
                        <span className="text-white font-bold">720</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doğru Kelimeler:</span>
                        <span className="text-green-400 font-bold">85</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Yanlış Kelimeler:</span>
                        <span className="text-red-400 font-bold">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Oyun:</span>
                        <span className="text-white font-bold">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Süre:</span>
                        <span className="text-white font-bold">2.7 saat</span>
                      </div>
                      
                      <Link to="/games/word" className="block mt-4 text-center py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-medium hover:from-green-500 hover:to-teal-500 transition-all duration-300">
                        Oyuna Git
                      </Link>
                    </div>
                  </div>
                  
                  {/* İngilizce Oyunu */}
                  <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                    <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 p-5 border-b border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-yellow-900/50 rounded-lg mr-4">
                          <span className="text-xl font-bold text-yellow-400">İ</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">İngilizce Oyunu</h3>
                          <p className="text-gray-400 text-sm">Son oynama: 4 gün önce</p>
                        </div>
                        <div className="ml-auto bg-yellow-600/20 px-3 py-1 rounded-lg">
                          <span className="text-yellow-400 text-sm font-medium">Seviye 1</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Skor:</span>
                        <span className="text-white font-bold">450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doğru Çeviriler:</span>
                        <span className="text-green-400 font-bold">42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Yanlış Çeviriler:</span>
                        <span className="text-red-400 font-bold">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Oyun:</span>
                        <span className="text-white font-bold">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Süre:</span>
                        <span className="text-white font-bold">1.5 saat</span>
                      </div>
                      
                      <Link to="/games/english" className="block mt-4 text-center py-2 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg text-white font-medium hover:from-yellow-500 hover:to-amber-500 transition-all duration-300">
                        Oyuna Git
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Link to="/games" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2">
                    <FaGamepad className="text-blue-400" />
                    <span>Tüm Oyunlara Git</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Başarılar */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h2 className="text-xl text-white font-bold mb-4">Kazanılan Başarılar</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map(achievement => (
                    <div 
                      key={achievement.id} 
                      className={`bg-gray-800/50 rounded-xl p-5 border ${
                        achievement.completed ? 'border-yellow-500/30' : 'border-gray-700/50'
                      } relative overflow-hidden`}
                    >
                      {achievement.completed && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                      )}
                      <div className="flex items-start">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg mr-4 ${
                          achievement.completed ? 'bg-yellow-900/30' : 'bg-gray-700/50'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-white font-medium">{achievement.name}</h3>
                            {achievement.completed ? (
                              <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs rounded-lg">Tamamlandı</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-lg">Devam Ediyor</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                          
                          {!achievement.completed && achievement.progress && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">İlerleme</span>
                                <span className="text-xs text-gray-500">%{achievement.progress}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 