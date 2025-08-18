
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CaseManagementPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setScreenshot(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a description of the suspicious activity.',
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate backend submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setDescription('');
    setScreenshot(null);
    
    toast({
      title: 'Report Submitted',
      description: 'Thank you for your report. It has been submitted for review.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Case Management</h1>
        <p className="text-muted-foreground">Submit anonymous reports of suspicious activity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anonymous Report Form</CardTitle>
          <CardDescription>
            Your report is anonymous. Provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Describe Suspicious Activity</Label>
              <Textarea
                id="description"
                placeholder="Enter details about the user, messages, or activity..."
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenshot">Upload Screenshot (Optional)</Label>
              <div className="flex items-center gap-4">
                 <Input
                    id="screenshot"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="screenshot"
                    className="flex-1 cursor-pointer"
                   >
                    <div className="flex items-center justify-center w-full h-12 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-accent">
                     <Upload className="mr-2 h-4 w-4" />
                     {screenshot ? screenshot.name : 'Choose a file'}
                    </div>
                  </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PNG, JPG, GIF. Max file size: 5MB.
              </p>
            </div>
            <div className="text-right">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseManagementPage;
