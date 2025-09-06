import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { AINavbar } from '../components/AINavbar';
import { AIFooter } from '../components/AIFooter';
import { getHealthcareInsight } from '../services/gemini';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { GoogleGeminiEffect } from '../components/GeminiEffect';
import ReactMarkdown from 'react-markdown';

// --- Data for the interactive cards ---
const insightTopics = [
    {
        title: "Predictive Analytics for Demand Forecasting",
        description: "How AI analyzes data to predict future needs for medical supplies.",
    },
    {
        title: "Real-time Supply Chain Visibility",
        description: "Using AI to track supplies and detect bottlenecks as they happen.",
    },
    {
        title: "Optimized Inventory Management",
        description: "AI algorithms that prevent stockouts and reduce waste in hospitals.",
    }
];

// --- Interactive Card Component ---
const AIInsightCard = ({ title, description }: { title: string, description: string }) => {
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchInsight = async () => {
        setIsLoading(true);
        setIsExpanded(true);
        try {
            const response = await getHealthcareInsight(title);
            setInsight(response);
        } catch (error) {
            console.error("Failed to fetch insight:", error);
            setInsight("Sorry, an error occurred while fetching details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            layout
            className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-xl font-bold text-neutral-100">{title}</h3>
            <p className="text-neutral-400 mt-2 flex-grow">{description}</p>
            <button 
                onClick={fetchInsight}
                disabled={isLoading}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isLoading ? 'Generating...' : 'Ask AI for Details'}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                    >
                        <div className="border-t border-neutral-700 pt-4">
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <span>Generating insight...</span>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm text-neutral-300">
                                     <ReactMarkdown>{insight}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


const AIHealthcarePage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="bg-black text-white">
      <AINavbar />
      <main>
        {/* Section 1: Hero Title */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          >
            AI in Healthcare Logistics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto"
          >
            Explore how Artificial Intelligence is creating a more resilient and predictive medical supply network.
          </motion.p>
        </div>

        {/* Section 2: Gemini Animation */}
        <div ref={ref} className="h-[300vh] relative">
          <GoogleGeminiEffect
            scrollYProgress={scrollYProgress}
            title="Visualizing a Healthier Future"
            description="Scroll to see how AI connects the dots in healthcare logistics"
            className="top-0"
          />
        </div>

        {/* Section 3: Interactive AI Content */}
        <div className="container mx-auto px-4 py-20 relative z-10 bg-black">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Key Applications
            </h2>
             <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
                The COVID-19 pandemic starkly exposed the vulnerabilities of the healthcare supply chain. Click on a topic below to ask our AI how it provides a solution.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-6">
              {insightTopics.map(topic => (
                  <AIInsightCard key={topic.title} title={topic.title} description={topic.description} />
              ))}
          </div>
        </div>
      </main>
      <AIFooter />
    </div>
  );
};

export default AIHealthcarePage;