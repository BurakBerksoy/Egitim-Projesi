import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaHeart, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaTimes, FaBars, FaGithub, FaUserAlt, FaSignOutAlt, FaUserCircle, FaHome, FaGamepad, FaInfoCircle, FaUser, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Giriş yapmamış kullanıcılar için navigasyon menüsü
  const publicNavItems = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hakkımızda', path: '/about' }
  ];

  // Giriş yapmış kullanıcılar için navigasyon menüsü
  const privateNavItems = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Oyunlar', path: '/games' },
    { name: 'Hakkımızda', path: '/about' }
  ];

  // Kullanıcının giriş durumuna göre uygun navigasyon menüsünü seç
  const navItems = currentUser ? privateNavItems : publicNavItems;

  const authItems = [
    { name: 'Giriş Yap', path: '/login' },
    { name: 'Kayıt Ol', path: '/register' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 backdrop-blur-xl bg-gray-900/80 shadow-lg shadow-black/20' : 'py-5 bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center group">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg ${
                  scrolled ? 'shadow-blue-500/30' : 'shadow-blue-500/20'
                } mr-3 transition-all group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:-translate-y-0.5`}
              >
                <FaGraduationCap className="text-white text-2xl" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Eğitici</span>
                <span className="font-bold text-xl ml-1">Oyunlar</span>
              </motion.div>
            </Link>

            <motion.ul 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex space-x-2"
            >
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.path}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                >
                  <Link 
                    to={item.path} 
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                      isActive(item.path) ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {isActive(item.path) && (
                      <motion.span 
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 z-0"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                    {!isActive(item.path) && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    )}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex space-x-3"
            >
              {currentUser ? (
                <div className="relative">
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-white hover:border-blue-500/50 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                      <FaUserCircle className="text-white text-lg" />
                    </div>
                    <span className="ml-2 font-semibold">{currentUser.username || currentUser.name || currentUser.displayName}</span>
                  </button>
                  
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl shadow-black/20 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                          <p className="text-sm font-medium text-white">{currentUser.username || currentUser.name || currentUser.displayName}</p>
                          <p className="text-xs text-gray-400">{currentUser.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <FaUser className="mr-2 text-blue-400" />
                            Profil
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <FaCog className="mr-2 text-green-400" />
                            Ayarlar
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors mt-2 border-t border-gray-700/50 pt-2"
                          >
                            <FaSignOutAlt className="mr-2 text-red-400" />
                            Çıkış Yap
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex space-x-3 items-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/login" 
                      className="relative overflow-hidden group flex items-center px-5 py-2.5 rounded-xl text-sm font-medium border border-blue-500/30 hover:border-blue-500/50 bg-gray-800/50 hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <div className="mr-2 w-7 h-7 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg">
                        <FaUserAlt className="text-blue-400 text-xs" />
                      </div>
                      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">Giriş Yap</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.2 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/register" 
                      className="relative overflow-hidden group flex items-center px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"></span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute -inset-x-2 bottom-0 h-[2px] bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 blur-sm"></span>
                      <span className="absolute -inset-x-2 bottom-0 h-px bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80"></span>
                      <div className="relative z-10 mr-2 w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                        <FaUserAlt className="text-white text-xs" />
                      </div>
                      <span className="relative z-10 text-white">Kayıt Ol</span>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="md:hidden bg-gray-800/90 p-2.5 rounded-xl border border-gray-700/30 text-gray-300 hover:text-white transition-colors hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü"
            >
              {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobileMenu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden p-4"
            >
              <div className="flex flex-col space-y-2">
                {currentUser ? (
                  <>
                    <div className="flex items-center p-2 mb-3 border-b border-gray-700/50 pb-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-lg shadow-blue-500/20 mr-3">
                        <FaUserCircle className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{currentUser.username || currentUser.name || currentUser.displayName}</p>
                        <p className="text-xs text-gray-400">{currentUser.email}</p>
                      </div>
                    </div>

                    <Link 
                      to="/"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaHome className="text-blue-400" />
                      <span>Ana Sayfa</span>
                    </Link>

                    <Link 
                      to="/games"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaGamepad className="text-indigo-400" />
                      <span>Oyunlar</span>
                    </Link>

                    <Link 
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaUser className="text-blue-400" />
                      <span>Profil</span>
                    </Link>

                    <Link 
                      to="/settings"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaCog className="text-green-400" />
                      <span>Ayarlar</span>
                    </Link>

                    <Link 
                      to="/about"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaInfoCircle className="text-purple-400" />
                      <span>Hakkımızda</span>
                    </Link>

                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 mt-2 border-t border-gray-700/50 pt-2"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      <span>Çıkış Yap</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaHome className="text-blue-400" />
                      <span>Ana Sayfa</span>
                    </Link>

                    <Link 
                      to="/about"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                    >
                      <FaInfoCircle className="text-purple-400" />
                      <span>Hakkımızda</span>
                    </Link>

                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <Link 
                        to="/login"
                        className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70"
                      >
                        <FaUserAlt className="text-blue-400" />
                        <span>Giriş Yap</span>
                      </Link>

                      <Link 
                        to="/register"
                        className="mt-2 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                      >
                        <FaUserAlt className="mr-2" />
                        Kayıt Ol
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800/30 pt-16 pb-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC4xIiBkPSJNMzYgMzBoLTZWMGg2djMweiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center mb-6 group">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/10 mr-3 transition-all group-hover:shadow-xl group-hover:shadow-blue-500/20 group-hover:-translate-y-0.5">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
                <div>
                  <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Eğitici</span>
                  <span className="font-bold text-xl ml-1">Oyunlar</span>
                </div>
              </Link>
              <p className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">
                Eğitici Oyunlar, çocukların eğlenerek öğrenmesini sağlayan interaktif bir eğitim platformudur. 
                Matematik, dil ve mantık becerileri geliştiren oyunlarımızla öğrenme sürecini keyifli hale getiriyoruz.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20">
                  <FaTwitter className="text-lg" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/20">
                  <FaInstagram className="text-lg" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20">
                  <FaYoutube className="text-lg" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/20">
                  <FaGithub className="text-lg" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">Keşfet</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link to="/games" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Oyunlar
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    SSS
                  </a>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Kayıt Ol
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">İletişim</h3>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:info@egiticioyunlar.com" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                    <FaEnvelope className="mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                    info@egiticioyunlar.com
                  </a>
                </li>
                <li className="text-sm text-gray-500 space-y-1">
                  <p>Eğitici Oyunlar A.Ş.</p>
                  <p>Atatürk Mah. 100. Sokak</p>
                  <p>No: 20, İstanbul</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800/30 text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Eğitici Oyunlar. Tüm hakları saklıdır.
            </p>
            <p className="mt-2 sm:mt-0 text-xs text-gray-500 flex items-center justify-center sm:justify-start">
              <FaHeart className="text-red-500 mx-1 animate-pulse" /> ile Türkiye'de üretildi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;