import HospitalCard, { Hospital } from './HospitalCard';
import { motion, AnimatePresence } from 'framer-motion';
import HospitalCardSkeleton from './HospitalCardSkeleton';
import { AiHospitalAnalysis } from '../services/gemini';

interface HospitalListProps {
  hospitals: Hospital[];
  isLoading: boolean;
  aiAnalysis?: { [key: number]: AiHospitalAnalysis }; // Add aiAnalysis map
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function HospitalList({ hospitals, isLoading, aiAnalysis }: HospitalListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <HospitalCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">
          No hospitals found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout 
    >
      <AnimatePresence>
        {hospitals.map(hospital => (
          <motion.div 
            key={hospital.id} 
            variants={itemVariants}
            exit="exit"
            layout 
          >
            {/* Pass the corresponding analysis object to the card */}
            <HospitalCard hospital={hospital} aiAnalysis={aiAnalysis?.[hospital.id]} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default HospitalList;