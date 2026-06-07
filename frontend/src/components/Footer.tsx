import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#D4AF37]/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px] py-12 sm:py-16 md:py-20">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Logo & Brand Section */}
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-[#0F0F0F] border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-xl">AK</span>
              </div>
              <span className="text-lg font-bold text-white">AK Infinity</span>
            </Link>
            <p className="text-[#BDBDBD] text-xs leading-relaxed">
              Building enterprise-grade digital solutions that drive real business growth and innovation.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mb-8">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.494-.67-.503-.172-.009-.371-.009-.57-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.812 11.812 0 0012.05 0C5.495 0 .162 5.334.162 11.886c0 2.098.551 4.134 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.889-5.335 11.889-11.887a11.815 11.815 0 00-3.48-8.423z"/>
                    </svg>
                  ),
                  name: 'WhatsApp',
                  href: 'https://wa.me/919044002858'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <radialGradient id="ig" cx="50%" cy="50%" r="150%">
                        <stop offset="0%" stopColor="#F58529"/>
                        <stop offset="25%" stopColor="#FEDA77"/>
                        <stop offset="50%" stopColor="#DD2A7B"/>
                        <stop offset="75%" stopColor="#8134AF"/>
                        <stop offset="100%" stopColor="#515BD4"/>
                      </radialGradient>
                      <path fill="url(#ig)" d="M12 0c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163S15.403 2.163 12 2.163zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4-1.79 4 4 4zm6.406-11.845c-.796 0-1.444.648-1.444 1.444s.648 1.444 1.444 1.444c.796 0 1.444-.648 1.444-1.444s-.648-1.444-1.444-1.444z"/>
                    </svg>
                  ),
                  name: 'Instagram',
                  href: '#'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#0077B5" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1-4.128 0 2.064 2.064 0 0 1 4.128 0zM7.09 20.452H3.538V9h3.552v11.452zM23.994 2.292A2.292 2.292 0 0 0 21.706 0H2.288A2.29 2.29 0 0 0 0 2.292v19.416A2.292 2.292 0 0 0 2.288 24h19.418a2.292 2.292 0 0 0 2.288-2.292V2.292z"/>
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
                  className="w-10 h-10 bg-[#0F0F0F] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

          {/* 3 Column Grid for Links */}
          <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <h3 className="text-[#D4AF37] font-semibold text-sm mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((link, index) => (
                    <li key={index}>
                      <Link
                        to={`/${link.toLowerCase()}`}
                        className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300 text-xs"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[#D4AF37] font-semibold text-sm mb-3">Services</h3>
                <ul className="space-y-2">
                  {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Cloud Solutions'].map((service, index) => (
                    <li key={index}>
                      <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300 text-xs">
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[#D4AF37] font-semibold text-sm mb-3">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-[#BDBDBD] text-xs">
                    <span className="block text-[#BDBDBD]/60 text-[10px] mb-0.5">Phone</span>
                    <a href="tel:+919044002858" className="hover:text-[#D4AF37] transition-colors duration-300">
                      9044002858
                    </a>
                  </li>
                  <li className="text-[#BDBDBD] text-xs">
                    <span className="block text-[#BDBDBD]/60 text-[10px] mb-0.5">Address</span>
                    <span className="block">914K – Solitarian City Building,</span>
                    <span className="block">KP-3, Greater Noida,</span>
                    <span className="block">Gautam Buddh Nagar,</span>
                    <span className="block">Uttar Pradesh, India – 201310</span>
                  </li>
                </ul>
              </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#D4AF37]/20 pt-6 space-y-3 text-center">
            <p className="text-[#BDBDBD] text-xs">
              <span className="text-[#D4AF37] font-medium">MSME Registered Enterprise</span> | Udyam Registration No. UDYAM-UP-28-0222045
            </p>
            <div className="text-[#BDBDBD] text-xs flex flex-col gap-2 justify-center items-center">
              <p>© {new Date().getFullYear()} AK Infinity. All Rights Reserved.</p>
              <div className="flex gap-3">
                <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
                  Terms & Conditions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
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
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.494-.67-.503-.172-.009-.371-.009-.57-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.812 11.812 0 0012.05 0C5.495 0 .162 5.334.162 11.886c0 2.098.551 4.134 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.889-5.335 11.889-11.887a11.815 11.815 0 00-3.48-8.423z"/>
                    </svg>
                  ),
                  name: 'WhatsApp',
                  href: 'https://wa.me/919044002858'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <radialGradient id="ig" cx="50%" cy="50%" r="150%">
                        <stop offset="0%" stopColor="#F58529"/>
                        <stop offset="25%" stopColor="#FEDA77"/>
                        <stop offset="50%" stopColor="#DD2A7B"/>
                        <stop offset="75%" stopColor="#8134AF"/>
                        <stop offset="100%" stopColor="#515BD4"/>
                      </radialGradient>
                      <path fill="url(#ig)" d="M12 0c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163S15.403 2.163 12 2.163zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4-1.79 4 4 4zm6.406-11.845c-.796 0-1.444.648-1.444 1.444s.648 1.444 1.444 1.444c.796 0 1.444-.648 1.444-1.444s-.648-1.444-1.444-1.444z"/>
                    </svg>
                  ),
                  name: 'Instagram',
                  href: '#'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#0077B5" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1-4.128 0 2.064 2.064 0 0 1 4.128 0zM7.09 20.452H3.538V9h3.552v11.452zM23.994 2.292A2.292 2.292 0 0 0 21.706 0H2.288A2.29 2.29 0 0 0 0 2.292v19.416A2.292 2.292 0 0 0 2.288 24h19.418a2.292 2.292 0 0 0 2.288-2.292V2.292z"/>
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

          {/* Desktop: Quick Links */}
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

          {/* Desktop: Services */}
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

          {/* Desktop: Contact */}
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
                <span className="block">914K – Solitarian City Building,</span>
                <span className="block">KP-3, Greater Noida,</span>
                <span className="block">Gautam Buddh Nagar,</span>
                <span className="block">Uttar Pradesh, India – 201310</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Bottom Section */}
        <div className="hidden lg:block border-t border-[#D4AF37]/20 mt-12 pt-8 space-y-4 text-center">
          <p className="text-[#BDBDBD] text-sm">
            <span className="text-[#D4AF37] font-medium">MSME Registered Enterprise</span> | Udyam Registration No. UDYAM-UP-28-0222045
          </p>
          <div className="text-[#BDBDBD] text-sm flex flex-col md:flex-row gap-4 justify-center items-center">
            <p>© {new Date().getFullYear()} AK Infinity. All Rights Reserved.</p>
            <span className="text-[#D4AF37]/40">|</span>
            <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
              Privacy Policy
            </a>
            <span className="text-[#D4AF37]/40">|</span>
            <a href="#" className="text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
