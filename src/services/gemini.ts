import { GoogleGenerativeAI, Part, Content } from "@google/generative-ai";
import OpenAI from "openai";
import { Hospital } from "../components/HospitalCard";

// Get the API keys from environment variables
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY; 

if (!geminiApiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}

if (!openaiApiKey) {
    console.warn("VITE_OPENAI_API_KEY is not set. OpenAI fallback will not be available.");
}


// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
});


// --- Helper function to convert a File to a GoogleGenerativeAI.Part ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

// --- Define the new, richer data structure for AI analysis ---
export interface AiHospitalAnalysis {
  id: number;
  reason: string;
  predictedWaitTime: string; // e.g., "45-55 days"
  predictedCost: string;     // e.g., "$95,000 - $110,000"
  outcomeScore: number;      // e.g., 85 (representing 85%)
}


/**
 * Generates a summary from an uploaded medical document image.
 */
export const getSummaryFromImage = async (image: File): Promise<string> => {
    // This function remains unchanged
    console.log("Processing medical document with REAL AI:", image.name);
    const prompt = `
        You are a helpful medical assistant AI.
        Analyze the following image of a medical document.
        Extract the key information and provide a concise summary (under 150 words) suitable for a "Brief Medical History" field.
        Focus on past diagnoses, major surgeries, chronic conditions, and allergies.
        Present the information in a clear, easy-to-read paragraph.
    `;
    try {
        const imagePart = await fileToGenerativePart(image);
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();
        console.log("AI Summary Response:", text);
        return text;
    } catch (error) {
        console.error("Error processing image with Gemini, trying OpenAI:", error);
        if (openaiApiKey) {
            try {
                const base64Image = await fileToGenerativePart(image);
                const response = await openai.chat.completions.create({
                    model: "gpt-4-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        "url": `data:${image.type};base64,${base64Image.inlineData?.data}`
                                    }
                                },
                            ],
                        },
                    ],
                });
                return response.choices[0].message.content || "Error: Could not process the document.";
            } catch (openaiError) {
                console.error("Error processing image with OpenAI:", openaiError);
                return "Error: Could not process the document with either service. Please enter the summary manually.";
            }
        }
        return "Error: Could not process the document. Please enter the summary manually.";
    }
};

/**
 * Extracts structured details from an uploaded prescription image.
 */
export const getPrescriptionDetailsFromImage = async (image: File): Promise<any> => {
    // This function remains unchanged
    console.log("Processing prescription with REAL AI:", image.name);
    const prompt = `
        You are an expert pharmacy technician AI. Analyze the following image of a medical prescription.
        Extract the key information and return it as a JSON object.

        Extract the following fields:
        1. "patientName": The full name of the patient.
        2. "medications": An array of objects, where each object has "name", "dosage" (e.g., "500mg"), and "instructions" (e.g., "Twice a day after meals").

        Your response must be ONLY the JSON object, with no other text, comments, or formatting.
        If a piece of information is not clearly visible, use an empty string "" for its value.

        Example Response:
        {
          "patientName": "Aniket Barun",
          "medications": [
            { "name": "Metformin", "dosage": "500mg", "instructions": "Take one tablet twice daily with meals." },
            { "name": "Amlodipine", "dosage": "5mg", "instructions": "Take one tablet every morning." }
          ]
        }
    `;
    try {
        const imagePart = await fileToGenerativePart(image);
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();
        console.log("AI Prescription JSON Response:", text);
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error processing prescription with Gemini, trying OpenAI:", error);
        if (openaiApiKey) {
            try {
                const base64Image = await fileToGenerativePart(image);
                const response = await openai.chat.completions.create({
                    model: "gpt-4-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        "url": `data:${base64Image.inlineData?.data}`
                                    }
                                },
                            ],
                        },
                    ],
                });
                const cleanedText = response.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
                return JSON.parse(cleanedText);
            } catch (openaiError) {
                console.error("Error processing prescription with OpenAI:", openaiError);
                return { patientName: '', medications: [] };
            }
        }
        return { patientName: '', medications: [] };
    }
};


/**
 * Generates dynamic, AI-powered emergency guidance.
 */
export const getEmergencyGuidance = async (basePrompt: string, formData: any): Promise<string> => {
  // This function remains unchanged
  console.log("Fetching REAL AI guidance for:", { basePrompt, formData });
  const prompt = `
    You are an AI assistant providing emergency guidance. Your tone must be professional, calm, and empathetic.
    **Context:**
    - The person reporting the emergency is named ${formData.name || 'User'}. You must address them, not the patient.
    - The nature of the emergency is: "${basePrompt}"
    - Other details provided about the patient and situation: ${JSON.stringify(formData, null, 2)}
    **Your Task:**
    1.  Address the **reporter** by their name (e.g., "Stay calm, ${formData.name || 'User'}.").
    2.  Provide immediate, clear, and concise step-by-step instructions on how **they** can help the patient.
    3.  Refer to the person needing help as "the patient" or "the person." **Do not assume the reporter is the patient.**
    4.  Use Markdown for a numbered list and bold key actions.
    5.  Keep the entire response concise and under 100 words.
    6.  Include a disclaimer that this is not a substitute for professional medical advice and to prioritize instructions from emergency dispatchers.
    Generate the response now.
  `;
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error fetching AI guidance from Gemini, trying OpenAI:", error);
        if (openaiApiKey) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                });
                return response.choices[0].message.content || "Error: Could not retrieve AI guidance.";
            } catch (openaiError) {
                console.error("Error fetching AI guidance from OpenAI:", openaiError);
                return "### Could Not Retrieve AI Guidance\n\nPlease follow standard first-aid procedures and await instructions from emergency services.";
            }
        }
        return "### Could Not Retrieve AI Guidance\n\nPlease follow standard first-aid procedures and await instructions from emergency services.";
    }
};

/**
 * Ranks a list of hospitals and provides detailed AI analysis for each.
 */
export const getAiRankedHospitals = async (
  filters: { location: string; organ: string; budget: string; urgency: string },
  hospitals: Hospital[]
): Promise<AiHospitalAnalysis[]> => {
  // This function remains unchanged
  console.log("Requesting AI analysis for", hospitals.length, "hospitals with filters:", filters);

  if (hospitals.length === 0) {
    return [];
  }

  const simplifiedHospitals = hospitals.map(h => ({
    id: h.id,
    name: h.name,
    distance: h.distance,
    historicalWaitTime: h.waitTime,
    historicalCost: h.estimatedCost,
  }));

  const prompt = `
    You are an expert medical concierge AI with a predictive analytics engine. Your task is to analyze and rank a list of hospitals for a user, providing a detailed, predictive breakdown for each.

    **User's Criteria:**
    - Organ Needed: ${filters.organ}
    - Maximum Budget: $${filters.budget || 'Not specified'}
    - Urgency: ${filters.urgency}
    - Preferred Location: ${filters.location || 'Not specified'}

    **Your Predictive Tasks:**
    1.  **Rank the Hospitals**: Order the list from most to least recommended based on the user's criteria. Prioritize 'historicalWaitTime' for 'Critical' urgency, balance wait time and distance for 'Urgent', and consider all factors for 'Standard'.
    2.  **Predict Wait Time**: Based on the 'historicalWaitTime' and the user's 'Urgency', provide a realistic *predicted range*. For 'Critical' urgency, the predicted time might be slightly less than historical. For 'Standard', it might be slightly more. Express it as a string, e.g., "45-55 days".
    3.  **Predict Cost**: Based on the 'historicalCost' and organ type, provide a realistic *predicted cost range*. This should be a slightly wider range than the single historical data point. Express it as a string, e.g., "$95,000 - $110,000".
    4.  **Estimate Outcome Score**: Generate a plausible "Outcome Score" (a number between 70 and 95) for each hospital. This score represents a hypothetical success rate. Give hospitals with lower wait times and established names (like Apollo, Fortis, Manipal) slightly higher scores. This is a simulation.
    5.  **Provide a Reason**: Write a concise, compelling sentence (max 15 words) that justifies the ranking, incorporating your predictions.

    **Available Hospitals (JSON format):**
    ${JSON.stringify(simplifiedHospitals, null, 2)}

    **Your Task:**
    Return a JSON array of objects. Each object must represent a hospital and contain the following keys: "id" (number), "reason" (string), "predictedWaitTime" (string), "predictedCost" (string), and "outcomeScore" (number). The array must be in the ranked order.
    
    **IMPORTANT: Your response must ONLY be the JSON array of objects, with no other text, comments, or formatting.**

    Example Response:
    [
      {
        "id": 3,
        "reason": "Top choice due to the lowest predicted wait time and high outcome score.",
        "predictedWaitTime": "40-50 days",
        "predictedCost": "$60,000 - $75,000",
        "outcomeScore": 92
      },
      {
        "id": 1,
        "reason": "A great balance of cost and a favorable predicted wait time.",
        "predictedWaitTime": "48-60 days",
        "predictedCost": "$95,000 - $110,000",
        "outcomeScore": 88
      }
    ]
  `;

  try {
    console.log("Attempting to rank with Gemini...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("AI Ranking Raw Response from Gemini:", text);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const rankedData = JSON.parse(cleanedText);
     if (
        Array.isArray(rankedData) && 
        rankedData.every(item => 
            typeof item.id === 'number' && 
            typeof item.reason === 'string' &&
            typeof item.predictedWaitTime === 'string' &&
            typeof item.predictedCost === 'string' &&
            typeof item.outcomeScore === 'number'
        )
    ) {
      return rankedData as AiHospitalAnalysis[];
    } else {
      throw new Error("Invalid response format from Gemini AI.");
    }
  } catch (error) {
    console.error("Error getting AI ranking from Gemini, trying OpenAI fallback:", error);
    if (openaiApiKey) {
        try {
            console.log("Attempting to rank with OpenAI...");
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });
            const text = response.choices[0].message.content;
            if (!text) throw new Error("Empty response from OpenAI");
            console.log("AI Ranking Raw Response from OpenAI:", text);
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const rankedData = JSON.parse(cleanedText);
            
            if (
                Array.isArray(rankedData) &&
                rankedData.every(item =>
                    typeof item.id === 'number' &&
                    typeof item.reason === 'string' &&
                    typeof item.predictedWaitTime === 'string' &&
                    typeof item.predictedCost === 'string' &&
                    typeof item.outcomeScore === 'number'
                )
            ) {
                return rankedData as AiHospitalAnalysis[];
            } else {
                throw new Error("Invalid response format from OpenAI AI.");
            }
        } catch (openaiError) {
             console.error("Error getting AI ranking from OpenAI:", openaiError);
             return hospitals.map(h => ({ 
                id: h.id, 
                reason: "AI analysis failed. Displaying raw data.",
                predictedWaitTime: `${h.waitTime} days`,
                predictedCost: `$${h.estimatedCost.toLocaleString()}`,
                outcomeScore: 70
            }));
        }
    }
    // Final fallback if both services fail
    return hospitals.map(h => ({ 
        id: h.id, 
        reason: "AI analysis failed. Displaying raw data.",
        predictedWaitTime: `${h.waitTime} days`,
        predictedCost: `$${h.estimatedCost.toLocaleString()}`,
        outcomeScore: 70
    }));
  }
};


// --- UPDATED CHATBOT KNOWLEDGE BASE ---
const knowledgeBase = `
You are the "Synergy AI Assistant", a helpful and friendly chatbot for the Synergy web platform.
Your goal is to answer user questions and guide them through the site based on the context provided below.
Keep your answers concise and helpful. You are multilingual. If the user asks a question in a language other than English (like Hindi, Spanish, etc.), you MUST respond in that same language.

**Synergy Platform Information:**
- **Main Goal:** Synergy connects patients needing urgent specialty care with hospitals that have available capacity.
- **Core Services:** Find a Hospital, Emergency Guidance, Pharmacy, Telehealth, Home Care, and Ambulance Booking.

**Your Behavior Rules:**
1.  **Direct Questions:** If a user asks how to do something specific (e.g., "how to order medicine?"), guide them to the correct page. (e.g., "You can upload your prescription on our Pharmacy page to get started!").
2.  **General Medical Questions:** If the user asks a general medical question you cannot answer (like "how to grow hair?" or "what are the symptoms of a cold?"), **you must do two things**:
    - First, politely state that you cannot provide medical advice.
    - Second, **immediately suggest a relevant Synergy service**. For example: "While I can't give medical advice, you can connect with a specialist through our Telehealth service to discuss that." or "I can't diagnose symptoms, but you could use our Find a Hospital page to locate a clinic near you."
3.  **Tone:** Be friendly, empathetic, and professional.
`;


export const getChatbotResponse = async (history: Content[]): Promise<string> => {
    // This function's logic remains the same
    console.log("Getting chatbot response for history:", history);
    try {
        const lastMessage = history[history.length - 1].parts[0].text;
        if (!lastMessage) {
            return "I'm sorry, I didn't get that. Could you please repeat?";
        }

        const prompt = `${knowledgeBase}\n\n**Conversation History:**\n${history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n')}\n\n**New Question:**\n${lastMessage}\n\n**Your Answer:**`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log("Chatbot AI Response:", text);
        return text;
    } catch (error) {
        console.error("Error getting chatbot response from Gemini, trying OpenAI:", error);
        if (openaiApiKey) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: history.map(h => ({
                        role: h.role as 'user' | 'assistant',
                        content: Array.isArray(h.parts) ? h.parts[0].text || '' : h.parts
                    }))
                });

                return response.choices[0].message.content || "I'm sorry, I'm having trouble connecting right now.";
            } catch (openaiError) {
                console.error("Error getting chatbot response from OpenAI:", openaiError);
                return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
            }
        }
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};