import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Check, Clock, Building, Globe, Smartphone, ShieldCheck, Shield, Zap } from 'lucide-react'
import Button from '../components/Button'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import emailjs from '@emailjs/browser'
import GovtLogo from '../assets/badges/govt-india-logo.png'
import MsmeLogo from '../assets/badges/msme-logo.png'
import UdyamLogo from '../assets/badges/udyam-logo.png'
import FourthLogo from '../assets/badges/government-officials-logo.png'

// Fix Leaflet marker icon issue and create custom gold marker
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

interface ContactFormData {
  fullName: string
  email: string
  phoneNumber: string
  businessName: string
  serviceInterested: string
  message: string
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()
  const markerRef = useRef<any>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setTimeout(() => {
      if (markerRef.current) {
        markerRef.current.openPopup()
      }
    }, 400)
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      console.log('EmailJS attempt with:', { serviceId, templateId, publicKey, data })

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            businessName: data.businessName,
            serviceInterested: data.serviceInterested,
            message: data.message
          },
          publicKey
        )
      }

      setIsSubmitting(false)
      setSubmitSuccess(true)
      reset()
      setTimeout(() => setSubmitSuccess(false), 8000)
    } catch (error: any) {
      console.error('EmailJS error details:', error)
      setIsSubmitting(false)
      alert(`Error: ${error.text || error.message || 'Something went wrong'}`)
    }
  }

  const services = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Digital Marketing',
    'SEO Optimization',
    'Branding',
    'Other'
  ]

  // Coordinates for Solitorian City Building, Knowledge Park III, Greater Noida, India (from Google Maps)
  const position: [number, number] = [28.48009436176084, 77.48260703003373];

  // Fix Leaflet z-index issue - ensure map stays below navbar
  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container')
    if (mapContainer) {
      (mapContainer as HTMLElement).style.zIndex = '1'
    }
  }, [])

  // Contact information data
  const contactInfo = [
    { 
      icon: <Mail className="w-6 h-6" />, 
      title: 'Email Address', 
      value: 'akinfinity09@gmail.com',
      link: 'mailto:akinfinity09@gmail.com'
    },
    { 
      icon: <Phone className="w-6 h-6" />, 
      title: 'Phone Number', 
      value: '9044002858',
      link: 'tel:+919044002858'
    },
    { 
      icon: <Smartphone className="w-6 h-6" />, 
      title: 'WhatsApp', 
      value: '9044002858',
      link: 'https://wa.me/919044002858'
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      title: 'Office Address', 
      value: (
        <>
          914K – Solitarian City Building<br />
          KP-3, Greater Noida<br />
          Gautam Buddh Nagar<br />
          Uttar Pradesh, India – 201310
        </>
      ),
      link: null
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: 'Availability', 
      value: 'Open 24 Hours • 7 Days a Week',
      link: null
    },
    { 
      icon: <Globe className="w-6 h-6" />, 
      title: 'Website', 
      value: 'www.akinfinity.com',
      link: 'http://www.akinfinity.com'
    }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Get in Touch
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-6 md:mb-8">
                Let's Start a Conversation
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Have a project in mind? We'd love to hear from you. Let's discuss.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="pb-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="bg-bg-card border border-border-primary rounded-3xl p-8"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { logo: GovtLogo, text: "Government of India Registered" },
                { logo: MsmeLogo, text: "MSME Registered Enterprise" },
                { logo: UdyamLogo, text: "Udyam Certified Business" },
                { logo: FourthLogo, text: "Government Officials Registered" }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-3 p-5 bg-bg-card border-2 border-gold-primary/25 rounded-2xl hover:border-gold-primary/70 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)] transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 rounded-2xl flex items-center justify-center shadow-md overflow-hidden ${
                      index === 2 ? 'bg-white border border-gray-100' : 'bg-transparent border-none'
                    } w-full max-w-40 sm:max-w-52 md:max-w-60 h-14 sm:h-20 md:h-24`}
                  >
                    <img src={badge.logo} alt={badge.text} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-semibold text-text-primary text-center text-sm leading-tight">{badge.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Center-aligned registration number */}
            <motion.div variants={fadeInUp} className="border-t border-border-primary pt-6 text-center">
              <p className="text-text-muted text-sm mb-2">Udyam Registration Number</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gold-primary to-gold-deep bg-clip-text text-transparent">
                UDYAM-UP-28-0222045
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Contact Section */}
      <section className="py-10 pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          {/* Map and Form Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left Side - Interactive Map */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="order-1 lg:order-1"
            >
              <div className="bg-bg-card border-3 border-gray-500 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 h-[460px] md:h-[570px] relative z-10" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <MapContainer
                  ref={mapRef}
                  center={position}
                  zoom={15}
                  scrollWheelZoom={true}
                  attributionControl={false}
                  style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker ref={markerRef} position={position} icon={redIcon}>
                    <Popup className="custom-popup">
                      <div className="p-4">
                        <h3 className="font-bold text-xl mb-3 text-gray-900">AK Infinity Head Office</h3>
                        <div className="text-sm text-gray-700 leading-relaxed space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">📍</span>
                            <span>914K – Solitarian City Building</span>
                          </div>
                          <div className="pl-6">KP-3, Greater Noida</div>
                          <div className="pl-6">Gautam Buddh Nagar</div>
                          <div className="pl-6">Uttar Pradesh, India – 201310</div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* Enhanced Address Section */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                className="mt-10 bg-bg-card border border-border-primary rounded-2xl p-10 md:p-12 hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 border border-border-primary rounded-2xl flex items-center justify-center text-gold-primary">
                    <Building className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-3">AK Infinity Head Office</h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                      914K – Solitarian City Building<br />
                      KP-3, Greater Noida<br />
                      Gautam Buddh Nagar<br />
                      Uttar Pradesh, India – 201310
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-border-primary pt-8 space-y-5">
                  <p className="text-gold-primary font-semibold flex items-center gap-2 text-lg">
                    <ShieldCheck className="w-5 h-5" />
                    Government Registered MSME Enterprise
                  </p>
                  <p className="text-text-secondary font-medium flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-gold-primary" />
                    Open 24 Hours • 7 Days a Week
                  </p>
                  <a href="tel:+919044002858" className="text-text-secondary font-medium flex items-center gap-2 hover:text-gold-primary transition-colors duration-300 text-lg">
                    <Phone className="w-5 h-5 text-gold-primary" />
                    Phone: 9044002858
                  </a>
                  <a href="mailto:akinfinity09@gmail.com" className="text-text-secondary font-medium flex items-center gap-2 hover:text-gold-primary transition-colors duration-300 text-lg">
                    <Mail className="w-5 h-5 text-gold-primary" />
                    Email: akinfinity09@gmail.com
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="order-2 lg:order-2"
            >
              {/* Why Contact Section - added above form */}
              <motion.div variants={fadeInUp} className="mb-8">
                <h3 className="text-2xl font-bold text-text-primary mb-4">Why Contact AK Infinity?</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Zap className="w-5 h-5" />, text: "Free Consultation" },
                    { icon: <Shield className="w-5 h-5" />, text: "MSME Registered Enterprise" },
                    { icon: <Clock className="w-5 h-5" />, text: "Response Within 24 Hours" },
                    { icon: <Building className="w-5 h-5" />, text: "Custom Business Solutions" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-bg-card border border-border-primary rounded-xl hover:border-gold-primary/30 transition-all duration-300">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border border-gold-primary/20 rounded-lg flex items-center justify-center text-gold-primary">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-text-primary text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-bg-card border border-border-primary rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-500">
                {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-20"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-gold-primary to-gold-deep rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-gold-primary/30">
                        <Check className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold text-text-primary mb-4">
                        Successfully Email Sent!
                      </h3>
                      <p className="text-text-secondary text-xl max-w-md mx-auto">
                        Thank you for reaching out! We've received your message and will connect with you within 24 hours.
                      </p>
                    </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-3">
                        Full Name *
                      </label>
                      <input
                        {...register('fullName', { required: 'Full name is required' })}
                        type="text"
                        className="w-full px-6 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/30 focus:border-gold-primary/50 transition-all duration-300"
                        placeholder="Your full name"
                      />
                      {errors.fullName && <p className="text-red-400 text-sm mt-2">{errors.fullName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-3">
                        Email Address *
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className="w-full px-6 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/30 focus:border-gold-primary/50 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-3">
                          Phone Number
                        </label>
                        <input
                          {...register('phoneNumber')}
                          type="tel"
                          className="w-full px-6 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/30 focus:border-gold-primary/50 transition-all duration-300"
                          placeholder="9044002858"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-3">
                          Business Name
                        </label>
                        <input
                          {...register('businessName')}
                          type="text"
                          className="w-full px-6 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/30 focus:border-gold-primary/50 transition-all duration-300"
                          placeholder="Your business name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-3">
                        Service Interested In *
                      </label>
                      <select
                        {...register('serviceInterested', { required: 'Please select a service' })}
                        className="w-full px-6 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/30 focus:border-gold-primary/50 transition-all duration-300"
                      >
                        <option value="">Select a service</option>
                        {services.map((service, idx) => (
                          <option key={idx} value={service}>{service}</option>
                        ))}
                      </select>
                      {errors.serviceInterested && <p className="text-red-400 text-sm mt-2">{errors.serviceInterested.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-3">
                        Message *
                      </label>
                      <textarea
                        {...register('message', { required: 'Message is required' })}
                        rows={6}
                        className="w-full px-6 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/30 focus:border-gold-primary/50 transition-all duration-300 resize-none"
                        placeholder="Tell us about your project..."
                      />
                      {errors.message && <p className="text-red-400 text-sm mt-2">{errors.message.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-16 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 w-5 h-5" />
                    </Button>

                    {/* Customer Notice */}
                    <div className="mt-6 p-5 bg-gradient-to-br from-gold-primary/10 to-gold-deep/5 border border-gold-primary/20 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gold-primary/20 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-gold-primary" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium mb-1">Thank you for contacting us.</p>
                          <p className="text-text-secondary text-sm leading-relaxed">
                            Our team will review your request and connect with you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Average Response Time Badge */}
                    <div className="mt-5 p-4 bg-bg-secondary border border-border-primary rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border border-gold-primary/20 rounded-lg flex items-center justify-center text-gold-primary">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider">Average Response Time</p>
                          <p className="text-text-primary font-semibold">Within 2–24 Hours</p>
                        </div>
                      </div>
                    </div>

                    {/* Privacy & Security Notice */}
                    <div className="mt-4 p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gold-primary">
                        <Shield className="w-4 h-4" />
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        Your information is secure and will never be shared with third parties.
                      </p>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Full Width Contact Information Section */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Information</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <a
                    href={item.link || undefined}
                    target={item.link && item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link && item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group block"
                  >
                    <div className="flex items-start gap-4 p-7 bg-bg-card border-2 border-border-primary rounded-2xl hover:border-gold-primary/40 hover:shadow-xl transition-all duration-400">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border-2 border-gold-primary/20 rounded-2xl flex items-center justify-center text-gold-primary group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-text-primary mb-2 text-lg">{item.title}</h4>
                        <p className="text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors duration-300">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
