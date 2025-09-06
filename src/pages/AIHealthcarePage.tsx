import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { AINavbar } from '../components/AINavbar';
import { AIFooter } from '../components/AIFooter';
import { getHealthcareInsight, getPrescriptionAnalysis, PrescriptionAnalysis } from '../services/gemini';
import { Bot, Loader2, Sparkles, UploadCloud, FileText, Heart, Leaf, Dumbbell } from 'lucide-react';
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

// --- NEW AI PRESCRIPTION READER COMPONENT ---
const AIPrescriptionReader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<PrescriptionAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);
            setIsLoading(true);
            setAnalysis(null);
            setError(null);
            try {
                const data = await getPrescriptionAnalysis(uploadedFile);
                setAnalysis(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Upload Section */}
                <div className="flex flex-col items-center">
                    <label htmlFor="prescription-upload" className="w-full relative cursor-pointer bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center p-10 hover:border-primary transition-colors">
                        <UploadCloud className="h-12 w-12 mb-4 text-neutral-500" />
                        <span className="text-sm text-neutral-400 text-center">
                           {file ? file.name : 'Click to upload or drag & drop'}
                        </span>
                    </label>
                    <input id="prescription-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
                    <p className="text-xs text-neutral-500 mt-4">Your data is processed securely and is not stored.</p>
                </div>

                {/* Results Section */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                             <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-neutral-400">
                                 <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                 <p>AI is analyzing your prescription...</p>
                             </motion.div>
                        ) : error ? (
                             <motion.div key="error" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-red-400">
                                <p>{error}</p>
                            </motion.div>
                        ) : analysis ? (
                             <motion.div key="results" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="space-y-6">
                                {/* Medications */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-neutral-100"><FileText/> Medications Identified</h4>
                                    <ul className="mt-2 space-y-2">
                                        {analysis.medications.map((med, i) => (
                                            <li key={i} className="p-3 bg-neutral-800 rounded-md text-sm">
                                                <strong className="text-primary">{med.name}</strong> ({med.dosage})
                                                <p className="text-xs text-neutral-400">Alternatives to discuss with your doctor: {med.alternatives.join(', ')}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Guidance */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-neutral-100"><Heart/> Holistic Guidance</h4>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <p><strong className="text-primary flex items-center gap-1"><Leaf size={14}/> Home Remedies:</strong> {analysis.guidance.homeRemedies.join(', ')}</p>
                                        <p><strong className="text-primary flex items-center gap-1"><Dumbbell size={14}/> Exercise & Yoga:</strong> {analysis.guidance.yogaAndExercises.join(', ')}</p>
                                        <p><strong className="text-primary">Diet Plan:</strong> {analysis.guidance.dietPlan.join(', ')}</p>
                                    </div>
                                </div>
                             </motion.div>
                        ) : (
                            <motion.div key="initial" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-neutral-500">
                                <p>Upload a prescription to see AI analysis.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};


const AIHealthcarePage = () => {
  // Setup for first Gemini Effect
  const ref1 = useRef(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: ref1,
    offset: ["start end", "end start"],
  });
  
  // Setup for second Gemini Effect
  const ref2 = useRef(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: ref2,
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

        {/* Section 2: Gemini Animation 1 */}
        <div ref={ref1} className="h-[300vh] relative">
          <GoogleGeminiEffect
            scrollYProgress={scrollYProgress1}
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
        
        {/* Section 4: Gemini Animation 2 */}
        <div ref={ref2} className="h-[300vh] relative">
          <GoogleGeminiEffect
            scrollYProgress={scrollYProgress2}
            title="Personalized Health Insights"
            description="Scroll to unlock intelligent guidance from your prescriptions"
            className="top-0"
          />
        </div>
        
        {/* Section 5: AI Prescription Reader */}
        <div className="container mx-auto px-4 py-20 relative z-10 bg-black">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              AI Prescription Reader & Smart Guidance
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
              Upload a prescription, and our AI will instantly identify medicines, suggest alternatives, and provide holistic guidance to complement your recovery.
            </p>
          </div>
          <AIPrescriptionReader />
        </div>

      </main>
      <AIFooter />
    </div>
  );
};

export default AIHealthcarePage;