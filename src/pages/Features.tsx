import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DiagnosisResult from "@/components/DiagnosisResult";
import { 
  Bug, 
  Sprout, 
  Camera, 
  Upload, 
  AlertTriangle,
  Leaf,
  Calendar,
  Beaker,
  BarChart3,
  Lightbulb
} from "lucide-react";

const Features = () => {
  const [activeTab, setActiveTab] = useState("pest-detection");
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDiagnosis = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setDiagnosisResult({
        disease: "Early Blight (Alternaria solani)",
        confidence: 87,
        severity: "Moderate",
        treatment: "Apply copper-based fungicide immediately. Remove affected leaves and improve air circulation around plants.",
        prevention: "Ensure proper spacing between plants, avoid overhead watering, and rotate crops annually. Apply preventive fungicide during humid conditions.",
        symptoms: ["Brown spots with concentric rings", "Yellowing leaves", "Leaf drop"],
        organicTreatment: "Spray with neem oil solution (2-3ml per liter water) every 7 days. Use baking soda spray (1 tsp per liter) as preventive measure.",
        timeToRecover: "7-14 days with proper treatment"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleSaveToDiary = () => {
    // Implement save to diary logic
    alert("Diagnosis saved to Farm Diary!");
  };

  const handleNewDiagnosis = () => {
    setDiagnosisResult(null);
  };

  const pestData = [
    {
      name: "Aphids",
      season: "Spring-Summer",
      symptoms: "Small green/black insects on leaves",
      treatment: "Neem oil spray, ladybugs"
    },
    {
      name: "Leaf Rust",
      season: "Monsoon",
      symptoms: "Brown/orange spots on leaves",
      treatment: "Copper fungicide, proper drainage"
    },
    {
      name: "Whitefly",
      season: "Year-round",
      symptoms: "White flying insects, yellowing leaves",
      treatment: "Yellow sticky traps, neem oil"
    },
    {
      name: "Blight",
      season: "Rainy season",
      symptoms: "Dark spots, wilting leaves",
      treatment: "Remove affected parts, fungicide spray"
    }
  ];

  const organicRecipes = [
    {
      name: "Neem Oil Spray",
      ingredients: "Neem oil, water, mild soap",
      usage: "Spray every 7-10 days in evening",
      benefits: "Natural pesticide, safe for beneficial insects"
    },
    {
      name: "Cow Urine Solution",
      ingredients: "Fresh cow urine, water (1:10 ratio)",
      usage: "Apply during early morning",
      benefits: "Natural fertilizer and pest repellent"
    },
    {
      name: "Garlic-Chili Spray",
      ingredients: "Garlic, green chili, water",
      usage: "Spray on affected areas",
      benefits: "Repels aphids and small insects"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Smart Farming Features
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Advanced agricultural tools powered by AI to help you make informed farming decisions
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pest-detection" className="flex items-center space-x-2">
                <Bug className="h-4 w-4" />
                <span>Pest & Disease Detection</span>
              </TabsTrigger>
              <TabsTrigger value="soil-health" className="flex items-center space-x-2">
                <Sprout className="h-4 w-4" />
                <span>Soil Health Analysis</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Pest & Disease Detection Tab */}
          <TabsContent value="pest-detection">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Image Upload Component */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="h-6 w-6 text-primary" />
                      <span>Image Upload Diagnosis</span>
                    </CardTitle>
                    <CardDescription>
                      Take or upload a photo of affected plant parts for AI-powered diagnosis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Click to upload or drag and drop your plant image
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supported formats: JPG, PNG, HEIC (Max: 10MB)
                      </p>
                      <Button className="bg-primary hover:bg-primary/90">
                        Choose File
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Photo Guidelines:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Take clear, well-lit photos</li>
                        <li>• Focus on affected areas</li>
                        <li>• Include both healthy and affected parts</li>
                        <li>• Capture multiple angles if possible</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Symptom Description Component */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                      <span>Manual Diagnosis</span>
                    </CardTitle>
                    <CardDescription>
                      Describe symptoms for expert recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Crop</label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Rice</option>
                        <option>Wheat</option>
                        <option>Maize</option>
                        <option>Soybean</option>
                        <option>Cotton</option>
                        <option>Sugarcane</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Problem Description</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg h-32"
                        placeholder="Describe what you're seeing on your plants (e.g., yellow spots on leaves, wilting, insects present, etc.)"
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleDiagnosis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? "Analyzing..." : "Get Diagnosis"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Diagnosis Results */}
            <DiagnosisResult
              result={diagnosisResult}
              onSaveToDiary={handleSaveToDiary}
              onNewDiagnosis={handleNewDiagnosis}
            />

            {/* Common Pests Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Common Pests & Seasonal Occurrence</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pestData.map((pest, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Bug className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{pest.name}</h3>
                      </div>
                      <Badge variant="secondary" className="mb-2">
                        {pest.season}
                      </Badge>
                      <p className="text-sm text-gray-600 mb-2">{pest.symptoms}</p>
                      <p className="text-sm font-medium text-primary">{pest.treatment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Organic Pesticide Recipes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Natural Pesticide Recipes</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {organicRecipes.map((recipe, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <span>{recipe.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">Ingredients:</h4>
                          <p className="text-sm text-gray-600">{recipe.ingredients}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Usage:</h4>
                          <p className="text-sm text-gray-600">{recipe.usage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Benefits:</h4>
                          <p className="text-sm text-primary">{recipe.benefits}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Soil Health Analysis Tab */}
          <TabsContent value="soil-health">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Soil Test Upload */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-6 w-6 text-primary" />
                      <span>Upload Soil Test Results</span>
                    </CardTitle>
                    <CardDescription>
                      Upload your lab soil test report for detailed analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Beaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload your soil test report (PDF, JPG, PNG)
                      </p>
                      <Button className="bg-primary hover:bg-primary/90">
                        Upload Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Manual NPK Entry */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-6 w-6 text-primary" />
                      <span>Enter NPK Values</span>
                    </CardTitle>
                    <CardDescription>
                      Manually input your soil test values
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nitrogen (N)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg"
                          placeholder="kg/ha"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phosphorus (P)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg"
                          placeholder="kg/ha"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Potassium (K)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg"
                          placeholder="kg/ha"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">pH Level</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full p-2 border rounded-lg"
                          placeholder="6.0 - 8.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Organic Carbon (%)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full p-2 border rounded-lg"
                          placeholder="0.5 - 2.0"
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Analyze Soil Health
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Soil Health Advisory */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    <span>Fertilizer Recommendations</span>
                  </CardTitle>
                  <CardDescription>
                    Personalized fertilizer advice based on your soil analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Nitrogen (N)</h4>
                      <p className="text-blue-700 text-sm">Current: Low</p>
                      <p className="text-blue-700 text-sm">Recommendation: Apply 120 kg/ha Urea</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Phosphorus (P)</h4>
                      <p className="text-green-700 text-sm">Current: Adequate</p>
                      <p className="text-green-700 text-sm">Recommendation: Apply 60 kg/ha DAP</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Potassium (K)</h4>
                      <p className="text-orange-700 text-sm">Current: High</p>
                      <p className="text-orange-700 text-sm">Recommendation: Reduce K fertilizer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Soil Improvement Tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Soil Health Improvement Tips</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Organic Matter</h3>
                    <p className="text-sm text-gray-600">
                      Add compost and farmyard manure to improve soil structure and water retention.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Crop Rotation</h3>
                    <p className="text-sm text-gray-600">
                      Rotate legume crops to naturally fix nitrogen and break pest cycles.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Cover Crops</h3>
                    <p className="text-sm text-gray-600">
                      Plant cover crops during off-season to prevent soil erosion and add nutrients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Features;