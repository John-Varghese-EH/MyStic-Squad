'use client';

import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ThreatMessage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface LiveActivityFeedProps {
  messages: ThreatMessage[];
}

const LiveActivityFeed: FC<LiveActivityFeedProps> = ({ messages }) => {
  const getBadgeVariant = (level: ThreatMessage['threatLevel']) => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Activity Feed</CardTitle>
        <CardDescription>AI-flagged messages for manual review.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[520px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source ID</TableHead>
                <TableHead>Message Snippet</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map(message => (
                <TableRow key={message.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="font-mono">{message.senderId}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{message.message}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getBadgeVariant(message.threatLevel)} className={message.threatLevel === 'low' ? 'bg-primary/20 text-primary-foreground border-primary' : ''}>
                      {message.threatLevel}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
