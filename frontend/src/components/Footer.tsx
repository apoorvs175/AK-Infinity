import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#D4AF37]/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px] py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#0F0F0F] border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-2xl">AK</span>
              </div>
              <span className="text-xl font-bold text-white">AK Infinity</span>
            </Link>
            <p className="text-[#BDBDBD] mb-8 text-lg leading-relaxed max-w-md">
              Building enterprise-grade digital solutions that drive real business growth and innovation.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  name: 'WhatsApp',
                  href: 'https://wa.me/919044002858'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163S15.403 5.838 12 5.838zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4-1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M18.406 5.595c-.796 0-1.444.648-1.444 1.444s.648 1.444 1.8406 1.444c.796 0 1.444-.648 1.444-1.444s-.648-1.444-1.444-1.444z" fill="currentColor" />
                    </svg>
                  ),
                  name: 'Instagram',
                  href: '#'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" fill="currentColor" />
                      <path d="M5.337 7.433a2.064 2.064 0 1 1-4.128 0 2.064 2.064 0 0 1 4.128 0z" fill="currentColor" />
                      <path d="M7.09 20.452H3.538V9h3.552v11.452z" fill="currentColor" />
                      <path d="M23.994 2.292A2.292 2.292 0 0 0 21.706 0H2.288A2.29 2.29 0 0 0 0 2.292v19.416A2.292 2.292 0 0 0 2.288 24h19.418a2.292 2.292 0 0 0 2.288-2.292V2.292z" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                  ),
                  name: 'LinkedIn',
                  href: '#'
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-12 h-12 bg-[#0F0F0F] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#BDBDBD] hover:text-[#D4AF37] transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#D4AF37] font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((link, index) => (
                <li key={index}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#D4AF37] font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-4">
              {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Cloud Solutions'].map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#D4AF37] font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="text-[#BDBDBD]">
                <span className="block text-[#BDBDBD]/60 text-sm mb-1">Phone</span>
                <a href="tel:+919044002858" className="hover:text-[#D4AF37] transition-colors duration-300">
                  9044002858
                </a>
              </li>
              <li className="text-[#BDBDBD]">
                <span className="block text-[#BDBDBD]/60 text-sm mb-1">Address</span>
                <span className="block">914K – Solitarian City Building</span>
                <span className="block">KP-3, Greater Noida</span>
                <span className="block">Gautam Buddh Nagar</span>
                <span className="block">Uttar Pradesh, India – 201310</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/20 mt-12 pt-8 space-y-4 text-center">
          <p className="text-[#BDBDBD] text-sm">
            <span className="text-[#D4AF37] font-medium">MSME Registered Enterprise</span> | Udyam Registration No. UDYAM-UP-28-0222045
          </p>
          <div className="text-[#BDBDBD] text-sm flex flex-col md:flex-row gap-4 justify-center items-center">
            <p>© {new Date().getFullYear()} AK Infinity. All Rights Reserved.</p>
            <span className="hidden md:inline text-[#D4AF37]/40">|</span>
            <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
              Privacy Policy
            </a>
            <span className="hidden md:inline text-[#D4AF37]/40">|</span>
            <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
