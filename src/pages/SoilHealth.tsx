import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Droplets, Thermometer, Zap, CheckCircle } from "lucide-react";

const SoilHealth = () => {
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
  
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setRecommendations({
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
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Soil Health Analysis
          </h1>
          <p className="text-xl text-muted-foreground">
            Get personalized fertilizer recommendations based on your soil conditions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sprout className="h-6 w-6 text-primary" />
                <span>Soil Analysis Form</span>
              </CardTitle>
              <CardDescription>
                Enter your soil test results and crop information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Soil"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-success" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                Personalized recommendations for your soil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!recommendations ? (
                <div className="text-center py-8 text-muted-foreground">
                  Complete the form to see your soil analysis results
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Health Score */}
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Soil Health Score</h3>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {recommendations.healthScore}/100
                    </div>
                    <p className="text-muted-foreground">{recommendations.soilHealth}</p>
                  </div>

                  {/* Nutrient Levels */}
                  <div>
                    <h4 className="font-semibold mb-4">Nutrient Status</h4>
                    <div className="space-y-3">
                      {Object.entries(recommendations.nutrients).map(([nutrient, data]: [string, any]) => (
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

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-4">Recommendations</h4>
                    <div className="space-y-2">
                      {recommendations.recommendations.map((rec: string, index: number) => (
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