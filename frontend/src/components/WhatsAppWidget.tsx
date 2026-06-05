import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppWidget() {
  const phoneNumber = '919044002858'
  const message = encodeURIComponent(
    'Hello AK Infinity,\n\nI am interested in your website, mobile app, or digital services for my business. Please let me know how we can connect.\n\nThank you.'
  )
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600"
        />
        <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-xl flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.a>
  )
}
