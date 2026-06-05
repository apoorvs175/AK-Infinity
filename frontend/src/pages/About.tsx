import { motion, useAnimation, useInView } from 'framer-motion'
import { Award, Check, Shield, FileCheck, Building, Clock, Zap, MessageCircle, Star, CheckCircle } from 'lucide-react'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

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

const AnimatedCounter = ({ to }: { to: number | string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('animate')
    }
  }, [isInView, controls])

  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!counterRef.current || !isInView) return

    if (typeof to === 'string') {
      counterRef.current.textContent = to
      return
    }

    const duration = 1500
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.floor(progress * to)
      counterRef.current!.textContent = `${current}${to === 100 ? '%' : '+'}`
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [to, isInView])

  return (
    <span ref={counterRef} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold-primary to-gold-deep bg-clip-text text-transparent" />
  )
}

const team = [
  { name: 'Apoorv Vikram Singh', role: 'CEO & Founder', initial: 'AVS' },
  { name: 'Aman Raj', role: 'Chief Technology Officer (CTO)', initial: 'AR' },
  { name: 'Kashish Sharma', role: 'CFO & Lead Designer', initial: 'KS' },
  { name: 'Naman Singh', role: 'Senior Developer', initial: 'NS' }
]

const stats = [
  { number: 50, label: 'Projects Delivered', icon: <Zap className="w-8 h-8" /> },
  { number: '100%', label: 'Client Satisfaction', icon: <Star className="w-8 h-8" /> },
  { number: '24/7', label: 'Support Availability', icon: <Clock className="w-8 h-8" /> },
  { number: 'Within 24 Hours', label: 'Response Time', icon: <MessageCircle className="w-8 h-8" /> }
]

const trustPoints = [
  'Government of India Registered Business',
  'MSME Registered Enterprise',
  'Udyam Certified Organization',
  'Professional Development Team',
  'Modern Technology Stack',
  'Transparent Communication',
  'Dedicated Support',
  'Business-Focused Solutions'
]

const values = [
  { title: 'Excellence', desc: 'We strive for perfection in every line of code and every pixel we design.' },
  { title: 'Innovation', desc: 'We embrace new technologies and creative solutions to solve complex problems.' },
  { title: 'Integrity', desc: 'Honesty and transparency guide everything we do for our clients.' },
  { title: 'Quality', desc: 'We never compromise on quality, ensuring every product exceeds expectations.' }
]

export default function About() {
  return (
    <div className="min-h-screen relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                About Us
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-8">
                Building the Future Together
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                We are a team of passionate experts dedicated to delivering premium digital solutions that drive real business growth and innovation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-bg-secondary/30">
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
                  Our Story
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
                  Building Excellence Since 2026
                </h2>
              </motion.div>
              <motion.div variants={fadeInUp} className="space-y-6">
                <p className="text-text-secondary text-lg leading-relaxed">
                  AK Infinity was established with a vision to help businesses grow through innovative digital solutions, modern technology, and reliable development services.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Our mission is to build high-quality websites, mobile applications, cloud solutions, and digital products that help businesses scale and succeed in the modern digital world.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  We believe in transparency, quality, innovation, and long-term client relationships.
                </p>
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-accent/5 rounded-full blur-3xl" />
                <div className="relative">
                  <MessageCircle className="w-12 h-12 text-gold-primary/30 mb-8" />
                  <blockquote className="text-2xl md:text-3xl font-medium text-text-primary mb-10 leading-relaxed">
                    "We believe that great products are built by great teams who truly care about their craft."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-bg-secondary border border-border-primary rounded-full flex items-center justify-center text-gold-primary text-xl font-bold">
                      AVS
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Apoorv Vikram Singh</p>
                      <p className="text-text-muted text-sm">CEO & Founder</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Official Business Registration Section */}
      <section className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border border-gold-primary/30 rounded-2xl flex items-center justify-center text-gold-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="inline-block text-gold-primary font-semibold tracking-widest uppercase text-sm">
                  Official Business Registration
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Government Verified Business
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                AK Infinity is an officially registered MSME (Micro, Small and Medium Enterprise) under the Government of India Udyam Registration framework. Our registration reflects our commitment to professionalism, transparency, and long-term business operations.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { icon: <Shield className="w-7 h-7" />, text: "MSME Registered Enterprise" },
                { icon: <FileCheck className="w-7 h-7" />, text: "Udyam Certified" },
                { icon: <Building className="w-7 h-7" />, text: "Micro Enterprise" },
                { icon: <Award className="w-7 h-7" />, text: "Registered Since 2024" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="flex items-center gap-4 p-6 bg-bg-card border border-border-primary rounded-2xl hover:border-gold-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border border-gold-primary/20 rounded-xl flex items-center justify-center text-gold-primary">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-text-primary text-lg">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-bg-card border border-border-primary rounded-3xl p-8 md:p-10 text-center">
              <p className="text-text-muted text-sm mb-3">Udyam Registration Number</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gold-primary to-gold-deep bg-clip-text text-transparent">
                UDYAM-UP-28-0222045
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Trust AK Infinity Section */}
      <section className="py-20 bg-bg-secondary/30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Why Trust Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                Why Trust AK Infinity?
              </h2>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trustPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex items-start gap-4 p-6 bg-bg-card border border-border-primary rounded-2xl hover:border-gold-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border border-gold-primary/20 rounded-xl flex items-center justify-center text-gold-primary">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold text-text-primary">{point}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Our Impact
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                Company Statistics
              </h2>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-bg-card border border-border-primary rounded-3xl p-10 text-center hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-primary/25 to-gold-deep/15 border border-gold-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold-primary">
                  {stat.icon}
                </div>
                <div className="mb-2">
                  <AnimatedCounter to={stat.number} />
                </div>
                <p className="text-text-secondary font-semibold text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-bg-secondary/30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Our Values
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                What We Stand For
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                The principles that guide every decision we make and every product we build.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-bg-card border border-border-primary rounded-3xl p-8 text-center hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-bg-secondary border border-border-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-gold-primary/50 transition-all duration-300">
                  <Check className="w-8 h-8 text-gold-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{value.title}</h3>
                <p className="text-text-secondary">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
                Our Team
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                Meet the Experts
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                The talented individuals who make everything possible.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-bg-card border border-border-primary rounded-3xl p-8 text-center hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-gold-primary/30 to-gold-deep/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-border-primary">
                  <span className="text-gold-primary font-bold text-3xl">{member.initial}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">{member.name}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bg-secondary/30">
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
                Let's Work Together
              </h2>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
                Ready to transform your business with a professional website, mobile application, or custom digital solution?<br />
                Let's build something exceptional together.
              </p>
              <Link to="/contact">
                <Button size="lg" className="h-16 px-12 text-lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
