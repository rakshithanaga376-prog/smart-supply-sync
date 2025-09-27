import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
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
import { ShoppingCart, Building2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatePODialogProps {
  onCreatePO?: (po: any) => void;
}

export const CreatePODialog: React.FC<CreatePODialogProps> = ({ onCreatePO }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    component: '',
    quantity: '',
    urgency: 'normal',
    expectedDelivery: '',
    notes: '',
    budgetLimit: ''
  });
  const { components, suppliers } = useInventory();
  const { toast } = useToast();

  const lowStockComponents = components.filter(c => c.status === 'Low Stock' || c.status === 'Critical');
  const selectedComponent = components.find(c => c.name === formData.component);
  const selectedSupplier = suppliers.find(s => s.name === formData.supplier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier || !formData.component || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in supplier, component, and quantity",
        variant: "destructive"
      });
      return;
    }

    const newPO = {
      id: `PO-${Date.now()}`,
      ...formData,
      quantity: parseInt(formData.quantity),
      budgetLimit: parseFloat(formData.budgetLimit) || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedCost: selectedComponent ? selectedComponent.cost * parseInt(formData.quantity) : 0
    };

    onCreatePO?.(newPO);
    
    toast({
      title: "Purchase Order Created",
      description: `PO ${newPO.id} has been created for ${formData.quantity} ${formData.component}`,
      variant: "default"
    });

    // Reset form
    setFormData({
      supplier: '',
      component: '',
      quantity: '',
      urgency: 'normal',
      expectedDelivery: '',
      notes: '',
      budgetLimit: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Create PO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Create Purchase Order
          </DialogTitle>
          <DialogDescription>
            Generate a purchase order for component procurement
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplier} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <div>
                          <span className="font-medium">{supplier.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">★{supplier.rating}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSupplier && (
                <div className="text-xs text-muted-foreground">
                  Lead time: {selectedSupplier.leadTime} days | On-time: {selectedSupplier.onTimeDelivery}%
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="component">Component *</Label>
              <Select value={formData.component} onValueChange={(value) => setFormData(prev => ({ ...prev, component: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs text-muted-foreground border-b">Low Stock Items</div>
                  {lowStockComponents.map(component => (
                    <SelectItem key={component.id} value={component.name}>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <div>
                          <span className="font-medium">{component.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{component.currentStock} left</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs text-muted-foreground border-b border-t">All Components</div>
                  {components.filter(c => c.status !== 'Low Stock' && c.status !== 'Critical').map(component => (
                    <SelectItem key={component.id} value={component.name}>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {component.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedComponent && (
                <div className="text-xs text-muted-foreground">
                  Current stock: {selectedComponent.currentStock} | Cost: ${selectedComponent.cost}/unit
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="100"
                required
              />
              {selectedComponent && formData.quantity && (
                <div className="text-xs text-success">
                  Estimated cost: ${(selectedComponent.cost * parseInt(formData.quantity)).toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgency">Priority</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetLimit">Budget Limit</Label>
              <Input
                id="budgetLimit"
                type="number"
                step="0.01"
                value={formData.budgetLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetLimit: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Special instructions, quality requirements, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Create Purchase Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};