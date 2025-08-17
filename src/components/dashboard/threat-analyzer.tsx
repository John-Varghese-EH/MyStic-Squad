'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

interface ThreatAnalyzerProps {
  onAnalyze: (message: string) => void;
  isAnalyzing: boolean;
}

const ThreatAnalyzer: FC<ThreatAnalyzerProps> = ({ onAnalyze, isAnalyzing }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onAnalyze(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Assessment</CardTitle>
        <CardDescription>Manually analyze an encrypted message with AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            placeholder="Paste encrypted message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={isAnalyzing}
            rows={4}
          />
          <Button type="submit" disabled={isAnalyzing || !message.trim()}>
            {isAnalyzing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Lock />
            )}
            Analyze Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ThreatAnalyzer;
