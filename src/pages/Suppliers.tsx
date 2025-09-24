import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Suppliers: React.FC = () => {
  const { suppliers } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.components.some(comp => comp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'secondary';
      case 'Inactive': return 'destructive';
      case 'Under Review': return 'default';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Inactive': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'Under Review': return <Clock className="w-4 h-4 text-warning" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-warning text-warning' 
            : i < rating 
              ? 'fill-warning/50 text-warning' 
              : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-success';
    if (percentage >= 85) return 'text-warning';
    return 'text-destructive';
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
  const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const avgOnTime = suppliers.reduce((sum, s) => sum + s.onTimeDelivery, 0) / suppliers.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground">
            Track supplier performance, ratings, and delivery metrics
          </p>
        </div>
        
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Supplier
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              {activeSuppliers} active suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {getRatingStars(avgRating)}
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{Math.round(avgOnTime)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">
              {(100 - suppliers.reduce((sum, s) => sum + s.defectRate, 0) / suppliers.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average quality rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, location, or component type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {supplier.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(supplier.status)}
                        <Badge variant={getStatusColor(supplier.status)} className="text-xs">
                          {supplier.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex">
                      {getRatingStars(supplier.rating)}
                    </div>
                    <span className="text-sm font-medium ml-1">{supplier.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Overall Rating</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{supplier.leadTime} days lead time</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">On-Time Delivery</span>
                    <span className={`text-sm font-bold ${getPerformanceColor(supplier.onTimeDelivery)}`}>
                      {supplier.onTimeDelivery}%
                    </span>
                  </div>
                  <Progress value={supplier.onTimeDelivery} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className={`text-sm font-bold ${getPerformanceColor(100 - supplier.defectRate)}`}>
                      {(100 - supplier.defectRate).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={100 - supplier.defectRate} className="h-2" />
                </div>
              </div>

              {/* Components Supplied */}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Components Supplied
                </p>
                <div className="flex flex-wrap gap-1">
                  {supplier.components.map((component, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {component}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{supplier.leadTime}</p>
                  <p className="text-xs text-muted-foreground">Lead Days</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{supplier.onTimeDelivery}%</p>
                  <p className="text-xs text-muted-foreground">On-Time</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-warning">{supplier.defectRate}%</p>
                  <p className="text-xs text-muted-foreground">Defect Rate</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Supplier Details",
                      description: `Opening detailed view for ${supplier.name}`
                    });
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Edit Supplier",
                      description: `Opening edit form for ${supplier.name}`
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
                      title: "Contact Supplier",
                      description: `Initiating contact with ${supplier.name}`
                    });
                  }}
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Contact
                </Button>
              </div>

              {/* Performance Indicator */}
              {supplier.onTimeDelivery >= 95 && supplier.defectRate <= 1 && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">Preferred Supplier</span>
                  </div>
                  <p className="text-xs text-success/80 mt-1">
                    Excellent performance metrics qualify this supplier as preferred partner
                  </p>
                </div>
              )}

              {supplier.onTimeDelivery < 80 || supplier.defectRate > 2 && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Performance Review Needed</span>
                  </div>
                  <p className="text-xs text-warning/80 mt-1">
                    Below-average metrics require performance discussion
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or add new suppliers to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Suppliers;