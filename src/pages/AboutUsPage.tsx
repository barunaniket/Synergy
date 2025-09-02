import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, wrap, useInView, animate, useScroll, useTransform } from 'framer-motion';
import { Users, Target, Heart, Zap, Eye, ChevronLeft, ChevronRight, Hospital, Clock, UsersRound, ArrowDown } from 'lucide-react';

// Variants for staggered animations (retained for card pop-ins)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Data for the page sections (unchanged)
const values = [
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Providing clear, real-time data to empower patients and hospitals alike.',
    },
    {
      icon: Zap,
      title: 'Speed & Access',
      description: 'Drastically reducing wait times and connecting patients to critical care faster.',
    },
    {
      icon: Heart,
      title: 'Empathy',
      description: 'Building a platform with the patient\'s journey at the heart of everything we do.',
    },
];

const teamMembers = [
    {
        name: 'Mr. Aniket Barun',
        title: 'Lead Designing',
        imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQEGxqhUnuJx1w/profile-displayphoto-shrink_800_800/B4EZahk_z6HMAc-/0/1746467553305?e=1759968000&v=beta&t=b2veD_5X1vifZA9G9F-M0aDva0An0DAvFgbQXXQ1nP0'
    },
    {
        name: 'Mr. Kishan Bhardwaj',
        title: 'Lead Technologist',
        imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: 'Mr. Naivadh Shrivastava',
        title: 'Head of Hospital Relations',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
    },
    {
        name: 'Mr. Krishna H Zalavadiya',
        title: 'Head of Hospital Relations',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
    },
    {
        name: 'Mr. Ayush Kumar',
        title: 'Head of Hospital Relations',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
    },
    {
        name: 'Mr. Bismun Singh',
        title: 'Head of Hospital Relations',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
    }
];

const testimonials = [
    {
        quote: "Synergy didn't just find me a hospital; it gave me hope when I had none. The speed and clarity of the process were incredible. I'm here today because of this platform.",
        name: 'Sarah Johnson',
        title: 'Liver Transplant Recipient',
        imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop'
    },
    {
        quote: "As a small regional hospital, connecting with patients in need was our biggest challenge. Synergy put us on the map and allowed us to serve a community far beyond our own.",
        name: 'Dr. Alistair Finch',
        title: 'Chief of Surgery, Hopewell Regional',
        imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop'
    },
    {
        quote: "The waitlist felt like a black box of uncertainty. Synergy provided real-time updates and transparent data that empowered my family and me to make informed decisions.",
        name: 'David Chen',
        title: 'Kidney Transplant Recipient',
        imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop'
    }
];

// Animation variants for testimonial slideshow (unchanged)
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

// Component for the animated counter (unchanged)
function AnimatedCounter({ to, icon: Icon, label, suffix = '' }: { to: number, icon: React.ElementType, label: string, suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && ref.current) {
            const controls = animate(0, to, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate(value) {
                    if (ref.current) {
                        ref.current.textContent = Math.round(value).toLocaleString();
                    }
                }
            });
            return () => controls.stop();
        }
    }, [isInView, to]);

    return (
        <div className="text-center">
            <Icon className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-4xl md:text-5xl font-bold">
                <span ref={ref}>0</span>{suffix}
            </p>
            <p className="text-text-secondary mt-1">{label}</p>
        </div>
    );
}

// The main About Us page component
function AboutUsPage() {
  const [[page, direction], setPage] = useState([0, 0]);
  const testimonialIndex = wrap(0, testimonials.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
        paginate(1);
    }, 7000);
    return () => clearInterval(interval);
  }, [page]);

  // --- NEW: Refs and hooks for scroll animations ---
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroScrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScrollYProgress, [0, 0.5], [1, 0]);
  const arrowOpacity = useTransform(heroScrollYProgress, [0, 0.2], [1, 0]);
  
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: storyScrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "center center"]
  });
  const storyTextX = useTransform(storyScrollYProgress, [0, 1], ['-50px', '0px']);
  const storyTextOpacity = useTransform(storyScrollYProgress, [0, 1], [0, 1]);
  const storyImageX = useTransform(storyScrollYProgress, [0, 1], ['50px', '0px']);
  const storyImageOpacity = useTransform(storyScrollYProgress, [0, 1], [0, 1]);
  const storyImageReveal = useTransform(storyScrollYProgress, [0, 1], ['0%', '100%']);

  const impactRef = useRef<HTMLElement>(null);
  const { scrollYProgress: impactScrollYProgress } = useScroll({
    target: impactRef,
    offset: ["start end", "end center"]
  });
  const impactOpacity = useTransform(impactScrollYProgress, [0, 0.6], [0.5, 1]);
  const impactScale = useTransform(impactScrollYProgress, [0, 0.6], [0.9, 1]);
  
  const valuesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: valuesScrollYProgress } = useScroll({
      target: valuesRef,
      offset: ["start end", "end start"]
  });
  const valuesY = useTransform(valuesScrollYProgress, [0, 1], ['50px', '-50px']);

  const teamRef = useRef<HTMLElement>(null);
  const { scrollYProgress: teamScrollYProgress } = useScroll({
      target: teamRef,
      offset: ["start end", "end start"]
  });
  const teamY = useTransform(teamScrollYProgress, [0, 1], ['50px', '-50px']);

  return (
    <div className="pt-20 overflow-x-hidden">
      {/* Hero Section with Scroll Animation */}
      <motion.section ref={heroRef} className="h-screen flex items-center justify-center text-center relative">
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary">
            Bridging the Gap in Urgent Care.
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-text-secondary">
            Synergy was born from a simple, powerful idea: that no one should have to wait for life-saving care because of logistical barriers. We are a team of technologists, healthcare professionals, and patient advocates dedicated to creating a more connected and efficient healthcare ecosystem.
          </p>
        </motion.div>
        <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            style={{ opacity: arrowOpacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <ArrowDown className="h-8 w-8 text-text-secondary" />
        </motion.div>
      </motion.section>
      
      {/* Our Story Section with Scroll Animation */}
      <section ref={storyRef} className="py-20 md:py-28 bg-surface border-y border-border">
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
              <motion.div style={{ x: storyTextX, opacity: storyTextOpacity }}>
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
                  <p className="text-text-secondary leading-relaxed">
                      Our mission is to create a transparent, data-driven network that seamlessly connects patients with available hospital capacity for specialty care and transplants. We aim to eliminate uncertainty and reduce critical wait times, ultimately saving lives by making vital information accessible when it matters most.
                  </p>
              </motion.div>
              <motion.div className="relative h-96 rounded-lg overflow-hidden border border-border shadow-2xl" style={{ x: storyImageX, opacity: storyImageOpacity }}>
                  <img src="https://plus.unsplash.com/premium_photo-1661281345831-72aac72beb52?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Team collaborating" className="absolute w-full h-full object-cover" />
                  <motion.div className="absolute inset-0 bg-surface" style={{ x: storyImageReveal }} />
              </motion.div>
          </div>
      </section>

      {/* Our Impact In Numbers Section with Scroll Animation */}
      <motion.section ref={impactRef} style={{ opacity: impactOpacity, scale: impactScale }} className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                  <AnimatedCounter to={1200} icon={UsersRound} label="Patients Helped" suffix="+" />
                  <AnimatedCounter to={75} icon={Hospital} label="Partner Hospitals" />
                  <AnimatedCounter to={40} icon={Clock} label="Avg. Wait Time Reduction" suffix="%" />
              </div>
          </div>
      </motion.section>

      {/* Our Values Section with Scroll Animation */}
      <section ref={valuesRef} className="py-20 md:py-28 border-t border-border bg-surface overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text-primary">The Principles That Guide Us</h2>
                <p className="mt-2 text-text-secondary">Our values are the foundation of our platform and our promise to you.</p>
            </div>
            <motion.div style={{ y: valuesY }} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value) => (
                    <motion.div key={value.title} variants={itemVariants} className="bg-background p-8 rounded-lg border border-border text-center">
                        <value.icon className="h-10 w-10 text-primary mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-text-secondary">{value.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* Premium Testimonial Slideshow (Unchanged) */}
      <section className="py-20 md:py-28 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative max-w-4xl mx-auto h-80 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute w-full grid md:grid-cols-3 gap-8 items-center"
                >
                    <div className="md:col-span-1">
                        <div className="relative w-48 h-48 mx-auto md:w-full md:h-64 rounded-lg overflow-hidden border border-border shadow-lg">
                             <img src={testimonials[testimonialIndex].imageUrl} alt={testimonials[testimonialIndex].name} className="w-full h-full object-cover"/>
                        </div>
                    </div>
                    <div className="md:col-span-2 text-center md:text-left">
                        <p className="text-xl md:text-2xl font-light italic text-text-primary">
                            "{testimonials[testimonialIndex].quote}"
                        </p>
                        <p className="mt-4 text-lg font-semibold text-text-primary">{testimonials[testimonialIndex].name}</p>
                        <p className="text-primary">{testimonials[testimonialIndex].title}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
            <button onClick={() => paginate(-1)} className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-12 bg-surface p-2 rounded-full border border-border hover:bg-primary hover:text-white transition-colors z-10">
                <ChevronLeft size={24}/>
            </button>
             <button onClick={() => paginate(1)} className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-12 bg-surface p-2 rounded-full border border-border hover:bg-primary hover:text-white transition-colors z-10">
                <ChevronRight size={24}/>
            </button>
          </div>
        </div>
      </section>

      {/* Meet The Team Section with Scroll Animation */}
      <section ref={teamRef} className="py-20 md:py-28 bg-surface overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary">Meet Our Team</h2>
            <p className="mt-2 text-text-secondary">The passionate individuals behind Synergy.</p>
          </div>
          <motion.div style={{ y: teamY }} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-primary shadow-lg">
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                <p className="text-primary">{member.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section (Unchanged) */}
      <section className="py-20 md:py-28 text-center border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4"/>
            <h2 className="text-3xl font-bold text-text-primary">Join Our Network</h2>
            <p className="mt-2 max-w-2xl mx-auto text-text-secondary">
                Whether you are a patient seeking care or a hospital wanting to improve access, Synergy is here to help.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <a href="/find-a-hospital" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                    Find a Hospital
                  </a>
                  <a href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-background">
                    Contact Us
                  </a>
            </div>
          </div>
      </section>
    </div>
  );
}

export default AboutUsPage;

