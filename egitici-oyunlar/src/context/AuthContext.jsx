import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

// Auth Context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is logged in from local storage on initial load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Token var, kullanıcı profili bilgilerini al
          const userProfile = await userService.getProfile();
          setCurrentUser(userProfile);
        }
      } catch (error) {
        console.error("Token doğrulama hatası:", error);
        // Token geçersiz veya süresi dolmuş
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  // Get registered users from localStorage or initialize empty array
  const getRegisteredUsers = () => {
    try {
      const users = localStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error getting registered users:", error);
      return [];
    }
  };

  // Save registered users to localStorage
  const saveRegisteredUsers = (users) => {
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (error) {
      console.error("Error saving registered users:", error);
    }
  };

  // Login function
  const login = async ({ email, password }) => {
    setError(null);
    
    try {
      // API ile giriş yap
      console.log("AuthContext - login başlatılıyor:", { email });
      const response = await authService.login({ 
        email, 
        password 
      });
      
      console.log("Login başarılı, yanıt:", response);
      // Kullanıcıyı ayarla
      setCurrentUser(response);
      
      return { success: true, user: response };
    } catch (error) {
      console.error("AuthContext - Login hatası:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Giriş sırasında bir hata oluştu';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    
    try {
      // API ile kayıt ol
      const response = await authService.register(userData);
      
      // Otomatik giriş yap
      await login({ email: userData.email, password: userData.password });
      
      return { success: true, user: response };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logout yapılıyor - tüm veriler temizleniyor");
    authService.logout(); // Bu artık localStorage.clear() çağıracak
    setCurrentUser(null);
  };

  // Google ile giriş yap
  const googleLogin = () => {
    console.log("Google ile giriş başlatılıyor...");
    setError(null);
    authService.googleLogin();
  };
  
  // Kullanıcı profilini güncelle
  const updateProfile = async (userData) => {
    setError(null);
    
    try {
      // Kullanıcı bilgilerini güncelle
      setCurrentUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };
  
  // OAuth2 yönlendirmesini işle
  const handleOAuth2Redirect = (token, username) => {
    console.log("OAuth2 yönlendirmesi işleniyor...");
    setError(null);
    
    if (!token || !username) {
      console.error("Token veya kullanıcı adı eksik!");
      setError("Google ile giriş başarısız oldu: Geçersiz token veya kullanıcı adı.");
      return false;
    }
    
    try {
      // Token ve kullanıcı adını kaydet
      const success = authService.handleOAuth2Redirect(token, username);
      
      if (success) {
        // Kullanıcı bilgilerini güncelle
        console.log("Google ile giriş başarılı!");
        setCurrentUser({
          username: username,
          isOAuthUser: true
        });
        return true;
      } else {
        setError("Google ile giriş işleminde bir hata oluştu.");
        return false;
      }
    } catch (error) {
      console.error("OAuth2 yönlendirme hatası:", error);
      setError("Google ile giriş işleminde bir hata oluştu: " + error.message);
      return false;
    }
  };

  // Auth values for the context
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    googleLogin,
    updateProfile,
    handleOAuth2Redirect
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 