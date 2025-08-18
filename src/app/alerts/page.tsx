'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldCheck, ShieldAlert, Check } from 'lucide-react';
import { generateInitialMessages } from '@/lib/mock-data';
import type { ThreatMessage } from '@/lib/types';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<ThreatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const highAndMediumAlerts = generateInitialMessages(100).filter(
      (m) => m.threatLevel === 'high' || m.threatLevel === 'medium'
    );
    setAlerts(highAndMediumAlerts);
    setLoading(false);
  }, []);

  const getBadgeVariant = (level: ThreatMessage['threatLevel']) => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getIcon = (level: ThreatMessage['threatLevel']) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <ShieldAlert className="h-4 w-4 text-yellow-400" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-primary" />;
    }
  }

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  }

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Card>
          <CardHeader>
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Active Alerts</h1>
      <Card>
        <CardHeader>
          <CardTitle>High & Medium Priority Alerts</CardTitle>
          <CardDescription>
            These messages have been flagged by the AI for review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Severity</TableHead>
                <TableHead>Source ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length > 0 ? alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge variant={getBadgeVariant(alert.threatLevel)} className="capitalize flex items-center gap-2">
                       {getIcon(alert.threatLevel)} {alert.threatLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{alert.senderId}</TableCell>
                  <TableCell className="max-w-xs truncate">{alert.reason}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(alert.timestamp, 'MMM d, yyyy, h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleResolveAlert(alert.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Resolve
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No active alerts.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;
