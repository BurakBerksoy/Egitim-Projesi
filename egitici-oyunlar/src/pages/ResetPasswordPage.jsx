import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { authService } from '../services/api';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValidating, setIsTokenValidating] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL'den token'ı al
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (!tokenParam) {
      setMessage({ type: 'error', text: 'Geçersiz şifre sıfırlama bağlantısı.' });
      setIsTokenValidating(false);
      return;
    }

    setToken(tokenParam);
    
    // Token'ı doğrula
    const validateToken = async () => {
      try {
        await authService.validateResetToken(tokenParam);
        setIsTokenValidating(false);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
        setIsTokenValidating(false);
      }
    };
    
    validateToken();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await authService.resetPassword(
        token,
        formData.newPassword,
        formData.confirmPassword
      );
      setMessage({ type: 'success', text: response.message });
      setSuccess(true);
      
      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  if (isTokenValidating) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-500 mx-auto h-8 w-8 mb-4" />
          <p className="text-white">Token doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Şifre Sıfırlama</h2>
            <p className="text-gray-400">
              Yeni şifrenizi belirleyin.
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : ''
            }`}>
              {message.text}
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-400 rounded-full mb-4">
                <FaCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg text-white font-semibold mb-2">Şifre Başarıyla Sıfırlandı</h3>
              <p className="text-gray-400 mb-6">
                Yeni şifreniz başarıyla ayarlandı. Otomatik olarak giriş sayfasına yönlendirileceksiniz.
              </p>
              <div className="flex justify-center">
                <Link to="/login" className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Giriş Sayfasına Git
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Şifreniz en az 6 karakter olmalıdır.</p>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : null}
                <span>{isLoading ? 'İşleniyor...' : 'Şifreyi Sıfırla'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center">
              <FaArrowLeft className="mr-2" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage; 