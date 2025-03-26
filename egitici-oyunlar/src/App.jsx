import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import MathGamePage from './pages/MathGamePage'
import MemoryGame from './games/MemoryGame'
import WordGame from './games/WordGame'
import EnglishGame from './games/EnglishGame'
import ScienceGame from './games/ScienceGame'
import GeographyGame from './games/GeographyGame'
import MainLayout from './layouts/MainLayout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import SettingsPage from './pages/SettingsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { useAuth } from './context/AuthContext'
import { useEffect, useState } from 'react'

// Korumalı Rota (Private Route) bileşeni
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" />;
  }
  
  return children;
};

// OAuth2 yönlendirme işleyicisi
const OAuth2RedirectHandler = () => {
  const { handleOAuth2Redirect } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Google ile giriş yapılıyor...");
  
  useEffect(() => {
    const processOAuthRedirect = async () => {
      try {
        // URL'den token ve kullanıcı adını al
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const username = params.get('user');
        
        console.log("OAuth2 yönlendirme parametreleri alındı:", { 
          hasToken: !!token, 
          hasUsername: !!username 
        });
        
        if (token && username) {
          setMessage("Google hesabınızla giriş yapılıyor...");
          const success = handleOAuth2Redirect(token, username);
          
          if (success) {
            setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            setMessage("Giriş başarısız oldu! Giriş sayfasına yönlendiriliyorsunuz...");
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } else {
          setMessage("Eksik bilgiler! Giriş sayfasına yönlendiriliyorsunuz...");
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        console.error("OAuth yönlendirme hatası:", error);
        setMessage("Hata oluştu! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    
    processOAuthRedirect();
  }, [handleOAuth2Redirect, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Korumalı rotalar - Sadece giriş yapmış kullanıcılar erişebilir */}
        <Route path="/games" element={
          <PrivateRoute>
            <GamesPage />
          </PrivateRoute>
        } />
        <Route path="/games/math" element={
          <PrivateRoute>
            <MathGamePage />
          </PrivateRoute>
        } />
        <Route path="/games/memory" element={
          <PrivateRoute>
            <MemoryGame />
          </PrivateRoute>
        } />
        <Route path="/games/word" element={
          <PrivateRoute>
            <WordGame />
          </PrivateRoute>
        } />
        <Route path="/games/english" element={
          <PrivateRoute>
            <EnglishGame />
          </PrivateRoute>
        } />
        <Route path="/games/science" element={
          <PrivateRoute>
            <ScienceGame />
          </PrivateRoute>
        } />
        <Route path="/games/geography" element={
          <PrivateRoute>
            <GeographyGame />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        } />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  )
}
