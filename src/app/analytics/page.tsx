'use client';
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';
import { generateInitialMessages } from '@/lib/mock-data';
import type { ThreatMessage } from '@/lib/types';
import { format } from 'date-fns';

const AnalyticsPage: React.FC = () => {
    const messages = useMemo(() => generateInitialMessages(200), []);

    const hourlyData = useMemo(() => {
        const data: { [key: string]: { hour: string; high: number; medium: number; low: number } } = {};
        messages.forEach(msg => {
            const hour = format(msg.timestamp, 'ha');
            if (!data[hour]) {
                data[hour] = { hour, high: 0, medium: 0, low: 0 };
            }
            data[hour][msg.threatLevel]++;
        });
        return Object.values(data).sort((a,b) => new Date('1970/01/01 ' + a.hour.replace(/am|pm/i, ' $&')).getTime() - new Date('1970/01/01 ' + b.hour.replace(/am|pm/i, ' $&')).getTime());
    }, [messages]);

    const keywordData = useMemo(() => {
        const keywords: { [key: string]: number } = {};
        messages.forEach(msg => {
            msg.keywords.forEach(kw => {
                keywords[kw] = (keywords[kw] || 0) + 1;
            });
        });
        return Object.entries(keywords)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [messages]);
    
    const riskDistribution = useMemo(() => {
        const counts = { high: 0, medium: 0, low: 0 };
        messages.forEach(msg => counts[msg.threatLevel]++);
        return [
            { name: 'High Risk', value: counts.high },
            { name: 'Medium Risk', value: counts.medium },
            { name: 'Low Risk', value: counts.low },
        ];
    }, [messages]);
    
    const COLORS = ['hsl(var(--destructive))', 'hsl(var(--chart-3))', 'hsl(var(--primary))'];

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold">Threat Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Threats by Hour</CardTitle>
                        <CardDescription>Volume of flagged messages by the hour of the day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                  }}
                                />
                                <Legend wrapperStyle={{fontSize: "14px"}} />
                                <Bar dataKey="high" stackId="a" fill="hsl(var(--destructive))" name="High" />
                                <Bar dataKey="medium" stackId="a" fill="hsl(var(--chart-3))" name="Medium" />
                                <Bar dataKey="low" stackId="a" fill="hsl(var(--primary))" name="Low" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Risk Distribution</CardTitle>
                        <CardDescription>Overall distribution of threat levels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <PieLegend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Keywords</CardTitle>
                    <CardDescription>Most frequently detected keywords in flagged messages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart layout="vertical" data={keywordData} margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                  }}
                             />
                            <Bar dataKey="value" fill="hsl(var(--primary))" name="Count" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
};

export default AnalyticsPage;
