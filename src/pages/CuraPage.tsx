import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FloatingDockNav } from '../components/FloatingDockNav';
import { AIFooter } from '../components/AIFooter';
import { getHealthcareInsight, getPrescriptionAnalysis, PrescriptionAnalysis, getOutbreakPrediction, OutbreakPrediction, getSmartAlert, SmartAlert, runGemini } from '../services/gemini';
import { Bot, Loader2, Sparkles, UploadCloud, FileText, Heart, Leaf, Dumbbell, ShieldAlert, Activity, CheckCircle, BarChart, MapPin, Pill, TrendingUp, Bell, ChefHat } from 'lucide-react';
import { GoogleGeminiEffect } from '../components/GeminiEffect';
import ReactMarkdown from 'react-markdown';
import { BackgroundLines } from '../components/BackgroundLines';
import ForecastGraph from '../components/ForecastGraph';

// --- NEW COMPONENT: NutritionPredictor ---
const NutritionPredictor: React.FC = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male', // Default value
    height: '',
    weight: '',
    activity: 'Moderately active', // Default value
    goal: 'Maintain weight', // Default value - renamed from weightPlan
    meals: '3', // Default value
  });

  // State for handling results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null); // Changed to any type for structured data
  const [finalMeals, setFinalMeals] = useState<any>(null); // New state for final LLM-processed meals
  const [llmLoading, setLlmLoading] = useState(false); // New loading state for LLM processing

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to format ingredients from string array to readable list
  const formatIngredients = (ingredients: string | string[]) => {
    if (typeof ingredients === 'string') {
      // Handle case where ingredients might be a string representation of an array
      try {
        const parsed = JSON.parse(ingredients.replace(/c\(|\)/g, ''));
        if (Array.isArray(parsed)) {
          return parsed.map(item => item.replace(/"/g, '')).join(', ');
        }
      } catch (e) {
        // If parsing fails, return string as is
        return ingredients;
      }
    } else if (Array.isArray(ingredients)) {
      return ingredients.join(', ');
    }
    return ingredients;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setFinalMeals(null);

    try {
      // --- Step 1: Call your Python AI Predictor Backend ---
      // Updated to use correct endpoint and field names
      const response = await fetch('http://127.0.0.1:8080/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send data in the format your Python app expects
        body: JSON.stringify({
          age: parseInt(formData.age, 10),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activity: formData.activity,
          goal: formData.goal, // Changed from weightPlan to goal
          meals: parseInt(formData.meals, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`AI model server error: ${errorData}`);
      }

      const data = await response.json();
      
      // Check if response contains an error message
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Store structured response
      setRecommendations(data);
      
      // --- Step 2: Send recommended meals to LLM ---
      if (data.recommended_meals && data.recommended_meals.length > 0) {
        setLlmLoading(true);
        
        // Create a prompt for LLM to select top 3 healthiest meals
        const llmPrompt = `
          From the following list of meals, please select the top 3 healthiest options based on nutritional balance, 
          natural ingredients, and overall health benefits. Return your answer as a JSON array with the following structure:
          
          [
            {
              "name": "Meal Name",
              "calories": number,
              "protein": number,
              "fat": number,
              "carbs": number,
              "ingredients": "Formatted ingredient list",
              "healthScore": number (1-100),
              "healthBenefits": "Brief description of health benefits"
            }
          ]
          
          Here is the list of meals:
          ${JSON.stringify(data.recommended_meals)}
          
          Please analyze each meal's nutritional profile and ingredients to determine the healthiest options. 
          Consider factors like protein content, fiber, vitamins, and natural ingredients.
        `;
        
        try {
          const llmResponse = await runGemini(llmPrompt);
          
          // Try to parse JSON response
          try {
            // Check if the response starts with an error message
            if (llmResponse.startsWith("Error:")) {
              throw new Error(llmResponse);
            }
            
            // Try to extract JSON from the response
            let jsonMatch = llmResponse.match(/```json\s*([\s\S]*?)\s*```/);
            if (!jsonMatch) {
              // Try to find JSON without code blocks
              jsonMatch = llmResponse.match(/\[[\s\S]*\]/);
            }
            
            if (!jsonMatch) {
              throw new Error("No valid JSON found in the response");
            }
            
            const jsonString = jsonMatch[1] || jsonMatch[0];
            const topMeals = JSON.parse(jsonString);
            setFinalMeals(topMeals);
          } catch (parseError) {
            console.error("Error parsing LLM response:", parseError);
            console.error("Original LLM response:", llmResponse);
            
            // If parsing fails, use the original meals
            setFinalMeals(data.recommended_meals.slice(0, 3).map((meal: any) => ({
              ...meal,
              ingredients: formatIngredients(meal.ingredients),
              healthScore: 75, // Default score
              healthBenefits: "A nutritious option with balanced macronutrients."
            })));
          }
        } catch (llmError) {
          console.error("Error calling LLM:", llmError);
          
          // If LLM call fails, use the original meals
          setFinalMeals(data.recommended_meals.slice(0, 3).map((meal: any) => ({
            ...meal,
            ingredients: formatIngredients(meal.ingredients),
            healthScore: 75, // Default score
            healthBenefits: "A nutritious option with balanced macronutrients."
          })));
        } finally {
          setLlmLoading(false);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred. Make sure the AI predictor server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-xl bg-gray-900/50 backdrop-blur-md border border-gray-700">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        AI Nutritional Advisor
      </h2>
      
      {/* --- Prediction Form --- */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Age</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
        </div>
        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        {/* Height */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">Height (cm)</label>
          <input type="number" step="0.1" name="height" id="height" value={formData.height} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
        </div>
        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
          <input type="number" step="0.1" name="weight" id="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
        </div>
        {/* Activity Level */}
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-gray-300 mb-1">Activity Level</label>
          <select name="activity" id="activity" value={formData.activity} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required>
            <option>Little/no exercise</option>
            <option>Lightly active</option>
            <option>Moderately active</option>
            <option>Very active</option>
            <option>Extra active</option>
          </select>
        </div>
        {/* Weight Goal */}
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">Weight Goal</label>
          <select name="goal" id="goal" value={formData.goal} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required>
            <option>Lose weight</option>
            <option>Maintain weight</option>
            <option>Gain weight</option>
          </select>
        </div>
        {/* Number of Meals */}
        <div className="md:col-span-2">
          <label htmlFor="meals" className="block text-sm font-medium text-gray-300 mb-1">Number of Meals</label>
          <select name="meals" id="meals" value={formData.meals} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required>
            <option value="3">3 meals</option>
            <option value="4">4 meals</option>
            <option value="5">5 meals</option>
          </select>
        </div>
        
        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            disabled={loading || llmLoading}
          >
            {loading ? 'Analyzing...' : llmLoading ? 'Selecting Healthiest Options...' : 'Get Recommendations'}
          </button>
        </div>
      </form>

      {/* --- Results Display Area --- */}
      <div className="mt-8">
        {loading && (
          <div className="text-center text-blue-400">
            <p>Loading... Contacting AI models.</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}
        {recommendations && !finalMeals && (
          <div className="text-center text-blue-400">
            <p>Analyzing meal options...</p>
          </div>
        )}
        {finalMeals && (
          <div className="p-6 bg-gray-800/60 border border-gray-700 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">Your Personalized Nutrition Plan</h3>
            
            {/* Display Nutrition Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-400">Daily Calories</h4>
                <p className="text-2xl font-bold text-white">{recommendations.predicted_calories} kcal</p>
                <p className="text-sm text-gray-300">Target per meal: {recommendations.per_meal_target} kcal</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-400">Protein</h4>
                <p className="text-2xl font-bold text-white">{recommendations.macros.protein}g</p>
                <p className="text-sm text-gray-300">Daily target</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-400">Fat / Carbs</h4>
                <p className="text-2xl font-bold text-white">{recommendations.macros.fat}g / {recommendations.macros.carbs}g</p>
                <p className="text-sm text-gray-300">Daily target</p>
              </div>
            </div>
            
            {/* Display Top 3 Healthiest Meals */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Top 3 Healthiest Meal Recommendations
              </h4>
              <div className="space-y-4">
                {finalMeals.map((meal: any, index: number) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-lg font-medium text-white">{meal.name}</h5>
                      {meal.healthScore && (
                        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          Health Score: {meal.healthScore}/100
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="text-gray-400">Calories</span>
                        <p className="font-semibold text-white">{meal.calories} kcal</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="text-gray-400">Protein</span>
                        <p className="font-semibold text-green-400">{meal.protein}g</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="text-gray-400">Fat</span>
                        <p className="font-semibold text-yellow-400">{meal.fat}g</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="text-gray-400">Carbs</span>
                        <p className="font-semibold text-blue-400">{meal.carbs}g</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-300 mb-1">Ingredients:</p>
                      <p className="text-sm text-gray-400">
                        {formatIngredients(meal.ingredients)}
                      </p>
                    </div>
                    
                    {meal.healthBenefits && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-1">Health Benefits:</p>
                        <p className="text-sm text-gray-400">{meal.healthBenefits}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Data for interactive cards ---
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

// --- AI PRESCRIPTION READER COMPONENT ---
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

// --- AI HEALTH SENTINEL COMPONENT ---
const AIHealthSentinel = () => {
    const [location, setLocation] = useState('Bengaluru');
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState<OutbreakPrediction | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleAnalyze = async () => {
        setIsLoading(true);
        setPrediction(null);
        setError(null);
        try {
            const data = await getOutbreakPrediction(location);
            setPrediction(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const riskColor = {
        Low: 'text-green-400',
        Moderate: 'text-yellow-400',
        High: 'text-orange-400',
        Critical: 'text-red-400',
    };

    return (
         <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                     <input 
                         type="text"
                         value={location}
                         onChange={(e) => setLocation(e.target.value)}
                         placeholder="Enter city or region"
                         className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 pl-10"
                     />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !location}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                     {isLoading ? <Loader2 className="animate-spin" /> : <ShieldAlert />}
                     {isLoading ? 'Analyzing Data...' : 'Run Analysis'}
                </button>
            </div>
            
             <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 min-h-[200px]">
                 <AnimatePresence mode="wait">
                        {isLoading ? (
                             <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-neutral-400">
                                 <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                 <p>Analyzing simulated health data for {location}...</p>
                             </motion.div>
                        ) : error ? (
                             <motion.div key="error" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-red-400">
                                <p>{error}</p>
                            </motion.div>
                        ) : prediction ? (
                             <motion.div key="prediction" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="space-y-4">
                                <div>
                                    <span className="text-sm uppercase font-bold text-neutral-400">Risk Level</span>
                                    <p className={`text-2xl font-bold ${riskColor[prediction.riskLevel]}`}>{prediction.riskLevel}</p>
                                </div>
                                 <div>
                                    <span className="text-sm uppercase font-bold text-neutral-400">Potential Outbreak</span>
                                    <p className="text-lg text-neutral-100">{prediction.emergingCondition}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="flex items-center gap-2 font-semibold text-neutral-300"><BarChart/> Key Indicators</h4>
                                        <ul className="list-disc list-inside text-sm text-neutral-400 mt-1">
                                            {prediction.keyIndicators.map(indicator => <li key={indicator}>{indicator}</li>)}
                                        </ul>
                                    </div>
                                     <div>
                                        <h4 className="flex items-center gap-2 font-semibold text-neutral-300"><CheckCircle/> Recommended Actions</h4>
                                        <ul className="list-disc list-inside text-sm text-neutral-400 mt-1">
                                            {prediction.recommendedActions.map(action => <li key={action}>{action}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                 <div>
                                    <span className="text-sm uppercase font-bold text-neutral-400">AI Summary</span>
                                    <p className="text-sm text-neutral-300 mt-1">{prediction.summary}</p>
                                </div>
                             </motion.div>
                        ) : (
                             <motion.div key="initial" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-neutral-500">
                                <p>Enter a location and run the analysis to predict potential health risks.</p>
                            </motion.div>
                        )}
                 </AnimatePresence>
            </div>
         </div>
    );
};

// --- AI STOCK FORECASTING COMPONENT ---
const AIStockForecasting = () => {
    const [drug, setDrug] = useState('Remdesivir');
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<SmartAlert | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleForecast = async () => {
        setIsLoading(true);
        setAlert(null);
        setError(null);
        try {
            const data = await getSmartAlert(drug);
            setAlert(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                     <Pill className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                     <select 
                         value={drug}
                         onChange={(e) => setDrug(e.target.value)}
                         className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 pl-10 appearance-none"
                     >
                         <option>Remdesivir</option>
                         <option>Oseltamivir (Tamiflu)</option>
                         <option>Amoxicillin</option>
                         <option>Ibuprofen</option>
                     </select>
                </div>
                <button
                    onClick={handleForecast}
                    disabled={isLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                     {isLoading ? <Loader2 className="animate-spin" /> : <TrendingUp />}
                     {isLoading ? 'Forecasting...' : 'Generate Forecast'}
                </button>
            </div>
            
             <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 min-h-[200px]">
                 <AnimatePresence mode="wait">
                        {isLoading ? (
                             <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-neutral-400">
                                 <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                 <p>Generating smart forecast for {drug}...</p>
                             </motion.div>
                        ) : error ? (
                             <motion.div key="error" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-red-400">
                                <p>{error}</p>
                            </motion.div>
                        ) : alert ? (
                             <motion.div key="alert" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="space-y-4">
                               <h3 className="text-xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2"><Bell /> Smart Alert: Prophylactic Action Recommended for {alert.drugName}</h3>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                   <div className="bg-neutral-800 p-4 rounded-lg">
                                       <p className="text-sm font-bold text-neutral-400">Baseline Forecast</p>
                                       <p className="text-lg text-neutral-100">{alert.baselineForecast}</p>
                                   </div>
                                    <div className="bg-neutral-800 p-4 rounded-lg">
                                       <p className="text-sm font-bold text-neutral-400">Recommendation</p>
                                       <p className="text-lg text-neutral-100">{alert.recommendation}</p>
                                   </div>
                               </div>
                               <div>
                                   <h4 className="font-semibold text-neutral-300">AI Context Analysis:</h4>
                                   <p className="text-sm text-neutral-400 mt-1">{alert.contextAnalysis}</p>
                               </div>
                               {/* -- THIS IS THE LINE THAT RENDERS THE GRAPH -- */}
                               {alert.forecastData && <ForecastGraph data={alert.forecastData} />}
                             </motion.div>
                        ) : (
                             <motion.div key="initial" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-neutral-500">
                                <p>Select a drug and generate a forecast to see a smart alert.</p>
                            </motion.div>
                        )}
                 </AnimatePresence>
            </div>
         </div>
    );
};

// --- Main CuraPage Component ---
const CuraPage = () => {
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
  
  // Setup for third Gemini Effect
  const ref3 = useRef(null);
  const { scrollYProgress: scrollYProgress3 } = useScroll({
    target: ref3,
    offset: ["start end", "end start"],
  });
  
  // Setup for fourth Gemini Effect
  const ref4 = useRef(null);
  const { scrollYProgress: scrollYProgress4 } = useScroll({
    target: ref4,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="bg-black text-white relative">
      <BackgroundLines />
      <FloatingDockNav />
      <main className="relative z-10">
        {/* NEW SECTION: Nutrition Predictor */}
        <div className="container mx-auto px-4 py-20 pt-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              AI Nutritional Advisor
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
              Get personalized nutrition recommendations based on your health profile and goals.
            </p>
          </div>
          <NutritionPredictor />
        </div>

        {/* Section 1: Hero Title */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          >
            CURA
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

        {/* Section 6: Gemini Animation 3 */}
        <div ref={ref3} className="h-[300vh] relative">
          <GoogleGeminiEffect
            scrollYProgress={scrollYProgress3}
            title="AI-Powered Health Sentinel"
            description="Predicting local outbreaks before a crisis escalates"
            className="top-0"
          />
        </div>
        
        {/* Section 7: AI Health Sentinel */}
        <div className="container mx-auto px-4 py-20 relative z-10 bg-black">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
               AI-Powered Health Sentinel
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
              By analyzing sudden spikes in patient data or unusual drug consumption, Synergy's AI can predict local outbreaks early and alert hospitals and authorities before a crisis escalates.
            </p>
          </div>
          <AIHealthSentinel />
        </div>
        
        {/* Section 8: Gemini Animation 4 */}
        <div ref={ref4} className="h-[300vh] relative">
          <GoogleGeminiEffect
            scrollYProgress={scrollYProgress4}
            title="Smart Stock Forecasting"
            description="Transforming inventory from a reactive tool into a proactive, intelligent partner"
            className="top-0"
          />
        </div>
        
        {/* Section 9: AI Stock Forecasting */}
        <div className="container mx-auto px-4 py-20 relative z-10 bg-black">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
               Smart Stock & Medicine Forecasting
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
              Our hybrid AI combines forecasting models with contextual analysis from news and global events to generate actionable alerts, preventing shortages before they happen.
            </p>
          </div>
          <AIStockForecasting />
        </div>

      </main>
      <AIFooter />
    </div>
  );
};

export default CuraPage;