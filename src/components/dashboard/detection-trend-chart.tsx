'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ThreatMessage } from '@/lib/types';
import { subDays, subHours, format } from 'date-fns';

type TimeFrame = '24h' | '7d' | '30d';

const DetectionTrendChart: FC<{ messages: ThreatMessage[] }> = ({ messages }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24h');

  const chartData = useMemo(() => {
    let startTime: Date;
    let timeUnit: 'hour' | 'day';

    switch (timeFrame) {
      case '24h':
        startTime = subHours(new Date(), 24);
        timeUnit = 'hour';
        break;
      case '7d':
        startTime = subDays(new Date(), 7);
        timeUnit = 'day';
        break;
      case '30d':
        startTime = subDays(new Date(), 30);
        timeUnit = 'day';
        break;
    }

    const filteredMessages = messages.filter(m => m.timestamp > startTime);

    const dataMap: { [key: string]: { name: string; high: number; medium: number; low: number } } = {};

    if (timeUnit === 'hour') {
      for (let i = 0; i < 24; i++) {
        const hour = format(subHours(new Date(), i), 'ha');
        dataMap[hour] = { name: hour, high: 0, medium: 0, low: 0 };
      }
      filteredMessages.forEach(msg => {
        const hour = format(msg.timestamp, 'ha');
        if (dataMap[hour]) {
          dataMap[hour][msg.threatLevel]++;
        }
      });
    } else {
       const days = timeFrame === '7d' ? 7 : 30;
       for (let i = 0; i < days; i++) {
        const day = format(subDays(new Date(), i), 'MMM d');
        dataMap[day] = { name: day, high: 0, medium: 0, low: 0 };
      }
      filteredMessages.forEach(msg => {
        const day = format(msg.timestamp, 'MMM d');
        if (dataMap[day]) {
          dataMap[day][msg.threatLevel]++;
        }
      });
    }

    return Object.values(dataMap).reverse();

  }, [messages, timeFrame]);

  const chartConfig = {
    high: { label: 'High', color: 'hsl(var(--destructive))' },
    medium: { label: 'Medium', color: 'hsl(var(--chart-3))' },
    low: { label: 'Low', color: 'hsl(var(--primary))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Trends</CardTitle>
        <CardDescription>Threats detected over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                 <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="low" stackId="a" fill="var(--color-low)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="var(--color-medium)" />
                <Bar dataKey="high" stackId="a" fill="var(--color-high)" />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionTrendChart;
