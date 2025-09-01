import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: 'https://images.pexels.com/photos/33642009/pexels-photo-33642009.jpeg',
    alt: 'Healthcare professionals collaborating on a laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop',
    alt: 'Surgeons in an operating room',
  },
  {
    src: 'https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?q=80&w=2071&auto=format&fit=crop',
    alt: 'Close-up of a DNA helix structure',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1681842906523-f27efd0d1718?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Doctors',
  },
];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Timer updated to 6.8 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center space-y-6 text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tighter text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                Find the Right Hospital,
                <br />
                <span className="text-primary">Faster Than Ever.</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-text-secondary md:text-xl lg:mx-0">
                Our platform connects patients with hospitals in real-time, reducing wait times and
                providing transparent access to urgent specialty care and transplants.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4 min-[400px]:flex-row justify-center lg:justify-start"
            >
              <a
                href="/search"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Start Your Search
              </a>
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </a>
            </motion.div>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
            <AnimatePresence>
              <motion.img
                key={currentIndex}
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                initial={{ opacity: 0, scale: 1.15 }} // Start invisible and zoomed IN
                animate={{ opacity: 1, scale: 1 }} // Animate to visible and zoomed OUT
                exit={{ opacity: 0 }} // Fade out on exit
                transition={{
                  // The zoom-out animation takes the full 6.8s duration
                  scale: { duration: 8.9, ease: 'linear' },
                  // The fade-in is quicker
                  opacity: { duration: 1.5 },
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

