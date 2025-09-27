import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInventory } from '@/contexts/InventoryContext';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Mail,
  User,
  Phone,
  Building,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Globe,
  Clock,
  Users,
  BarChart3,
  Zap,
  Moon,
  Sun,
  Monitor,
  Bookmark,
  Copy,
  Play,
  Info,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Palette,
  Lock,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { settings, updateSettings, components } = useInventory();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activePreset, setActivePreset] = useState<string>('custom');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [settingsHistory, setSettingsHistory] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    department: '',
    bio: ''
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30
  });

  // Settings presets
  const settingsPresets = {
    conservative: {
      name: "Conservative",
      description: "Safe thresholds for stable operations",
      lowStockThreshold: 40,
      criticalStockThreshold: 15,
      reorderPointDays: 21,
      safetyStockDays: 10,
      autoReorder: false
    },
    balanced: {
      name: "Balanced",
      description: "Optimal balance of efficiency and safety",
      lowStockThreshold: 30,
      criticalStockThreshold: 10,
      reorderPointDays: 14,
      safetyStockDays: 7,
      autoReorder: false
    },
    aggressive: {
      name: "Aggressive",
      description: "Lean inventory with automated reordering",
      lowStockThreshold: 20,
      criticalStockThreshold: 5,
      reorderPointDays: 7,
      safetyStockDays: 3,
      autoReorder: true
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated`
    });
  };

  const handleProfileSave = () => {
    updateProfile({
      name: profileData.name,
      email: profileData.email
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully"
    });
  };

  const handlePasswordChange = () => {
    if (!securityData.currentPassword || !securityData.newPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in both current and new password",
        variant: "destructive"
      });
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match",
        variant: "destructive"
      });
      return;
    }

    // Simulate password change
    setSecurityData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully"
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
    // Save current settings to history
    setSettingsHistory(prev => [...prev.slice(-4), { ...settings, timestamp: new Date() }]);
    
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
    
    setActivePreset('balanced');
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
      variant: "destructive"
    });
  };

  const applyPreset = (presetKey: string) => {
    const preset = settingsPresets[presetKey as keyof typeof settingsPresets];
    if (!preset) return;

    // Save current settings to history
    setSettingsHistory(prev => [...prev.slice(-4), { ...settings, timestamp: new Date() }]);
    
    Object.entries(preset).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'description') {
        updateSettings({ [key]: value });
      }
    });
    
    setActivePreset(presetKey);
    
    toast({
      title: `${preset.name} Preset Applied`,
      description: preset.description,
      variant: "default"
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `inventory-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Settings Exported",
      description: "Settings have been downloaded as JSON file"
    });
  };

  const testNotifications = () => {
    toast({
      title: "Test Notification",
      description: "This is how notifications will appear in your system"
    });
  };

  // Calculate impact preview
  const getImpactPreview = () => {
    const total = components.length;
    const lowStockCount = components.filter(c => 
      (c.currentStock / c.optimalStock) * 100 <= settings.lowStockThreshold
    ).length;
    const criticalCount = components.filter(c => 
      (c.currentStock / c.optimalStock) * 100 <= settings.criticalStockThreshold
    ).length;
    
    return { total, lowStockCount, criticalCount };
  };

  const impactPreview = getImpactPreview();

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">
            Configure inventory thresholds, notifications, and system preferences
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Hide' : 'Show'} Preview
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Settings Presets */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            Quick Presets
          </CardTitle>
          <CardDescription>
            Apply predefined settings configurations for different business needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(settingsPresets).map(([key, preset]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activePreset === key ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => applyPreset(key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{preset.name}</h4>
                    {activePreset === key && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{preset.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Low Stock:</span>
                      <span className="font-medium">{preset.lowStockThreshold}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical:</span>
                      <span className="font-medium">{preset.criticalStockThreshold}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto Reorder:</span>
                      <span className={`font-medium ${preset.autoReorder ? 'text-success' : 'text-muted-foreground'}`}>
                        {preset.autoReorder ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Preview */}
      {previewMode && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <BarChart3 className="w-5 h-5" />
              Impact Preview
            </CardTitle>
            <CardDescription>
              How current settings affect your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-foreground">{impactPreview.total}</div>
                <div className="text-sm text-muted-foreground">Total Components</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-warning">{impactPreview.lowStockCount}</div>
                <div className="text-sm text-muted-foreground">Low Stock Items</div>
                <div className="text-xs text-warning mt-1">
                  {Math.round((impactPreview.lowStockCount / impactPreview.total) * 100)}% of inventory
                </div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-destructive">{impactPreview.criticalCount}</div>
                <div className="text-sm text-muted-foreground">Critical Items</div>
                <div className="text-xs text-destructive mt-1">
                  {Math.round((impactPreview.criticalCount / impactPreview.total) * 100)}% of inventory
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold (%)</Label>
                  <Badge variant="outline" className="text-xs">
                    {impactPreview.lowStockCount} components affected
                  </Badge>
                </div>
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
                  <Progress value={settings.lowStockThreshold} max={50} className="h-1" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Percentage of optimal stock that triggers low stock alerts
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="criticalStockThreshold">Critical Stock Threshold (%)</Label>
                  <Badge variant="destructive" className="text-xs">
                    {impactPreview.criticalCount} components affected
                  </Badge>
                </div>
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
                  <Progress value={settings.criticalStockThreshold} max={25} className="h-1" />
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
                <div className="flex gap-2">
                  <Input
                    id="reorderPointDays"
                    type="number"
                    min="7"
                    max="60"
                    value={settings.reorderPointDays}
                    onChange={(e) => handleSettingChange('reorderPointDays', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleSettingChange('reorderPointDays', 14)}>
                    Default
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Days of stock to maintain before reordering
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="safetyStockDays">Safety Stock (Days)</Label>
                <div className="flex gap-2">
                  <Input
                    id="safetyStockDays"
                    type="number"
                    min="3"
                    max="30"
                    value={settings.safetyStockDays}
                    onChange={(e) => handleSettingChange('safetyStockDays', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleSettingChange('safetyStockDays', 7)}>
                    Default
                  </Button>
                </div>
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
              <Zap className="w-5 h-5 text-success" />
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">

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
                <div className="flex items-center gap-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                  <Button variant="outline" size="sm" onClick={testNotifications}>
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
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
                <div className="flex items-center gap-2">
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                  <Button variant="outline" size="sm" onClick={testNotifications}>
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Notification Types</h4>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Select All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="stockout" defaultChecked className="rounded" />
                    <Label htmlFor="stockout" className="text-sm">Stockout Alerts</Label>
                  </div>
                  <Badge variant="destructive" className="text-xs">High</Badge>
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reorder" defaultChecked className="rounded" />
                    <Label htmlFor="reorder" className="text-sm">Reorder Notifications</Label>
                  </div>
                  <Badge variant="default" className="text-xs">Medium</Badge>
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="overstock" defaultChecked className="rounded" />
                    <Label htmlFor="overstock" className="text-sm">Overstock Warnings</Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">Low</Badge>
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="supplier" defaultChecked className="rounded" />
                    <Label htmlFor="supplier" className="text-sm">Supplier Updates</Label>
                  </div>
                  <Badge variant="outline" className="text-xs">Info</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Notification Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quiet Hours</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="22">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, '0')}:00</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground self-center">to</span>
                    <Select defaultValue="8">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, '0')}:00</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Weekend Notifications</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.role}</p>
                  <Badge variant="secondary" className="mt-1">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileName">Full Name</Label>
                  <Input
                    id="profileName"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileEmail">Email Address</Label>
                  <Input
                    id="profileEmail"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePhone">Phone Number</Label>
                  <Input
                    id="profilePhone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileCompany">Company</Label>
                  <Input
                    id="profileCompany"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileBio">Bio</Label>
                <Textarea
                  id="profileBio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordChange} variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Receive verification codes via SMS
                    </div>
                  </div>
                  <Switch
                    checked={securityData.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select
                    value={securityData.sessionTimeout.toString()}
                    onValueChange={(value) => setSecurityData(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">

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
                    <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">🇬🇧 British Pound (GBP)</SelectItem>
                    <SelectItem value="JPY">🇯🇵 Japanese Yen (JPY)</SelectItem>
                    <SelectItem value="INR">🇮🇳 Indian Rupee (INR)</SelectItem>
                    <SelectItem value="CAD">🇨🇦 Canadian Dollar (CAD)</SelectItem>
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
                    <SelectItem value="UTC">🌍 UTC</SelectItem>
                    <SelectItem value="EST">🇺🇸 Eastern Time (EST)</SelectItem>
                    <SelectItem value="PST">🇺🇸 Pacific Time (PST)</SelectItem>
                    <SelectItem value="GMT">🇬🇧 Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme Settings
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <CardContent className="p-3 text-center">
                    <Sun className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Light</div>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <CardContent className="p-3 text-center">
                    <Moon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Dark</div>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setTheme('system')}
                >
                  <CardContent className="p-3 text-center">
                    <Monitor className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">System</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Data Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex-1" onClick={exportSettings}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Settings
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Backup Data
                </Button>
                <Button variant="outline" className="flex-1">
                  <Clock className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Preferences
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compactMode">Compact View Mode</Label>
                  <Switch id="compactMode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Enable Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sounds">Sound Effects</Label>
                  <Switch id="sounds" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Advanced Settings
            </CardTitle>
            <CardDescription>
              Advanced configuration options for power users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-destructive">Advanced Settings</span>
              </div>
              <p className="text-sm text-destructive/80">
                These settings can significantly impact system performance and behavior. Modify only if you understand the implications.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Performance Tuning</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cache Duration (minutes)</Label>
                  <Input type="number" defaultValue="30" min="5" max="120" />
                </div>
                <div className="space-y-2">
                  <Label>Batch Size for Operations</Label>
                  <Input type="number" defaultValue="50" min="10" max="500" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">API Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="apiRetries">Auto-retry Failed Requests</Label>
                  <Switch id="apiRetries" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Request Timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" min="5" max="120" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Debug Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="verboseLogging">Verbose Logging</Label>
                  <Switch id="verboseLogging" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="debugMode">Debug Mode</Label>
                  <Switch id="debugMode" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings History */}
        {settingsHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Changes
              </CardTitle>
              <CardDescription>
                History of your recent settings modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settingsHistory.slice(-3).map((historyItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Settings Modified</div>
                      <div className="text-xs text-muted-foreground">
                        {historyItem.timestamp?.toLocaleString()}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </TabsContent>
      </Tabs>

      {/* Current Settings Summary */}
      <Card className="bg-gradient-to-r from-success/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Settings Summary
          </CardTitle>
          <CardDescription>
            Current configuration overview with real-time impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1 p-3 bg-background rounded-lg border">
              <span className="text-muted-foreground">Low Stock Threshold:</span>
              <p className="font-medium text-lg">{settings.lowStockThreshold}%</p>
              <div className="text-xs text-warning">
                {impactPreview.lowStockCount} components affected
              </div>
            </div>
            <div className="space-y-1 p-3 bg-background rounded-lg border">
              <span className="text-muted-foreground">Critical Threshold:</span>
              <p className="font-medium text-lg text-destructive">{settings.criticalStockThreshold}%</p>
              <div className="text-xs text-destructive">
                {impactPreview.criticalCount} components affected
              </div>
            </div>
            <div className="space-y-1 p-3 bg-background rounded-lg border">
              <span className="text-muted-foreground">Reorder Point:</span>
              <p className="font-medium text-lg">{settings.reorderPointDays} days</p>
              <div className="text-xs text-muted-foreground">Lead time buffer</div>
            </div>
            <div className="space-y-1 p-3 bg-background rounded-lg border">
              <span className="text-muted-foreground">Safety Stock:</span>
              <p className="font-medium text-lg">{settings.safetyStockDays} days</p>
              <div className="text-xs text-muted-foreground">Emergency buffer</div>
            </div>
            <div className="space-y-1 p-3 bg-background rounded-lg border">
              <span className="text-muted-foreground">Forecast Period:</span>
              <p className="font-medium text-lg">{settings.forecastPeriodMonths} months</p>
              <div className="text-xs text-muted-foreground">AI prediction span</div>
            </div>
            <div className="space-y-1 p-3 bg-background rounded-lg border">
              <span className="text-muted-foreground">Auto Reorder:</span>
              <div className="flex items-center gap-2">
                <p className={`font-medium text-lg ${settings.autoReorder ? 'text-success' : 'text-muted-foreground'}`}>
                  {settings.autoReorder ? 'Enabled' : 'Disabled'}
                </p>
                {settings.autoReorder && <Zap className="w-4 h-4 text-success" />}
              </div>
              <div className={`text-xs ${settings.autoReorder ? 'text-success' : 'text-muted-foreground'}`}>
                {settings.autoReorder ? 'Fully automated' : 'Manual approval'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;