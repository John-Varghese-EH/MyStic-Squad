'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeThreatMessageOutput } from '@/ai/flows/analyze-threat-message';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ThreatAnalyzerProps {
  onAnalyze: (message: string) => Promise<void>;
  isAnalyzing: boolean;
  analysisResult: AnalyzeThreatMessageOutput | null;
  isResultOpen: boolean;
  setIsResultOpen: (isOpen: boolean) => void;
}

const ThreatAnalyzer: FC<ThreatAnalyzerProps> = ({ 
  onAnalyze, 
  isAnalyzing, 
  analysisResult,
  isResultOpen,
  setIsResultOpen
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onAnalyze(message);
      setMessage('');
    }
  };

  return (
    <>
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
      
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="sm:max-w-[525px] bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {analysisResult?.warrantsReview ? (
                <AlertCircle className="text-destructive" />
              ) : (
                <CheckCircle className="text-primary" />
              )}
              Analysis Complete
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis of the provided encrypted message.
            </DialogDescription>
          </DialogHeader>
          {analysisResult && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Threat Level</span>
                <Badge 
                  variant={analysisResult.threatLevel === 'high' ? 'destructive' : analysisResult.threatLevel === 'medium' ? 'secondary' : 'default'}
                  className={analysisResult.threatLevel === 'low' ? 'bg-primary/20 text-primary-foreground border-primary' : ''}
                >
                  {analysisResult.threatLevel.toUpperCase()}
                </Badge>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Reasoning</h4>
                <p className="text-sm text-muted-foreground">{analysisResult.reason}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Identified Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.length > 0 ? analysisResult.keywords.map(kw => <Badge variant="outline" key={kw}>{kw}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Identified Patterns</h4>
                 <div className="flex flex-wrap gap-2">
                  {analysisResult.patterns.length > 0 ? analysisResult.patterns.map(p => <Badge variant="outline" key={p}>{p}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThreatAnalyzer;
