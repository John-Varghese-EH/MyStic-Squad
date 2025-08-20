
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeWebText, type AnalyzeWebTextInput, type AnalyzeWebTextOutput } from '@/ai/flows/analyze-web-text';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

type ScanResult = AnalyzeWebTextOutput & {
    source: string;
    timestamp: Date;
    id: string;
};

const PublicFinderClient: React.FC = () => {
    const [sourceUrl, setSourceUrl] = useState('');
    const [rawText, setRawText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [latestResult, setLatestResult] = useState<ScanResult | null>(null);
    const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const textToAnalyze = rawText.trim() || sourceUrl.trim();
        const source = rawText.trim() ? 'Raw Text' : sourceUrl;

        if (!textToAnalyze) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please provide a URL or raw text to analyze.',
            });
            return;
        }

        setIsSubmitting(true);
        setLatestResult(null);

        try {
            const input: AnalyzeWebTextInput = rawText.trim() 
                ? { text: rawText } 
                : { url: sourceUrl };

            const result = await analyzeWebText(input);
            const newResult: ScanResult = {
                ...result,
                source: source,
                timestamp: new Date(),
                id: Math.random().toString(36).substring(7),
            };

            setLatestResult(newResult);
            setScanHistory(prev => [newResult, ...prev]);

        } catch (error) {
            console.error("Analysis error:", error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'Could not analyze the provided content. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
            setSourceUrl('');
            setRawText('');
        }
    };

    const getRiskBadgeVariant = (level: 'low' | 'medium' | 'high') => {
        if (level === 'high') return 'destructive';
        if (level === 'medium') return 'secondary';
        return 'default';
    }
    
    if (!isClient) {
        return null;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Public Content Finder</h1>
                <p className="text-muted-foreground">Analyze public websites or text for suspicious keywords.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Content Scanner</CardTitle>
                        <CardDescription>Enter a URL or paste raw text below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL</Label>
                                <Input
                                    id="url"
                                    placeholder="https://example.com"
                                    value={sourceUrl}
                                    onChange={(e) => {
                                        setSourceUrl(e.target.value)
                                        setRawText('')
                                    }}
                                    disabled={isSubmitting || !!rawText}
                                />
                            </div>
                            <div className="text-center text-sm text-muted-foreground">OR</div>
                             <div className="space-y-2">
                                <Label htmlFor="rawText">Raw Text / HTML</Label>
                                <Textarea
                                    id="rawText"
                                    placeholder="Paste content to analyze..."
                                    rows={8}
                                    value={rawText}
                                    onChange={(e) => {
                                        setRawText(e.target.value)
                                        setSourceUrl('')
                                    }}
                                    disabled={isSubmitting || !!sourceUrl}
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Analyze Content
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {latestResult && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Latest Scan Result</CardTitle>
                            <CardDescription>
                                Analysis for: <span className="font-mono">{latestResult.source.length > 50 ? `${latestResult.source.substring(0, 50)}...` : latestResult.source}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                               <span className="font-semibold text-muted-foreground">Risk Level</span>
                               <Badge variant={getRiskBadgeVariant(latestResult.riskLevel)} className="capitalize">{latestResult.riskLevel}</Badge>
                            </div>
                            <div>
                               <h4 className="font-semibold mb-2 text-muted-foreground">Detected Keywords ({latestResult.totalOccurrences})</h4>
                               {latestResult.detectedKeywords.length > 0 ? (
                                 <div className="flex flex-wrap gap-2">
                                     {latestResult.detectedKeywords.map(kw => (
                                         <Badge key={kw.word} variant="outline">
                                             {kw.word} ({kw.count})
                                         </Badge>
                                     ))}
                                 </div>
                               ) : (
                                 <p className="text-sm text-muted-foreground">No suspicious keywords found.</p>
                               )}
                            </div>
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>Scan History</CardTitle>
                        <CardDescription>Your past 10 content scans.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Risk</TableHead>
                                    <TableHead>Keywords</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scanHistory.length > 0 ? scanHistory.slice(0, 10).map(scan => (
                                    <TableRow key={scan.id}>
                                        <TableCell className="max-w-[150px] truncate font-mono">{scan.source}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRiskBadgeVariant(scan.riskLevel)} className="capitalize">{scan.riskLevel}</Badge>
                                        </TableCell>
                                        <TableCell>{scan.totalOccurrences}</TableCell>
                                        <TableCell className="text-muted-foreground">{format(scan.timestamp, 'MMM d, h:mm a')}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No scan history yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
              </div>
            </div>
        </div>
    );
};

export default PublicFinderClient;
