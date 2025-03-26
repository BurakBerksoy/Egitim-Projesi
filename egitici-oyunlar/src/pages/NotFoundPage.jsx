import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-9xl font-bold text-blue-500 mb-6">404</div>
        <h1 className="text-4xl font-bold mb-4 text-white">Sayfa Bulunamadı</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Aradığınız sayfaya ulaşılamıyor. Silinmiş veya taşınmış olabilir.
        </p>
        <Link to="/" className="btn-primary inline-block px-8 py-3">
          Ana Sayfaya Dön
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage 