import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// API isteği için axios instance oluştur
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı isteklere ekleyen interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth servisi
export const authService = {
  // Kullanıcı kaydı
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        username: userData.name,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Kayıt işlemi sırasında bir hata oluştu'
      );
    }
  },

  // Kullanıcı girişi
  login: async (credentials) => {
    try {
      console.log("Login isteği gönderiliyor:", {
        email: credentials.email,
        passwordLength: credentials.password ? credentials.password.length : 0
      });
      
      const response = await apiClient.post('/auth/login', {
        username: credentials.email, // Email kullanıcı adı olarak gönderilir
        email: credentials.email,    // Email alanı ayrıca gönderilir
        password: credentials.password,
      });
      
      console.log("Login yanıtı başarılı:", {
        status: response.status,
        hasToken: !!response.data?.token,
        data: response.data
      });
      
      // Token'ı localStorage'a kaydet
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log("Token localStorage'a kaydedildi");
      } else {
        console.warn("Token alınamadı!");
      }
      
      return response.data;
    } catch (error) {
      console.error("Login hatası:", error);
      console.error("Hata detayları:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      throw new Error(
        error.response?.data?.message || 'Giriş sırasında bir hata oluştu'
      );
    }
  },

  // Kullanıcı çıkışı
  logout: () => {
    // Tüm localStorage verilerini temizle
    localStorage.clear();
  },

  // Google ile giriş işlemi
  googleLogin: () => {
    console.log("Google ile giriş başlatılıyor...");
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  },

  // OAuth2 yönlendirmesini işle
  handleOAuth2Redirect: (token, username) => {
    console.log("OAuth2 yönlendirmesi işleniyor. Token:", token ? "Var" : "Yok", "Kullanıcı:", username);
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      console.log("Token ve kullanıcı bilgisi localStorage'a kaydedildi");
      return true;
    }
    console.error("OAuth2 yönlendirmesi başarısız: Token alınamadı");
    return false;
  },

  // Şifremi unuttum
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Şifre sıfırlama işlemi sırasında bir hata oluştu'
      );
    }
  },

  // Reset token doğrulama
  validateResetToken: async (token) => {
    try {
      const response = await apiClient.get(`/auth/reset-password/validate?token=${token}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Token doğrulama işlemi sırasında bir hata oluştu'
      );
    }
  },

  // Şifre sıfırlama
  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Şifre sıfırlama işlemi sırasında bir hata oluştu'
      );
    }
  },
};

// Kullanıcı servisi
export const userService = {
  // Kullanıcı profili
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Profil bilgileri alınamadı'
      );
    }
  },

  // Profil güncelleme
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.post('/auth/profile/update', profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Profil güncellenemedi'
      );
    }
  },

  // Şifre değiştirme
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post('/auth/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Şifre değiştirilemedi'
      );
    }
  },

  // Kullanıcı puanı
  getScore: async () => {
    try {
      const response = await apiClient.get('/users/score');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Puan bilgileri alınamadı'
      );
    }
  },

  // Puan güncelleme
  updateScore: async (score) => {
    try {
      const response = await apiClient.put('/users/score', { score });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Puan güncellenemedi'
      );
    }
  },
};

export default {
  auth: authService,
  user: userService,
}; 