import React from 'react'
import { motion } from 'framer-motion'
import { 
  FaRocket, 
  FaLightbulb, 
  FaGraduationCap, 
  FaUsers, 
  FaChartLine, 
  FaHeart,
  FaBrain,
  FaGamepad,
  FaBook,
  FaStar,
  FaTrophy,
  FaMedal,
  FaAward,
  FaHandshake,
  FaGlobe,
  FaChild,
  FaLaptopCode,
  FaMobileAlt,
  FaTabletAlt,
  FaDesktop
} from 'react-icons/fa'

// Animasyon varyantları
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

function AboutPage() {
  return (
    <div className="min-h-screen relative pb-20">
      {/* Arkaplan dekorasyonu */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-blue-900/20 to-transparent opacity-60"></div>
        <div className="absolute top-[20vh] left-0 w-2/3 h-[30vh] bg-gradient-to-r from-purple-900/20 to-transparent opacity-40"></div>
        <div className="absolute top-[60vh] right-0 w-1/2 h-[40vh] bg-gradient-to-l from-indigo-900/20 to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[80px] opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[80px] opacity-30"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30"></div>
              <div className="relative px-6 py-1 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-400">
                  <FaRocket />
                  <span className="text-sm font-semibold">HAKKIMIZDA</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 mb-6"
            >
              Eğitici Oyunlarla Geleceği Şekillendiriyoruz
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300/90 max-w-3xl mx-auto"
            >
              Çocukların zihinsel gelişimini destekleyen, eğlenceli ve interaktif oyunlarla 
              öğrenmeyi keyifli hale getiriyoruz.
            </motion.p>
          </motion.div>

          {/* İstatistikler */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: <FaUsers />, number: "10K+", label: "Aktif Kullanıcı" },
              { icon: <FaGamepad />, number: "50+", label: "Eğitici Oyun" },
              { icon: <FaStar />, number: "4.8/5", label: "Kullanıcı Puanı" },
              { icon: <FaGlobe />, number: "100+", label: "Ülke" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 text-center"
              >
                <div className="text-3xl text-blue-400 mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Misyon ve Vizyon */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Misyon */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30"
            >
              <div className="text-3xl text-blue-400 mb-4">
                <FaRocket />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Misyonumuz</h3>
              <p className="text-gray-400">
                Çocukların öğrenme sürecini eğlenceli ve etkili hale getirerek, 
                onların zihinsel gelişimine katkıda bulunmak ve geleceğin 
                başarılı bireylerini yetiştirmek.
              </p>
            </motion.div>

            {/* Vizyon */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30"
            >
              <div className="text-3xl text-purple-400 mb-4">
                <FaLightbulb />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Vizyonumuz</h3>
              <p className="text-gray-400">
                Eğitim teknolojilerinde öncü olarak, çocukların öğrenme deneyimini 
                dönüştürmek ve her çocuğun potansiyelini en üst düzeye çıkarmasına 
                yardımcı olmak.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Değerlerimiz</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Eğitimde kalite ve yenilikçiliği ön planda tutarak, çocukların 
              gelişimine katkıda bulunuyoruz.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FaGraduationCap />,
                title: "Kaliteli Eğitim",
                description: "En güncel eğitim yöntemlerini kullanarak kaliteli içerik sunuyoruz."
              },
              {
                icon: <FaBrain />,
                title: "Yenilikçilik",
                description: "Sürekli gelişen teknoloji ile eğitimde yenilikçi çözümler üretiyoruz."
              },
              {
                icon: <FaHeart />,
                title: "Çocuk Odaklı",
                description: "Her çocuğun kendine özgü öğrenme stiline uygun içerikler sunuyoruz."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 text-center"
              >
                <div className="text-3xl text-blue-400 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Neden Biz */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Neden Biz?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Eğitici oyunlarımızla çocukların öğrenme sürecini keyifli ve 
              etkili hale getiriyoruz.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <FaChartLine />,
                title: "Sürekli Gelişim",
                description: "Düzenli güncellemeler ve yeni içeriklerle sürekli gelişiyoruz."
              },
              {
                icon: <FaTrophy />,
                title: "Başarı Odaklı",
                description: "Çocukların başarısını artırmak için özel tasarlanmış oyunlar."
              },
              {
                icon: <FaMedal />,
                title: "Kalite Standartları",
                description: "En yüksek eğitim standartlarında içerikler sunuyoruz."
              },
              {
                icon: <FaAward />,
                title: "Ödüllü Platform",
                description: "Eğitim teknolojileri alanında ödüllü bir platform."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 text-center"
              >
                <div className="text-3xl text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cihaz Desteği */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Her Cihazda Erişilebilir</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Oyunlarımıza masaüstü, tablet ve mobil cihazlardan kolayca erişebilirsiniz.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FaDesktop />,
                title: "Masaüstü",
                description: "Tam ekran deneyimi için masaüstü uyumlu"
              },
              {
                icon: <FaTabletAlt />,
                title: "Tablet",
                description: "Dokunmatik ekran desteği ile tablet uyumlu"
              },
              {
                icon: <FaMobileAlt />,
                title: "Mobil",
                description: "Her yerde oynayabilme imkanı"
              }
            ].map((device, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 text-center"
              >
                <div className="text-3xl text-blue-400 mb-4">{device.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{device.title}</h3>
                <p className="text-gray-400">{device.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* İletişim CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Bizimle İletişime Geçin
              </h2>
              <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
                Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz.
                Size en kısa sürede dönüş yapacağız.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                İletişime Geç
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage 