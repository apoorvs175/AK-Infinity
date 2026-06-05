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
  Building,
  FileCheck
} from 'lucide-react'
import Button from '../components/Button'

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
    name: 'Sarah Johnson',
    role: 'CEO, TechCorp',
    content: 'AK Infinity transformed our business with an incredible digital solution. Their team is professional, responsive, and truly understands enterprise needs.',
    initial: 'SJ'
  },
  {
    name: 'Michael Chen',
    role: 'CTO, Innovate Inc',
    content: 'Working with AK Infinity was a game-changer. They delivered a scalable platform that exceeded our expectations.',
    initial: 'MC'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Founder, StartupX',
    content: 'From concept to launch, AK Infinity guided us every step of the way. The final product is beyond what we imagined.',
    initial: 'ER'
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
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
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
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-8 leading-[1.05] tracking-tight"
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
      <section className="py-12 bg-white border-y border-gold-primary/20">
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

            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
              {[
                { icon: <Award className="w-6 h-6" />, text: "Government of India Registered" },
                { icon: <Shield className="w-6 h-6" />, text: "MSME Registered Enterprise" },
                { icon: <FileCheck className="w-6 h-6" />, text: "Udyam Certified Business" },
                { icon: <Building className="w-6 h-6" />, text: "Registered Since 2024" }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-3 p-5 bg-bg-card border-2 border-gold-primary/25 rounded-2xl hover:border-gold-primary/70 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)] transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, -3, 3, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3, repeatDelay: 3 }}
                    className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gold-primary to-gold-deep rounded-2xl flex items-center justify-center text-white shadow-md"
                  >
                    {badge.icon}
                  </motion.div>
                  <span className="font-semibold text-text-primary text-center text-sm leading-tight">{badge.text}</span>
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
      <section className="py-24 md:py-32">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group bg-bg-card border border-border-primary rounded-3xl p-10 hover:border-gold-primary/30 hover:shadow-[0_0_40px_rgba(244,197,66,0.1)] transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-bg-secondary border border-border-primary rounded-2xl flex items-center justify-center group-hover:border-gold-primary/50 group-hover:shadow-[0_0_20px_rgba(244,197,66,0.2)] transition-all duration-300">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-gold-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-bg-secondary border border-border-primary text-text-secondary rounded-full text-sm font-medium"
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
      <section className="py-24 md:py-32 bg-bg-secondary/30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
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
              <div className="relative bg-bg-card border border-border-primary rounded-3xl p-12 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-accent/5 rounded-full blur-3xl" />
                <div className="relative">
                  <MessageSquare className="w-12 h-12 text-gold-primary/30 mb-8" />
                  <blockquote className="text-2xl md:text-3xl font-medium text-text-primary mb-10 leading-relaxed">
                    "We don't just build software, we build partnerships that last."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-bg-secondary border border-border-primary rounded-full flex items-center justify-center text-gold-primary text-xl font-bold">
                      AK
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">AK Infinity Team</p>
                      <p className="text-text-muted text-sm">Your Digital Partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
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
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-bg-card border border-border-primary rounded-3xl p-10 hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-gold-primary fill-gold-primary"
                    />
                  ))}
                </div>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-bg-secondary border border-border-primary rounded-full flex items-center justify-center text-gold-primary font-semibold">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-bg-elevated to-bg-card border border-border-primary p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-gold-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-accent/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                Let's discuss your project and build something amazing together.
              </p>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg"
                >
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
