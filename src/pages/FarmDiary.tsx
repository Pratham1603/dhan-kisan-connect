import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Sprout,
  Bug,
  Droplets,
  TrendingUp,
  FileText,
  Image as ImageIcon
} from "lucide-react";

const FarmDiary = () => {
  const [newEntry, setNewEntry] = useState({
    title: "",
    description: "",
    category: "general",
    date: new Date().toISOString().split('T')[0]
  });

  const diaryEntries = [
    {
      id: 1,
      title: "Pest Detection - Early Blight",
      description: "Found early blight symptoms on tomato plants in field A. Applied copper fungicide as recommended.",
      category: "pest",
      date: "2024-01-15",
      image: "/placeholder-crop.jpg"
    },
    {
      id: 2,
      title: "Soil Test Results",
      description: "Soil analysis shows nitrogen deficiency. Applied NPK fertilizer (10:26:26) at 50kg per acre.",
      category: "soil",
      date: "2024-01-10",
      recommendations: ["Increase organic matter", "Monitor pH levels"]
    },
    {
      id: 3,
      title: "Weather Alert Action",
      description: "Heavy rain predicted. Covered seedlings and checked drainage systems.",
      category: "weather",
      date: "2024-01-08",
    },
    {
      id: 4,
      title: "Market Price Check",
      description: "Wheat prices increased to ₹2,450 per quintal. Good time to sell stored produce.",
      category: "market",
      date: "2024-01-05",
      price: "₹2,450/quintal"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pest": return <Bug className="h-4 w-4" />;
      case "soil": return <Sprout className="h-4 w-4" />;
      case "weather": return <Droplets className="h-4 w-4" />;
      case "market": return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "pest": return "bg-red-100 text-red-700";
      case "soil": return "bg-green-100 text-green-700";
      case "weather": return "bg-blue-100 text-blue-700";
      case "market": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add new entry logic here
    console.log("New entry:", newEntry);
    setNewEntry({
      title: "",
      description: "",
      category: "general",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const farmStats = {
    totalEntries: 24,
    thisMonth: 8,
    pestDetections: 5,
    soilTests: 3
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Farm Diary
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your farming activities, results, and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-hover">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{farmStats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{farmStats.thisMonth}</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-4 text-center">
              <Bug className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{farmStats.pestDetections}</div>
              <div className="text-sm text-muted-foreground">Pest Detections</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-4 text-center">
              <Sprout className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{farmStats.soilTests}</div>
              <div className="text-sm text-muted-foreground">Soil Tests</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="entries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entries">Diary Entries</TabsTrigger>
            <TabsTrigger value="add-entry">Add New Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="entries">
            <div className="space-y-6">
              {diaryEntries.map((entry) => (
                <Card key={entry.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          {getCategoryIcon(entry.category)}
                          <span>{entry.title}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      <Badge className={getCategoryColor(entry.category)}>
                        {entry.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{entry.description}</p>
                    
                    {entry.image && (
                      <div className="mb-4">
                        <img 
                          src={entry.image} 
                          alt="Farm activity" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {entry.recommendations && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Recommendations:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {entry.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {entry.price && (
                      <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>{entry.price}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-entry">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-6 w-6 text-primary" />
                  <span>Add New Entry</span>
                </CardTitle>
                <CardDescription>
                  Record your farming activities and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Entry Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Pest Detection on Tomatoes"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEntry.date}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select 
                      className="w-full p-2 border border-input rounded-md"
                      value={newEntry.category}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="general">General</option>
                      <option value="pest">Pest & Disease</option>
                      <option value="soil">Soil Health</option>
                      <option value="weather">Weather</option>
                      <option value="market">Market</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your farming activity, observations, or results..."
                      rows={4}
                      value={newEntry.description}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Add Photo</span>
                    </Button>
                    <Button type="button" variant="outline" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Add Document</span>
                    </Button>
                  </div>

                  <Button type="submit" className="w-full btn-hero">
                    Save Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmDiary;