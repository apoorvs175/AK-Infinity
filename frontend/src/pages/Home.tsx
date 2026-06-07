import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Shield,
  Award,
  Code2,
  Layers,
  Cpu,
  Globe,
  MessageSquare,
  Star,
  StarHalf,
  FileCheck
} from 'lucide-react'
import Button from '../components/Button'
import ZynpayLogo from '../assets/Zynpay product.png'
import ShardaLogo from '../assets/Sharda.png'
import WorkforceLogo from '../assets/Daily wages Workforce.png'
import GovtLogo from '../assets/govt of india logo.png'
import MsmeLogo from '../assets/msme logo.png'
import UdyamLogo from '../assets/Udyam Logo.png'
import FourthLogo from '../assets/fourth logo.png'

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

const services = [
  {
    icon: <Code2 className="w-8 h-8 text-gold-primary" />,
    title: 'Web Development',
    description: 'Enterprise-grade web applications built with modern technologies',
    features: ['React & Next.js', 'TypeScript', 'Scalable Architecture', 'Performance Optimized']
  },
  {
    icon: <Globe className="w-8 h-8 text-gold-primary" />,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile experiences',
    features: ['React Native', 'iOS & Android', 'Offline Support', 'Push Notifications']
  },
  {
    icon: <Layers className="w-8 h-8 text-gold-primary" />,
    title: 'UI/UX Design',
    description: 'User-centered design that drives engagement',
    features: ['User Research', 'Prototyping', 'Design Systems', 'Usability Testing']
  },
  {
    icon: <Cpu className="w-8 h-8 text-gold-primary" />,
    title: 'Cloud Solutions',
    description: 'Scalable infrastructure for modern applications',
    features: ['AWS & Azure', 'Serverless', 'CI/CD', 'DevOps']
  }
]



const testimonials = [
  {
    name: 'Aman Pratap Singh',
    role: 'Founder & CEO, ZynPay Product',
    content: 'AK Infinity developed our digital payments and gift card platform exactly as we envisioned. The team delivered a fast, secure, and user-friendly solution with excellent attention to detail. Their professionalism and technical expertise made the entire process smooth and efficient.',
    initial: 'APS',
    rating: 4,
    logo: ZynpayLogo
  },
  {
    name: 'Sharda University',
    role: 'Sharda Launchpad',
    content: 'The CodeX Platform developed by AK Infinity has significantly improved the coding and assessment experience for our students. Features such as AI-assisted evaluation, proctor mode, and a modern coding environment have added tremendous value to our academic ecosystem.',
    initial: 'SL',
    rating: 5,
    logo: ShardaLogo
  },
  {
    name: 'Daniel Thompson',
    role: 'Operations Director, Workforce Connect Ltd.',
    content: 'AK Infinity built a highly efficient workforce management platform that connects skilled labour with employers seamlessly. The system is intuitive, reliable, and has streamlined our hiring and workforce coordination process. We are extremely satisfied with the results.',
    initial: 'DT',
    rating: 4.5,
    logo: WorkforceLogo
  }
]

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-8 sm:pt-16 sm:pb-12 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-3 px-6 py-3 bg-bg-card border border-border-primary rounded-full text-sm font-medium text-gold-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-primary"></span>
                </span>
                Premium Digital Solutions
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-6 md:mb-8 leading-[1.05] tracking-tight"
            >
              Building the Future
              <span className="block bg-gradient-to-r from-gold-primary to-gold-deep bg-clip-text text-transparent">One Project at a Time</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Enterprise-grade digital solutions that drive business growth, enhance user experiences, and scale with your ambitions.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto h-16">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/portfolio" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16">
                  View Portfolio
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-primary" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-gold-primary" />
                <span>100% Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-primary" />
                <span>Award Winning</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Trust Bar - Above the Fold */}
      <section className="py-6 bg-white border-y border-gold-primary/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-gold-primary/10 border border-gold-primary/30 rounded-full text-gold-primary font-semibold text-xs">
                <Award className="w-3.5 h-3.5" />
                Official Government Registered
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  className="flex flex-col items-center gap-2 p-4 bg-bg-card border-2 border-gold-primary/25 rounded-2xl hover:border-gold-primary/70 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)] transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 rounded-2xl flex items-center justify-center shadow-md overflow-hidden ${
                      index === 2 ? 'bg-white border border-gray-100' : 'bg-transparent border-none'
                    } w-full max-w-28 sm:max-w-40 md:max-w-52 h-12 sm:h-16 md:h-20 lg:h-24`}>
                    <img src={badge.logo} alt={badge.text} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-semibold text-text-primary text-center text-xs sm:text-sm leading-tight">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gold-primary/15 to-gold-deep/8 border border-gold-primary/35 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4.5 h-4.5 text-gold-primary" />
                <span className="text-text-muted font-medium text-xs">Udyam Reg No.</span>
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-gold-primary to-gold-deep bg-clip-text text-transparent">
                UDYAM-UP-28-0222045
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Services Section */}
      <section className="py-12 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Our Services
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                What We Do Best
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Comprehensive digital solutions tailored to your business needs
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group bg-bg-card border border-border-primary rounded-3xl p-4 md:p-8 lg:p-10 hover:border-gold-primary/30 hover:shadow-[0_0_40px_rgba(244,197,66,0.1)] transition-all duration-500"
              >
                <div className="flex items-start gap-3 md:gap-6">
                  <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-bg-secondary border border-border-primary rounded-xl md:rounded-2xl flex items-center justify-center group-hover:border-gold-primary/50 group-hover:shadow-[0_0_20px_rgba(244,197,66,0.2)] transition-all duration-300">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-xl lg:text-2xl font-bold text-text-primary mb-1.5 md:mb-3 group-hover:text-gold-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary mb-3 md:mb-6 leading-relaxed text-xs md:text-base">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {service.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 md:px-4 md:py-2 bg-bg-secondary border border-border-primary text-text-secondary rounded-full text-[10px] md:text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-32 bg-bg-secondary/30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          {/* Mobile-first - 2x2 grid, desktop uses 2 column layout */}
          <div className="mb-10 md:mb-0">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="text-center"
            >
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-8">
                Excellence in Every Detail
              </h2>
              {/* Gold divider for mobile */}
              <div className="w-16 h-1 bg-gradient-to-r from-gold-primary to-gold-deep mx-auto md:hidden mb-8" />
            </motion.div>

            {/* 2x2 Grid for mobile only */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4 md:hidden mb-10"
            >
              {[
                { title: 'Expert Team', desc: 'Seasoned professionals with 10+ years of industry expertise', icon: 'users' },
                { title: 'Enterprise Security', desc: 'Bank-level security and scalable infrastructure', icon: 'shield' },
                { title: 'Agile Process', desc: 'Clear communication and iterative development', icon: 'refresh' },
                { title: 'Post-launch Support', desc: '24/7 support and maintenance services', icon: 'headset' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-bg-card border border-border-primary rounded-2xl text-center"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 border border-gold-primary/20 rounded-xl flex items-center justify-center">
                    {item.icon === 'users' && (
                      <svg className="w-5 h-5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    )}
                    {item.icon === 'shield' && (
                      <svg className="w-5 h-5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    )}
                    {item.icon === 'refresh' && (
                      <svg className="w-5 h-5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                    )}
                    {item.icon === 'headset' && (
                      <svg className="w-5 h-5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary text-xs mb-0.5">{item.title}</h4>
                    <p className="text-text-secondary text-[10px] leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quote Card (mobile only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="relative md:hidden"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-gold-primary/30 to-blue-accent/20 rounded-2xl rotate-1" />
              <div className="relative bg-bg-card border border-border-primary rounded-2xl p-4 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-primary/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-accent/5 rounded-full blur-3xl" />
                <div className="relative">
                  <MessageSquare className="w-6 h-6 text-gold-primary/30 mb-3" />
                  <blockquote className="text-base font-medium text-text-primary mb-4 leading-relaxed">
                    "We don't just build software, we build partnerships that last."
                  </blockquote>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-bg-secondary border border-border-primary rounded-full flex items-center justify-center text-gold-primary text-base font-bold">
                      AK
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-text-primary">AK Infinity Team</p>
                      <p className="text-[10px] text-text-muted">Your Digital Partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop/Tablet Layout (unchanged) */}
          <div className="hidden md:grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                  Why Choose Us
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
                  Excellence in Every Detail
                </h2>
              </motion.div>
              <motion.div variants={fadeInUp} className="space-y-6">
                {[
                  { title: 'Expert Team', desc: 'Seasoned professionals with 10+ years of industry expertise' },
                  { title: 'Enterprise Security', desc: 'Bank-level security and scalable infrastructure' },
                  { title: 'Agile Process', desc: 'Clear communication and iterative development' },
                  { title: 'Post-launch Support', desc: '24/7 support and maintenance services' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-6 bg-bg-card border border-border-primary rounded-2xl"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-bg-secondary border border-border-primary rounded-xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary text-lg mb-1">{item.title}</h4>
                      <p className="text-text-secondary">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-gold-primary/30 to-blue-accent/20 rounded-3xl rotate-1" />
              <div className="relative bg-bg-card border border-border-primary rounded-3xl p-6 md:p-10 lg:p-12 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-gold-primary/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-blue-accent/5 rounded-full blur-3xl" />
                <div className="relative">
                  <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-gold-primary/30 mb-4 md:mb-8" />
                  <blockquote className="text-lg md:text-2xl lg:text-3xl font-medium text-text-primary mb-6 md:mb-10 leading-relaxed">
                    "We don't just build software, we build partnerships that last."
                  </blockquote>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-bg-secondary border border-border-primary rounded-full flex items-center justify-center text-gold-primary text-lg md:text-xl font-bold">
                      AK
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-text-primary">AK Infinity Team</p>
                      <p className="text-xs md:text-sm text-text-muted">Your Digital Partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10 md:mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                What Our Clients Say
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Trusted by leading companies worldwide
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-5 md:gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-bg-card border border-border-primary rounded-3xl p-4 md:p-8 hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-3 md:mb-4">
                  {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= Math.floor(testimonial.rating)) {
                      return (
                        <Star
                          key={star}
                          className="w-3.5 h-3.5 md:w-5 md:h-5 text-gold-primary fill-gold-primary"
                        />
                      );
                    } else if (star - testimonial.rating === 0.5) {
                      return (
                        <StarHalf
                          key={star}
                          className="w-3.5 h-3.5 md:w-5 md:h-5 text-gold-primary fill-gold-primary"
                        />
                      );
                    } else {
                      return (
                        <Star
                          key={star}
                          className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-400"
                        />
                      );
                    }
                  })}
                </div>
                <p className="text-text-secondary text-xs md:text-lg mb-4 md:mb-8 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className={`w-10 h-10 md:w-16 md:h-16 border border-border-primary rounded-full flex items-center justify-center overflow-hidden ${index === 2 ? 'bg-[#2b2a28] border-none' : 'bg-bg-secondary'}`}>
                    {testimonial.logo ? (
                      <img
                        src={testimonial.logo}
                        alt={`${testimonial.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gold-primary font-semibold text-xs md:text-base">{testimonial.initial}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-xs md:text-lg text-text-primary">{testimonial.name}</p>
                    <p className="text-[10px] md:text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-bg-elevated to-bg-card border border-border-primary p-6 md:p-12 lg:p-20 text-center"
          >
            <div className="absolute inset-0">
              <div className="absolute -top-16 -left-16 w-56 h-56 md:w-72 md:h-72 bg-gold-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 md:w-96 md:h-96 bg-blue-accent/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-4 md:mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-text-secondary mb-8 md:mb-12 max-w-2xl mx-auto">
                Let's discuss your project and build something amazing together.
              </p>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="h-12 md:h-16 px-8 md:px-12 text-sm md:text-lg"
                >
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-4 md:w-6 h-4 md:h-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
