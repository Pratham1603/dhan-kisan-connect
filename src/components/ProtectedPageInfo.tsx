import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProtectedPageInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl mb-2">Protected Content</CardTitle>
            <CardDescription>
              This page requires authentication to access. Please log in to continue.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure access required</span>
          </div>
          
          <div className="space-y-2">
            <Link to="/auth">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Sign In / Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectedPageInfo;