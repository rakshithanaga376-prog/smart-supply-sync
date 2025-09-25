import React from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Bell, 
  AlertTriangle, 
  X, 
  Package, 
  Clock,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationPanel: React.FC = () => {
  const { riskAlerts, resolveAlert } = useInventory();
  const { toast } = useToast();
  
  const unreadAlerts = riskAlerts.filter(alert => !alert.resolved);
  const recentAlerts = riskAlerts.slice(0, 5);

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId);
    toast({
      title: "Alert Resolved",
      description: "Risk alert has been marked as resolved"
    });
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'high':
        return <Package className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-primary" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="relative hover:bg-accent"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
            >
              {unreadAlerts.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </span>
              {unreadAlerts.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadAlerts.length} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {recentAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="w-8 h-8 text-success mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No notifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All alerts have been resolved
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.resolved 
                          ? 'bg-muted/30 border-border/50' 
                          : 'bg-card border-border'
                      } transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          {getAlertIcon(alert.severity)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium truncate">
                                {alert.component}
                              </p>
                              <Badge 
                                variant={getAlertColor(alert.severity) as any}
                                className="text-xs"
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {!alert.resolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                            onClick={() => handleResolveAlert(alert.id)}
                            title="Resolve alert"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {riskAlerts.length > 5 && (
              <div className="p-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};