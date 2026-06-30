import { motion } from 'framer-motion'

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
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
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
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: '#25D366' }}
        />
        <div 
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#25D366' }}
        >
          {/* Official WhatsApp SVG Logo (Pixel Perfect) */}
          <svg 
            viewBox="0 0 24 24" 
            width="28" 
            height="28" 
            className="sm:w-8 sm:h-8"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.64 2.57 15.3 3.38 16.77L2 22L7.36 20.66C8.77 21.42 10.38 21.85 12.05 21.85H12.04C17.5 21.85 21.95 17.4 21.95 11.94C21.95 6.48 17.5 2.03 12.04 2ZM12.04 20.03H12.03C10.57 20.03 9.15 19.64 7.95 18.94L7.62 18.75L4.33 19.61L5.18 16.39L4.97 16.05C4.16 14.81 3.7 13.38 3.7 11.91C3.7 7.33 7.44 3.59 12.03 3.59C16.61 3.59 20.35 7.34 20.35 11.93C20.35 16.51 16.61 20.03 12.04 20.03Z" />
            <path d="M16.55 13.85C16.36 13.75 15.17 13.15 14.98 13.08C14.8 13.01 14.62 12.97 14.43 13.26C14.25 13.55 13.72 14.18 13.59 14.34C13.46 14.5 13.33 14.52 13.14 14.42C12.95 14.32 12.22 14.08 11.45 13.41C10.86 12.89 10.41 12.19 10.25 11.91C10.09 11.63 10.22 11.46 10.37 11.31C10.5 11.17 10.67 10.96 10.76 10.81C10.85 10.66 10.89 10.53 10.84 10.38C10.79 10.23 10.28 8.94 10.07 8.42C9.87 7.92 9.67 7.97 9.5 8C9.34 8.02 9.16 8.01 8.98 8H8.83C8.65 8 8.22 8.07 7.86 8.42C7.5 8.77 7.25 9.23 7.25 9.81C7.25 10.39 7.59 10.95 7.67 11.08C7.75 11.21 8.64 12.57 10.01 13.57C11.15 14.39 12.16 14.79 12.83 15C13.16 15.1 13.47 15.18 13.74 15.23C14.3 15.34 14.9 15.28 15.39 14.99C15.95 14.66 16.41 14.15 16.55 13.85Z" />
          </svg>
        </div>
      </div>
    </motion.a>
  )
}
