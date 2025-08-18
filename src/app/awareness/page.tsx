
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, EyeOff, AlertTriangle, UserX } from 'lucide-react';

const AwarenessPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Cyber Fraud Awareness</h1>
        <p className="text-xl text-muted-foreground mt-2">Stay Informed, Stay Secure.</p>
      </div>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            The Risks of Online Drug Dealing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The anonymity of the internet has made it a fertile ground for illegal activities, including drug trafficking. Cybercriminals leverage encrypted messaging apps, dark web marketplaces, and social media to conduct their operations, posing significant risks to individuals and society.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Legal Consequences:</strong> Engaging in or facilitating online drug sales can lead to severe legal penalties, including long-term imprisonment and hefty fines.</li>
            <li><strong>Personal Safety:</strong> Buyers are exposed to risks such as receiving contaminated or counterfeit substances, which can have fatal consequences.</li>
            <li><strong>Financial Fraud:</strong> Transactions are often unregulated, making users vulnerable to scams, theft of personal information, and financial losses.</li>
            <li><strong>Exploitation:</strong> Vulnerable individuals, including minors, can be targeted and exploited by online drug dealers.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="text-yellow-400" />
              How Encrypted Apps Are Misused
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              While encrypted communication tools are vital for privacy, they can be misused by criminals to conceal their activities. Features like end-to-end encryption, disappearing messages, and anonymous accounts make it challenging for law enforcement to track and prevent illegal drug sales.
            </p>
            <p>
              Common tactics include using code words, negotiating in private groups, and using cryptocurrencies for untraceable payments.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary" />
              Safe Reporting Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you encounter suspicious activity online, it's crucial to report it safely and anonymously. Your information can help authorities take action and protect others.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Use Official Channels:</strong> Report directly to law enforcement agencies through their official websites or dedicated cybercrime portals.</li>
              <li><strong>Remain Anonymous:</strong> Do not use your personal accounts or reveal identifying information when reporting. Use the anonymous reporting tool provided in this application.</li>
              <li><strong>Do Not Engage:</strong> Avoid direct confrontation with suspicious individuals. Your safety is the priority.</li>
              <li><strong>Preserve Evidence:</strong> If possible, take screenshots of suspicious messages or profiles without compromising your anonymity.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AwarenessPage;
