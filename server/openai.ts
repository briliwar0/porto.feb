import OpenAI from "openai";

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Predefined color palettes for different moods
const predefinedPalettes: Record<string, string[][]> = {
  professional: [
    ["#0A2463", "#3E92CC", "#FFFFFF", "#D8315B", "#1E1B18"],
    ["#1D3557", "#457B9D", "#A8DADC", "#F1FAEE", "#E63946"],
    ["#2C3531", "#116466", "#D9B08C", "#FFCB9A", "#D1E8E2"]
  ],
  vibrant: [
    ["#FFD166", "#EF476F", "#06D6A0", "#118AB2", "#073B4C"],
    ["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0"],
    ["#F15BB5", "#FEE440", "#00BBF9", "#00F5D4", "#9B5DE5"]
  ],
  minimalist: [
    ["#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#212529"],
    ["#FFFFFF", "#F2F2F2", "#CCCCCC", "#999999", "#333333"],
    ["#F5F5F5", "#EBEBEB", "#D9D9D9", "#4D4D4D", "#1A1A1A"]
  ],
  playful: [
    ["#FF9F1C", "#FFBF69", "#CBF3F0", "#2EC4B6", "#FFFFFF"],
    ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
    ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#F9F9F9"]
  ],
  elegant: [
    ["#5F4B8B", "#E69A8D", "#FFFFFF", "#000000", "#B8A9C9"],
    ["#2D3142", "#EAE8FF", "#BFD7EA", "#91AEC1", "#FFFFFF"],
    ["#FFF8F0", "#A8998F", "#2B2118", "#734F45", "#D9CFC1"]
  ],
  bold: [
    ["#1A535C", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"],
    ["#000000", "#14213D", "#FCA311", "#E5E5E5", "#FFFFFF"],
    ["#1B1B1B", "#E4572E", "#17BEBB", "#FFC914", "#FFFFFF"]
  ],
  retro: [
    ["#FFD23F", "#EE4266", "#0EAD69", "#3BCEAC", "#540D6E"],
    ["#FFBC42", "#D81159", "#8F2D56", "#218380", "#73D2DE"],
    ["#F06543", "#E8E9EB", "#E0DFD5", "#313638", "#F09D51"]
  ],
  futuristic: [
    ["#0B0C10", "#1F2833", "#C5C6C7", "#66FCF1", "#45A29E"],
    ["#2C3333", "#2E4F4F", "#0E8388", "#CBE4DE", "#A9F1DF"],
    ["#012A4A", "#013A63", "#01497C", "#2A6F97", "#61A5C2"]
  ],
  warm: [
    ["#FFF3B0", "#FFDE82", "#FFB800", "#FF7800", "#FF5B00"],
    ["#FFF3E6", "#FFC49B", "#FF9C71", "#FF7456", "#FF5D40"],
    ["#FFFCF2", "#CCC5B9", "#EB5E28", "#403D39", "#252422"]
  ],
  cool: [
    ["#05668D", "#028090", "#00A896", "#02C39A", "#F0F3BD"],
    ["#1B263B", "#415A77", "#778DA9", "#E0E1DD", "#FFFFFF"],
    ["#CFDBD5", "#7D98A1", "#5E6472", "#2F3037", "#000000"]
  ]
};

// Get a semi-random color palette based on mood and description
function getFallbackPalette(mood: string, description: string, numColors: number): string[] {
  // Default to "professional" if mood isn't found
  const moodKey = Object.keys(predefinedPalettes).includes(mood) 
    ? mood 
    : "professional";
  
  // Pick a pattern based on the description (using string length as a simple way to select)
  const paletteIndex = description.length % predefinedPalettes[moodKey].length;
  let palette = predefinedPalettes[moodKey][paletteIndex];
  
  // Ensure we have the right number of colors
  if (palette.length > numColors) {
    palette = palette.slice(0, numColors);
  } else if (palette.length < numColors) {
    // Add colors from another palette to fill
    const extraPaletteIndex = (paletteIndex + 1) % predefinedPalettes[moodKey].length;
    const extraColors = predefinedPalettes[moodKey][extraPaletteIndex].slice(0, numColors - palette.length);
    palette = [...palette, ...extraColors];
  }
  
  return palette;
}

// Function to generate color palette based on input
export async function generateColorPalette(
  description: string,
  mood: string,
  numColors: number = 5
): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key") {
      console.log("OpenAI API key not provided or invalid, using fallback palette");
      return getFallbackPalette(mood, description, numColors);
    }
    
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
            
            Return a JSON object with a single property "colors" that contains an array of exactly ${numColors} hex color codes.
            Example: {"colors": ["#FFFFFF", "#000000", "#FF0000"]}
            
            For personal branding, ensure the colors are complementary, memorable, and appropriate for the specified mood.
            The colors should form a cohesive palette suitable for the described brand.`
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
    // Use fallback mechanism when OpenAI API fails
    console.log("Using fallback palette generation due to API error");
    return getFallbackPalette(mood, description, numColors);
  }
}