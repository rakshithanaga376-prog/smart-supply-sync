import React from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Plus,
  FileText,
  Target,
  ShoppingCart
} from 'lucide-react';

// Mock data for charts
const stockData = [
  { month: 'Jan', current: 850, optimal: 1000, forecast: 880 },
  { month: 'Feb', current: 720, optimal: 1000, forecast: 750 },
  { month: 'Mar', current: 920, optimal: 1000, forecast: 950 },
  { month: 'Apr', current: 680, optimal: 1000, forecast: 700 },
  { month: 'May', current: 1150, optimal: 1000, forecast: 1100 },
  { month: 'Jun', current: 950, optimal: 1000, forecast: 980 }
];

const categoryData = [
  { name: 'Resistors', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Capacitors', value: 25, color: 'hsl(var(--secondary))' },
  { name: 'ICs', value: 20, color: 'hsl(var(--success))' },
  { name: 'Diodes', value: 15, color: 'hsl(var(--warning))' },
  { name: 'Other', value: 5, color: 'hsl(var(--muted))' }
];

const Dashboard: React.FC = () => {
  const { components, riskAlerts, suppliers } = useInventory();

  const totalComponents = components.length;
  const lowStockCount = components.filter(c => c.status === 'Low Stock' || c.status === 'Critical').length;
  const overStockedCount = components.filter(c => c.status === 'Overstocked').length;
  const optimalCount = components.filter(c => c.status === 'Optimal').length;
  const criticalAlerts = riskAlerts.filter(a => !a.resolved && a.severity === 'High').length;

  const totalValue = components.reduce((sum, component) => 
    sum + (component.currentStock * component.cost), 0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time inventory insights and AI-powered analytics
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Forecast Demand
          </Button>
          <Button variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Components</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{totalComponents.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Active: {totalComponents}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Stock Health</CardTitle>
            <div className="flex gap-1">
              <div className="status-dot status-success"></div>
              <div className="status-dot status-warning"></div>
              <div className="status-dot status-danger"></div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{optimalCount}</div>
            <div className="flex gap-3 text-xs mt-2">
              <span className="text-success">Optimal: {optimalCount}</span>
              <span className="text-warning">Low: {lowStockCount}</span>
              <span className="text-danger">Over: {overStockedCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {riskAlerts.filter(a => !a.resolved).length} total unresolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Analysis Chart */}
        <Card className="lg:col-span-2 chart-container">
          <CardHeader>
            <CardTitle>Stock Analysis Trend</CardTitle>
            <CardDescription>
              Current vs Optimal vs AI Forecast levels over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
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
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Current Stock"
                />
                <Line 
                  type="monotone" 
                  dataKey="optimal" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Optimal Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="AI Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Component Categories</CardTitle>
            <CardDescription>
              Distribution by component type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Health Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Health Indicators</CardTitle>
            <CardDescription>
              Real-time component status overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {components.slice(0, 5).map((component) => (
              <div key={component.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`status-dot ${
                    component.status === 'Critical' ? 'status-danger' :
                    component.status === 'Low Stock' ? 'status-warning' :
                    component.status === 'Optimal' ? 'status-success' :
                    'bg-muted-foreground'
                  }`}></div>
                  <div>
                    <p className="font-medium text-sm">{component.name}</p>
                    <p className="text-xs text-muted-foreground">{component.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    component.status === 'Critical' ? 'destructive' :
                    component.status === 'Low Stock' ? 'default' :
                    component.status === 'Optimal' ? 'secondary' :
                    'outline'
                  } className="text-xs">
                    {component.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {component.currentStock}/{component.optimalStock}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
            <CardDescription>
              Performance metrics and ratings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suppliers.slice(0, 3).map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {supplier.components.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">★</span>
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {supplier.onTimeDelivery}% On-Time
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;