import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, TrendingUp, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      toast({
        title: "Login Failed", 
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome!",
        description: "Successfully logged in to Inventory Management System"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-card rounded-full shadow-primary mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            AI Inventory Manager
          </h1>
          <p className="text-primary-foreground/80">
            Smart inventory management with AI-powered insights
          </p>
        </div>

        <Card className="shadow-elevation-3 border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter any email and password to access the demo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@inventory.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Demo Features:
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span>AI Forecasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-warning" />
                  <span>Risk Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-3 h-3 text-secondary" />
                  <span>Stock Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-primary" />
                  <span>Multi-role Access</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-primary-foreground/60 text-sm">
          <p>Try: admin@demo.com, manager@demo.com, or any email</p>
        </div>
      </div>
    </div>
  );
};