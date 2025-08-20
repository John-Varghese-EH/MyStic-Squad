
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';

type KeywordRiskLevel = 'Normal' | 'Risk' | 'High Risk';

type DetectedKeyword = {
  word: string;
  count: number;
  risk: KeywordRiskLevel;
};

type ScanResult = {
  id: string;
  sourceText: string;
  detectedKeywords: DetectedKeyword[];
  overallRisk: KeywordRiskLevel;
  totalOccurrences: number;
  timestamp: string;
};

const getRiskLevel = (count: number): KeywordRiskLevel => {
  if (count > 100) return 'High Risk';
  if (count > 50) return 'Risk';
  return 'Normal';
};

const getRiskBadgeVariant = (level: KeywordRiskLevel) => {
  if (level === 'High Risk') return 'destructive';
  if (level === 'Risk') return 'secondary';
  return 'default';
};


const PublicFinderClient: React.FC = () => {
    const [textToAnalyze, setTextToAnalyze] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [latestResult, setLatestResult] = useState<ScanResult | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const savedKeywords = localStorage.getItem('publicFinderKeywords');
            if (savedKeywords) {
                setKeywords(JSON.parse(savedKeywords));
            }
        } catch (error) {
            console.error("Failed to load keywords from localStorage", error);
        }
    }, []);

    const handleAddKeyword = () => {
        const trimmedKeyword = newKeyword.trim().toLowerCase();
        if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
            const updatedKeywords = [...keywords, trimmedKeyword];
            setKeywords(updatedKeywords);
            localStorage.setItem('publicFinderKeywords', JSON.stringify(updatedKeywords));
            setNewKeyword('');
            toast({ title: 'Keyword Added', description: `"${trimmedKeyword}" has been saved.`});
        }
    };

    const handleDeleteKeyword = (keywordToDelete: string) => {
        const updatedKeywords = keywords.filter(kw => kw !== keywordToDelete);
        setKeywords(updatedKeywords);
        localStorage.setItem('publicFinderKeywords', JSON.stringify(updatedKeywords));
        toast({ title: 'Keyword Removed', description: `"${keywordToDelete}" has been removed.`});
    };

    const handleAnalyze = () => {
        if (!textToAnalyze.trim()) {
            toast({ variant: 'destructive', title: 'Input Required', description: 'Please paste some text to analyze.' });
            return;
        }
        if (keywords.length === 0) {
            toast({ variant: 'destructive', title: 'Keywords Required', description: 'Please add at least one keyword to scan for.' });
            return;
        }
        setIsAnalyzing(true);

        const lowerCaseText = textToAnalyze.toLowerCase();
        let totalOccurrences = 0;

        const detectedKeywords: DetectedKeyword[] = keywords.map(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'g');
            const count = (lowerCaseText.match(regex) || []).length;
            totalOccurrences += count;
            return {
                word: kw,
                count,
                risk: getRiskLevel(count),
            };
        }).filter(kw => kw.count > 0);

        const avgOccurrences = detectedKeywords.length > 0 ? totalOccurrences / detectedKeywords.length : 0;
        const overallRisk = getRiskLevel(avgOccurrences);

        const newResult: ScanResult = {
            id: new Date().toISOString(),
            sourceText: textToAnalyze,
            detectedKeywords,
            overallRisk,
            totalOccurrences,
            timestamp: new Date().toLocaleString(),
        };

        setLatestResult(newResult);
        setIsAnalyzing(false);
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Public Content Finder</h1>
                <p className="text-muted-foreground">Analyze text for custom keywords and assess risk.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Content to Analyze</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste any text content here to start..."
                            rows={10}
                            value={textToAnalyze}
                            onChange={(e) => setTextToAnalyze(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Keyword Management</CardTitle>
                        <CardDescription>Add or remove keywords for scanning.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                           <Input
                                placeholder="Add a new keyword"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                           />
                           <Button onClick={handleAddKeyword}>Add</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Saved Keywords</Label>
                             {keywords.length > 0 ? (
                                <div className="max-h-40 overflow-y-auto pr-2 flex flex-wrap gap-2">
                                    {keywords.map(kw => (
                                        <Badge key={kw} variant="secondary" className="flex items-center gap-1.5">
                                            {kw}
                                            <button onClick={() => handleDeleteKeyword(kw)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">No keywords saved.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg" className="w-full">
                    {isAnalyzing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="mr-2 h-4 w-4" />
                    )}
                    Analyze Content
                </Button>
              </div>

              <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Analysis Result</CardTitle>
                        <CardDescription>Detected keywords and risk assessment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isAnalyzing ? (
                            <div className="text-center py-10">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                <p className="mt-2 text-muted-foreground">Analyzing...</p>
                            </div>
                        ) : latestResult ? (
                            <div className="space-y-6">
                                <Card className="bg-muted/30">
                                    <CardHeader className="flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-base font-medium">Overall Risk Rating</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Badge 
                                          variant={getRiskBadgeVariant(latestResult.overallRisk)} 
                                          className="text-2xl font-bold capitalize"
                                        >
                                          {latestResult.overallRisk}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Based on an average of { (latestResult.totalOccurrences / (latestResult.detectedKeywords.length || 1)).toFixed(2)} occurrences per detected keyword.
                                        </p>
                                    </CardContent>
                                </Card>
                                
                                <div>
                                <h4 className="font-semibold mb-2">Detected Keyword Breakdown</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Keyword</TableHead>
                                            <TableHead className="text-center">Frequency</TableHead>
                                            <TableHead className="text-right">Risk Level</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {latestResult.detectedKeywords.length > 0 ? latestResult.detectedKeywords.map((kw, index) => (
                                            <TableRow key={`${kw.word}-${index}`}>
                                                <TableCell className="font-medium">{kw.word}</TableCell>
                                                <TableCell className="text-center font-mono">{kw.count}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={getRiskBadgeVariant(kw.risk)} className="capitalize">{kw.risk}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center">
                                                    No keywords found in the text.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                </div>

                            </div>
                        ) : (
                           <div className="text-center text-muted-foreground py-10">
                                <p>Analysis results will appear here.</p>
                           </div>
                        )}
                    </CardContent>
                </Card>
              </div>
            </div>
        </div>
    );
};

export default () => (
    <React.Suspense fallback={
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div>
                <Skeleton className="h-9 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Skeleton className="h-[450px] w-full" />
                </div>
                <div className="lg:col-span-2">
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        </div>
    }>
        <PublicFinderClient />
    </React.Suspense>
);

    