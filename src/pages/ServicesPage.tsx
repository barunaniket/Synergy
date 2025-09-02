import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Hospital, Siren, Pill, Home, Video, ArrowRight, Plus, ShieldCheck, Zap, Users } from 'lucide-react';

// --- DATA ---
const services = [
  {
    icon: Hospital,
    title: 'Find a Hospital',
    description: 'Access our real-time network of top-tier hospitals. Filter by specialty, wait time, and location.',
    link: '/find-a-hospital',
    image: '/dl.beatsnoop.com-final-Al0yVLXNC7.jpg'
  },
  {
    icon: Siren,
    title: 'Emergency Services',
    description: 'Instantly locate the nearest emergency rooms with available capacity, ensuring you get critical care without delay.',
    link: '/emergency',
    image: '/dl.beatsnoop.com-final-nsrY5TzDuB.jpg'
  },
  {
    icon: Pill,
    title: 'Pharmacy Network',
    description: 'Connect with our network of pharmacies for prescription fulfillment and medication management.',
    link: '/pharmacy',
    image: '/dl.beatsnoop.com-final-JpNHXSut5C.jpg'
  },
  {
    icon: Home,
    title: 'Home Care Visits',
    description: 'Schedule professional and compassionate in-home visits from qualified doctors and nurses.',
    link: '/home-visit',
    image: '/premium_photo-1661658696251-88ca80710869.avif'
  },
  {
    icon: Video,
    title: 'Telehealth Consultations',
    description: 'Book secure video calls with specialists from the comfort of your home for expert medical advice.',
    link: '/telehealth',
    image: '/dl.beatsnoop.com-final-epGd54fhW9.jpg'
  },
];

const benefits = [
    {
        icon: Zap,
        title: "Speed & Efficiency",
        description: "Our real-time data network drastically reduces wait times, connecting you to care when seconds count."
    },
    {
        icon: ShieldCheck,
        title: "Trusted Network",
        description: "We partner with accredited, high-quality hospitals and providers to ensure you receive the best care."
    },
    {
        icon: Users,
        title: "Patient-Centric",
        description: "Our platform is designed with your journey in mind, providing clarity and support at every step."
    }
];

const faqs = [
    {
        question: "How does Synergy find hospitals so quickly?",
        answer: "Our platform uses a real-time data network connected directly to our partner hospitals. This allows us to access up-to-the-minute information on bed availability, specialist schedules, and wait times, providing you with the fastest and most accurate results."
    },
    {
        question: "Is there a fee for patients to use Synergy?",
        answer: "No, our core service of finding and connecting with hospitals is completely free for patients. Our mission is to improve access to care, and we believe that shouldn't come at a cost to those in need."
    },
    {
        question: "How do I schedule a telehealth consultation?",
        answer: "Simply select the 'Telehealth Consultations' service, browse available specialists, and choose a time that works for you. You'll receive a secure link for your video call once your appointment is confirmed."
    },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// --- HELPER COMPONENTS ---

const AnimatedWords = ({ text }: { text: string }) => {
    const words = text.split(" ");
    return (
        <span className="inline-block">
            {words.map((word, i) => (
                <motion.span key={i} variants={itemVariants} className="inline-block mr-[0.25em]">
                    {word}
                </motion.span>
            ))}
        </span>
    );
};

const ServiceCard = ({ service }: { service: typeof services[0] }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={ref}
            href={service.link}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
            variants={itemVariants}
            className="block group rounded-2xl overflow-hidden border border-border bg-surface relative"
        >
            <div className="relative h-64">
                <motion.img 
                    src={service.image} 
                    alt={service.title} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    style={{
                        transformStyle: "preserve-3d",
                        scale: 1.1,
                        transition: 'transform 0.4s ease',
                    }}
                    whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-8" style={{ transform: "translateZ(50px)" }}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        <service.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary">{service.title}</h3>
                </div>
                <p className="text-text-secondary mb-6">{service.description}</p>
                <div className="flex items-center font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </div>
            </div>
        </motion.a>
    );
};

const AccordionItem = ({ faq, isOpen, onToggle }: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) => {
    return (
        <motion.div className="border-b border-border" layout>
            <motion.button
                className="flex w-full items-center justify-between py-6 text-left"
                onClick={onToggle}
            >
                <span className="text-lg font-medium text-text-primary">{faq.question}</span>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
                   <Plus className="h-6 w-6 text-text-secondary"/>
                </motion.div>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-text-secondary">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// --- MAIN PAGE COMPONENT ---
function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="pt-20 bg-background overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-24 md:py-32 text-center relative"
      >
        <div className="absolute inset-0 h-full w-full bg-surface [mask-image:radial-gradient(100%_50%_at_top_center,white,transparent)] -z-10"></div>
        <div className="container mx-auto px-4 md:px-6">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-text-primary">
            <AnimatedWords text="Comprehensive Care," />
            <br />
            <span className="text-primary"><AnimatedWords text="Seamlessly Delivered." /></span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-3xl mx-auto text-lg text-text-secondary">
            Synergy offers a complete suite of services designed to provide you with timely, efficient, and compassionate healthcare at every step of your journey.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">A Connected Ecosystem of Care</h2>
            <p className="mt-4 max-w-2xl mx-auto text-text-secondary">
                From urgent needs to ongoing support, our services are designed around you.
            </p>
        </motion.div>
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ perspective: "1000px" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => <ServiceCard key={service.title} service={service} />)}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 bg-surface border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Why Choose Synergy?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-text-secondary">
                    We're committed to revolutionizing your healthcare experience.
                </p>
            </motion.div>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {benefits.map(benefit => (
                    <motion.div key={benefit.title} variants={itemVariants} className="text-center p-8">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
                            <benefit.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">{benefit.title}</h3>
                        <p className="text-text-secondary">{benefit.description}</p>
                    </motion.div>
                ))}
            </motion.div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Frequently Asked Questions</h2>
        </motion.div>
        <motion.div 
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {faqs.map((faq, index) => (
                <AccordionItem 
                    key={index}
                    faq={faq}
                    isOpen={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                />
            ))}
        </motion.div>
      </section>
      
      {/* CTA Section */}
       <section className="py-24 md:py-32 bg-surface border-t border-border">
            <motion.div
                className="container mx-auto px-4 md:px-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Ready to Find Care?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-text-secondary">
                    Take the next step in your healthcare journey. Our network is ready to help you find the best care, faster.
                </p>
                <a
                  href="/find-a-hospital"
                  className="inline-flex mt-8 h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
                >
                  Start Your Search
                </a>
            </motion.div>
      </section>

    </div>
  );
}

export default ServicesPage;

