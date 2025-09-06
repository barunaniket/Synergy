// src/components/AIFooter.tsx
import { HeartPulse, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AIFooter() {
  return (
    <footer className="w-full bg-black border-t border-white/[0.1]">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-dark-text-primary">Synergy</span>
          </Link>
          <p className="mt-4 text-sm text-dark-text-secondary max-w-md">
            Bridging the gap between patients seeking urgent care and hospitals with available capacity.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-dark-text-secondary hover:text-primary transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-dark-text-secondary hover:text-primary transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-dark-text-secondary hover:text-primary transition-colors"><Github size={18} /></a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.1] text-center text-xs text-dark-text-secondary">
          <p>&copy; 2025 Synergy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}