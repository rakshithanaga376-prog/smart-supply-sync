import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Package, TrendingUp, TrendingDown, AlertTriangle, Eye, Plus, Minus, Package2, MapPin, Calendar, Edit, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddComponentDialog } from '@/components/AddComponentDialog';

const Components: React.FC = () => {
  const { components, updateComponent } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const { toast } = useToast();

  const categories = ['All', ...new Set(components.map(c => c.category))];
  const statuses = ['All', 'Critical', 'Low Stock', 'Optimal', 'Overstocked'];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || component.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || component.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStockUpdate = (componentId: string, newStock: number) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    let newStatus = component.status;
    const optimalStock = component.optimalStock;
    
    if (newStock <= optimalStock * 0.1) {
      newStatus = 'Critical';
    } else if (newStock <= optimalStock * 0.3) {
      newStatus = 'Low Stock';
    } else if (newStock > optimalStock * 1.2) {
      newStatus = 'Overstocked';
    } else {
      newStatus = 'Optimal';
    }

    updateComponent(componentId, { currentStock: newStock, status: newStatus });
    
    toast({
      title: "Stock Updated",
      description: `${component.name} stock updated to ${newStock} units`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'destructive';
      case 'Low Stock': return 'default';
      case 'Optimal': return 'secondary';
      case 'Overstocked': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'Low Stock': return <TrendingDown className="w-4 h-4 text-warning" />;
      case 'Optimal': return <Package2 className="w-4 h-4 text-success" />;
      case 'Overstocked': return <TrendingUp className="w-4 h-4 text-secondary" />;
      default: return <Package2 className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Increasing': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'Decreasing': return <TrendingDown className="w-4 h-4 text-danger" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Component Management</h1>
          <p className="text-muted-foreground">
            Manage inventory levels, track usage, and monitor component health
          </p>
        </div>
        
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Component
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <Card key={component.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-1">
                    {component.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {component.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      ID: {component.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(component.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stock Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Stock</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => handleStockUpdate(component.id, Math.max(0, component.currentStock - 1))}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-semibold text-lg w-12 text-center">
                        {component.currentStock}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => handleStockUpdate(component.id, component.currentStock + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Unit: {component.unit}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Optimal Level</span>
                    <span className="font-semibold">{component.optimalStock}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Target level
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Stock Level</span>
                  <span>{Math.round((component.currentStock / component.optimalStock) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      component.status === 'Critical' ? 'bg-destructive' :
                      component.status === 'Low Stock' ? 'bg-warning' :
                      component.status === 'Optimal' ? 'bg-success' :
                      'bg-secondary'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (component.currentStock / component.optimalStock) * 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Status and Trend */}
              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor(component.status)} className="text-xs">
                  {component.status}
                </Badge>
                <div className="flex items-center gap-1">
                  {getTrendIcon(component.demandTrend)}
                  <span className="text-xs text-muted-foreground">
                    {component.demandTrend}
                  </span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                  </div>
                  <span className="font-medium">{component.location}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="font-medium">{component.supplier}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Restock:</span>
                  </div>
                  <span className="font-medium">
                    {component.lastRestock.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Cost per Unit:</span>
                  <span className="font-medium">${component.cost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Lead Time:</span>
                  <span className="font-medium">{component.leadTime} days</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Edit Component",
                      description: `Opening edit form for ${component.name}`
                    });
                  }}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Reorder Initiated",
                      description: `Creating purchase order for ${component.name}`
                    });
                  }}
                >
                  Reorder
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No components found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or add new components to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Components;