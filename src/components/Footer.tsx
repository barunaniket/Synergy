import { HeartPulse, Twitter, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border">
      {/* Reduced vertical padding from py-16 to py-12 */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand and Contact Info */}
          <div className="sm:col-span-2 space-y-4">
            <a href="#" className="flex items-center space-x-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              {/* Reduced font size from text-2xl to text-xl */}
              <span className="text-xl font-bold text-text-primary">Synergy</span>
            </a>
            {/* Reduced font size and spacing */}
            <div className="space-y-2 text-sm text-text-secondary">
              <p className="flex items-start">
                <span className="mt-1 mr-3 flex-shrink-0 text-text-primary"><MapPin size={14} /></span>
                <span>123 Health St, MedCity, MC 54321, United States</span>
              </p>
              <p className="flex items-start">
                <span className="mt-1 mr-3 flex-shrink-0 text-text-primary"><Mail size={14} /></span>
                <span>help@synergy.com</span>
              </p>
              <p className="flex items-start">
                <span className="mt-1 mr-3 flex-shrink-0 text-text-primary"><Phone size={14} /></span>
                <span>+1 (555) 123-4567</span>
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
            {/* Reduced font size and spacing */}
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Find a Hospital</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">For Patients</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">For Hospitals</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        {/* Reduced top margin */}
        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-text-secondary">
          <p>&copy; 2025 Synergy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

