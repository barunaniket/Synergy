import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView, useScroll, PanInfo } from 'framer-motion';
import {
  Hospital,
  Siren,
  Pill,
  Home,
  Video,
  ArrowRight,
  Plus,
  ShieldCheck,
  Zap,
  Search,
  Calendar,
  HeartHandshake,
  Ambulance,
  Activity,
} from 'lucide-react';

// Expanded Data for Services - Added more services for premium feel and length
const services = [
  {
    icon: Hospital,
    title: 'Find a Hospital',
    description: 'Access our real-time network of top-tier hospitals. Filter by specialty, wait time, and location for the best match.',
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
    description: 'Connect with our network of pharmacies for prescription fulfillment, medication management, and home delivery options.',
    link: '/pharmacy',
    image: '/dl.beatsnoop.com-final-JpNHXSut5C.jpg'
  },
  {
    icon: Home,
    title: 'Home Care Visits',
    description: 'Schedule professional and compassionate in-home visits from qualified doctors and nurses for personalized care.',
    link: '/home-visit',
    image: '/premium_photo-1661658696251-88ca80710869.avif'
  },
  {
    icon: Video,
    title: 'Telehealth Consultations',
    description: 'Book secure video calls with specialists from the comfort of your home for expert medical advice and follow-ups.',
    link: '/telehealth',
    image: '/dl.beatsnoop.com-final-epGd54fhW9.jpg'
  },
  {
    icon: Ambulance,
    title: 'Ambulance Booking',
    description: 'Book ambulances with real-time tracking and equipped medical staff for emergency transportations.',
    link: '/ambulance',
    image: '/dl.beatsnoop.com-final-WOhStyPkxF.jpg' // Placeholder for new image
  }
];

// Expanded Benefits Data - Added more for length and premium content
const benefits = [
  {
    icon: Zap,
    title: "Speed & Efficiency",
    description: "Our real-time data network drastically reduces wait times, connecting you to care when seconds count. Experience seamless integration with AI-powered matching.",
    image: '/dl.beatsnoop.com-final-r1qNkbDcfh.jpg' // Added image for visual appeal
  },
  {
    icon: ShieldCheck,
    title: "Trusted Network",
    description: "We partner with accredited, high-quality hospitals and providers to ensure you receive the best care. All partners are vetted for excellence and compliance.",
    image: '/dl.beatsnoop.com-final-ZEIHbyKhxP.jpg' // Added image
  },
  {
    icon: Activity,
    title: "24/7 Support",
    description: "Round-the-clock assistance from our dedicated support team, including live chat and AI chatbot for instant queries.",
    image: '/dl.beatsnoop.com-final-k9BRe4dWKO.jpg' // Added image
  },
];

// Process Steps Data
const processSteps = [
  {
    icon: Search,
    title: "1. Define Your Needs",
    description: "Use our intelligent search and filtering tools to specify the care you require, from transplant type to location and budget."
  },
  {
    icon: Calendar,
    title: "2. Review & Connect",
    description: "Browse a curated list of hospitals with real-time availability. View detailed profiles and schedule consultations directly."
  },
  {
    icon: HeartHandshake,
    title: "3. Receive Care",
    description: "With logistics streamlined, you can focus on what matters most: accessing the best possible care, faster and with full transparency."
  }
];

// Expanded FAQs - Added more for content length
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
  {
    question: "What makes Synergy's network trusted?",
    answer: "We only partner with accredited institutions and verified professionals, ensuring high standards of care and reliability in every recommendation."
  },
  {
    question: "Can I track my appointments?",
    answer: "Yes, our platform includes a dashboard where you can track all your appointments, consultations, and care plans in one place."
  }
];

// New Testimonials Data for Premium Feel
const testimonials = [
  {
    name: "John Doe",
    role: "Patient",
    quote: "Synergy made finding the right hospital effortless. The real-time updates saved us precious time during an emergency.",
    image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
  },
  {
    name: "Jane Smith",
    role: "Family Member",
    quote: "The telehealth service is fantastic. We consulted with a specialist from home, and the process was seamless.",
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
  },
  {
    name: "Dr. Anaya Johnson",
    role: "Physician",
    quote: "As a partner, Synergy's platform helps us connect with patients efficiently, improving overall care delivery.",
    image: 'https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg'
  }
];

// Animation Variants - Expanded for more control
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.4, duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
};

const hoverVariants = {
  hover: { scale: 1.08, rotate: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const parallaxVariants = {
  hidden: { y: 150, opacity: 0, rotate: -2 },
  visible: { y: 0, opacity: 1, rotate: 0, transition: { duration: 1.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// New Fade In Variant for Testimonials
const fadeInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Helper Component: AnimatedWords - With comments for length
/**
 * AnimatedWords Component
 * Splits text into words and animates each word individually for a premium reveal effect.
 * @param {string} text - The text to animate.
 */
const AnimatedWords = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block overflow-hidden">
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block mr-[0.25em] whitespace-nowrap"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Helper Component: ServiceCard - Expanded with drag functionality for interactive feel
/**
 * ServiceCard Component
 * Renders an interactive card for each service with 3D tilt, hover effects, and drag for premium interaction.
 * @param {object} service - The service data object.
 */
const ServiceCard = ({ service }: { service: typeof services[0] }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  const x = useMotionValue(0);
  const yTilt = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 500, damping: 50 });
  const ySpring = useSpring(yTilt, { stiffness: 500, damping: 50 });
  const rotateX = useTransform(ySpring, [-0.6, 0.6], ['10deg', '-10deg']);
  const rotateY = useTransform(xSpring, [-0.6, 0.6], ['-10deg', '10deg']);

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
    yTilt.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    yTilt.set(0);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Snap back after drag
    x.set(0);
    yTilt.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={service.link}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      drag
      dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        perspective: "1500px",
        y,
        opacity,
      }}
      variants={itemVariants}
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      className="block group rounded-3xl overflow-hidden border border-[#e9ecef] bg-white shadow-xl transition-all duration-600 hover:shadow-2xl hover:shadow-[#00a8b5]/10"
    >
      <div className="relative h-72 overflow-hidden">
        <motion.img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
          style={{ transformStyle: "preserve-3d" }}
          variants={hoverVariants}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 transition-opacity duration-600 group-hover:opacity-40" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#00a8b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600"
          style={{ transform: "translateZ(40px)" }}
        />
      </div>
      <div className="p-10 relative" style={{ transform: "translateZ(60px)" }}>
        <div className="flex items-center gap-5 mb-5">
          <motion.div
            className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-full bg-[#e0f7fa]/30 text-[#00a8b5] shadow-lg"
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ duration: 0.4 }}
          >
            <service.icon size={32} />
          </motion.div>
          <h3 className="text-3xl font-bold text-[#1a2e44]">{service.title}</h3>
        </div>
        <p className="text-[#4a607c] mb-8 leading-relaxed text-lg">{service.description}</p>
        <motion.div
          className="flex items-center font-semibold text-[#00a8b5] transition-all duration-400 group-hover:translate-x-3 group-hover:text-[#009da6]"
          whileHover={{ x: 8 }}
        >
          Learn More <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:rotate-45" />
        </motion.div>
      </div>
    </motion.a>
  );
};

// Helper Component: AccordionItem - With expanded animations
/**
 * AccordionItem Component
 * Renders an accordion item for FAQs with smooth expand/collapse and hover effects.
 * @param {object} faq - The FAQ data object.
 * @param {boolean} isOpen - Whether the accordion is open.
 * @param {function} onToggle - Toggle function for accordion.
 */
const AccordionItem = ({ faq, isOpen, onToggle }: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.div
      ref={ref}
      className="border-b border-[#e9ecef] last:border-b-0 rounded-lg overflow-hidden"
      layout
      initial={false}
      animate={{ backgroundColor: isOpen ? '#f5f7fa' : 'white' }}
      variants={itemVariants}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <motion.button
        className="flex w-full items-center justify-between py-8 px-6 text-left transition-colors hover:text-[#00a8b5] hover:bg-[#e0f7fa]/20"
        onClick={onToggle}
        whileHover={{ x: 6, scale: 1.02 }}
        variants={itemVariants}
        animate={isInView ? "visible" : "hidden"}
      >
        <span className="text-xl font-medium text-[#1a2e44]">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Plus className="h-7 w-7 text-[#4a607c] transition-colors group-hover:text-[#00a8b5]" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -30 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden px-6"
          >
            <p className="pb-8 text-[#4a607c] leading-relaxed text-lg">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// New Helper Component: BenefitCard - For benefits section with images
/**
 * BenefitCard Component
 * Renders a card for each benefit with image, icon, and description for visual enhancement.
 * @param {object} benefit - The benefit data object.
 */
const BenefitCard = ({ benefit }: { benefit: typeof benefits[0] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      animate={isInView ? "visible" : "hidden"}
      className="text-center p-10 rounded-3xl bg-white border border-[#e9ecef] shadow-2xl transition-all duration-600 hover:shadow-[#00a8b5]/10 hover:scale-105"
      whileHover={{ y: -12, scale: 1.05 }}
    >
      <motion.img
        src={benefit.image}
        alt={benefit.title}
        className="w-full h-48 object-cover rounded-2xl mb-6 transition-transform duration-600 hover:scale-110"
        variants={hoverVariants}
      />
      <motion.div
        className="flex items-center justify-center h-16 w-16 rounded-full bg-[#e0f7fa]/30 text-[#00a8b5] shadow-lg mx-auto mb-6"
        whileHover={{ scale: 1.15, rotate: 360 }}
        transition={{ duration: 0.7 }}
      >
        <benefit.icon size={36} />
      </motion.div>
      <h3 className="text-2xl font-bold text-[#1a2e44] mb-3">{benefit.title}</h3>
      <p className="text-[#4a607c] leading-relaxed text-base">{benefit.description}</p>
    </motion.div>
  );
};

// New Helper Component: TestimonialCard - For testimonials section
/**
 * TestimonialCard Component
 * Renders a testimonial card with image, name, role, and quote for social proof.
 * @param {object} testimonial - The testimonial data object.
 */
const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      variants={fadeInVariants}
      animate={isInView ? "visible" : "hidden"}
      className="p-8 rounded-3xl bg-white border border-[#e9ecef] shadow-xl transition-all duration-600 hover:shadow-2xl hover:border-[#00a8b5]/30"
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <div className="flex items-center mb-6">
        <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4 shadow-md" />
        <div>
          <h4 className="text-xl font-bold text-[#1a2e44]">{testimonial.name}</h4>
          <p className="text-[#4a607c]">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-[#4a607c] leading-relaxed italic">"{testimonial.quote}"</p>
    </motion.div>
  );
};

// Main Page Component - Expanded with new sections: Testimonials and Global Reach
function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-150px" });
  const isServicesInView = useInView(servicesRef, { once: true, margin: "-150px" });
  const isProcessInView = useInView(processRef, { once: true, margin: "-150px" });
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: "-150px" });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-150px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-150px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-150px" });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  useEffect(() => {
    // Preload images for smooth loading
    services.forEach(service => {
      const img = new Image();
      img.src = service.image;
    });
    benefits.forEach(benefit => {
      const img = new Image();
      img.src = benefit.image;
    });
    testimonials.forEach(testimonial => {
      const img = new Image();
      img.src = testimonial.image;
    });
  }, []);

  return (
    <div className="pt-24 overflow-x-hidden bg-[radial-gradient(circle_at_center,#e9ecef_1px,transparent_1px)] bg-[length:20px_20px]">
      {/* Hero Section - With expanded parallax and animated words */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-40 md:py-56 text-center relative overflow-hidden bg-gradient-to-b from-[#f5f7fa] to-transparent"
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e9ecef_1px,transparent_1px)] bg-[length:20px_20px] opacity-60"
          style={{ y: backgroundY, scale: scaleProgress }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <motion.h1 variants={parallaxVariants} className="text-6xl md:text-8xl font-extrabold text-[#1a2e44] tracking-tight leading-tight">
            <AnimatedWords text="Comprehensive Care," />
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8b5] to-[#00c4cc]"><AnimatedWords text="Seamlessly Delivered." /></span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-10 max-w-4xl mx-auto text-2xl text-[#4a607c] leading-relaxed">
            Synergy offers a complete suite of services designed to provide you with timely, efficient, and compassionate healthcare at every step of your journey. Discover how we can transform your healthcare experience.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid - Expanded with more cards */}
      <section ref={servicesRef} className="container mx-auto px-6 md:px-8 py-32 md:py-40 bg-transparent">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight">A Connected Ecosystem of Care</h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-[#4a607c] leading-relaxed">
            From urgent needs to ongoing support, our expanded services are designed around you with cutting-edge technology and human touch.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 xl:gap-16"
          style={{ perspective: "2500px" }}
          variants={containerVariants}
          initial="hidden"
          animate={isServicesInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => <ServiceCard key={index} service={service} />)}
        </motion.div>
      </section>

      {/* Process Section - With premium animations, no lines */}
      <section ref={processRef} className="py-32 md:py-40 bg-[#f5f7fa]/60">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 60 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight">Your Journey, Simplified</h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-[#4a607c] leading-relaxed">
              We've refined the process of finding healthcare into three simple, transparent steps, enhanced with intuitive UI and AI assistance.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-16 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isProcessInView ? "visible" : "hidden"}
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="flex flex-col items-center text-center p-10 rounded-3xl bg-white shadow-2xl transition-all duration-600 hover:shadow-[#00a8b5]/20 hover:scale-105"
                whileHover={{ scale: 1.08, y: -10 }}
              >
                <motion.div
                  className="flex items-center justify-center h-20 w-20 rounded-full bg-[#e0f7fa]/30 text-[#00a8b5] shadow-lg mb-8"
                  whileHover={{ scale: 1.2, rotate: index % 2 === 0 ? 10 : -10 }}
                >
                  <step.icon size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#1a2e44] mb-4">{step.title}</h3>
                <p className="text-[#4a607c] leading-relaxed text-lg">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - Expanded with images */}
      <section ref={benefitsRef} className="py-32 md:py-40 bg-transparent">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 60 }}
            animate={isBenefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight">Why Choose Synergy?</h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-[#4a607c] leading-relaxed">
              We're committed to revolutionizing your healthcare experience with innovative features and unwavering support.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 xl:gap-16"
            variants={containerVariants}
            initial="hidden"
            animate={isBenefitsInView ? "visible" : "hidden"}
          >
            {benefits.map((benefit, index) => <BenefitCard key={index} benefit={benefit} />)}
          </motion.div>
        </div>
      </section>

      {/* New Testimonials Section - For social proof and visual life */}
      <section ref={testimonialsRef} className="py-32 md:py-40 bg-[#f5f7fa]/60">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 60 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight">What Our Users Say</h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-[#4a607c] leading-relaxed">
              Hear from patients and professionals who have experienced the Synergy difference.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-16"
            variants={containerVariants}
            initial="hidden"
            animate={isTestimonialsInView ? "visible" : "hidden"}
          >
            {testimonials.map((testimonial, index) => <TestimonialCard key={index} testimonial={testimonial} />)}
          </motion.div>
        </div>
      </section>

            {/* New Global Reach Section - With image for aliveness and hover cursor movement */}
      <section className="py-32 md:py-40 bg-transparent">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight mb-10"
          >
            Our Global Reach
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-[#4a607c] leading-relaxed mb-12"
          >
            Connecting patients to care across the world with partnerships in over 50 countries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
            style={{ perspective: "2000px" }}
          >
            <motion.img
              src="/dl.beatsnoop.com-final-d23yxZ7CX0.jpg"
              alt="Global Network"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl transition-transform duration-300"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ scale: 1.05 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const moveX = (mouseX - centerX) * 0; // Adjust sensitivity
                const moveY = (mouseY - centerY) * 0;
                e.currentTarget.style.transform = `translate(${moveX}px, ${moveY}px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `translate(0, 0)`;
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Expanded with more items */}
      <section ref={faqRef} className="container mx-auto px-6 md:px-8 py-32 md:py-40">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight">Frequently Asked Questions</h2>
        </motion.div>
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate={isFaqInView ? "visible" : "hidden"}
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

      {/* CTA Section - With premium pulse effect */}
      <section ref={ctaRef} className="py-32 md:py-40 bg-[#f5f7fa]/60">
        <motion.div
          className="container mx-auto px-6 md:px-8 text-center"
          initial={{ opacity: 0, y: 60 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl font-bold text-[#1a2e44] sm:text-6xl tracking-tight">Ready to Find Care?</h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-[#4a607c] leading-relaxed">
            Take the next step in your healthcare journey. Our network is ready to help you find the best care, faster.
          </p>
          <motion.a
            href="/find-a-hospital"
            className="inline-flex mt-10 h-14 items-center justify-center rounded-full bg-[#00a8b5] px-12 text-base font-medium text-white shadow-2xl transition-all duration-600 hover:bg-[#009da6] hover:scale-105"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={{ scale: [1, 1.04, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          >
            Start Your Search
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}

export default ServicesPage;