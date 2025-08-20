
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Download, Trash2, RotateCcw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractKeywords } from '@/ai/flows/extract-keywords';

type DetectedKeyword = {
  word: string;
  count: number;
  positions: number[];
};

type ScanResult = {
  id: string;
  text: string;
  detectedKeywords: DetectedKeyword[];
  timestamp: string;
};

type HighlightedTextSegment = {
  text: string;
  highlight: boolean;
};

const PublicFinderPage: React.FC = () => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'ai' | 'custom'>('ai');
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [customKeywordInput, setCustomKeywordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem('publicFinderHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveHistory = (newHistory: ScanResult[]) => {
    setHistory(newHistory);
    localStorage.setItem('publicFinderHistory', JSON.stringify(newHistory));
  };

  const handleAddCustomKeyword = () => {
    if (customKeywordInput.trim()) {
      const newKeywords = customKeywordInput.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw && !customKeywords.includes(kw));
      setCustomKeywords([...customKeywords, ...newKeywords]);
      setCustomKeywordInput('');
    }
  };

  const handleRemoveCustomKeyword = (keywordToRemove: string) => {
    setCustomKeywords(customKeywords.filter(kw => kw !== keywordToRemove));
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter text to analyze.' });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      let keywordsToScan: string[] = [];
      if (mode === 'ai') {
        const aiResult = await extractKeywords({ textToAnalyze: text });
        keywordsToScan = aiResult.keywords;
      } else {
        keywordsToScan = customKeywords;
      }

      if (keywordsToScan.length === 0) {
        toast({ title: 'No Keywords', description: 'No keywords to analyze. Please add custom keywords or use AI suggestion.' });
        setIsLoading(false);
        return;
      }

      const lowerText = text.toLowerCase();
      const detectedKeywords: DetectedKeyword[] = keywordsToScan.map(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = [...lowerText.matchAll(regex)];
        return {
          word,
          count: matches.length,
          positions: matches.map(match => match.index as number),
        };
      }).filter(kw => kw.count > 0);

      const newResult: ScanResult = {
        id: new Date().toISOString(),
        text,
        detectedKeywords,
        timestamp: new Date().toLocaleString(),
      };
      setResult(newResult);

      const updatedHistory = [newResult, ...history].slice(0, 5);
      saveHistory(updatedHistory);

    } catch (error) {
      console.error("Analysis error:", error);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze the text.' });
    } finally {
      setIsLoading(false);
    }
  };

  const highlightedText = useMemo((): HighlightedTextSegment[] => {
    if (!result) return [{ text, highlight: false }];

    const segments: HighlightedTextSegment[] = [];
    let lastIndex = 0;
    
    const allPositions = result.detectedKeywords.flatMap(kw => 
        kw.positions.map(pos => ({ start: pos, end: pos + kw.word.length }))
    ).sort((a,b) => a.start - b.start);

    if (allPositions.length === 0) return [{ text, highlight: false }];

    allPositions.forEach(({ start, end }) => {
        if (start > lastIndex) {
            segments.push({ text: text.slice(lastIndex, start), highlight: false });
        }
        segments.push({ text: text.slice(start, end), highlight: true });
        lastIndex = end;
    });

    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), highlight: false });
    }

    return segments;
  }, [result, text]);
  
  const exportData = (format: 'csv' | 'json') => {
    if (!result) return;
    let dataStr: string;
    let fileName: string;

    if (format === 'json') {
      dataStr = JSON.stringify(result.detectedKeywords, null, 2);
      fileName = 'keywords.json';
    } else {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Keyword,Count\n";
      result.detectedKeywords.forEach(row => {
        csvContent += `${row.word},${row.count}\n`;
      });
      dataStr = encodeURI(csvContent);
      fileName = 'keywords.csv';
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = format === 'json' ? 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr) : dataStr;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({ title: 'Exported', description: `Results exported as ${fileName}`});
  };

  const loadFromHistory = (item: ScanResult) => {
    setText(item.text);
    setResult(item);
  };
  
  const clearHistory = () => {
    saveHistory([]);
    toast({ title: 'History Cleared'});
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
       <div>
        <h1 className="text-3xl font-bold">Public Finder</h1>
        <p className="text-muted-foreground">Analyze text to detect and highlight keywords.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste any text content here to start..."
                rows={12}
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Keyword Mode</CardTitle>
            </CardHeader>
            <CardContent>
               <Tabs value={mode} onValueChange={(v) => setMode(v as 'ai' | 'custom')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ai">AI Suggested</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="ai" className="pt-4">
                  <p className="text-sm text-muted-foreground">The AI will automatically identify and extract relevant keywords from your text.</p>
                </TabsContent>
                <TabsContent value="custom" className="pt-4 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add comma-separated keywords"
                      value={customKeywordInput}
                      onChange={e => setCustomKeywordInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddCustomKeyword()}
                    />
                    <Button onClick={handleAddCustomKeyword}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {customKeywords.map(kw => (
                      <Badge key={kw} variant="secondary" className="flex items-center gap-1">
                        {kw}
                        <button onClick={() => handleRemoveCustomKeyword(kw)} className="rounded-full hover:bg-muted-foreground/20">
                           <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? 'Analyzing...' : 'Analyze Text'}
          </Button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Detected keywords and highlighted text.</CardDescription>
            </CardHeader>
            <CardContent>
              {result && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Detected Keywords ({result.detectedKeywords.length})</h3>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={() => exportData('csv')}>Export CSV</Button>
                           <Button variant="outline" size="sm" onClick={() => exportData('json')}>Export JSON</Button>
                        </div>
                    </div>
                   {result.detectedKeywords.length > 0 ? (
                     <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                      {result.detectedKeywords.map(kw => (
                        <div key={kw.word} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                          <span>{kw.word}</span>
                          <Badge variant="outline">{kw.count}</Badge>
                        </div>
                      ))}
                    </div>
                   ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No keywords found in the text.</p>
                   )}

                  <div>
                     <h3 className="font-semibold mb-2">Highlighted Text</h3>
                     <div className="max-h-60 overflow-y-auto p-3 border rounded-md bg-muted/20 whitespace-pre-wrap text-sm">
                       {highlightedText.map((segment, index) => (
                           <span key={index} className={segment.highlight ? 'bg-yellow-400 text-black rounded' : ''}>
                               {segment.text}
                           </span>
                       ))}
                     </div>
                  </div>
                </div>
              )}
               {!result && !isLoading && <p className="text-center text-muted-foreground py-10">Analysis results will appear here.</p>}
               {isLoading && <p className="text-center text-muted-foreground py-10">Analyzing... please wait.</p>}
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>History</CardTitle>
                    <CardDescription>Your last 5 analyses.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={clearHistory} disabled={history.length === 0}>
                    <Trash2 className="h-4 w-4" />
                </Button>
             </CardHeader>
             <CardContent>
                {history.length > 0 ? (
                    <div className="space-y-2">
                        {history.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                <div className="truncate">
                                    <p className="text-sm font-medium truncate">{item.text}</p>
                                    <p className="text-xs text-muted-foreground">{item.timestamp} - {item.detectedKeywords.length} keywords</p>
                                </div>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="sm" onClick={() => loadFromHistory(item)}>
                                         <RotateCcw className="h-3 w-3 mr-1" />
                                         Load
                                     </Button>
                                     <Button variant="ghost" size="sm" onClick={() => {
                                         navigator.clipboard.writeText(JSON.stringify(item.detectedKeywords, null, 2));
                                         toast({title: 'Copied to clipboard'});
                                     }}>
                                         <Copy className="h-3 w-3 mr-1" />
                                         Copy
                                     </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">No history yet.</p>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicFinderPage;

    