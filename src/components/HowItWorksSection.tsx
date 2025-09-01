import { motion } from 'framer-motion';
import { Search, Clock, Link } from 'lucide-react';

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
  visible: { opacity: 1, y: 0 },
};

function HowItWorksSection() {
  return (
    // The background is now transparent, letting the main dot pattern show through
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-surface px-3 py-1 text-sm text-primary">
              How It Works
            </div>
            {/* Text colors are reverted back to our light theme's defaults */}
            <h2 className="text-3xl font-bold tracking-tighter text-text-primary sm:text-5xl">
              A Transparent, Data-Driven Flow
            </h2>
            <p className="max-w-[900px] text-text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From your initial query to booking, our process is designed to improve access, reduce
              wait times, and empower you with informed choices.
            </p>
          </motion.div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3 lg:gap-16"
        >
          {/* Feature Cards updated for the light theme */}
          {[
            {
              icon: <Search className="h-8 w-8 text-primary" />,
              title: 'Search & Filter Intelligently',
              description:
                'Use our smart filters to find nearby hospitals based on budget, wait time, location, and required transplant organ.',
            },
            {
              icon: <Clock className="h-8 w-8 text-primary" />,
              title: 'View Real-Time Availability',
              description:
                'Hospitals provide live updates on their capacity, waitlist signals, and program availability, giving you the most current information.',
            },
            {
              icon: <Link className="h-8 w-8 text-primary" />,
              title: 'Connect and Reach Care Faster',
              description:
                'Receive tailored recommendations, real-time directions, and contact options to help you make informed choices and access care quickly.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="grid gap-4 text-center rounded-xl border border-border bg-surface p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <div className="grid gap-2">
                <h3 className="text-xl font-bold text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

