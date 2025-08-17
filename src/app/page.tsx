'use client';

import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import type { ThreatMessage, ThreatLevel } from '@/lib/types';
import { generateInitialMessages, generateNewMessage } from '@/lib/mock-data';
import RiskSummaryCards from '@/components/dashboard/risk-summary-cards';
import LiveActivityFeed from '@/components/dashboard/live-activity-feed';
import DetectionTrendChart from '@/components/dashboard/detection-trend-chart';
import ThreatAnalyzer from '@/components/dashboard/threat-analyzer';
import { analyzeThreatMessage, type AnalyzeThreatMessageOutput } from '@/ai/flows/analyze-threat-message';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const DashboardPage: FC = () => {
  const [messages, setMessages] = useState<ThreatMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeThreatMessageOutput | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    setMessages(generateInitialMessages());

    const interval = setInterval(() => {
      setMessages(prevMessages => [generateNewMessage(), ...prevMessages].slice(0, 50));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const overallRiskLevel = useMemo((): ThreatLevel => {
    if (messages.some(m => m.threatLevel === 'high')) return 'high';
    if (messages.some(m => m.threatLevel === 'medium')) return 'medium';
    return 'low';
  }, [messages]);

  const criticalAlert = useMemo(() => {
    return messages.find(m => m.threatLevel === 'high');
  }, [messages]);
  
  const stats = useMemo(() => {
    const total = messages.length;
    const high = messages.filter(m => m.threatLevel === 'high').length;
    const medium = messages.filter(m => m.threatLevel === 'medium').length;
    return { total, high, medium };
  }, [messages]);

  const handleAnalyze = async (encryptedMessage: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeThreatMessage({ encryptedMessage });
      setAnalysisResult(result);
      setIsResultOpen(true);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the message. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <RiskSummaryCards
        overallRiskLevel={overallRiskLevel}
        stats={stats}
        criticalAlert={criticalAlert}
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LiveActivityFeed messages={messages} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <DetectionTrendChart messages={messages} />
          <ThreatAnalyzer onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
      </div>
      
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
    </div>
  );
};

export default DashboardPage;
