import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Component {
  id: string;
  name: string;
  category: 'Resistors' | 'Capacitors' | 'Diodes' | 'ICs' | 'Transistors' | 'Inductors' | 'Connectors' | 'Sensors';
  currentStock: number;
  optimalStock: number;
  unit: string;
  supplier: string;
  leadTime: number; // days
  lastRestock: Date;
  cost: number;
  status: 'Overstocked' | 'Optimal' | 'Low Stock' | 'Critical';
  demandTrend: 'Increasing' | 'Stable' | 'Decreasing';
  location: string;
}

export interface RiskAlert {
  id: string;
  type: 'Stockout Risk' | 'Excess Inventory' | 'Anomaly Detection' | 'Supplier Delay';
  severity: 'High' | 'Medium' | 'Low';
  component: string;
  message: string;
  date: Date;
  resolved: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  onTimeDelivery: number;
  defectRate: number;
  components: string[];
  contact: string;
  location: string;
  leadTime: number;
  status: 'Active' | 'Inactive' | 'Under Review';
}

export interface Settings {
  lowStockThreshold: number;
  criticalStockThreshold: number;
  reorderPointDays: number;
  safetyStockDays: number;
  forecastPeriodMonths: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoReorder: boolean;
  currency: string;
}

interface InventoryContextType {
  components: Component[];
  riskAlerts: RiskAlert[];
  suppliers: Supplier[];
  settings: Settings;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  addComponent: (component: Omit<Component, 'id'>) => void;
  addSupplier: (supplier: any) => void;
  addRiskAlert: (alert: Omit<RiskAlert, 'id' | 'date'>) => void;
  resolveAlert: (id: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  generateForecast: (componentId: string) => Promise<any[]>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

// Mock data
const mockComponents: Component[] = [
  {
    id: '1',
    name: 'Ceramic Capacitor 0.1μF',
    category: 'Capacitors',
    currentStock: 450,
    optimalStock: 500,
    unit: 'pieces',
    supplier: 'TechParts Inc',
    leadTime: 7,
    lastRestock: new Date('2024-01-15'),
    cost: 0.05,
    status: 'Low Stock',
    demandTrend: 'Stable',
    location: 'A1-B2-C3'
  },
  {
    id: '2',
    name: 'Arduino Uno R3',
    category: 'ICs',
    currentStock: 25,
    optimalStock: 50,
    unit: 'pieces',
    supplier: 'ElectroSupply Co',
    leadTime: 14,
    lastRestock: new Date('2024-01-10'),
    cost: 23.50,
    status: 'Critical',
    demandTrend: 'Increasing',
    location: 'B2-C1-D4'
  },
  {
    id: '3',
    name: 'LED Red 5mm',
    category: 'Diodes',
    currentStock: 1200,
    optimalStock: 800,
    unit: 'pieces',
    supplier: 'BrightLED Ltd',
    leadTime: 5,
    lastRestock: new Date('2024-01-20'),
    cost: 0.12,
    status: 'Overstocked',
    demandTrend: 'Decreasing',
    location: 'C3-D2-E1'
  },
  {
    id: '4',
    name: 'Resistor 10kΩ 1/4W',
    category: 'Resistors',
    currentStock: 800,
    optimalStock: 1000,
    unit: 'pieces',
    supplier: 'ResistorWorld',
    leadTime: 3,
    lastRestock: new Date('2024-01-18'),
    cost: 0.03,
    status: 'Low Stock',
    demandTrend: 'Stable',
    location: 'A2-B1-C2'
  },
  {
    id: '5',
    name: 'Temperature Sensor DS18B20',
    category: 'Sensors',
    currentStock: 60,
    optimalStock: 80,
    unit: 'pieces',
    supplier: 'SensorTech',
    leadTime: 10,
    lastRestock: new Date('2024-01-12'),
    cost: 3.25,
    status: 'Low Stock',
    demandTrend: 'Increasing',
    location: 'D1-E2-F3'
  }
];

const mockRiskAlerts: RiskAlert[] = [
  {
    id: '1',
    type: 'Stockout Risk',
    severity: 'High',
    component: 'Arduino Uno R3',
    message: 'Stock will be depleted in 3 days based on current demand',
    date: new Date('2024-01-22'),
    resolved: false
  },
  {
    id: '2',
    type: 'Excess Inventory',
    severity: 'Medium',
    component: 'LED Red 5mm',
    message: 'Inventory is 50% above optimal level',
    date: new Date('2024-01-21'),
    resolved: false
  },
  {
    id: '3',
    type: 'Supplier Delay',
    severity: 'Medium',
    component: 'Ceramic Capacitor 0.1μF',
    message: 'TechParts Inc reported 3-day delay in shipment',
    date: new Date('2024-01-20'),
    resolved: true
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechParts Inc',
    rating: 4.2,
    onTimeDelivery: 92,
    defectRate: 0.5,
    components: ['Capacitors', 'Resistors'],
    contact: 'orders@techparts.com',
    location: 'California, USA',
    leadTime: 7,
    status: 'Active'
  },
  {
    id: '2',
    name: 'ElectroSupply Co',
    rating: 4.7,
    onTimeDelivery: 96,
    defectRate: 0.2,
    components: ['ICs', 'Processors'],
    contact: 'sales@electrosupply.com',
    location: 'Texas, USA',
    leadTime: 14,
    status: 'Active'
  },
  {
    id: '3',
    name: 'BrightLED Ltd',
    rating: 4.0,
    onTimeDelivery: 88,
    defectRate: 1.2,
    components: ['LEDs', 'Displays'],
    contact: 'info@brightled.com',
    location: 'Shenzhen, China',
    leadTime: 5,
    status: 'Under Review'
  }
];

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>(mockComponents);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(mockRiskAlerts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [settings, setSettings] = useState<Settings>({
    lowStockThreshold: 30,
    criticalStockThreshold: 10,
    reorderPointDays: 14,
    safetyStockDays: 7,
    forecastPeriodMonths: 3,
    emailNotifications: true,
    pushNotifications: true,
    autoReorder: false,
    currency: 'USD'
  });

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const addComponent = (component: Omit<Component, 'id'>) => {
    const newComponent: Component = {
      ...component,
      id: Date.now().toString(),
      lastRestock: new Date()
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const addSupplier = (supplier: any) => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      ...supplier,
      defectRate: 0.5,
      leadTime: supplier.leadTime || 7,
      components: [supplier.category || 'General'],
      status: 'Active'
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const addRiskAlert = (alert: Omit<RiskAlert, 'id' | 'date'>) => {
    const newAlert: RiskAlert = {
      ...alert,
      id: Date.now().toString(),
      date: new Date()
    };
    setRiskAlerts(prev => [newAlert, ...prev]);
  };

  const resolveAlert = (id: string) => {
    setRiskAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const generateForecast = async (componentId: string): Promise<any[]> => {
    // Simulate AI forecast generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const component = components.find(c => c.id === componentId);
    if (!component) return [];

    // Generate mock forecast data
    const forecast = [];
    const baseStock = component.currentStock;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const trend = component.demandTrend === 'Increasing' ? -2 : 
                   component.demandTrend === 'Decreasing' ? 1 : -0.5;
      const randomVariation = Math.random() * 10 - 5;
      const predictedStock = Math.max(0, baseStock + (trend * i) + randomVariation);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.round(predictedStock),
        optimal: component.optimalStock,
        safety: component.optimalStock * 0.3
      });
    }
    
    return forecast;
  };

  const value = {
    components,
    riskAlerts,
    suppliers,
    settings,
    updateComponent,
    addComponent,
    addSupplier,
    addRiskAlert,
    resolveAlert,
    updateSettings,
    generateForecast
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};