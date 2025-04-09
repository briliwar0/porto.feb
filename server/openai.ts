import OpenAI from "openai";

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to generate color palette based on input
export async function generateColorPalette(
  description: string,
  mood: string,
  numColors: number = 5
): Promise<string[]> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a color palette expert specialized in personal branding. Generate harmonious and professional color palettes."
        },
        {
          role: "user",
          content: 
            `Create a color palette for personal branding with the following details:
            - Description: ${description}
            - Mood: ${mood}
            - Number of colors: ${numColors}
            
            Return ONLY a valid JSON array of exactly ${numColors} hex color codes (e.g. ["#FFFFFF", "#000000"]).
            For personal branding, ensure the colors are complementary, memorable, and appropriate for the specified mood.
            Do not include any explanation or additional text - just the JSON array.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in the response");
    }

    // Parse the response
    const parsedResponse = JSON.parse(content);
    
    // Check if the colors property exists and is an array
    if (!parsedResponse.colors || !Array.isArray(parsedResponse.colors)) {
      throw new Error("Invalid response format - expected colors array");
    }

    return parsedResponse.colors;
  } catch (error) {
    console.error("Error generating color palette:", error);
    throw error;
  }
}