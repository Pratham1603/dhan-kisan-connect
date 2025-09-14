import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from "lucide-react";

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    rating: "",
    helpful: "",
    feature: "",
    experience: "",
    suggestions: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit feedback logic here
    console.log("Feedback submitted:", feedback);
    setSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🙏</div>
              <h1 className="text-3xl font-bold mb-4 text-gradient">Thank You!</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Your feedback has been submitted successfully. We appreciate your input in helping us improve our services for farmers.
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                className="btn-hero"
              >
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Feedback & Suggestions
          </h1>
          <p className="text-xl text-muted-foreground">
            Help us improve our smart farming platform by sharing your experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span>Share Your Experience</span>
              </CardTitle>
              <CardDescription>
                Your feedback helps us serve farmers better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall Rating */}
                <div>
                  <Label className="text-base font-medium">How would you rate our platform overall?</Label>
                  <RadioGroup 
                    value={feedback.rating} 
                    onValueChange={(value) => handleInputChange("rating", value)}
                    className="flex space-x-1 mt-2"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-1">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="sr-only" />
                        <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                          <Star 
                            className={`h-8 w-8 ${
                              parseInt(feedback.rating) >= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Helpfulness */}
                <div>
                  <Label className="text-base font-medium">Was our platform helpful for your farming needs?</Label>
                  <RadioGroup 
                    value={feedback.helpful} 
                    onValueChange={(value) => handleInputChange("helpful", value)}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="helpful-yes" />
                      <Label htmlFor="helpful-yes" className="flex items-center space-x-1 cursor-pointer">
                        <ThumbsUp className="h-4 w-4 text-success" />
                        <span>Yes, very helpful</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="helpful-no" />
                      <Label htmlFor="helpful-no" className="flex items-center space-x-1 cursor-pointer">
                        <ThumbsDown className="h-4 w-4 text-destructive" />
                        <span>Not very helpful</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Most Useful Feature */}
                <div>
                  <Label htmlFor="feature">Which feature did you find most useful?</Label>
                  <RadioGroup 
                    value={feedback.feature} 
                    onValueChange={(value) => handleInputChange("feature", value)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pest-detection" id="pest-detection" />
                      <Label htmlFor="pest-detection">Pest & Disease Detection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="soil-health" id="soil-health" />
                      <Label htmlFor="soil-health">Soil Health Analysis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weather" id="weather" />
                      <Label htmlFor="weather">Weather Insights</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="market-prices" id="market-prices" />
                      <Label htmlFor="market-prices">Market Prices</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chatbot" id="chatbot" />
                      <Label htmlFor="chatbot">AI Chatbot Support</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Experience Description */}
                <div>
                  <Label htmlFor="experience">Describe your experience using our platform</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your experience, what worked well, what didn't..."
                    rows={3}
                    value={feedback.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <Label htmlFor="suggestions">Suggestions for improvement</Label>
                  <Textarea
                    id="suggestions"
                    placeholder="What features would you like to see? How can we better serve farmers?"
                    rows={3}
                    value={feedback.suggestions}
                    onChange={(e) => handleInputChange("suggestions", e.target.value)}
                  />
                </div>

                {/* Email (Optional) */}
                <div>
                  <Label htmlFor="email">Email (Optional - for follow-up)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@krishimarg.in"
                    value={feedback.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full btn-hero">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Feedback & Info */}
          <div className="space-y-6">
            {/* Quick Feedback */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Quick Feedback</CardTitle>
                <CardDescription>Rate specific features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Pest Detection Accuracy", rating: 4.5 },
                  { name: "Weather Predictions", rating: 4.2 },
                  { name: "Market Price Updates", rating: 4.7 },
                  { name: "User Interface", rating: 4.3 },
                  { name: "Response Time", rating: 4.1 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Need Direct Support?</CardTitle>
                <CardDescription>Get in touch with our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium">Farmer Helpline</h5>
                  <p className="text-sm text-muted-foreground">📞 1800-XXX-FARM (Available 24/7)</p>
                </div>
                
                <div>
                  <h5 className="font-medium">Email Support</h5>
                  <p className="text-sm text-muted-foreground">✉️ support@krishimarg.in</p>
                </div>
                
                <div>
                  <h5 className="font-medium">WhatsApp Support</h5>
                  <p className="text-sm text-muted-foreground">📱 Available in Hindi, Marathi, Punjabi</p>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    💡 Pro Tip: Use our AI chatbot for instant answers to common farming questions!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>What's new in our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">✨ Enhanced Pest Detection</div>
                  <div className="text-muted-foreground">Improved accuracy for 20+ new crop diseases</div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium">🌦️ Extended Weather Forecasts</div>
                  <div className="text-muted-foreground">Now showing 10-day predictions</div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium">📱 Voice Commands</div>
                  <div className="text-muted-foreground">Ask questions using voice in local languages</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;