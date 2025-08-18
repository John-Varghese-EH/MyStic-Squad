"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setIsLoading(true);

      // Placeholder for Gemini API integration
      // Replace with actual API call to Gemini for drug awareness information
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
      const botResponse = "This is a placeholder bot response about drug awareness.";
      setMessages(currentMessages => [...currentMessages, { text: botResponse, sender: 'bot' }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjusted height for layout */}
      <Card className="flex-1 flex flex-col m-4"> {/* Added margin */}
        <CardHeader>
          <CardTitle>AI Chatbot for Drug Awareness</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4"> {/* Added padding-right for scrollbar */}
            <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${ // Adjusted max-width
                  msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted' // Use theme colors
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
           {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-muted">
                  Typing...
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="p-6 bg-white">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Ask me about drug awareness..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="bg-primary text-primary-foreground rounded-r-lg px-6 py-3 hover:bg-primary/90" // Use theme colors
            onClick={handleSendMessage}
            disabled={isLoading} // Disable send button while loading
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}