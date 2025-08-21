
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EncryptionDemoPage: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('secretkey');
  const { toast } = useToast();

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
      toast({ title: 'Success', description: 'Message encrypted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to encrypt message.' });
    }
  };

  const handleDecrypt = () => {
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
      toast({ title: 'Success', description: 'Message decrypted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to decrypt. The text may not be valid ciphertext or the key may be wrong.' });
    }
  };

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
          <div className="space-y-2">
            <Label htmlFor="key">Encryption Key</Label>
            <Input 
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your secret key..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="plaintext">Plaintext</Label>
              <Textarea
                id="plaintext"
                placeholder="Enter your message here..."
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
