import { motion } from 'framer-motion';
import { HealthData } from '../data/mockHealthData';

interface BarGraphProps {
  data: HealthData[];
}

const BarGraph = ({ data }: BarGraphProps) => {
  const maxPatients = Math.max(...data.map(d => d.totalPatients), 2000); // Ensure a minimum height for the graph

  return (
    <div className="w-full bg-neutral-900 p-6 rounded-lg border border-neutral-700 flex justify-around items-end gap-4 h-64">
      {data.map((day, index) => (
        <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            className="w-full bg-primary rounded-t-md"
            initial={{ height: 0 }}
            animate={{ height: `${(day.totalPatients / maxPatients) * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
          />
          <span className="text-xs font-semibold text-neutral-400">
            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BarGraph;