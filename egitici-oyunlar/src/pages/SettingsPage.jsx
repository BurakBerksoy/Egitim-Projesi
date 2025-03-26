import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaSave, FaCamera } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { userService } from '../services/api';

const SettingsPage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.username.trim() || !profileData.email.trim()) {
      setMessage({ type: 'error', text: 'Kullanıcı adı ve e-posta gereklidir.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await userService.updateProfile(profileData);
      setMessage({ type: 'success', text: response.message || 'Profil bilgileriniz başarıyla güncellendi.' });
      
      // Kullanıcı bilgilerini güncelle (Auth Context)
      if (updateProfile) {
        updateProfile({
          ...currentUser,
          ...profileData
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Tüm şifre alanlarını doldurun.' });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await userService.changePassword(passwordData);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setMessage({ type: 'success', text: response.message || 'Şifreniz başarıyla güncellendi.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Şifreniz güncellenirken bir hata oluştu: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700"
        >
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hesap Ayarları</h1>
            
            <div className="flex flex-wrap border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'profile' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profil Bilgileri
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'password' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('password')}
              >
                Şifre Değiştir
              </button>
            </div>
            
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : ''
              }`}>
                {message.text}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar bölümü */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-700">
                      {currentUser?.imageUrl ? (
                        <img src={currentUser.imageUrl} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-white text-5xl" />
                      )}
                    </div>
                    <button type="button" className="flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                      <FaCamera className="mr-2" />
                      Fotoğraf Değiştir
                    </button>
                  </div>
                  
                  {/* Form alanları */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Kullanıcı Adı
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Kullanıcı adınız"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-500" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="E-posta adresiniz"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                        Hakkımda
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows="4"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Kendiniz hakkında kısa bir açıklama..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl mx-auto">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Mevcut Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mevcut şifreniz"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Yeni şifreniz"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Yeni Şifre (Tekrar)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Şifreyi Değiştir
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage; 