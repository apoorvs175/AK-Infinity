import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { Check, ChevronRight, ExternalLink, Zap, Users, TrendingUp, Shield, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect, useCallback } from 'react'

const portfolioProjects = [
  {
    id: 1,
    milestone: '01',
    title: 'Clanza Inn – Premium Hostel & Student Accommodation Platform',
    businessType: 'PropTech / Student Housing',
    clientGoal: 'To build a comprehensive hostel management and booking platform to streamline operations and improve student experience.',
    challenge: 'Manual hostel administration was time-consuming, error-prone, and lacked real-time visibility into occupancy and fees.',
    solution: 'We developed a full-featured platform with student registration, online booking, attendance tracking, fee management, and visitor management systems.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'HTML5', 'CSS3'],
    features: [
      'Student Registration',
      'Online Room Booking',
      'Attendance Management',
      'Fee Receipt Generation',
      'Digital Payment Tracking',
      'Room Allocation System',
      'Visitor Management',
      'Complaint Management',
      'Amenities Showcase',
      'Inquiry Management',
      'WhatsApp Integration',
      'Mobile Responsive Design',
      'SEO Optimization'
    ],
    outcome: 'Automated hostel operations with reduced manual work and improved student satisfaction.',
    results: [
      'Automated hostel operations',
      'Reduced manual administration',
      'Improved student experience',
      'Better occupancy management',
      'Streamlined fee tracking'
    ],
    liveLink: 'https://clanzainn.vercel.app/',
    images: [
      '/Images/Project Images/ClanzaInn_1.png',
      '/Images/Project Images/ClanzaInn_2.png',
      '/Images/Project Images/ClanzaInn_3.png',
      '/Images/Project Images/ClanzaInn_4.png'
    ]
  },
  {
    id: 2,
    milestone: '02',
    title: 'MyHostel HMA (Hostel Management Application)',
    businessType: 'SaaS / Property Management',
    clientGoal: 'To create a scalable SaaS platform for managing multiple hostels with role-based access and real-time analytics.',
    challenge: 'Managing multiple hostels across locations was fragmented, with no centralized system for operations and reporting.',
    solution: 'We built a multi-tenant SaaS platform with super admin, hostel admin, and student portals with real-time data sync and analytics.',
    technologies: ['React', 'TypeScript', 'Supabase Cloud Services', 'Supabase PostgreSQL', 'Supabase Auth', 'JWT Security'],
    features: [
      'Role-Based Authentication',
      'Super Admin Dashboard',
      'Hostel Admin Dashboard',
      'Student Portal',
      'Occupancy Tracking',
      'Room Allocation',
      'Bed Management',
      'Complaint System',
      'Fee Management',
      'Attendance Management',
      'Digital Records',
      'Real-Time Reporting',
      'Analytics Dashboard',
      'Multi-Hostel Support'
    ],
    outcome: 'Centralized hostel operations with scalable SaaS architecture and real-time tracking.',
    results: [
      'Centralized hostel operations',
      'Scalable SaaS architecture',
      'Reduced paperwork',
      'Real-time occupancy tracking',
      'Better hostel administration'
    ],
    liveLink: 'https://www.myhostell.site/auth/login',
    images: [
      '/Images/Project Images/MyHostelHMA_1.png',
      '/Images/Project Images/MyHostelHMA_2.png',
      '/Images/Project Images/MyHostelHMA_3.png',
      '/Images/Project Images/MyHostelHMA_4.png'
    ]
  },
  {
    id: 3,
    milestone: '03',
    title: 'ZynPay – International Digital Payments Platform',
    businessType: 'FinTech',
    clientGoal: 'To build an international payment platform with currency exchange, gift cards, and real-time analytics.',
    challenge: 'International transactions were complex, with limited visibility into financial data and no unified payment solution.',
    solution: 'We developed a secure payment platform with multi-currency support, gift card marketplace, and real-time financial analytics.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'SSL Security', 'Authentication System'],
    features: [
      'Currency Exchange',
      'Gift Card Marketplace',
      'International Transactions',
      'Real-Time Analytics Dashboard',
      'Transaction Monitoring',
      'Payment Tracking',
      'Financial Reports',
      'Multi-Currency Support',
      'User Management',
      'Admin Dashboard'
    ],
    outcome: 'Simplified international transactions with improved digital payment experience and centralized monitoring.',
    results: [
      'Simplified international transactions',
      'Improved digital payment experience',
      'Centralized financial monitoring',
      'Enhanced user engagement'
    ],
    liveLink: 'https://zynpayproduct.vercel.app/',
    images: [
      '/Images/Project Images/ZynPay_1.png',
      '/Images/Project Images/ZynPay_2.png',
      '/Images/Project Images/ZynPay_3.png',
      '/Images/Project Images/ZynPay_4.png'
    ]
  },
  {
    id: 4,
    milestone: '04',
    title: 'Atrangi Café – Modern Café Experience Platform',
    businessType: 'Food & Beverage',
    clientGoal: 'To create a modern café website with digital menu, table booking, and customer engagement features.',
    challenge: 'The café lacked an online presence, making it difficult for customers to view menus and book tables.',
    solution: 'We designed a visually engaging platform with digital menu, table booking, event promotion, and interactive animations.',
    technologies: ['React', 'TypeScript', 'CSS3', 'Modern Animation Libraries'],
    features: [
      'Digital Menu',
      'Table Booking',
      'Event Promotion',
      'Contact Integration',
      'Customer Engagement',
      'Mobile Responsive Design',
      'Interactive Animations',
      'Modern UI/UX',
      'SEO Optimization'
    ],
    outcome: 'Enhanced brand visibility and improved customer engagement with better online presence.',
    results: [
      'Enhanced brand visibility',
      'Improved customer engagement',
      'Better online presence',
      'Increased booking opportunities'
    ],
    liveLink: 'https://cozy-brew-hub-16.preview.emergentagent.com/',
    images: [
      '/Images/Project Images/AtrangiCafe_1.png',
      '/Images/Project Images/AtrangiCafe_2.png',
      '/Images/Project Images/AtrangiCafe_3.png',
      '/Images/Project Images/AtrangiCafe_4.png'
    ]
  },
  {
    id: 5,
    milestone: '05',
    title: 'CodeX Platform – AI Proctor Coding Environment',
    businessType: 'EdTech / AI',
    clientGoal: 'To build a secure coding assessment platform with AI proctoring and real-time code execution.',
    challenge: 'Traditional coding assessments lacked security and real-time monitoring, risking academic integrity.',
    solution: 'We developed an AI-powered platform with secure coding environment, real-time execution, and AI monitoring for anti-cheating.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AI Monitoring Systems', 'Automated Evaluation'],
    features: [
      'AI Proctoring',
      'Secure Coding Environment',
      'Real-Time Code Execution',
      'Student Dashboard',
      'Coding Challenges',
      'Assessment Tracking',
      'Performance Analytics',
      'AI Monitoring',
      'Learning Management Features',
      'Anti-Cheating System'
    ],
    outcome: 'Improved coding assessments with better academic integrity and real-time evaluation.',
    results: [
      'Improved coding assessments',
      'Better academic integrity',
      'Enhanced learning experience',
      'Real-time student evaluation'
    ],
    liveLink: 'https://codex-platform-one.vercel.app/',
    images: [
      '/Images/Project Images/CodeX_1.png',
      '/Images/Project Images/CodeX_2.png',
      '/Images/Project Images/CodeX_3.png',
      '/Images/Project Images/CodeX_4.png'
    ]
  },
  {
    id: 6,
    milestone: '06',
    title: 'AK Infinity E-Commerce Platform',
    businessType: 'Retail & E-Commerce',
    clientGoal: 'To build a modern e-commerce platform with product management, shopping cart, and order tracking.',
    challenge: 'The client needed a scalable online shopping solution with inventory management and analytics.',
    solution: 'We developed a full-featured e-commerce platform with product search, filters, customer dashboard, and analytics.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    features: [
      'Product Management',
      'Shopping Cart',
      'Order Management',
      'Customer Dashboard',
      'Product Search',
      'Filters & Categories',
      'Responsive Design',
      'Inventory Management',
      'Analytics Dashboard'
    ],
    outcome: 'Improved shopping experience with better product discoverability and optimized order management.',
    results: [
      'Improved shopping experience',
      'Better product discoverability',
      'Optimized order management'
    ],
    liveLink: 'https://shop-swart-iota.vercel.app/',
    images: [
      '/Images/Project Images/ECommerce_1.png',
      '/Images/Project Images/ECommerce_2.png',
      '/Images/Project Images/ECommerce_3.png',
      '/Images/Project Images/ECommerce_4.png'
    ]
  },
  {
    id: 7,
    milestone: '07',
    title: 'Daily Wages Workforce Management System',
    businessType: 'HRTech / Workforce Management',
    clientGoal: 'To create a workforce tracking platform with attendance, wage calculation, and reporting.',
    challenge: 'Manual wage calculations and attendance tracking were error-prone and time-consuming.',
    solution: 'We built a system for worker registration, attendance tracking, wage calculations, and payroll monitoring with analytics.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    features: [
      'Worker Registration',
      'Attendance Tracking',
      'Wage Calculations',
      'Payroll Monitoring',
      'Reporting Dashboard',
      'Workforce Analytics',
      'Employee Records'
    ],
    outcome: 'Reduced manual calculations with better workforce management and accurate payment tracking.',
    results: [
      'Reduced manual calculations',
      'Better workforce management',
      'Accurate payment tracking'
    ],
    liveLink: 'https://daily-wages-workforce-6qef.vercel.app/',
    images: [
      '/Images/Project Images/DailyWages_1.png',
      '/Images/Project Images/DailyWages_2.png',
      '/Images/Project Images/DailyWages_3.png',
      '/Images/Project Images/DailyWages_3.png'
    ]
  },
  {
    id: 8,
    milestone: '08',
    title: 'Real Estate Property Management Platform',
    businessType: 'Real Estate',
    clientGoal: 'To build a property listing and management platform with search, filters, and lead management.',
    challenge: 'Property management was fragmented with no centralized system for listings and inquiries.',
    solution: 'We developed a platform with property listings, search & filters, lead management, and property analytics.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    features: [
      'Property Listings',
      'Search & Filters',
      'Lead Management',
      'Inquiry System',
      'Property Analytics',
      'Responsive Interface',
      'Customer Dashboard'
    ],
    outcome: 'Improved property visibility with better lead generation and streamlined management.',
    results: [
      'Improved property visibility',
      'Better lead generation',
      'Streamlined property management'
    ],
    liveLink: 'https://real-estate-self-phi.vercel.app/',
    images: [
      '/Images/Project Images/RealEstate_1.png',
      '/Images/Project Images/RealEstate_2.png',
      '/Images/Project Images/RealEstate_3.png',
      '/Images/Project Images/RealEstate_3.png'
    ]
  },
  {
    id: 9,
    milestone: '09',
    title: 'Heartbeat Hotel – Modern Hotel Web Application',
    businessType: 'Hospitality / Hotel Tech',
    clientGoal: 'To build a complete, modern, and attractive hotel web application for seamless booking and guest management.',
    challenge: 'Traditional hotel booking systems are outdated, with poor user experience and limited functionality.',
    solution: 'We developed a beautiful, modern hotel web application with online room booking, room viewing, guest management, and an elegant user interface.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'CSS3', 'Responsive Design'],
    features: [
      'Online Room Booking',
      'Room Gallery & Details',
      'Guest Management',
      'Date Selection',
      'Responsive Interface',
      'Modern Animations',
      'SEO Optimized',
      'Mobile-First Design'
    ],
    outcome: 'Created a stunning, user-friendly hotel booking platform that enhances guest experience and streamlines operations.',
    results: [
      'Modern, attractive design',
      'Seamless booking experience',
      'Mobile-responsive interface',
      'Improved user engagement'
    ],
    liveLink: '#',
    images: [
      '/Images/Project Images/heartBeatHotel1.png',
      '/Images/Project Images/heartBeatHotel2.png',
      '/Images/Project Images/heartBeatHotel3.png',
      '/Images/Project Images/heartBeatHotel4.png'
    ]
  }
]

const PortfolioImageComposition = ({ index, images }: { index: number, images: string[] }) => {
  const isEven = index % 2 === 0
  const isProject01 = index === 0
  const isProject02 = index === 1
  const isProject03 = index === 2
  const isProject05 = index === 4

  if (isProject01) {
    return (
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* Large horizontal image (Row 1) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-3xl aspect-video mb-6"
          >
            <img
              src={images[0]}
              alt="Project showcase"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Existing 3-image collage (Row 2) */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl aspect-[4/5]"
            >
              <img
                src={images[1]}
                alt="Project feature"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="flex flex-col gap-4 pt-8">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl aspect-square"
              >
                <img
                  src={images[2]}
                  alt="Project feature"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="relative overflow-hidden rounded-3xl aspect-square"
              >
                <img
                  src={images[3]}
                  alt="Project summary"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 rounded-full blur-2xl"
          />
        </motion.div>
      </div>
    )
  }

  if (isProject02) {
    return (
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* Staggered collage layout for Project 02 */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <img
                  src={images[0]}
                  alt="Project showcase"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <img
                  src={images[2]}
                  alt="Project feature"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
            {/* Right column - shifted downward */}
            <div className="flex flex-col gap-4 pt-12">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <img
                  src={images[1]}
                  alt="Project feature"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="relative overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <img
                  src={images[3]}
                  alt="Project summary"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 rounded-full blur-2xl"
          />
        </motion.div>
      </div>
    )
  }

  if (isProject03 || isProject05) {
    return (
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* Magazine-style layout for Project 03 and 05 */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Large main showcase image - full height of right column */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl col-span-8"
            >
              <img
                src={images[0]}
                alt="Project showcase"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            {/* Right column with two taller images */}
            <div className="flex flex-col gap-4 col-span-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl aspect-[3/4]"
              >
                <img
                  src={images[1]}
                  alt="Project feature"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl aspect-[3/4]"
              >
                <img
                  src={images[2]}
                  alt="Project feature"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
          {/* Full width banner image */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative overflow-hidden rounded-3xl aspect-video"
          >
            <img
              src={images[3]}
              alt="Project summary"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-gold-primary/20 to-gold-deep/10 rounded-full blur-2xl"
          />
        </motion.div>
      </div>
    )
  }

  // Original layout for all other projects (04, 06-08)
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
            className="relative overflow-hidden rounded-3xl aspect-[4/5]"
          >
            <img
              src={images[0]}
              alt="Project showcase"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div className="flex flex-col gap-4 pt-8">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl aspect-square"
            >
              <img
                src={images[1]}
                alt="Project feature"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl aspect-square"
            >
              <img
                src={images[2]}
                alt="Project feature"
                className="w-full h-full object-cover"
                loading="lazy"
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

const PortfolioRoadmapPath = () => {
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
          <linearGradient id="portfolioRoadmapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4C542" />
            <stop offset="50%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 0 
             C 60 150, 60 250, 0 400 
             C -60 550, -60 650, 0 800 
             C 60 950, 60 1050, 0 1200"
          stroke="url(#portfolioRoadmapGradient)"
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

const PortfolioSlider = () => {
  const sliderItems = [
    {
      id: 1,
      title: "Clanza Inn",
      description: "Modern student accommodation platform.",
      image: "/Images/Slider/Clanza_In_Hostel.png",
      link: "https://clanzainn.vercel.app/"
    },
    {
      id: 2,
      title: "MyHostel HMA",
      description: "Smart hostel operations management.",
      image: "/Images/Slider/HostelManagementPortal_Image.png",
      link: "https://www.myhostell.site/auth/login"
    },
    {
      id: 3,
      title: "ZynPay",
      description: "Digital payment and transaction solution.",
      image: "/Images/Slider/ZynpayPrductImage.png",
      link: "https://zynpayproduct.vercel.app/"
    },
    {
      id: 4,
      title: "Atrangi Café",
      description: "Modern café experience platform.",
      image: "/Images/Slider/atrangiCafe_Image.png",
      link: "https://cozy-brew-hub-16.preview.emergentagent.com/"
    },
    {
      id: 5,
      title: "CodeX Platform",
      description: "Interactive coding and learning ecosystem.",
      image: "/Images/Slider/CodeX_Platform.png",
      link: "https://codex-platform-one.vercel.app/"
    },
    {
      id: 6,
      title: "E-Commerce",
      description: "Premium online shopping experience.",
      image: "/Images/Slider/E_Commerce_Image.png",
      link: "https://shop-swart-iota.vercel.app/"
    },
    {
      id: 7,
      title: "Daily Wages Workforce",
      description: "Workforce and labor management platform.",
      image: "/Images/Slider/DailyWagesWorkforce_image.png",
      link: "https://daily-wages-workforce-6qef.vercel.app/"
    },
    {
      id: 8,
      title: "Real Estate",
      description: "Property listing and management platform.",
      image: "/Images/Slider/RealEastate_Company.png",
      link: "https://real-estate-self-phi.vercel.app/"
    },
    {
      id: 9,
      title: "Heartbeat Hotel",
      description: "Complete modern hotel web application.",
      image: "/Images/Project Images/heartBeatHotel1.png",
      link: "#"
    }
  ]

  // Duplicate items for infinite scroll
  const allItems = [...sliderItems, ...sliderItems, ...sliderItems]
  const itemWidth = 300
  const gap = 24
  const totalSingleSetWidth = sliderItems.length * (itemWidth + gap)
  
  const [isPaused, setIsPaused] = useState(false)
  const x = useMotionValue(0 as any)
  const resumeTimeoutRef = useRef<number | null>(null)

  const pauseAutoScroll = useCallback((resumeDelay = 800) => {
    setIsPaused(true)
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, resumeDelay)
  }, [])

  const handleNext = () => {
    pauseAutoScroll(500)
    x.set(x.get() - (itemWidth + gap))
  }

  const handlePrev = () => {
    pauseAutoScroll(500)
    x.set(x.get() + (itemWidth + gap))
  }

  // Keep offset within bounds for smooth infinite scroll
  useEffect(() => {
    const unsubscribe = x.onChange((latest: number) => {
      const maxOffset = -totalSingleSetWidth
      if (latest <= maxOffset) {
        x.set(latest + totalSingleSetWidth)
      } else if (latest > 0) {
        x.set(latest - totalSingleSetWidth)
      }
    })
    return unsubscribe
  }, [x, totalSingleSetWidth])

  const animationProps = !isPaused ? {
    x: [x.get(), x.get() - totalSingleSetWidth] as any
  } : undefined

  const transitionProps = (!isPaused ? {
    x: {
      repeat: Infinity,
      repeatType: "loop",
      duration: sliderItems.length * 5,
      ease: "linear",
    },
  } : undefined) as any

  return (
    <section className="py-6 sm:py-10 md:py-12 overflow-hidden relative">
      {/* Decorative gradient elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Navigation Arrows - Desktop/Tablet only */}
        <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-4 z-20">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700 group-hover:text-gold-primary transition-colors duration-300" />
          </button>
        </div>
        <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-4 z-20">
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronRightIcon className="w-6 h-6 text-slate-700 group-hover:text-gold-primary transition-colors duration-300" />
          </button>
        </div>

        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          animate={animationProps}
          transition={transitionProps}
          drag="x"
          dragDirectionLock
          dragElastic={0.05}
          dragMomentum={true}
          dragPropagation={false}
          onDragStart={() => pauseAutoScroll(800)}
          onDragEnd={() => {
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current)
            }
            resumeTimeoutRef.current = setTimeout(() => {
              setIsPaused(false)
            }, 800)
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {allItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 pointer-events-auto"
            >
              <motion.div
                className="w-[220px] sm:w-[300px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative"
                whileHover={{ 
                  y: -12, 
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* Premium gradient border */}
                <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-gold-primary/30 via-amber-100/20 to-slate-200/30 pointer-events-none group-hover:from-gold-primary/50 group-hover:via-amber-100/30 group-hover:to-slate-200/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-white rounded-[23px]" />
                </div>
                <div className="relative z-10">
                  <div className="relative h-[160px] sm:h-[180px] overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.05, transition: { duration: 0.7 } }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                    
                    {/* Subtle overlay on hover */}
                    <motion.div 
                      className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 group-hover:text-gold-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function Portfolio() {
  return (
    <div className="min-h-screen relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-2 sm:pt-24 sm:pb-4 md:pt-20 md:pb-6 lg:pt-24 lg:pb-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block text-gold-primary font-semibold mb-3 tracking-widest uppercase text-sm">
              Our Portfolio Journey
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6">
              Success Stories
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-0">
              Explore our journey of transforming businesses through premium digital solutions, one success story at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Slider */}
      <PortfolioSlider />

      {/* Portfolio Journey Section */}
      <section className="py-6 sm:py-10 md:py-12 relative">
        <PortfolioRoadmapPath />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          {portfolioProjects.map((project, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.section
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-150px' }}
                transition={{ duration: 0.8 }}
                className={`mb-20 sm:mb-32 ${index === portfolioProjects.length - 1 ? 'mb-12 sm:mb-20' : ''}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  {/* Image Composition */}
                  <div className={`${!isEven ? 'md:order-2' : ''}`}>
                    <PortfolioImageComposition index={index} images={project.images} />
                  </div>

                  {/* Project Story Content */}
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
                            {project.milestone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-[2px] bg-gradient-to-r from-gold-primary to-transparent" />
                          <span className="text-gold-primary font-semibold tracking-wider uppercase text-sm">
                            Milestone {project.milestone}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
                        {project.title}
                      </h2>
                      <p className="text-lg text-gold-primary font-semibold mb-8">
                        {project.businessType}
                      </p>

                      {/* Client Goal - Hidden on mobile */}
                      <div className="mb-6 hidden md:block">
                        <h4 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-gold-primary" /> Client Goal
                        </h4>
                        <p className="text-text-secondary leading-relaxed">{project.clientGoal}</p>
                      </div>

                      {/* Challenge - Hidden on mobile */}
                      <div className="mb-6 hidden md:block">
                        <h4 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-gold-primary" /> The Challenge
                        </h4>
                        <p className="text-text-secondary leading-relaxed">{project.challenge}</p>
                      </div>

                      {/* Solution - Hidden on mobile */}
                      <div className="mb-8 hidden md:block">
                        <h4 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Users className="w-5 h-5 text-gold-primary" /> Our Solution
                        </h4>
                        <p className="text-text-secondary leading-relaxed">{project.solution}</p>
                      </div>

                      {/* Technologies */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-text-primary mb-3">Technologies Used</h4>
                        <div className="flex flex-wrap gap-3">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-bg-secondary border border-border-primary text-text-secondary rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {project.features.map((feature, idx) => (
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

                      {/* Outcome */}
                      <div className="mb-8 p-6 bg-bg-secondary/50 border border-border-primary rounded-2xl">
                        <h4 className="text-lg font-semibold text-text-primary mb-3">Outcome</h4>
                        <p className="text-text-secondary leading-relaxed mb-4">{project.outcome}</p>
                        <div className="space-y-2">
                          {project.results.map((result, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <TrendingUp className="w-5 h-5 text-gold-primary" />
                              <span className="text-text-primary font-semibold">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className="h-14">
                            View Live Project
                            <ExternalLink className="ml-2 w-5 h-5" />
                          </Button>
                        </a>
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
      <section className="py-12 sm:py-16 md:py-20">
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
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                Let's discuss your project and create your own success story together.
              </p>
              <Link to="/contact">
                <Button size="lg" className="h-16 px-12 text-lg">
                  Get in Touch
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
