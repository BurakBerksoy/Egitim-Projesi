import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaGoogle, FaUserPlus, FaShieldAlt, FaUser, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setGlowPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basit validasyon
      if (formData.name.trim() === '' || formData.email.trim() === '' || 
          formData.password.trim() === '' || formData.confirmPassword.trim() === '') {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      // Şifre kontrolü
      if (formData.password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }

      // Şifre eşleşme kontrolü
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Şifreler eşleşmiyor');
      }

      // Call register function from AuthContext
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Kayıt olurken bir hata oluştu');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        delay: 0.1
      }
    },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 10
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 70,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 70,
        damping: 10,
        delay: 0.4
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px -10px rgba(79, 70, 229, 0.6)", 
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 left-0 w-full h-[100vh] bg-gradient-to-b from-purple-950/40 via-indigo-950/30 to-transparent"></div>
        <div 
          className="absolute w-[40rem] h-[40rem] rounded-full blur-[120px]"
          style={{ 
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(79, 70, 229, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)",
            top: `${glowPosition.y * 0.05}px`,
            left: `${glowPosition.x * 0.05}px`,
            transform: "translate(-50%, -50%)",
            transition: "top 1s ease-out, left 1s ease-out"
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/3 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-blue-500/5 blur-[90px] rotate-12"></div>
        
        {/* Floating orbs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 right-1/4 w-4 h-4 bg-purple-400 rounded-full shadow-xl shadow-purple-400/20"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute bottom-32 left-1/3 w-3 h-3 bg-indigo-400 rounded-full shadow-xl shadow-indigo-400/20"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full shadow-xl shadow-blue-400/20"
        ></motion.div>
      </div>

      <div className="container px-6 mx-auto flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 py-10">
        {/* Left side - Welcome text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <Link to="/" className="inline-flex items-center mb-8 group">
            <motion.div 
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg shadow-purple-500/30 mr-3 transition-all"
            >
              <FaGraduationCap className="text-white text-3xl" />
            </motion.div>
            <div>
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Eğitici</span>
              <span className="font-bold text-2xl ml-1 text-white">Oyunlar</span>
            </div>
          </Link>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600">
              Öğrenme Maceranız 
            </span>
            <span className="text-white text-3xl md:text-4xl">
              Şimdi Başlıyor!
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
          >
            Eğitici Oyunlar ailesine katılarak, kişiselleştirilmiş eğitim deneyiminizi takip edin, ilerlemenizi kaydedin ve çocuğunuz için en iyi öğrenme yolculuğunu keşfedin.
          </motion.p>

          <motion.div 
            className="hidden lg:block relative h-80 w-full max-w-xl ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute z-20 top-10 left-20 w-36 h-40 bg-purple-500/10 rounded-2xl backdrop-blur-sm border border-purple-500/20 flex items-center justify-center shadow-xl"
            >
              <FaUserPlus className="text-purple-400 text-4xl" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute z-10 right-10 top-40 w-40 h-36 bg-indigo-500/10 rounded-2xl backdrop-blur-sm border border-indigo-500/20 flex items-center justify-center shadow-xl"
            >
              <FaShieldAlt className="text-indigo-400 text-4xl" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1,
                y: [0, -15, 0],
                rotateZ: [0, 2, 0],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute z-30 left-1/2 -translate-x-1/2 bottom-0 w-48 h-52 bg-gradient-to-br from-purple-500/15 to-indigo-500/15 rounded-2xl backdrop-blur-sm border border-indigo-500/20 shadow-2xl"
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <div className="absolute w-56 h-56 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-xl"></div>
                <FaUser className="text-white/80 text-6xl" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-1/2 max-w-md mx-auto"
        >
          <motion.div
            className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl shadow-purple-500/10 p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-500/5 z-0"></div>
            <div className="relative z-10">
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Hesap Oluştur</h2>
                <p className="text-gray-400">
                  Zaten hesabınız var mı?{' '}
                  <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors relative group">
                    Giriş yapın
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                  </Link>
                </p>
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-xl"
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} className="mb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaUser />
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="pl-10 w-full bg-gray-800/50 border border-gray-700 focus:border-purple-500/70 focus:ring focus:ring-purple-500/20 rounded-xl py-3 text-white placeholder-gray-400 shadow-sm transition-all duration-300"
                      placeholder="Ad Soyad"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaEnvelope />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 w-full bg-gray-800/50 border border-gray-700 focus:border-purple-500/70 focus:ring focus:ring-purple-500/20 rounded-xl py-3 text-white placeholder-gray-400 shadow-sm transition-all duration-300"
                      placeholder="ornek@mail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaLock />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="pl-10 w-full bg-gray-800/50 border border-gray-700 focus:border-purple-500/70 focus:ring focus:ring-purple-500/20 rounded-xl py-3 text-white placeholder-gray-400 shadow-sm transition-all duration-300"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Şifreniz en az 6 karakter olmalıdır</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaLock />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="pl-10 w-full bg-gray-800/50 border border-gray-700 focus:border-purple-500/70 focus:ring focus:ring-purple-500/20 rounded-xl py-3 text-white placeholder-gray-400 shadow-sm transition-all duration-300"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={isLoading}
                  type="submit"
                  className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                  ) : null}
                  <span className="mr-2">Hesap Oluştur</span>
                  <FaArrowRight className="text-sm opacity-70" />
                </motion.button>

                <motion.div 
                  variants={itemVariants}
                  className="mt-8 relative flex items-center justify-center"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative px-4 bg-gray-900/50 backdrop-blur-sm text-sm text-gray-400">
                    Veya şununla devam et
                  </div>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="mt-6 grid grid-cols-1 gap-4"
                >
                  <button
                    type="button"
                    onClick={googleLogin}
                    className="flex justify-center items-center py-3 px-4 border border-gray-700 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300 shadow-sm transition-all duration-300"
                  >
                    <FaGoogle className="mr-2 text-red-400" />
                    <span>Google ile Kayıt Ol</span>
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 