import { GoogleGenerativeAI } from "@google/generative-ai";

// check if the api key is set
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}
console.log('GEMINI_API_KEY', import.meta.env.VITE_GEMINI_API_KEY);
// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');


// Create a reusable chat model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Helper to convert our roles to Gemini roles
const convertRole = (role: 'user' | 'assistant'): 'user' | 'model' => {
  return role === 'assistant' ? 'model' : 'user';
};

export const geminiChat = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  context: {
    cartItems?: any[];
    userPreferences?: string[];
  } = {},
  onStream?: (chunk: string) => void
) => {
  try {
    // Start a chat session
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: convertRole(msg.role),
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
      },
    });

    // Prepare context for the AI
    let contextPrompt = "You are a helpful shopping assistant. Format your responses in markdown when appropriate. ";
    if (context.cartItems?.length) {
      contextPrompt += `Current cart items: ${context.cartItems.map(item => 
        `${item.name} (${item.quantity}x)`).join(', ')}. `;
    }
    if (context.userPreferences?.length) {
      contextPrompt += `User preferences: ${context.userPreferences.join(', ')}. `;
    }

    // Get streaming response from the model
    const result = await chat.sendMessageStream(contextPrompt);
    
    let fullResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onStream?.(fullResponse);
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}; 