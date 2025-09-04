import { HeartPulse, Twitter, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand and Contact Info */}
          <div className="sm:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-text-primary">Synergy</span>
            </Link>
            <div className="space-y-2 text-sm text-text-secondary">
              <p className="flex items-start">
                <span className="mt-1 mr-3 flex-shrink-0 text-text-primary"><MapPin size={14} /></span>
                <span>123 Health St, MedCity, MC 54321, United States</span>
              </p>
              <p className="flex items-start">
                <span className="mt-1 mr-3 flex-shrink-0 text-text-primary"><Mail size={14} /></span>
                <a href="mailto:help@synergy.com" className="hover:text-primary">help@synergy.com</a>
              </p>
              <p className="flex items-start">
                <span className="mt-1 mr-3 flex-shrink-0 text-text-primary"><Phone size={14} /></span>
                 <a href="tel:+15551234567" className="hover:text-primary">+1 (555) 123-4567</a>
              </p>
            </div>
            <div className="flex space-x-4 pt-2">
                <a href="#" className="text-text-secondary hover:text-primary transition-colors"><Twitter size={18} /></a>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors"><Linkedin size={18} /></a>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary tracking-wider uppercase mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-a-hospital" className="text-text-secondary hover:text-primary transition-colors">Find a Hospital</Link></li>
              <li><Link to="#" className="text-text-secondary hover:text-primary transition-colors">For Patients</Link></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">For Hospitals</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Blog</a></li>
              <li><a href="/about#testimonials" className="text-text-secondary hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="/services#faq" className="text-text-secondary hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-text-secondary hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Careers</a></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-text-secondary">
          <p>&copy; 2025 Synergy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
