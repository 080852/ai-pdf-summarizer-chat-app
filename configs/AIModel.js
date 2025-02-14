import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Ensure your API key is correctly set in environment variables
if (!apiKey) {
    throw new Error("Gemini API key is missing in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Ensure the model name is correct and supported
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Start a new chat session
export const chatSession = model.startChat({
    generationConfig,
    history: [],
});

// Function to send a message to the AI model and fetch the response
export const getAIResponse = async (prompt) => {
    try {
        // Send the prompt to the AI model
        const result = await chatSession.sendMessage(prompt);
        
        // Check if result is valid and return the response text
        if (result && result.response && result.response.text) {
            return result.response.text(); // Return the AI's response text
        } else {
            throw new Error("Invalid response from the AI model.");
        }
    } catch (error) {
        console.error("Error during AI request:", error);
        throw error; // Re-throw the error after logging it
    }
};
