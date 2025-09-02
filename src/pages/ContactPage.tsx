import { useState, useRef, FC, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Loader, Check, User, Mail as MailIcon, Book } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95]
    } 
  },
};

// --- NEW INTERACTIVE MAP COMPONENT ---
const InteractiveMap = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="w-full h-80 rounded-2xl overflow-hidden border border-border shadow-2xl relative group"
    >
      <img 
        src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_2560%2Cc_limit/GoogleMapTA.jpg" 
        alt="Map to our office" 
        className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:grayscale-[50%]"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative"
          whileHover="hover"
          initial="initial"
        >
          {/* Pulsing circle effect */}
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-red-500/50"
            variants={{
              initial: { scale: 0.5, opacity: 0 },
              hover: { 
                scale: [1, 1.5],
                opacity: [1, 0],
                transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } 
              }
            }}
          />
          {/* The main pin body */}
          <motion.svg 
            width="50" 
            height="50" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-lg"
            variants={{
              initial: { y: 0 },
              hover: { 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 10 }
              }
            }}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EF4444"/>
          </motion.svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

function ContactUsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });
  
  const shineOpacity = useMotionValue(0);

  useEffect(() => {
    const updateOpacity = () => {
        const newOpacity = Math.max(0, 1 - Math.hypot(xSpring.get(), ySpring.get()) / 150);
        shineOpacity.set(newOpacity);
    };
    
    const unsubscribeX = xSpring.on("change", updateOpacity);
    const unsubscribeY = ySpring.on("change", updateOpacity);

    return () => {
        unsubscribeX();
        unsubscribeY();
    };
  }, [xSpring, ySpring, shineOpacity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
  };

  return (
    <div className="pt-20 overflow-x-hidden">
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-24 md:py-32 text-center relative"
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-text-primary">
            Get in Touch
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
            We're here to help. Whether you have a question about our services or need assistance, our team is ready to answer all your questions.
          </motion.p>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 md:px-6 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="bg-surface p-8 sm:p-10 rounded-2xl border border-border shadow-2xl"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-text-primary mb-8">Send Us a Message</motion.h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" id="name" placeholder="Full Name" required className="w-full p-4 pl-12 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" id="email" placeholder="Email Address" required className="w-full p-4 pl-12 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" id="subject" placeholder="Subject" required className="w-full p-4 pl-12 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <textarea id="message" rows={5} placeholder="Message" required className="w-full p-4 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"></textarea>
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.button
                  ref={btnRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full relative inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="absolute inset-0 z-0"
                    style={{
                      background: `radial-gradient(150px circle at ${xSpring}px ${ySpring}px, rgba(255,255,255,0.4), transparent)`,
                      opacity: shineOpacity
                    }}
                  />
                  <AnimatePresence mode="wait">
                    {status === 'loading' && <motion.div key="loading" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}><Loader className="animate-spin h-6 w-6" /></motion.div>}
                    {status === 'success' && <motion.div key="success" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} className="flex items-center"><Check className="h-6 w-6 mr-2" /> Message Sent!</motion.div>}
                    {status === 'idle' && <motion.div key="idle" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} className="flex items-center z-10"><Send className="h-5 w-5 mr-3" /> Send Message</motion.div>}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }}
             variants={containerVariants}
             className="space-y-8"
          >
            <motion.div variants={itemVariants} className="p-8 sm:p-10 rounded-2xl border border-border shadow-2xl bg-surface">
                <h3 className="text-2xl font-bold text-text-primary mb-8">Contact Information</h3>
                <div className="space-y-6">
                    {[{
                      Icon: Phone, title: "Phone", line1: "+1 (555) 123-4567", line2: "Mon-Fri, 9am-5pm"
                    },{
                      Icon: Mail, title: "Email", line1: "help@synergy.com", line2: "We'll reply within 24 hours"
                    },{
                      Icon: MapPin, title: "Office", line1: "123 Health St, MedCity, USA", line2: ""
                    }].map(item => (
                       <motion.div key={item.title} whileHover={{ scale: 1.03 }} className="flex items-start">
                          <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                              <item.Icon size={26} />
                          </div>
                          <div className="ml-5">
                              <h4 className="text-lg font-semibold text-text-primary">{item.title}</h4>
                              <p className="text-text-secondary">{item.line1}</p>
                              {item.line2 && <p className="text-sm text-text-secondary">{item.line2}</p>}
                          </div>
                      </motion.div>
                    ))}
                </div>
            </motion.div>
            {/* --- MAP COMPONENT ADDED HERE --- */}
            <InteractiveMap />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;
