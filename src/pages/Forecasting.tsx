import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Calendar,
  Download,
  Loader2,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Forecasting: React.FC = () => {
  const { components, generateForecast } = useInventory();
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<string>('30');
  const { toast } = useToast();

  const handleGenerateForecast = async () => {
    if (!selectedComponent) {
      toast({
        title: "Select Component",
        description: "Please select a component to generate forecast",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const forecast = await generateForecast(selectedComponent);
      setForecastData(forecast);
      
      toast({
        title: "Forecast Generated",
        description: `AI forecast generated for ${components.find(c => c.id === selectedComponent)?.name}`
      });
    } catch (error) {
      toast({
        title: "Forecast Error",
        description: "Failed to generate forecast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  const predictStockout = () => {
    if (!forecastData.length) return null;
    
    const stockoutDate = forecastData.find(d => d.predicted <= d.safety);
    return stockoutDate;
  };

  const calculateReorderPoint = () => {
    if (!selectedComponentData || !forecastData.length) return null;
    
    const avgDailyUsage = selectedComponentData.optimalStock / 30; // Rough estimate
    const leadTimeDays = selectedComponentData.leadTime;
    const safetyStock = selectedComponentData.optimalStock * 0.3;
    
    return Math.round(avgDailyUsage * leadTimeDays + safetyStock);
  };

  const stockoutRisk = predictStockout();
  const reorderPoint = calculateReorderPoint();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Forecasting & Demand Prediction</h1>
          <p className="text-muted-foreground">
            Advanced machine learning models for inventory optimization and demand forecasting
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Forecast Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Generate AI Forecast
          </CardTitle>
          <CardDescription>
            Select a component and forecast period to generate demand predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Component</label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select component to forecast" />
                </SelectTrigger>
                <SelectContent>
                  {components.map(component => (
                    <SelectItem key={component.id} value={component.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{component.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {component.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Forecast Period</label>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateForecast}
              disabled={isLoading || !selectedComponent}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Forecast
                </>
              )}
            </Button>
          </div>

          {selectedComponentData && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Selected Component Details</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Stock:</span>
                  <p className="font-medium">{selectedComponentData.currentStock} {selectedComponentData.unit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Optimal Level:</span>
                  <p className="font-medium">{selectedComponentData.optimalStock} {selectedComponentData.unit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Lead Time:</span>
                  <p className="font-medium">{selectedComponentData.leadTime} days</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trend:</span>
                  <Badge variant="outline">{selectedComponentData.demandTrend}</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forecast Results */}
      {forecastData.length > 0 && (
        <>
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="metric-card-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Reorder Point</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">
                  {reorderPoint} {selectedComponentData?.unit}
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal reorder threshold
                </p>
              </CardContent>
            </Card>

            <Card className="metric-card-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Stockout Risk</CardTitle>
                {stockoutRisk ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-2xl font-bold ${stockoutRisk ? 'text-destructive' : 'text-success'}`}>
                  {stockoutRisk ? 'High' : 'Low'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stockoutRisk 
                    ? `Risk on ${new Date(stockoutRisk.date).toLocaleDateString()}`
                    : 'No immediate risk detected'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="metric-card-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
                <BarChart3 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-success">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  AI model confidence
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Chart */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Demand Forecast & Stock Projection</CardTitle>
              <CardDescription>
                AI-predicted stock levels with safety thresholds and optimal levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  
                  {/* Safety stock area */}
                  <Area
                    type="monotone"
                    dataKey="safety"
                    stackId="1"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.1}
                    name="Safety Level"
                  />
                  
                  {/* Predicted stock line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Predicted Stock"
                  />
                  
                  {/* Optimal level line */}
                  <Line
                    type="monotone"
                    dataKey="optimal"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Optimal Level"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Smart suggestions based on forecast analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockoutRisk && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="font-medium text-destructive">Critical Action Required</span>
                    </div>
                    <p className="text-sm text-destructive/80 mb-3">
                      Stockout predicted for {new Date(stockoutRisk.date).toLocaleDateString()}. 
                      Immediate reordering recommended to prevent supply disruption.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        Create Urgent PO
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact Supplier
                      </Button>
                    </div>
                  </div>
                )}

                {reorderPoint && selectedComponentData && selectedComponentData.currentStock <= reorderPoint && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-warning" />
                      <span className="font-medium text-warning">Reorder Point Reached</span>
                    </div>
                    <p className="text-sm text-warning/80 mb-3">
                      Current stock ({selectedComponentData.currentStock}) has reached the reorder point ({reorderPoint}). 
                      Consider placing an order to maintain optimal stock levels.
                    </p>
                    <Button size="sm" variant="outline">
                      Generate Purchase Order
                    </Button>
                  </div>
                )}

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="font-medium text-primary">Optimization Suggestions</span>
                  </div>
                  <ul className="text-sm text-primary/80 space-y-1">
                    <li>• Consider bulk purchasing to reduce per-unit costs</li>
                    <li>• Monitor seasonal demand patterns for better planning</li>
                    <li>• Set up automated reorder alerts at {reorderPoint} units</li>
                    <li>• Review supplier lead times quarterly for accuracy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What-If Scenario */}
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Analysis</CardTitle>
              <CardDescription>
                Simulate different scenarios to understand their impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Scenario Simulation",
                      description: "Analyzing impact of 20% demand increase"
                    });
                  }}
                >
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm">+20% Demand</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Scenario Simulation",
                      description: "Analyzing impact of supplier delay"
                    });
                  }}
                >
                  <Calendar className="w-5 h-5 text-warning" />
                  <span className="text-sm">Supplier Delay</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Scenario Simulation",
                      description: "Analyzing seasonal demand patterns"
                    });
                  }}
                >
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm">Seasonal Impact</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Getting Started */}
      {forecastData.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Forecasting</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Select a component above and generate AI-powered demand forecasts to optimize your inventory planning and prevent stockouts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">ML Algorithms</h4>
                <p className="text-sm text-muted-foreground">Advanced machine learning models analyze historical data</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <h4 className="font-semibold mb-1">Demand Prediction</h4>
                <p className="text-sm text-muted-foreground">Predict future demand with 94%+ accuracy</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <h4 className="font-semibold mb-1">Optimization</h4>
                <p className="text-sm text-muted-foreground">Optimize stock levels and reduce costs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Forecasting;