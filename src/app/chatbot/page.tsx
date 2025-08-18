'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatAboutDrugs } from '@/ai/flows/drug-awareness-chatbot';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' as const }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const result = await chatAboutDrugs({ message: input });
        setMessages(currentMessages => [...currentMessages, { text: result.response, sender: 'bot' }]);
      } catch (error) {
        console.error("Chatbot API error:", error);
         toast({
          variant: "destructive",
          title: "Error",
          description: "Could not get a response from the chatbot. Please try again.",
        });
        setMessages(messages); // Revert to previous state if API call fails
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <Card className="flex-1 flex flex-col m-4 shadow-lg rounded-xl">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            AI Chatbot for Drug Awareness
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            <div className="flex flex-col space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                     <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot size={20} />
                      </Avatar>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                   {msg.sender === 'user' && (
                     <Avatar className="w-8 h-8 bg-muted text-muted-foreground flex items-center justify-center">
                        <User size={20} />
                      </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                   <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                     <Bot size={20} />
                   </Avatar>
                  <div className="p-3 rounded-lg bg-muted rounded-bl-none">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0"></span>
                       <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                       <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t bg-background/80">
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Ask a question about drug awareness..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
