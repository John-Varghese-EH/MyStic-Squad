
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertTriangle,
  BookOpen,
  HeartPulse,
  Scale,
  Smartphone,
  Users,
  MessageCircle,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Smile,
  Phone,
  Newspaper,
  Siren,
  Brain,
  CircleHelp,
  CheckSquare,
} from 'lucide-react';

const AwarenessPage: React.FC = () => {
  const awarenessData = [
    {
      icon: <Brain className="text-destructive" />,
      title: 'How Can Drugs Affect You?',
      content: [
        'Alters how your body and mind work, impacting your study habits.',
        'Creates problems with family, friends, school and work.',
        'Puts you at risk of sexual assaults, which often occur when a person is under the influence of drugs or alcohol.',
        'Drug use is illegal! The consequences can lead to jail or prison.',
      ],
    },
    {
      icon: <Siren className="text-yellow-400" />,
      title: 'If Someone Overdoses on Drugs...',
      content: [
        'Watch out for the signs: abnormal breathing, slurred speech, lack of coordination, big or small pupils and unconsciousness.',
        'Notify UTEP Police Department at 747-5611 or call 911 immediately.',
        'If a person suddenly becomes hostile or violent, be careful. Call police immediately.',
      ],
    },
    {
      icon: <Users className="text-primary" />,
      title: 'How Students are Influenced to Use Drugs',
      content: [
        'Peer Pressure – Friends or groups often say things like “Try it once, nothing will happen” or “If you don’t try, you’re boring.”',
        'Curiosity & Experimentation – Students want new experiences; media, movies, and web series often glamorize drug use.',
        'Fear of Rejection – Students worry that if they refuse, they may be excluded from the group.',
        'Emotional Stress – Academic pressure, family problems, or depression make students more vulnerable, and some friends may offer drugs as an escape.',
        'Easy Availability – Drugs are sometimes easily accessible around hostels, parties, or certain social circles.',
      ],
    },
     {
      icon: <CheckSquare className="text-green-500" />,
      title: 'What You Should Do',
      content: [
        'Say “No” firmly the very first time and walk away.',
        'Talk to a trusted teacher, parent, or counselor if someone keeps pushing you.',
        'If the situation feels dangerous, report immediately to school authorities or local helplines/police.',
      ],
    },
    {
      icon: <ShieldCheck className="text-green-500" />,
      title: 'How to Prevent Drug Use',
      content: [
        'Build self-confidence – Learn to say “No” firmly.',
        'Choose good company – Stay close to friends who follow positive habits.',
        'Awareness programs – Schools and colleges should educate about the dangers of drug abuse.',
        'Healthy coping mechanisms – Deal with stress through sports, music, meditation, or by talking to someone you trust.',
        'Role of parents & teachers – They should pay attention to students’ emotions and guide them with care.',
      ],
    },
    {
      icon: <AlertTriangle className="text-destructive" />,
      title: 'Signs Someone is Trying to Influence You',
      content: [
        'Repeated Offers – They keep saying things like “Just try once” or “It will make you feel better.”',
        'Secretive Behavior – They ask you to meet in corners, speak in whispers, or say “Don’t tell anyone else.”',
        'Glorifying Drugs – They claim drugs reduce stress, boost confidence, or make parties more fun.',
        'Small Favors First – They may give you free samples or ask you to “just carry this packet” so you get used to it.',
        'Isolation Tactics – They try to separate you from other friends, saying “Only we are your true friends.”',
        'Suspicious Gifts or Money - Offering free things, paying for your expenses, or giving money without reason.',
        'Avoiding Authorities - They don’t want parents, teachers, or responsible adults to know about their activities.',
      ],
    },
    {
      icon: <BookOpen className="text-yellow-400" />,
      title: 'How Drug Dealing Usually Starts',
      content: [
        'Experimentation → Addiction → Need for Money: Students try drugs, get addicted, and start selling to fund their habit.',
        'Free Supply / “First Hit”: Dealers give free drugs initially to get people hooked.',
        'Using Students as Carriers: Students are asked to deliver packets as a “harmless favor.”',
        'Peer Circles: Sharing within a friend group slowly turns into small-scale dealing.',
        'Financial Temptation: The lure of “easy money” attracts young people, who ignore the severe legal risks.',
      ],
    },
    {
      icon: <Scale className="text-destructive" />,
      title: 'Legal Risks of Drug Dealing 🚨',
      content: [
        'Criminal Charges: Possession, selling, or transporting drugs is a serious criminal offense.',
        'Long Prison Sentences: Punishment can range from years to life imprisonment.',
        'Heavy Fines: Courts impose huge monetary fines.',
        'Permanent Criminal Record: A conviction makes it difficult to get jobs, visas, or higher education.',
        'Loss of Freedom & Rights: You may lose your right to vote, travel, or hold certain positions.',
        'Police Surveillance: Even if you are suspected, your movements and phone can be monitored.',
        'Impact on Family: Legal cases bring shame, stress, and financial burden to your family.',
      ],

    },
    {
      icon: <HeartPulse className="text-destructive" />,
      title: 'Health Risks of Drug Use 🚨',
      content: [
        'Brain Damage 🧠: Affects memory, concentration, and decision-making.',
        'Addiction: The body and mind become dependent, making it very difficult to stop.',
        'Heart and Lung Problems ❤️‍🔥: Can cause heart attacks, strokes, and breathing issues.',
        'Liver and Kidney Damage: Continuous use can lead to organ failure.',
        'Weakened Immune System: The body becomes less able to fight infections.',
        'Risk of Overdose: Taking too much can cause unconsciousness, coma, or even death.',
        'Spread of Diseases: Sharing needles increases the risk of HIV/AIDS and hepatitis.',
        'Mental Health Issues: Increases chances of depression, anxiety, and suicidal thoughts.',
      ],
    },
    {
      icon: <Smartphone className="text-destructive" />,
      title: 'Digital Risks of Drug Dealing 🚨',
      content: [
        'Online Surveillance: Police monitor social media, messaging apps, and the dark web.',
        'Permanent Digital Footprint: Every message, transaction, or search leaves a trace.',
        'Scams & Fraud: Many online dealers are fake and will cheat or blackmail you.',
        'Hacking & Identity Theft: Shady websites can expose your personal data to hackers.',
        'Digital Blackmail: Dealers or buyers can use screenshots of chats to threaten you.',
        'Banking & Crypto Risks: Transactions are traceable and accounts may be frozen.',
      ],
    },
    {
      icon: <MapPin className="text-yellow-400" />,
      title: 'How a Drug Dealer Can Track You 🚨',
      content: [
        'Phone Numbers & Chats 📱: They can keep contacting or blackmailing you.',
        'Social Media 🌐: They check your profiles to know your location and habits.',
        'GPS / Location Sharing 📍: They can track where you hang out.',
        'Friends & Peer Circles 👥: They ask common friends about you.',
        'Debt Trapping: If you take drugs on credit, they use it as leverage.',
        'Digital Transactions 💻: Your payment history can be used to identify or pressure you.',
      ],
    },
    {
      icon: <TrendingUp className="text-destructive" />,
      title: 'How Social Media Influences Drug Use 🚨',
      content: [
        'Glamorization of Drugs ✨: Posts and videos often show drugs as “cool” or “fun.”',
        'Peer Pressure Online 👥: Friends’ party pictures can make others feel left out.',
        'Curiosity Through Trends 🔥: Viral challenges can make drug use seem adventurous.',
        'Easy Access & Contact 📲: Dealers use social media to connect with new customers.',
        'Normalization 😶: Constant exposure to drug-related content reduces fear and caution.',
      ],
    },
    {
      icon: <Smile className="text-primary" />,
      title: 'Safe & Healthy Alternatives 🌱',
      content: [
        'Sports & Exercise 🏃‍♂️: Releases natural “happy chemicals” (endorphins).',
        'Music & Art 🎶🎨: A safe escape from negative emotions.',
        'Meditation & Yoga 🧘‍♀️: Calms the mind and reduces anxiety.',
        'Hobbies & Creativity ✍️📚: Gives a sense of achievement without harm.',
        'Positive Social Circles 👥: Good company removes the need for drugs as “stress relief.”',
        'Adventure & Travel: Hiking, cycling, or exploring new places provides a healthy thrill.',
        'Therapy & Counseling: Talking to a professional is a safe way to heal from emotional stress.',
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Drug Abuse Awareness Hub</h1>
        <p className="text-xl text-muted-foreground mt-2">Stay Informed. Stay Safe. Make Smart Choices.</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {awarenessData.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center gap-4">
                {item.icon}
                {item.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pl-4 border-l-2 border-primary ml-5">
              <ul className="list-disc list-inside space-y-2 pt-2">
                {item.content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="text-primary" /> Helpline Numbers</CardTitle>
          <CardDescription>Confidential support is just a call away. Don't hesitate to reach out.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Helpline Number</th>
                  <th className="p-2">Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Report drug-related crime, counseling</td>
                  <td className="p-2 font-mono">1933 (MANAS)</td>
                  <td className="p-2">24×7</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">De-addiction counseling & referrals</td>
                  <td className="p-2 font-mono">14446</td>
                  <td className="p-2">Toll-free</td>
                </tr>
                 <tr className="border-b">
                  <td className="p-2">Drug addiction support</td>
                  <td className="p-2 font-mono">1800-11-0031</td>
                  <td className="p-2">Toll-free</td>
                </tr>
                 <tr>
                  <td className="p-2">Mental health / emotional crisis support</td>
                  <td className="p-2 font-mono">+91 9999 666 555</td>
                  <td className="p-2">24×7 (Vandrevala)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
         <CardHeader>
          <CardTitle className="flex items-center gap-2"><Newspaper className="text-primary" /> Real News Stories</CardTitle>
          <CardDescription>These are real headlines. This is not a game.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">Seven college students among 11 arrested in drug raid in Chennai suburbs</p>
                <p className="text-sm text-muted-foreground">Police seized ganja chocolates, hookah items, and tobacco products near a private university.</p>
            </div>
             <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">Tamil Nadu: 5 college students arrested for selling and possessing drugs</p>
                <p className="text-sm text-muted-foreground">94 LSD stamps, 48 MDMA tablets, and 700 grams of ganga were recovered from the students.</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default AwarenessPage;
