import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Sprout, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Redirect authenticated users to the page they were trying to access or home
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors: any = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Signup specific validations
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      // Phone validation (Indian format - 10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          // Navigation will be handled by useEffect when user state updates
        }
      } else {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.phone
        );
        if (!error) {
          setIsLogin(true); // Switch to login after successful signup
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">KrishiMarg</h1>
          </div>
          <div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Join KrishiMarg'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to your smart farming dashboard' 
                : 'Create your account for smart crop advisory'
              }
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login" 
                onClick={() => setIsLogin(true)}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                onClick={() => setIsLogin(false)}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Signup Fields */}
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me - Only for Login */}
              {isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white py-6"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>

              {/* OTP Placeholder */}
              {!isLogin && (
                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full rounded-lg border-primary text-primary hover:bg-primary/5"
                    disabled
                  >
                    Sign Up with Phone OTP (Coming Soon)
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Twilio integration will be added soon for phone verification
                  </p>
                </div>
              )}
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;