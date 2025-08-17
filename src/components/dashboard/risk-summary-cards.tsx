import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ThreatLevel, ThreatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import CriticalAlert from './critical-alert';

interface RiskSummaryCardsProps {
  overallRiskLevel: ThreatLevel;
  stats: {
    total: number;
    high: number;
    medium: number;
  };
  criticalAlert: ThreatMessage | undefined;
}

const RiskSummaryCards: FC<RiskSummaryCardsProps> = ({ overallRiskLevel, stats, criticalAlert }) => {
  const riskConfig = {
    low: {
      Icon: ShieldCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: 'Low',
    },
    medium: {
      Icon: Shield,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      label: 'Medium',
    },
    high: {
      Icon: ShieldAlert,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      label: 'High',
    },
  };

  const { Icon, color, bgColor, label } = riskConfig[overallRiskLevel];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className={cn('flex flex-col justify-between', bgColor)}>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Overall Risk Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Icon className={cn('h-12 w-12', color)} />
            <span className={cn('text-4xl font-bold', color)}>{label}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Events (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">High/Medium Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            <span className="text-destructive">{stats.high}</span> / <span className="text-yellow-400">{stats.medium}</span>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 lg:col-span-1">
        <CriticalAlert alert={criticalAlert} />
      </div>
    </div>
  );
};

export default RiskSummaryCards;
