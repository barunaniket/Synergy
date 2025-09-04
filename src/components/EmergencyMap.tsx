import { motion } from 'framer-motion';

const EmergencyMap = () => {
  return (
    <motion.div
      className="w-full h-96 rounded-2xl overflow-hidden border border-border shadow-2xl relative group mt-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <img
        src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_2560%2Cc_limit/GoogleMapTA.jpg"
        alt="Map to our office"
        className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:grayscale-[50%]"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div className="relative" whileHover="hover" initial="initial">
          {/* Pulsing circle effect */}
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-red-500/50"
            variants={{
              initial: { scale: 0.5, opacity: 0 },
              hover: {
                scale: [1, 1.5],
                opacity: [1, 0],
                transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
              },
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
                transition: { type: 'spring', stiffness: 300, damping: 10 },
              },
            }}
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="#EF4444"
            />
          </motion.svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmergencyMap;