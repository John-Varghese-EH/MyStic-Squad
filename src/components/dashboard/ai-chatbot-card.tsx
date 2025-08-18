'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight } from 'lucide-react';

const AIChatbotCard: FC = () => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            AI Awareness Chatbot
        </CardTitle>
        <CardDescription>
          Get instant, confidential support and information. Our AI is here to help you understand the risks and find help.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/chatbot" passHref>
          <Button className="w-full">
            Start a Conversation
            <ArrowRight />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AIChatbotCard;
