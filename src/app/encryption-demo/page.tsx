
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getScanKeywords } from '@/lib/keyword-service';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EncryptionDemoPage: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('secretkey');
  const [availableKeywords, setAvailableKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);

  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchKeywords() {
      try {
        const keywords = await getScanKeywords();
        const keywordStrings = keywords.map(kw => kw.word);
        setAvailableKeywords(keywordStrings);
        if (keywordStrings.length > 0) {
          setSelectedKeyword(keywordStrings[0]);
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load keywords.' });
      }
    }
    fetchKeywords();
  }, [toast]);


  // A simple XOR cipher for demonstration purposes.
  // In a real application, use a robust cryptographic library like CryptoJS or the Web Crypto API.
  const simpleCipher = (text: string, cipherKey: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ cipherKey.charCodeAt(i % cipherKey.length));
    }
    return result;
  };

  const handleEncrypt = () => {
    if (!plaintext) {
      toast({ variant: 'destructive', title: 'Error', description: 'Plaintext cannot be empty.' });
      return;
    }
     if (!key) {
      toast({ variant: 'destructive', title: 'Error', description: 'Encryption key cannot be empty.' });
      return;
    }
    try {
      const encrypted = btoa(simpleCipher(plaintext, key));
      setCiphertext(encrypted);
      setDetectedKeywords([]); // Clear keywords on new encryption
      toast({ title: 'Success', description: 'Message encrypted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to encrypt message.' });
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ciphertext cannot be empty.' });
      return;
    }
     if (!key) {
      toast({ variant: 'destructive', title: 'Error', description: 'Encryption key cannot be empty.' });
      return;
    }
    try {
      const decrypted = simpleCipher(atob(ciphertext), key);
      setPlaintext(decrypted);
      
      // Keyword detection
      const lowerDecrypted = decrypted.toLowerCase();
      const foundKeywords = availableKeywords.filter(kw => lowerDecrypted.includes(kw.toLowerCase()));
      
      setDetectedKeywords(foundKeywords);

      toast({ title: 'Success', description: 'Message decrypted and scanned for keywords.' });
    } catch (error) {
      setDetectedKeywords([]);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to decrypt. The text may not be valid ciphertext or the key may be wrong.' });
    }
  };

  const isSelectedKeywordInPlaintext = selectedKeyword && plaintext.toLowerCase().includes(selectedKeyword.toLowerCase());

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Encryption & Decryption Demo</h1>
        <p className="text-muted-foreground">See how text and a key are used to transform data.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Demonstration Tool</CardTitle>
          <CardDescription>
            Enter text, provide a key, and use the buttons to see the transformation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key">Encryption Key</Label>
              <Input 
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your secret key..."
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="keyword-select">Keyword to Monitor</Label>
              <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                <SelectTrigger id="keyword-select">
                  <SelectValue placeholder="Select a keyword..." />
                </SelectTrigger>
                <SelectContent>
                  {availableKeywords.map(kw => (
                    <SelectItem key={kw} value={kw}>{kw}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isSelectedKeywordInPlaintext && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High-Risk Phrase Detected!</AlertTitle>
              <AlertDescription>
                The keyword `'{selectedKeyword}'` was found in the message.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Label htmlFor="plaintext">Plaintext</Label>
              <Textarea
                id="plaintext"
                placeholder="Enter your message here... try using words like 'payment', 'delivery', or 'crypto'."
                rows={8}
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciphertext">Ciphertext</Label>
              <Textarea
                id="ciphertext"
                placeholder="Encrypted output will appear here..."
                rows={8}
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button onClick={handleEncrypt}>
              <Lock className="mr-2" /> Encrypt
            </Button>
            <ArrowRightLeft className="text-muted-foreground" />
            <Button onClick={handleDecrypt}>
              <Unlock className="mr-2" /> Decrypt
            </Button>
          </div>
          
          {detectedKeywords.length > 0 && (
            <>
                <Separator className="my-4"/>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive">
                      <AlertTriangle/> Detected Keywords ({detectedKeywords.length})
                    </h3>
                    <p className="text-sm text-muted-foreground">The following suspicious keywords were found in the decrypted message.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {detectedKeywords.map((kw, index) => <Badge variant="destructive" key={index}>{kw}</Badge>)}
                    </div>
                </div>
            </>
          )}

        </CardContent>
      </Card>
       <Card className="mt-6 border-yellow-400/50 bg-yellow-400/10">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Lock size={20} /> Important Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-400/80">
            <p>
              This tool uses a simple XOR cipher with Base64 encoding for demonstration purposes only. It is **not** a secure encryption method and should not be used for protecting sensitive data. Real-world applications should use industry-standard, robust encryption algorithms and protocols.
            </p>
          </CardContent>
        </Card>
    </div>
  );
};

export default EncryptionDemoPage;
