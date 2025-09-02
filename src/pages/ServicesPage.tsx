import { motion } from 'framer-motion';
import { Hospital, Siren, Pill, Home, Video, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Hospital,
    title: 'Find a Hospital',
    description: 'Access our real-time network of top-tier hospitals. Filter by specialty, wait time, and location to find the perfect match for your needs.',
    link: '/find-a-hospital',
    image: '/dl.beatsnoop.com-final-Al0yVLXNC7.jpg'
  },
  {
    icon: Siren,
    title: 'Emergency Services',
    description: 'Instantly locate the nearest emergency rooms with available capacity, ensuring you get critical care without delay during an emergency.',
    link: '/emergency',
    image: '/dl.beatsnoop.com-final-nsrY5TzDuB.jpg'
  },
  {
    icon: Pill,
    title: 'Pharmacy Network',
    description: 'Connect with our network of pharmacies for prescription fulfillment, medication management, and expert pharmaceutical advice.',
    link: '/pharmacy',
    image: '/dl.beatsnoop.com-final-JpNHXSut5C.jpg'
  },
  {
    icon: Home,
    title: 'Home Care Visits',
    description: 'Schedule professional and compassionate in-home visits from qualified doctors and nurses for check-ups, post-operative care, and more.',
    link: '/home-visit',
    image: '/premium_photo-1661658696251-88ca80710869.avif'
  },
  {
    icon: Video,
    title: 'Telehealth Consultations',
    description: 'Book secure video calls with specialists from the comfort of your home. Get expert medical advice without the need to travel.',
    link: '/telehealth',
    image: '/dl.beatsnoop.com-final-epGd54fhW9.jpg'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] },
  },
};

function ServicesPage() {
  return (
    <div className="pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-24 md:py-32 text-center"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-text-primary">
            Comprehensive Care,
            <br />
            <span className="text-primary">Seamlessly Delivered.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 max-w-3xl mx-auto text-lg text-text-secondary">
            Synergy offers a complete suite of services designed to provide you with timely, efficient, and compassionate healthcare at every step of your journey.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="container mx-auto px-4 md:px-6 pb-24 md:pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <motion.a 
                href={service.link} 
                className="block group relative rounded-2xl overflow-hidden border border-border shadow-lg"
                whileHover="hover"
              >
                <div className="relative h-96">
                  <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    {/* --- THIS SECTION IS OPTIMIZED --- */}
                    <motion.div 
                      // Removed backdrop-blur-sm for better performance
                      className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/80 border border-white/20 mb-4 transition-all duration-300 group-hover:bg-primary"
                      variants={{ hover: { scale: 1.1, rotate: 5 } }}
                    >
                        <service.icon size={32} />
                    </motion.div>
                    {/* --- END OF OPTIMIZATION --- */}
                    <h3 className="text-3xl font-bold">{service.title}</h3>
                    <p className="mt-2 text-white/90 max-w-md">{service.description}</p>
                    <motion.div 
                      className="flex items-center mt-6 font-semibold text-primary"
                      variants={{ hover: { x: 5 } }}
                    >
                      Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default ServicesPage;