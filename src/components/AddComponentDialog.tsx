import React, { useState } from 'react';
import { useInventory, Component } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddComponentDialogProps {
  onAddComponent?: (component: any) => void;
}

export const AddComponentDialog: React.FC<AddComponentDialogProps> = ({ onAddComponent }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    category: '',
    description: '',
    currentStock: '',
    optimalStock: '',
    unit: 'pieces',
    unitCost: '',
    supplier: '',
    leadTime: '',
    location: '',
    status: 'active'
  });
  const { suppliers, addComponent } = useInventory();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.partNumber || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newComponent = {
      name: formData.name,
      category: formData.category as Component['category'],
      currentStock: parseInt(formData.currentStock) || 0,
      optimalStock: parseInt(formData.optimalStock) || 100,
      unit: formData.unit,
      supplier: formData.supplier,
      leadTime: parseInt(formData.leadTime) || 7,
      cost: parseFloat(formData.unitCost) || 0,
      status: parseInt(formData.currentStock) || 0 > (parseInt(formData.optimalStock) || 100) * 0.3 ? 'Optimal' as const : 'Low Stock' as const,
      demandTrend: 'Stable' as const,
      location: formData.location,
      lastRestock: new Date()
    };

    addComponent(newComponent);
    onAddComponent?.(newComponent);
    
    toast({
      title: "Component Added",
      description: `${formData.name} has been added to your inventory`
    });

    // Reset form
    setFormData({
      name: '',
      partNumber: '',
      category: '',
      description: '',
      currentStock: '',
      optimalStock: '',
      unit: 'pieces',
      unitCost: '',
      supplier: '',
      leadTime: '',
      location: '',
      status: 'active'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Component
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Add New Component
          </DialogTitle>
          <DialogDescription>
            Enter the component details to add it to your inventory
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Component Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Resistor 100Ω"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partNumber">Part Number *</Label>
              <Input
                id="partNumber"
                value={formData.partNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, partNumber: e.target.value }))}
                placeholder="RES-100-001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the component"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStock: e.target.value }))}
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optimalStock">Optimal Stock</Label>
              <Input
                id="optimalStock"
                type="number"
                value={formData.optimalStock}
                onChange={(e) => setFormData(prev => ({ ...prev, optimalStock: e.target.value }))}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                  <SelectItem value="sets">Sets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData(prev => ({ ...prev, unitCost: e.target.value }))}
                placeholder="2.50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead Time (days)</Label>
              <Input
                id="leadTime"
                type="number"
                value={formData.leadTime}
                onChange={(e) => setFormData(prev => ({ ...prev, leadTime: e.target.value }))}
                placeholder="7"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={formData.supplier} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Warehouse A-1-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Add Component
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};