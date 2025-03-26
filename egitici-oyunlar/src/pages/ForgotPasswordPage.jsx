import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaSpinner, FaKey } from 'react-icons/fa';
import { authService } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Lütfen geçerli bir e-posta adresi girin.' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await authService.forgotPassword(email);
      
      // Token kontrolü (geliştirme modu için)
      if (response.token) {
        setResetToken(response.token);
        setMessage({ 
          type: 'success', 
          text: response.message || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
        });
      } else {
        setMessage({ 
          type: 'success', 
          text: response.message || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
        });
      }
      
      setSubmitted(true);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseToken = () => {
    if (resetToken) {
      navigate(`/reset-password?token=${resetToken}`);
    }
  };

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
            <h2 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h2>
            <p className="text-gray-400">
              E-posta adresinizi giriniz. Size şifrenizi sıfırlamanız için bir bağlantı göndereceğiz.
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

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <span>{isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-400 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg text-white font-semibold mb-2">Şifre Sıfırlama Bağlantısı Gönderildi</h3>
              <p className="text-gray-400 mb-6">
                E-posta adresinize bir şifre sıfırlama bağlantısı gönderdik. 
                Lütfen e-postanızı kontrol edin ve şifrenizi sıfırlamak için bağlantıya tıklayın.
              </p>
              {resetToken && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300">
                  <p className="mb-2 font-semibold">Geliştirme Modu</p>
                  <p className="mb-4 text-sm">Mail gönderimi yapılamadı. Bu token'ı kullanabilirsiniz:</p>
                  <div className="bg-gray-700 p-2 rounded flex items-center justify-between">
                    <code className="text-sm text-yellow-200 break-all">{resetToken}</code>
                  </div>
                  <button
                    onClick={handleUseToken}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
                  >
                    <FaKey className="mr-2" />
                    Bu Token ile Devam Et
                  </button>
                </div>
              )}
              <p className="text-gray-400 mb-6">
                Eğer e-posta gelmezse, spam klasörünüzü kontrol edin veya farklı bir e-posta adresi deneyin.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                  setResetToken('');
                  setMessage({ type: '', text: '' });
                }}
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Farklı bir e-posta dene
              </button>
            </div>
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

export default ForgotPasswordPage; 