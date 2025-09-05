import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(apiKey);
// Use the gemini-1.5-flash model for multimodal capabilities
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
 * @param {File} image - The image file of the medical record.
 * @returns {Promise<string>} A text summary of the document.
 */
export const getSummaryFromImage = async (image: File): Promise<string> => {
    console.log("Processing medical document with REAL AI:", image.name);
    // ... (This function remains unchanged)
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
 * @param {File} image - The image file of the prescription.
 * @returns {Promise<any>} A JSON object with the extracted prescription details.
 */
export const getPrescriptionDetailsFromImage = async (image: File): Promise<any> => {
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
        return { patientName: '', medications: [] }; // Return a default structure on error
    }
};


/**
 * Generates dynamic, AI-powered emergency guidance.
 * @param {string} basePrompt - The predefined prompt for the emergency type.
 * @param {any} formData - The user-submitted form data.
 * @returns {Promise<string>} A Markdown string with AI-generated steps.
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
    console.log("AI Response:", text);
    return text;
  } catch (error) {
    console.error("Error fetching AI guidance:", error);
    return "### Could Not Retrieve AI Guidance\n\nPlease follow standard first-aid procedures and await instructions from emergency services. If you haven't already, call your local emergency number now.";
  }
};