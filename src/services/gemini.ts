import { GoogleGenerativeAI, Part, Content } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        console.error("Error processing image with AI:", error);
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
        console.error("Error processing prescription with AI:", error);
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
    console.error("Error fetching AI guidance:", error);
    return "### Could Not Retrieve AI Guidance\n\nPlease follow standard first-aid procedures and await instructions from emergency services.";
  }
};


// --- UPDATED CHATBOT KNOWLEDGE BASE ---
const knowledgeBase = `
You are the "Synergy AI Assistant", a helpful and friendly chatbot for the Synergy web platform.
Your goal is to answer user questions and guide them through the site based on the context provided below.
Keep your answers concise and helpful.

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
    // This function's logic remains the same, only the knowledgeBase it uses has changed.
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
        console.error("Error getting chatbot response:", error);
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};