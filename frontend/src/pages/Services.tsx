import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Check, ChevronRight, Search, Layers, Code2, Smartphone, Cloud, Zap, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

const roadmapServices = [
  {
    id: 'discovery',
    step: '01',
    title: 'Discovery & Strategy',
    description: 'We start by deeply understanding your business goals, target audience, and project requirements to craft a comprehensive, data-driven strategy that ensures success from day one.',
    features: [
      'User Research',
      'Competitive Analysis',
      'Goal Setting',
      'Tech Stack Planning',
      'Timeline Definition',
      'Budget Estimation'
    ],
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'design',
    step: '02',
    title: 'UI/UX Design',
    description: 'Creating beautiful, intuitive, and user-centered designs that drive engagement, reduce friction, and deliver exceptional user experiences that your customers will love.',
    features: [
      'Wireframing',
      'High-Fidelity Mockups',
      'Prototyping',
      'Design Systems',
      'Usability Testing',
      'Accessibility Focus'
    ],
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1487014679447-9f833a70028f?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'web',
    step: '03',
    title: 'Web Development',
    description: 'Building custom, scalable, and high-performance web applications using modern technologies and industry best practices that grow with your business.',
    features: [
      'React & Next.js',
      'TypeScript',
      'Responsive Design',
      'Performance Optimization',
      'SEO Integration',
      'PWA Support'
    ],
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'mobile',
    step: '04',
    title: 'Mobile Development',
    description: 'Creating native and cross-platform mobile applications that deliver seamless, performant experiences on both iOS and Android devices worldwide.',
    features: [
      'React Native',
      'iOS & Android',
      'Offline Support',
      'Push Notifications',
      'App Store Optimization',
      'Analytics Integration'
    ],
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'cloud',
    step: '05',
    title: 'Cloud & Deployment',
    description: 'Setting up scalable, secure, and reliable cloud infrastructure to ensure your application runs at peak performance 24/7, anywhere in the world.',
    features: [
      'AWS & Azure',
      'Serverless Architecture',
      'CI/CD Pipelines',
      'DevOps Practices',
      'Monitoring & Logging',
      'Enterprise Security'
    ],
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'support',
    step: '06',
    title: 'Maintenance & Support',
    description: 'Providing comprehensive post-launch support and proactive maintenance to keep your product running smoothly and evolving with your needs.',
    features: [
      '24/7 Support',
      'Bug Fixes',
      'Performance Monitoring',
      'Feature Updates',
      'Security Patches',
      'Scalability Planning'
    ],
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'
    ]
  }
]



const ImageComposition = ({ images, index }: { images: string[], index: number }) => {
  const isEven = index % 2 === 0
  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-bg-card"
          >
            <img
              src={images[0]}
              alt="Service visual"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </motion.div>
          <div className="flex flex-col gap-4 pt-8">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl aspect-square bg-bg-card"
            >
              <img
                src={images[1]}
                alt="Service visual"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl aspect-square bg-bg-card"
            >
              <img
                src={images[2]}
                alt="Service visual"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 rounded-full blur-2xl"
        />
      </motion.div>
    </div>
  )
}

const RoadmapPath = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden md:block pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roadmapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4C542" />
            <stop offset="50%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 0 
             C 60 150, 60 250, 0 400 
             C -60 550, -60 650, 0 800 
             C 60 950, 60 1050, 0 1200 
             C -60 1350, -60 1450, 0 1600 
             C 60 1750, 60 1850, 0 2000"
          stroke="url(#roadmapGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          style={{ pathLength }}
        />
      </svg>
    </div>
  )
}

export default function Services() {
  return (
    <div className="min-h-screen relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block text-gold-primary font-semibold mb-4 tracking-widest uppercase text-sm">
              Our Services
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-8">
              Your Digital Journey
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              A connected, visual journey of premium services designed to transform your vision into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 relative">
        <RoadmapPath />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          {roadmapServices.map((service, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.section
                key={service.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-150px' }}
                transition={{ duration: 0.8 }}
                className={`mb-32 ${index === roadmapServices.length - 1 ? 'mb-20' : ''}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  {/* Image Composition */}
                  <div className={`${!isEven ? 'md:order-2' : ''}`}>
                    <ImageComposition images={service.images} index={index} />
                  </div>

                  {/* Text Content */}
                  <div className={`${isEven ? 'md:order-2' : ''}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-bg-secondary border border-border-primary rounded-2xl flex items-center justify-center">
                          <span className="text-3xl font-bold bg-gradient-to-r from-gold-primary to-gold-deep bg-clip-text text-transparent">
                            {service.step}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-[2px] bg-gradient-to-r from-gold-primary to-transparent" />
                          <span className="text-gold-primary font-semibold tracking-wider uppercase text-sm">
                            Step {service.step}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
                        {service.title}
                      </h2>

                      <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-10">
                        {service.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-gold-primary" />
                            </div>
                            <span className="text-text-primary font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Milestone Marker */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 mt-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.4 }}
                    className="w-10 h-10 bg-bg-primary border-4 border-gold-primary rounded-full flex items-center justify-center z-10 shadow-[0_0_30px_rgba(244,197,66,0.3)]"
                  >
                    <div className="w-4 h-4 bg-gold-primary rounded-full" />
                  </motion.div>
                </div>
              </motion.section>
            )
          })}
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-bg-elevated to-bg-card border border-border-primary p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-gold-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-accent/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
                Start Your Journey
              </h2>
              <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                Let's discuss your project and walk through the roadmap together to bring your vision to life.
              </p>
              <Link to="/contact">
                <Button size="lg" className="h-16 px-12 text-lg">
                  Schedule a Consultation
                  <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
