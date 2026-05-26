import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-950 py-12 text-stone-300 font-sans border-t-[6px] border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <span className="font-extrabold text-white text-2xl tracking-tight">HF</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Half Fried
              </h2>
            </div>
            <p className="text-stone-400 text-base leading-relaxed pl-1 border-l-2 border-red-600 ml-1">
              Delicious Food, Delivered Fresh.
            </p>
            
            {/* 5. Social Media Icons */}
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="Youtube" className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* 3. Quick Links */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-1">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Menu', 'Dashboard', 'Contact', 'About'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : link === 'Menu' ? '/products' : `/${link.toLowerCase()}`}
                    className="text-stone-400 hover:text-red-500 hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Contact Information */}
          <div className="flex flex-col space-y-5 lg:col-span-1">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-1">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-stone-900 p-2.5 rounded-full shrink-0 border border-stone-800">
                  <MapPin className="text-red-500" size={18} />
                </div>
                <span className="text-stone-400 text-sm leading-relaxed mt-1">
                  Shop - 71, 2nd floor, Kingsway Camp,<br/>
                  GTB Nagar New Delhi, India
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-stone-900 p-2.5 rounded-full shrink-0 border border-stone-800">
                  <Phone className="text-red-500" size={18} />
                </div>
                <span className="text-stone-300 font-medium tracking-wide text-sm">+91-81308-40080</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-stone-900 p-2.5 rounded-full shrink-0 border border-stone-800">
                  <Mail className="text-red-500" size={18} />
                </div>
                <a href="mailto:support@halffried.com" className="text-white font-semibold hover:text-red-400 transition-colors text-sm break-all border-b border-dashed border-stone-600 hover:border-red-400 pb-0.5">
                  support@halffried.com
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Opening Hours */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-1">Opening Hours</h3>
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 p-6 rounded-xl border border-stone-800 shadow-xl relative overflow-hidden group hover:border-red-900 transition-colors duration-500">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:bg-red-600/10 transition-colors duration-500"></div>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-800/80">
                <span className="text-stone-400 font-medium text-sm">Mon - Sun</span>
                <span className="text-white font-bold text-sm bg-stone-800/50 px-3 py-1 rounded-md">10 AM - 11 PM</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                  Open for orders
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 7. Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="pt-8 border-t border-stone-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © 2026 Half Fried. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-stone-600">
            <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-stone-700 self-center"></span>
            <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
