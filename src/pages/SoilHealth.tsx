import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sprout, Upload, FileText, CheckCircle, AlertCircle, RotateCcw, Save, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SoilAnalysisResult {
  status: 'Good' | 'Needs Improvement' | 'Poor';
  parameters: {
    pH?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    organic_carbon?: number;
    [key: string]: any;
  };
  issues: string[];
  advice: string[];
  language: string;
}

const SoilHealth = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [ocrText, setOcrText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cropType: "",
    soilType: "",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicMatter: "",
    moisture: "",
  });

  const [manualRecommendations, setManualRecommendations] = useState<any>(null);
  const [isManualAnalyzing, setIsManualAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image (JPG, PNG) or PDF file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setOcrText("");
      setAnalysisResult(null);
    }
  };

  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a soil test report first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('language', selectedLanguage);

      const { data, error } = await supabase.functions.invoke('soil-analyze', {
        body: formData,
      });

      if (error) throw error;

      setOcrText(data.ocrText || "");
      setAnalysisResult(data.analysis);
      
      toast({
        title: "Analysis complete",
        description: "Your soil report has been analyzed successfully.",
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your soil report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!analysisResult || !ocrText) {
      toast({
        title: "No data to save",
        description: "Please analyze a soil report first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your results.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('soil_reports')
        .insert({
          user_id: user.id,
          ocr_text: ocrText,
          analysis: analysisResult as any,
          language: selectedLanguage,
        });

      if (error) throw error;

      toast({
        title: "Report saved",
        description: "Your soil analysis has been saved to your profile.",
      });

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReAnalyze = () => {
    setSelectedFile(null);
    setOcrText("");
    setAnalysisResult(null);
    const fileInput = document.getElementById('soil-report-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsManualAnalyzing(true);
    
    setTimeout(() => {
      setManualRecommendations({
        soilHealth: "Good",
        healthScore: 78,
        recommendations: [
          "Add 50kg of NPK (10:26:26) fertilizer per acre",
          "Apply 2 tons of organic compost to improve soil structure",
          "Consider lime application to adjust pH to optimal range",
        ],
        nutrients: {
          nitrogen: { level: "Adequate", recommendation: "Maintain current levels" },
          phosphorus: { level: "Low", recommendation: "Increase phosphorus application" },
          potassium: { level: "High", recommendation: "Reduce potassium inputs" },
        }
      });
      setIsManualAnalyzing(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-600 bg-green-50 border-green-200';
      case 'Needs Improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Soil Health Analysis
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your soil test report or enter data manually for personalized recommendations
          </p>
        </div>

        <Card className="card-hover mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-6 w-6 text-primary" />
              <span>Upload Soil Test Report</span>
            </CardTitle>
            <CardDescription>
              Upload an image or PDF of your soil test report for automated analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soil-report-upload">Soil Test Report</Label>
                <Input
                  id="soil-report-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: JPG, PNG, PDF (Max 10MB)
                </p>
              </div>

              <div>
                <Label htmlFor="language-select">Output Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="Marathi">मराठी (Marathi)</SelectItem>
                    <SelectItem value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedFile && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleAnalyzeReport}
                disabled={!selectedFile || isAnalyzing}
                className="btn-hero"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Report"}
              </Button>

              {(ocrText || analysisResult) && (
                <Button 
                  onClick={handleReAnalyze}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Re-analyze</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {(ocrText || analysisResult) && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {ocrText && (
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <span>Extracted Text</span>
                  </CardTitle>
                  <CardDescription>
                    Raw text extracted from your soil report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={ocrText}
                    readOnly
                    className="min-h-[200px] text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-success" />
                    <span>Analysis Results</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered soil analysis and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className={`p-4 rounded-lg border-2 ${getStatusColor(analysisResult.status)}`}>
                    <h3 className="text-lg font-semibold mb-2">Soil Health Status</h3>
                    <div className="text-2xl font-bold">
                      {analysisResult.status}
                    </div>
                  </div>

                  {Object.keys(analysisResult.parameters).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">Detected Parameters</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(analysisResult.parameters).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-muted rounded">
                            <span className="capitalize text-sm">{key.replace('_', ' ')}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.issues.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <span>Identified Issues</span>
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.issues.map((issue, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.advice.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Recommendations</span>
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.advice.map((advice, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{advice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleSaveToProfile}
                    disabled={isSaving}
                    className="w-full btn-hero flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save to Profile"}</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sprout className="h-6 w-6 text-primary" />
                <span>Manual Soil Analysis</span>
              </CardTitle>
              <CardDescription>
                Enter your soil test results and crop information manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select onValueChange={(value) => handleInputChange("cropType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select onValueChange={(value) => handleInputChange("soilType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ph">Soil pH</Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      placeholder="6.5"
                      value={formData.ph}
                      onChange={(e) => handleInputChange("ph", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="moisture">Moisture (%)</Label>
                    <Input
                      id="moisture"
                      type="number"
                      placeholder="25"
                      value={formData.moisture}
                      onChange={(e) => handleInputChange("moisture", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Nutrient Levels (ppm)</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                      <Input
                        id="nitrogen"
                        type="number"
                        placeholder="150"
                        value={formData.nitrogen}
                        onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                      <Input
                        id="phosphorus"
                        type="number"
                        placeholder="25"
                        value={formData.phosphorus}
                        onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="potassium">Potassium (K)</Label>
                      <Input
                        id="potassium"
                        type="number"
                        placeholder="200"
                        value={formData.potassium}
                        onChange={(e) => handleInputChange("potassium", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                  <Input
                    id="organicMatter"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={formData.organicMatter}
                    onChange={(e) => handleInputChange("organicMatter", e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-hero"
                  disabled={isManualAnalyzing}
                >
                  {isManualAnalyzing ? "Analyzing..." : "Analyze Manually"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-success" />
                <span>Manual Analysis Results</span>
              </CardTitle>
              <CardDescription>
                Results from manual data entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!manualRecommendations ? (
                <div className="text-center py-8 text-muted-foreground">
                  Complete the manual form to see analysis results
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Soil Health Score</h3>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {manualRecommendations.healthScore}/100
                    </div>
                    <p className="text-muted-foreground">{manualRecommendations.soilHealth}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Nutrient Status</h4>
                    <div className="space-y-3">
                      {Object.entries(manualRecommendations.nutrients).map(([nutrient, data]: [string, any]) => (
                        <div key={nutrient} className="flex items-center justify-between p-3 bg-muted rounded">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="capitalize">{nutrient}</span>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              data.level === "High" ? "text-success" :
                              data.level === "Low" ? "text-warning" : "text-primary"
                            }`}>
                              {data.level}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Recommendations</h4>
                    <div className="space-y-2">
                      {manualRecommendations.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
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
      </div>
    </div>
  );
};

export default SoilHealth;
