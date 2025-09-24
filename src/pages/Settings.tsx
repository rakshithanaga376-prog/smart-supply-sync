import React from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useInventory();
  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated`
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "All settings have been saved successfully",
      variant: "default"
    });
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      lowStockThreshold: 30,
      criticalStockThreshold: 10,
      reorderPointDays: 14,
      safetyStockDays: 7,
      forecastPeriodMonths: 3,
      emailNotifications: true,
      pushNotifications: true,
      autoReorder: false,
      currency: 'USD'
    };
    
    Object.entries(defaultSettings).forEach(([key, value]) => {
      updateSettings({ [key]: value });
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
      variant: "destructive"
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">
            Configure inventory thresholds, notifications, and system preferences
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveSettings} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Inventory Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Inventory Thresholds
          </CardTitle>
          <CardDescription>
            Configure stock level thresholds and reorder points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold (%)</Label>
              <div className="space-y-2">
                <Slider
                  id="lowStockThreshold"
                  min={10}
                  max={50}
                  step={5}
                  value={[settings.lowStockThreshold]}
                  onValueChange={([value]) => handleSettingChange('lowStockThreshold', value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>10%</span>
                  <span className="font-medium">{settings.lowStockThreshold}%</span>
                  <span>50%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of optimal stock that triggers low stock alerts
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="criticalStockThreshold">Critical Stock Threshold (%)</Label>
              <div className="space-y-2">
                <Slider
                  id="criticalStockThreshold"
                  min={5}
                  max={25}
                  step={5}
                  value={[settings.criticalStockThreshold]}
                  onValueChange={([value]) => handleSettingChange('criticalStockThreshold', value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5%</span>
                  <span className="font-medium text-destructive">{settings.criticalStockThreshold}%</span>
                  <span>25%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage that triggers critical shortage alerts
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reorderPointDays">Reorder Point (Days)</Label>
              <Input
                id="reorderPointDays"
                type="number"
                min="7"
                max="60"
                value={settings.reorderPointDays}
                onChange={(e) => handleSettingChange('reorderPointDays', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Days of stock to maintain before reordering
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="safetyStockDays">Safety Stock (Days)</Label>
              <Input
                id="safetyStockDays"
                type="number"
                min="3"
                max="30"
                value={settings.safetyStockDays}
                onChange={(e) => handleSettingChange('safetyStockDays', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Additional buffer stock for unexpected demand
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-success" />
            AI & Forecasting Settings
          </CardTitle>
          <CardDescription>
            Configure artificial intelligence and forecasting parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="forecastPeriod">Forecast Period (Months)</Label>
              <Select
                value={settings.forecastPeriodMonths.toString()}
                onValueChange={(value) => handleSettingChange('forecastPeriodMonths', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="2">2 Months</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Default period for AI demand forecasting
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="autoReorder">Automatic Reordering</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable AI-driven automatic purchase orders
                  </p>
                </div>
                <Switch
                  id="autoReorder"
                  checked={settings.autoReorder}
                  onCheckedChange={(checked) => handleSettingChange('autoReorder', checked)}
                />
              </div>
              
              {settings.autoReorder && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Auto-Reorder Enabled</span>
                  </div>
                  <p className="text-xs text-warning/80">
                    System will automatically create purchase orders when stock falls below reorder points
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Manage how and when you receive inventory alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts via email for critical events
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Get real-time push notifications in your browser
                  </p>
                </div>
              </div>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Notification Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="stockout" defaultChecked className="rounded" />
                <Label htmlFor="stockout" className="text-sm">Stockout Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="reorder" defaultChecked className="rounded" />
                <Label htmlFor="reorder" className="text-sm">Reorder Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="overstock" defaultChecked className="rounded" />
                <Label htmlFor="overstock" className="text-sm">Overstock Warnings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="supplier" defaultChecked className="rounded" />
                <Label htmlFor="supplier" className="text-sm">Supplier Updates</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            System Preferences
          </CardTitle>
          <CardDescription>
            General system settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleSettingChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="UTC">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Data Management</h4>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Summary</CardTitle>
          <CardDescription>
            Current configuration overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Low Stock Threshold:</span>
              <p className="font-medium">{settings.lowStockThreshold}%</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Critical Threshold:</span>
              <p className="font-medium text-destructive">{settings.criticalStockThreshold}%</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Reorder Point:</span>
              <p className="font-medium">{settings.reorderPointDays} days</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Safety Stock:</span>
              <p className="font-medium">{settings.safetyStockDays} days</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Forecast Period:</span>
              <p className="font-medium">{settings.forecastPeriodMonths} months</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Auto Reorder:</span>
              <p className={`font-medium ${settings.autoReorder ? 'text-success' : 'text-muted-foreground'}`}>
                {settings.autoReorder ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;