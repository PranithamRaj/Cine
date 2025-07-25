import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Terminal, Eye, EyeOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export const PromptGenerator = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [concept, setConcept] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [cfgScale, setCfgScale] = useState([0.7]);
  const [style, setStyle] = useState("default");
  const [cameraStyle, setCameraStyle] = useState("default");
  const [cameraDirection, setCameraDirection] = useState("default");
  const [pacing, setPacing] = useState("default");
  const [specialEffects, setSpecialEffects] = useState("default");
  const [promptLength, setPromptLength] = useState("medium");
  const [customElements, setCustomElements] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showApiKeyError, setShowApiKeyError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [images, setImages] = useState([]);

  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [maxRetries, setMaxRetries] = useState(5);
  const defaultTemplate = `Your task is to generate a compelling and descriptive video prompt.
You will receive a set of input parameters. Your goal is to synthesize these parameters into a rich, narrative video prompt string.
The generated prompt should creatively weave together the 'Concept' with the specified 'Style', 'Camera Style', 'Camera Direction', 'Pacing', and 'Special Effects'. The 'CFG Scale' will determine how strictly you adhere to the details within the 'Concept'.
If 'Custom Elements' are provided, integrate them naturally into the scene description.
The 'Desired Prompt Length' (Short, Medium, Long) should guide the level of detail and overall length of the generated prompt string.

### HANDLING THE CFG SCALE:
The CFG (Classifier Free Guidance) scale dictates how closely you must adhere to the *details* mentioned in the 'Concept' field.
**Crucially, the fundamental subject of the 'Concept' (e.g., 'a cat on a roof') MUST ALWAYS be the core of the generated prompt, regardless of the CFG scale value. The CFG scale only modulates the level of descriptive detail.**
- **Low CFG (0 - 0.3):** Focus only on the main subject of the 'Concept'. Be more general and less specific about the fine details (like specific colors, textures, or secondary actions) mentioned in the 'Concept' string. The other parameters (Style, Pacing, etc.) should still be woven in, but the central description will be less granular.
- **Medium CFG (0.4 - 0.7):** This is the default behavior. Interpret the 'Concept' in a balanced way. Include the key details from the 'Concept' while allowing for some creative interpretation to ensure a natural and logical scene.
- **High CFG (0.8 - 1.0):** Adhere very strictly to the 'Concept'. Ensure every detail, adjective, and specific element mentioned in the 'Concept' field is explicitly and accurately represented in the generated prompt string. Be as literal as possible with the concept description.

### IMPORTANT RULES:
- Use vivid and evocative language suitable for guiding a video generation model.
- Do NOT explicitly mention the parameter names (e.g., do not write "Style: Cinematic" or "CFG Scale: 0.9"). Instead, describe how that parameter manifests in the scene.
- If a parameter value is "None" or "Default", generally omit explicit mention of that aspect in the prompt, or describe it in a way that implies a standard/natural approach.
- The input parameter 'model' (e.g., "google/gemini-flash-1.5") is for contextual information and MUST NOT be included or mentioned in the output prompt string.
- Aim for a narrative or descriptive flow that paints a clear picture.
- The output MUST be a JSON object with a single key "prompt" containing the generated video prompt string.

---
### Input Parameters:
- Concept: "{concept}"
- Style: "{style}"
- Camera Style: "{cameraStyle}"
- Camera Direction: "{cameraDirection}"
- Pacing: "{pacing}"
- Special Effects: "{specialEffects}"
- Custom Elements: "{customElements}" (This might be an empty string or not provided)
- Desired Prompt Length: "{promptLength}"
- **CFG Scale: "{cfgScale}" (Range: 0.0 to 1.0)**
- Model: "{model}" (IGNORE THIS in the output prompt)
- Additional context may be provided by accompanying images (though not directly passed as a parameter here, keep in mind that visual descriptions are key).

### Example of how to think about integration:
Instead of: "A futuristic city at dusk. Style is Simple. Camera is Gimbal smoothness. Pacing is Slow burn. Effects are holographic."
Aim for: "A futuristic city glows softly at dusk, captured with smooth gimbal movements and a slow burn pacing, enhanced by a subtle holographic overlays."

### Return the result as a JSON object.
Example Output Format:
{
  "prompt": "A detailed and engaging video prompt string describing the scene based on the integrated parameters..."
}`;
  const [promptTemplate, setPromptTemplate] = useState(defaultTemplate);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('cineprompt_api_key');
    const savedMaxRetries = localStorage.getItem('cineprompt_max_retries');
    const savedTemplate = localStorage.getItem("cineprompt_template");

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedMaxRetries) setMaxRetries(parseInt(savedMaxRetries));
    if (savedTemplate) setPromptTemplate(savedTemplate);
    else setPromptTemplate(defaultTemplate);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('cineprompt_api_key', apiKey);
      setShowApiKeyError(false); // Hide error when API key is set
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('cineprompt_max_retries', maxRetries.toString());
  }, [maxRetries]);

  useEffect(() => {
    localStorage.setItem("cineprompt_template", promptTemplate);
  }, [promptTemplate]);

  const handleDeleteApiKey = () => {
    setApiKey("");
    localStorage.removeItem('cineprompt_api_key');
    setShowApiKeyError(false); // Hide error when deleting key
    setGeneratedPrompt(""); // Clear any generated prompt
    toast({
      title: "API Key Deleted",
      description: "Your API key has been removed.",
    });
  };

  const handleClearAllData = () => {
    // Clear localStorage
    localStorage.removeItem("cineprompt_api_key");
    localStorage.removeItem("cineprompt_max_retries");
    localStorage.removeItem("cineprompt_template");

    // Reset state
    setApiKey("");
    setMaxRetries(5);
    setPromptTemplate(defaultTemplate);
    setGeneratedPrompt("");
    setShowApiKeyError(false);

    toast({
      title: "Data Cleared",
      description: "All application data has been cleared from your browser.",
    });
  };

  const models = [
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-flash-preview", label: "Gemini 2.5 Flash Preview 04-17" },
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite Preview 06-17" },
  ];

  const styles = [
    { value: "default", label: "Default" },
    { value: "minimalist", label: "Minimalist" },
    { value: "simple", label: "Simple" },
    { value: "detailed", label: "Detailed" },
    { value: "descriptive", label: "Descriptive" },
    { value: "dynamic", label: "Dynamic" },
    { value: "cinematic", label: "Cinematic" },
    { value: "documentary", label: "Documentary" },
    { value: "animation", label: "Animation" },
    { value: "action", label: "Action" },
    { value: "experimental", label: "Experimental" },
  ];

  const cameraStyles = [
    { value: "default", label: "Default" },
    { value: "none", label: "None" },
    { value: "steadicam", label: "Steadicam flow" },
    { value: "drone", label: "Drone aerials" },
    { value: "handheld", label: "Handheld urgency" },
    { value: "crane", label: "Crane elegance" },
    { value: "dolly", label: "Dolly precision" },
    { value: "vr", label: "VR 360" },
    { value: "multi-angle", label: "Multi-angle rig" },
    { value: "static", label: "Static tripod" },
    { value: "gimbal", label: "Gimbal smoothness" },
  ];

  const cameraDirections = [
    { value: "default", label: "Default" },
    { value: "none", label: "None" },
    { value: "zoom-in", label: "Zoom in" },
    { value: "zoom-out", label: "Zoom out" },
    { value: "pan-left", label: "Pan left" },
    { value: "pan-right", label: "Pan right" },
    { value: "tilt-up", label: "Tilt up" },
    { value: "tilt-down", label: "Tilt down" },
    { value: "orbital", label: "Orbital rotation" },
    { value: "push-in", label: "Push in" },
    { value: "pull-out", label: "Pull out" },
  ];

  const pacingOptions = [
    { value: "default", label: "Default" },
    { value: "none", label: "None" },
    { value: "slow-burn", label: "Slow burn" },
    { value: "rhythmic", label: "Rhythmic pulse" },
    { value: "frantic", label: "Frantic energy" },
    { value: "ebb-flow", label: "Ebb and flow" },
    { value: "hypnotic", label: "Hypnotic drift" },
    { value: "time-lapse", label: "Time-lapse rush" },
    { value: "stop-motion", label: "Stop-motion staccato" },
    { value: "gradual", label: "Gradual build" },
    { value: "quick-cut", label: "Quick cut rhythm" },
  ];

  const specialEffectsOptions = [
    { value: "default", label: "Default" },
    { value: "none", label: "None" },
    { value: "practical", label: "Practical effects" },
    { value: "cgi", label: "CGI enhancement" },
    { value: "analog", label: "Analog glitches" },
    { value: "light-painting", label: "Light painting" },
    { value: "projection", label: "Projection mapping" },
    { value: "nanosecond", label: "Nanosecond exposures" },
    { value: "double", label: "Double exposure" },
    { value: "smoke", label: "Smoke diffusion" },
    { value: "lens-flare", label: "Lens flare artistry" },
  ];

  const promptLengths = [
    { value: "short", label: "Short" },
    { value: "medium", label: "Medium" },
    { value: "long", label: "Long" },
    { value: "default", label: "Default" },
  ];

  const generatePrompt = async () => {
    // First check if API key is provided
    if (!apiKey.trim()) {
      setShowApiKeyError(true);
      setGeneratedPrompt(""); // Clear any previous prompt
      return;
    }

    // Hide API key error if it was showing
    setShowApiKeyError(false);

    if (!concept.trim()) {
      toast({
        title: "Error",
        description: "Please enter a concept first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Prepare the prompt template with actual values
        const filledTemplate = promptTemplate
          .replace(/\{concept\}/g, concept)
          .replace(/\{style\}/g, style)
          .replace(/\{cameraStyle\}/g, cameraStyle)
          .replace(/\{cameraDirection\}/g, cameraDirection)
          .replace(/\{pacing\}/g, pacing)
          .replace(/\{specialEffects\}/g, specialEffects)
          .replace(/\{customElements\}/g, customElements || "")
          .replace(/\{promptLength\}/g, promptLength)
          .replace(/\{cfgScale\}/g, cfgScale[0].toString())
          .replace(/\{model\}/g, model);

        const parts = [];
        images.forEach((img) => {
          parts.push({
            inlineData: {
              mimeType: img.mimeType,
              data: img.data
            }
          });
        });
        parts.push({ text: filledTemplate });

        // Make API call to Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: parts
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || `API Error: ${response.status} ${response.statusText}`;
          
          // Check if it's a retryable error (429, 5xx)
          if (response.status === 429 || response.status >= 500) {
            lastError = new Error(errorMessage);
            if (attempt < maxRetries) {
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
              continue;
            }
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          const generatedText = data.candidates[0].content.parts[0].text;
          
          if (!generatedText || generatedText.trim() === "") {
            throw new Error("Empty response from API");
          }
          
          // Try to parse JSON response
          try {
            const parsedResponse = JSON.parse(generatedText);
            if (parsedResponse.prompt && parsedResponse.prompt.trim()) {
              setGeneratedPrompt(parsedResponse.prompt.trim());
            } else {
              // If no prompt field or it's empty, use the whole response
              setGeneratedPrompt(generatedText.trim());
            }
          } catch (parseError) {
            // If not JSON, use the text as is
            setGeneratedPrompt(generatedText.trim());
          }

          toast({
            title: "Success",
            description: attempt > 1 ? `Video prompt generated successfully after ${attempt} attempts!` : "Video prompt generated successfully!",
          });
          
          setIsGenerating(false);
          return; // Success, exit the retry loop
        } else {
          throw new Error("Invalid response structure from API");
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error occurred");
        
        // If it's the last attempt or not a retryable error, break
        if (attempt === maxRetries || (error instanceof Error && !error.message.includes("429") && !error.message.includes("5"))) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }
    }

    // If we get here, all retries failed
    console.error("Error generating prompt after", maxRetries, "attempts:", lastError);
    toast({
      title: "Generation Error",
      description: `Failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`,
      variant: "destructive",
    });
    setGeneratedPrompt("");
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="CinePrompt Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">CinePrompt</h1>
              <p className="text-sm text-muted-foreground">Create detailed video prompts, optionally with image references.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Form */}
        <Card className="p-6 space-y-6">
          <CardContent className="p-0 space-y-6">
            {/* Input Concept and Model Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="concept">Input Concept</Label>
                <Textarea
                  id="concept"
                  placeholder="e.g., A futuristic city at dusk"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Select Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cfg Scale */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Cfg Scale</Label>
                <span className="text-sm text-muted-foreground">{cfgScale[0]}</span>
              </div>
              <Slider
                value={cfgScale}
                onValueChange={setCfgScale}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Upload Images */}
            <div className="space-y-2">
              <Label>Upload Images (Optional - Max 10)</Label>
              <Input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const newImages = [];
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      newImages.push({ data: base64, mimeType: file.type });
                      if (newImages.length === files.length) {
                        setImages(newImages.slice(0, 10));
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />
              {images.length > 0 && (
                <div>Uploaded {images.length} images</div>
              )}
            </div>

            {/* Style Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Camera Style</Label>
                <Select value={cameraStyle} onValueChange={setCameraStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cameraStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Camera Direction</Label>
                <Select value={cameraDirection} onValueChange={setCameraDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cameraDirections.map((direction) => (
                      <SelectItem key={direction.value} value={direction.value}>
                        {direction.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pacing</Label>
                <Select value={pacing} onValueChange={setPacing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pacingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Special Effects</Label>
                <Select value={specialEffects} onValueChange={setSpecialEffects}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {specialEffectsOptions.map((effect) => (
                      <SelectItem key={effect.value} value={effect.value}>
                        {effect.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prompt Length</Label>
                <Select value={promptLength} onValueChange={setPromptLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promptLengths.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Elements */}
            <div className="space-y-2">
              <Label htmlFor="custom">Custom Elements (Optional)</Label>
              <Textarea
                id="custom"
                placeholder="e.g., neon signs, flying cars"
                value={customElements}
                onChange={(e) => setCustomElements(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generatePrompt}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isGenerating ? "Generating..." : "Generate Video Prompt"}
            </Button>

            {/* API Key Error Display */}
            {showApiKeyError && (
              <Alert variant="destructive">
                <AlertDescription className="text-center">
                  <div className="font-medium text-lg">Video Prompt Error</div>
                  <div className="mt-1">Please set your API Key in Settings.</div>
                </AlertDescription>
              </Alert>
            )}

            {/* Generated Prompt Display */}
            {generatedPrompt && generatedPrompt.trim() && (
              <div className="space-y-2">
                <Label>Generated Prompt</Label>
                <div className="p-4 bg-muted rounded-lg border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const blob = new Blob([generatedPrompt], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'generated-prompt.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download as TXT
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigator.share({
                        title: 'Generated Prompt',
                        text: generatedPrompt,
                      });
                    }}
                  >
                    Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Manage your API key, video prompt template, and other options.
                Changes are saved automatically.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Gemini API Key Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Gemini API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your API Key (saved locally)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={handleDeleteApiKey}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Max Retries Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Max Retries on Failure</Label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(parseInt(e.target.value) || 5)}
                    className="w-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of times to retry API calls on network errors or specific server
                    errors (e.g., 429, 5xx).
                  </p>
                </div>
              </div>

              {/* Video Prompt Generation Template Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Video Prompt Generation Template</Label>
                <Textarea
                  value={promptTemplate}
                  onChange={(e) => setPromptTemplate(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter your prompt template here..."
                />
                <Button 
                  variant="outline" 
                  onClick={() => setPromptTemplate(defaultTemplate)}
                >
                  Reset to Default
                </Button>
                <p className="text-sm text-muted-foreground">
                  Use placeholders like {`{concept}`}, {`{style}`}, {`{cfgScale}`}, etc. (Refer to
                  default for all placeholders). This template instructs the LLM.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t flex-col sm:flex-col sm:space-x-0 gap-2">
              <div className="w-full">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Clear All Site Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all
                        CinePrompt data from your browser, including your API key,
                        custom template, and other settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllData}>
                        Yes, clear all data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="w-full text-center">
                <Button
                  variant="link"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-muted-foreground"
                >
                  Privacy Policy & Data Handling
                </Button>
              </div>
              <DialogClose asChild>
                <Button onClick={() => setIsSettingsOpen(false)} className="w-full">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Privacy Policy Dialog */}
        <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Privacy Policy & Data Handling</DialogTitle>
              <DialogDescription>
                Our commitment to your privacy and data security.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  This is a client-side application.
                </h3>
                <p>
                  This means we do not have a server to store your data. We do
                  not collect, see, or store:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Your API Key.</li>
                  <li>Your prompts or generated results.</li>
                  <li>Your uploaded images.</li>
                  <li>Any form of personal analytics or usage data.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Local Storage
                </h3>
                <p>
                  All data handled by CinePrompt is stored in your web browser's{" "}
                  <code>localStorage</code>. This data is sandboxed and cannot
                  be accessed by other websites. While this is secure for
                  client-side storage, you should be aware of its function.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Third-Party Services (Google)
                </h3>
                <p>
                  When you generate a prompt, your input data and API key are
                  sent directly from your browser to the Google Gemini API. Your
                  use of the Gemini API is subject to Google's Privacy Policy
                  and the Google AI API Terms of Service. We do not control how
                  Google uses your data.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Your Rights and Choices
                </h3>
                <p>
                  You have complete control over your data. You can clear your
                  API key and all settings at any time by:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>
                    Using the "Clear All Site Data" button in the application's
                    settings.
                  </li>
                  <li>
                    Clearing your browser's cache and site data for this
                    website.
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};