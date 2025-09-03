import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Find a Hospital', href: '/find-a-hospital' },
  { name: 'Services', href: '/services' },
  // Ensure this href points to the correct route
  { name: 'About Us', href: '/about' }, 
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    initial: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(229, 231, 235, 0)',
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)', 
      borderBottom: '1px solid rgba(229, 231, 235, 0.6)', 
    },
  };
  
  const mobileMenuVariants = {
    open: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    closed: { opacity: 0, x: "-100%" },
  };

  const mobileLinkVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 w-full"
        initial="initial"
        animate={scrolled ? "scrolled" : "initial"}
        variants={navVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors">
            <HeartPulse className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Synergy</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-text-secondary font-medium hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </a>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-background pt-24 p-6 z-40 md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
             <motion.a
                key={link.name}
                href={link.href}
                className="text-2xl text-text-secondary font-medium hover:text-primary transition-colors"
                variants={mobileLinkVariants}
             >
               {link.name}
             </motion.a>
          ))}
          <motion.a
            href="/login"
            className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-8"
            variants={mobileLinkVariants}
          >
            Hospital Login
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}