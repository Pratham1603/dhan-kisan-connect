import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Image as ImageIcon, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PestDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useLanguage();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        disease: "Early Blight",
        confidence: 87,
        severity: "Moderate",
        treatment: "Apply copper-based fungicide immediately. Remove affected leaves and improve air circulation.",
        prevention: "Ensure proper spacing between plants, avoid overhead watering, and rotate crops annually."
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Pest & Disease Detection
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload or capture an image of your crop to get instant AI-powered diagnosis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-6 w-6 text-primary" />
                <span>Image Upload</span>
              </CardTitle>
              <CardDescription>
                Upload a clear image of the affected plant or leaf
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedImage ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Button variant="outline" className="flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>Upload Image</span>
                        </Button>
                      </label>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span>Take Photo</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPG, PNG, WEBP
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Uploaded crop"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 btn-hero"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-success" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered diagnosis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center py-8 text-muted-foreground">
                  Upload an image to see analysis results
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Detected Issue</h3>
                    <p className="text-2xl font-bold text-primary">{result.disease}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {result.confidence}% | Severity: {result.severity}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                        Immediate Treatment
                      </h4>
                      <p className="text-sm text-muted-foreground">{result.treatment}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                        Prevention Tips
                      </h4>
                      <p className="text-sm text-muted-foreground">{result.prevention}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Save to Farm Diary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 card-hover">
          <CardHeader>
            <CardTitle>Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Clear Images</h4>
                <p className="text-sm text-muted-foreground">Take well-lit, focused photos</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Close-up Shots</h4>
                <p className="text-sm text-muted-foreground">Focus on affected areas</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Multiple Angles</h4>
                <p className="text-sm text-muted-foreground">Upload different perspectives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PestDetection;