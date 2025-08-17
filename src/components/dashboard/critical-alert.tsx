import type { FC } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import type { ThreatMessage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface CriticalAlertProps {
  alert: ThreatMessage | undefined;
}

const CriticalAlert: FC<CriticalAlertProps> = ({ alert }) => {
  if (!alert) {
    return (
       <Alert className="bg-primary/10 border-primary/50 text-primary-foreground">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">All Clear</AlertTitle>
        <AlertDescription>
          No critical threats detected at this time.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Critical Alert: High-Risk Message Detected!</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-1">
            <span>
              <strong>Source ID:</strong> {alert.senderId}
            </span>
            <span>
              <strong>Detected:</strong> {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
            </span>
            <span className="truncate">
              <strong>Reason:</strong> {alert.reason}
            </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CriticalAlert;
