import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import AKLogo from '../assets/AK_Main_Logo.webp'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-[56px] h-[48px] bg-[#FAF7F2] rounded-2xl flex items-center justify-center border border-border-primary overflow-hidden"
            >
              <img
                  src={AKLogo}
                  alt="AK Infinity Logo"
                  className="w-[51px] h-[52px] object-contain"
                />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-text-primary tracking-tight">
                AK Infinity
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={link.path}
                  className={`relative px-6 py-3 text-base font-medium transition-all duration-300 rounded-full ${
                    location.pathname === link.path
                      ? 'text-gold-primary bg-bg-elevated border border-gold-primary/30'
                      : 'text-text-primary hover:text-gold-primary hover:bg-bg-card/50'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-gold-primary/20 to-gold-deep/10 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: navLinks.length * 0.1 }}
            className="ml-4 md:ml-6"
          >
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-2 px-6 md:px-10 py-2.5 md:py-3.5 bg-gradient-to-r from-gold-primary to-gold-deep text-bg-primary rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,197,66,0.4)] hover:scale-105"
            >
                <span className="relative z-10">Get Started</span>
                <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-gold-hover to-gold-primary rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </motion.div>
          </nav>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-bg-card/50 transition-colors text-text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-bg-secondary border-b border-border-primary"
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px] py-6">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-5 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-gold-primary bg-bg-card border border-gold-primary/30'
                      : 'text-text-primary hover:text-gold-primary hover:bg-bg-card/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 px-6 py-3.5 bg-gradient-to-r from-gold-primary to-gold-deep text-bg-primary rounded-xl font-semibold text-base text-center"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
