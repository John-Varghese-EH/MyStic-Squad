'use client';

import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useMemo } from 'react';
import type { ThreatMessage, ThreatLevel } from '@/lib/types';
import { generateInitialMessages, generateNewMessage } from '@/lib/mock-data';
import RiskSummaryCards from '@/components/dashboard/risk-summary-cards';
import LiveActivityFeed from '@/components/dashboard/live-activity-feed';
import DetectionTrendChart from '@/components/dashboard/detection-trend-chart';
import ThreatAnalyzer from '@/components/dashboard/threat-analyzer';
import { analyzeThreatMessage, type AnalyzeThreatMessageOutput } from '@/ai/flows/analyze-threat-message';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle } from 'lucide-react';


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
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
           <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
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
          <ThreatAnalyzer 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            isResultOpen={isResultOpen}
            setIsResultOpen={setIsResultOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
