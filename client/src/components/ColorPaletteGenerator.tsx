import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChromePicker } from 'react-color';
import { saveAs } from 'file-saver';
import { fadeIn } from '@/lib/animations';
import SectionHeading from './ui/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  PaletteIcon, 
  RefreshCwIcon, 
  ZapIcon, 
  DownloadIcon, 
  LoaderIcon, 
  PaintBucket, 
  Palette, 
  Copy, 
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Color {
  hex: string;
  name?: string;
}

const ColorPaletteGenerator = () => {
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('professional');
  const [numColors, setNumColors] = useState(5);
  const [palette, setPalette] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  
  // Predefined moods for palette generation
  const moods = [
    'professional', 'vibrant', 'minimalist', 'playful', 
    'elegant', 'bold', 'retro', 'futuristic', 'warm', 'cool'
  ];

  // Generate palette using OpenAI API
  const generatePalette = async () => {
    if (!description) {
      toast({
        title: "Description required",
        description: "Please provide a description for your brand or project.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-palette', {
        method: 'POST',
        body: JSON.stringify({ description, mood, numColors }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success && data.colors) {
        // Create palette from colors
        const newPalette = data.colors.map((color: string) => ({ hex: color }));
        setPalette(newPalette);
      } else {
        throw new Error(data.message || 'Failed to generate palette');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle color picker change
  const handleColorChange = (color: { hex: string }) => {
    if (currentColorIndex !== null) {
      const newPalette = [...palette];
      newPalette[currentColorIndex] = { ...newPalette[currentColorIndex], hex: color.hex };
      setPalette(newPalette);
    }
  };

  // Copy color to clipboard
  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
    
    toast({
      title: "Color copied!",
      description: `${hex} has been copied to your clipboard.`,
    });
  };

  // Download palette as JSON
  const downloadPalette = () => {
    if (palette.length === 0) return;
    
    const data = {
      name: `${mood}-palette`,
      description: description,
      colors: palette.map(color => color.hex)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `${mood}-color-palette.json`);

    toast({
      title: "Palette downloaded",
      description: "Your color palette has been saved as a JSON file.",
    });
  };

  // Download palette as CSS variables
  const downloadCssVariables = () => {
    if (palette.length === 0) return;
    
    let cssContent = ":root {\n";
    palette.forEach((color, index) => {
      cssContent += `  --color-${index + 1}: ${color.hex};\n`;
    });
    cssContent += "}\n";
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    saveAs(blob, `${mood}-color-variables.css`);

    toast({
      title: "CSS variables downloaded",
      description: "Your color palette has been saved as CSS variables.",
    });
  };

  return (
    <section id="color-generator" className="py-20 md:py-32 px-6 min-h-screen flex items-center relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="Color Palette"
          highlightedText="Generator"
          description="Create a custom color palette for your personal brand or project. Powered by AI to generate harmonious and professional color schemes based on your preferences."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
          {/* Generator Controls */}
          <motion.div
            variants={fadeIn('right')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Your Brand Details</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Brand Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe your brand, project, or personality (e.g., 'Modern tech startup focused on sustainability')"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood/Style</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger id="mood">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map(m => (
                          <SelectItem key={m} value={m}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="numColors">Number of Colors: {numColors}</Label>
                    </div>
                    <Slider
                      id="numColors"
                      min={3}
                      max={8}
                      step={1}
                      value={[numColors]}
                      onValueChange={(values) => setNumColors(values[0])}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={generatePalette} 
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                      disabled={loading || !description}
                    >
                      {loading ? (
                        <>
                          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <ZapIcon className="mr-2 h-4 w-4" />
                          Generate Palette
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {palette.length > 0 && (
              <motion.div
                variants={fadeIn('up', 0.2)}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-col gap-4"
              >
                <div className="flex gap-4">
                  <Button 
                    onClick={downloadPalette} 
                    variant="outline"
                    className="flex-1"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                  <Button 
                    onClick={downloadCssVariables} 
                    variant="outline"
                    className="flex-1"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download CSS
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  <PaletteIcon className="inline-block mr-1 h-4 w-4" />
                  Click on a color to edit it. Changes made to the palette are included when downloading.
                </p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Color Palette Display */}
          <motion.div
            variants={fadeIn('left')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {palette.length > 0 ? (
              <div className="space-y-8">
                <Card className="shadow-lg overflow-hidden">
                  <div className="grid grid-cols-1 divide-y dark:divide-gray-700">
                    {palette.map((color, index) => (
                      <div 
                        key={index}
                        className="p-4 group flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="h-12 w-12 rounded-md cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setCurrentColorIndex(index)}
                          />
                          <div>
                            <p className="font-medium">{color.hex}</p>
                            <p className="text-sm text-muted-foreground">Color {index + 1}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(color.hex, index)}
                          >
                            {copied === index ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentColorIndex(index)}
                          >
                            <PaintBucket className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Preview section with sample UI elements */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Preview</h3>
                    
                    {palette.length >= 3 && (
                      <div className="space-y-6">
                        <div className="p-4 rounded-lg" style={{ backgroundColor: palette[0].hex }}>
                          <h4 className="text-lg font-bold" style={{ color: palette[2].hex }}>
                            Sample Header
                          </h4>
                          <p style={{ color: palette[2].hex }}>
                            This is how your primary background color looks with text.
                          </p>
                        </div>
                        
                        <div className="flex gap-4 justify-center">
                          <button
                            className="px-4 py-2 rounded-md font-medium"
                            style={{ 
                              backgroundColor: palette[1].hex,
                              color: palette[0].hex
                            }}
                          >
                            Primary Button
                          </button>
                          
                          <button
                            className="px-4 py-2 rounded-md font-medium border-2"
                            style={{ 
                              borderColor: palette[1].hex,
                              color: palette[1].hex,
                            }}
                          >
                            Secondary Button
                          </button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                <Palette className="h-16 w-16 text-muted mb-4" />
                <h3 className="text-xl font-medium mb-2">No Palette Generated Yet</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Fill in your brand details and click "Generate Palette" to create your custom color scheme.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Color Picker Dialog */}
        {currentColorIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-bold mb-4">Edit Color</h3>
              
              <ChromePicker 
                color={palette[currentColorIndex]?.hex || '#000000'}
                onChange={handleColorChange}
                disableAlpha
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setCurrentColorIndex(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ColorPaletteGenerator;