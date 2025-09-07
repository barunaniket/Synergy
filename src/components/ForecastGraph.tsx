// src/components/ForecastGraph.tsx
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HealthData } from '../data/mockHealthData';

interface ForecastGraphProps {
  data: HealthData[];
}

// This function simulates a forecast based on historical data
const generateForecast = (historicalData: HealthData[]) => {
  return historicalData.map((d, i) => {
    // For past data, forecast matches historical
    if (i < historicalData.length - 1) {
      return { ...d, forecasted: d.totalPatients };
    }
    // For the last data point, create a spike for the forecast
    return { ...d, forecasted: d.totalPatients * 1.5 }; 
  });
};


const ForecastGraph = ({ data }: ForecastGraphProps) => {
  const chartData = generateForecast(data);

  return (
    <motion.div 
      className="w-full h-80 bg-neutral-900 p-6 rounded-lg border border-neutral-700 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            tick={{ fill: '#a3a3a3' }} 
            axisLine={{ stroke: '#404040' }}
            tickLine={{ stroke: '#404040' }}
          />
          <YAxis 
            tick={{ fill: '#a3a3a3' }} 
            axisLine={{ stroke: '#404040' }}
            tickLine={{ stroke: '#404040' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 30, 30, 0.8)', 
              borderColor: '#404040' 
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            cursor={{ fill: 'rgba(13, 148, 136, 0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#a3a3a3' }} />
          <Bar dataKey="totalPatients" name="Historical Volume" fill="#52525b" />
          <Bar dataKey="forecasted" name="AI Forecast" fill="#0d9488" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ForecastGraph;