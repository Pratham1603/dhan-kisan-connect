import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  AlertTriangle,
  Download,
  Eye,
  TrendingUp,
  Bug,
  Sprout,
  Cloud
} from "lucide-react";

const AdminDashboard = () => {
  const stats = {
    totalUsers: 50247,
    activeToday: 3421,
    totalQueries: 125680,
    satisfactionRate: 94.2
  };

  const recentQueries = [
    {
      id: 1,
      farmer: "राजेश कुमार",
      location: "पंजाब",
      query: "मेरे गेहूं की फसल में पत्तियां पीली हो रही हैं",
      category: "pest",
      status: "resolved",
      time: "2 hours ago"
    },
    {
      id: 2,
      farmer: "संतोष पाटिल",
      location: "महाराष्ट्र",
      query: "Soil test results interpretation needed",
      category: "soil",
      status: "pending",
      time: "4 hours ago"
    },
    {
      id: 3,
      farmer: "Harjit Singh",
      location: "Punjab",
      query: "Market rates for sugarcane in nearby mandis",
      category: "market",
      status: "resolved",
      time: "6 hours ago"
    }
  ];

  const categoryStats = [
    { category: "Pest Detection", count: 2547, icon: Bug, color: "text-red-500" },
    { category: "Soil Health", count: 1823, icon: Sprout, color: "text-green-500" },
    { category: "Weather", count: 1456, icon: Cloud, color: "text-blue-500" },
    { category: "Market Prices", count: 967, icon: TrendingUp, color: "text-purple-500" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-success/10 text-success">Resolved</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      case "urgent":
        return <Badge className="bg-destructive/10 text-destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pest": return <Bug className="h-4 w-4 text-red-500" />;
      case "soil": return <Sprout className="h-4 w-4 text-green-500" />;
      case "weather": return <Cloud className="h-4 w-4 text-blue-500" />;
      case "market": return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor farmer queries, analytics, and system performance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Farmers</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.activeToday.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Today</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalQueries.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Queries</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="queries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="queries">Recent Queries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="queries">
            <div className="space-y-6">
              {/* Query Categories */}
              <div className="grid md:grid-cols-4 gap-4">
                {categoryStats.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${item.color}`} />
                          <div>
                            <div className="font-medium text-sm">{item.category}</div>
                            <div className="text-2xl font-bold">{item.count}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Queries */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Recent Farmer Queries</CardTitle>
                  <CardDescription>Latest support requests and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQueries.map((query) => (
                      <div key={query.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-start space-x-3">
                          {getCategoryIcon(query.category)}
                          <div className="flex-1">
                            <div className="font-medium">{query.farmer}</div>
                            <div className="text-sm text-muted-foreground">{query.location}</div>
                            <div className="text-sm mt-1">{query.query}</div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(query.status)}
                          <div className="text-xs text-muted-foreground">{query.time}</div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Query Trends</CardTitle>
                  <CardDescription>Monthly query volume by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: "January", pest: 420, soil: 380, weather: 290, market: 150 },
                      { month: "February", pest: 465, soil: 410, weather: 320, market: 180 },
                      { month: "March", pest: 520, soil: 450, weather: 380, market: 210 },
                    ].map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="font-medium">{data.month}</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Pest Detection</span>
                            <span>{data.pest}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-red-500 rounded-full h-2" style={{ width: `${(data.pest / 600) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>User Satisfaction</CardTitle>
                  <CardDescription>Feedback ratings and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{stats.satisfactionRate}%</div>
                      <div className="text-muted-foreground">Overall Satisfaction</div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { rating: "5 Stars", count: 1247, percentage: 72 },
                        { rating: "4 Stars", count: 342, percentage: 20 },
                        { rating: "3 Stars", count: 89, percentage: 5 },
                        { rating: "2 Stars", count: 34, percentage: 2 },
                        { rating: "1 Star", count: 12, percentage: 1 },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.rating}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-primary rounded-full h-2" style={{ width: `${item.percentage}%` }}></div>
                            </div>
                            <span className="text-sm w-8">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Download detailed analytics and usage reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { title: "Monthly Usage Report", description: "User activity and query statistics", format: "PDF" },
                      { title: "Farmer Feedback Report", description: "Satisfaction ratings and comments", format: "Excel" },
                      { title: "Category Performance", description: "Feature-wise usage analytics", format: "PDF" },
                      { title: "Regional Analysis", description: "State-wise user distribution", format: "Excel" },
                      { title: "Response Time Metrics", description: "Support team performance", format: "PDF" },
                      { title: "User Growth Report", description: "Registration and retention data", format: "Excel" },
                    ].map((report, index) => (
                      <Card key={index} className="card-hover">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{report.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                          <Button size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            Download {report.format}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                    <span>System Alerts</span>
                  </CardTitle>
                  <CardDescription>Important notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <div className="font-medium">High Query Volume</div>
                        <div className="text-sm text-muted-foreground">
                          Pest detection queries increased by 45% in the last 24 hours
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Weather Alert Active</div>
                        <div className="text-sm text-muted-foreground">
                          Monsoon warnings issued for 12 states - expect increased weather queries
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;