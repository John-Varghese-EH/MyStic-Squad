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
      setMessages(prevMessages => {
        // Prevent messages from growing indefinitely and only keep the latest 50
        const updatedMessages = [generateNewMessage(), ...prevMessages];
        return updatedMessages.slice(0, 50);
      });
    }, 5000); // New message every 5 seconds

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
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
           <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[230px] w-full" />
          </div>
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
