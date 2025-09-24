import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  Clock,
  Check,
  X,
  Search,
  Filter,
  Bell,
  Package,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RiskAlerts: React.FC = () => {
  const { riskAlerts, resolveAlert, addRiskAlert } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [showResolved, setShowResolved] = useState(false);
  const { toast } = useToast();

  const severities = ['All', 'High', 'Medium', 'Low'];
  const types = ['All', 'Stockout Risk', 'Excess Inventory', 'Anomaly Detection', 'Supplier Delay'];

  const filteredAlerts = riskAlerts.filter(alert => {
    const matchesSearch = alert.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || alert.severity === filterSeverity;
    const matchesType = filterType === 'All' || alert.type === filterType;
    const matchesResolved = showResolved || !alert.resolved;
    
    return matchesSearch && matchesSeverity && matchesType && matchesResolved;
  });

  const handleResolveAlert = (alertId: string) => {
    const alert = riskAlerts.find(a => a.id === alertId);
    resolveAlert(alertId);
    toast({
      title: "Alert Resolved",
      description: `Alert for ${alert?.component} has been marked as resolved`
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'Medium': return <Shield className="w-4 h-4 text-warning" />;
      case 'Low': return <AlertCircle className="w-4 h-4 text-info" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Stockout Risk': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'Excess Inventory': return <Package className="w-4 h-4 text-warning" />;
      case 'Supplier Delay': return <Clock className="w-4 h-4 text-warning" />;
      default: return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const unreadAlerts = riskAlerts.filter(a => !a.resolved).length;
  const highPriorityAlerts = riskAlerts.filter(a => !a.resolved && a.severity === 'High').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            AI-powered risk detection and inventory anomaly alerts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-xs">
            {highPriorityAlerts} High Priority
          </Badge>
          <Badge variant="outline" className="text-xs">
            {unreadAlerts} Unresolved
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{unreadAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {highPriorityAlerts} high priority
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Stockout Risks</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">
              {riskAlerts.filter(a => !a.resolved && a.type === 'Stockout Risk').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Components at risk
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Excess Inventory</CardTitle>
            <Package className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">
              {riskAlerts.filter(a => !a.resolved && a.type === 'Excess Inventory').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Overstocked items
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Supplier Issues</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">
              {riskAlerts.filter(a => !a.resolved && a.type === 'Supplier Delay').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery delays
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search alerts by component or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map(severity => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showResolved ? "default" : "outline"}
                onClick={() => setShowResolved(!showResolved)}
                className="whitespace-nowrap"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showResolved ? "Hide Resolved" : "Show Resolved"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`transition-all hover:shadow-md ${
              alert.resolved ? 'opacity-60' : 'border-l-4 border-l-destructive'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mt-1">
                    {getSeverityIcon(alert.severity)}
                    {getTypeIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-semibold">
                        {alert.component}
                      </CardTitle>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <CardDescription className="text-sm text-foreground">
                      {alert.message}
                    </CardDescription>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        {alert.date.toLocaleDateString()} at {alert.date.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!alert.resolved && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolveAlert(alert.id)}
                      className="hover:bg-success hover:text-success-foreground"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            {alert.severity === 'High' && !alert.resolved && (
              <CardContent className="pt-0">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-medium text-destructive">Immediate Action Required</span>
                  </div>
                  <p className="text-sm text-destructive/80">
                    This is a high-priority alert that requires immediate attention to prevent stockout or other critical issues.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="destructive">
                      Create Purchase Order
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Supplier
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
            <p className="text-muted-foreground">
              {showResolved 
                ? "No alerts match your current filters."
                : "No active alerts. Your inventory is running smoothly!"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Simulate alerts for testing and demonstration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addRiskAlert({
                  type: 'Stockout Risk',
                  severity: 'High',
                  component: 'Arduino Uno R4',
                  message: 'Stock will be depleted in 2 days based on current demand patterns',
                  resolved: false
                });
                toast({
                  title: "Alert Generated",
                  description: "New stockout risk alert created"
                });
              }}
            >
              + Stockout Alert
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addRiskAlert({
                  type: 'Supplier Delay',
                  severity: 'Medium',
                  component: 'Ceramic Capacitors',
                  message: 'Supplier reported 5-day delay due to manufacturing issues',
                  resolved: false
                });
                toast({
                  title: "Alert Generated",
                  description: "New supplier delay alert created"
                });
              }}
            >
              + Supplier Delay
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addRiskAlert({
                  type: 'Anomaly Detection',
                  severity: 'Medium',
                  component: 'LED Arrays',
                  message: 'Unusual demand spike detected - 300% increase in usage',
                  resolved: false
                });
                toast({
                  title: "Alert Generated",
                  description: "New anomaly detection alert created"
                });
              }}
            >
              + Anomaly Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAlerts;