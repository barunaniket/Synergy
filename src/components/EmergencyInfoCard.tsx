import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';
import React from 'react';

interface EmergencyInfoCardProps {
  title: string;
  description: string;
  icon: React.ElementType<LucideProps>;
}

const EmergencyInfoCard: React.FC<EmergencyInfoCardProps> = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      className="bg-background p-8 rounded-lg border border-border text-center"
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </motion.div>
  );
};

export default EmergencyInfoCard;