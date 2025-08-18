'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const pastReports = [
  { id: 'REP-001', date: '2023-10-01', type: 'Weekly Threat Summary', range: 'Sep 24-30, 2023'},
  { id: 'REP-002', date: '2023-09-24', type: 'Weekly Threat Summary', range: 'Sep 17-23, 2023'},
  { id: 'REP-003', date: '2023-09-17', type: 'Monthly Keyword Analysis', range: 'August 2023'},
  { id: 'REP-004', date: '2023-09-01', type: 'High-Risk Activity Report', range: 'Aug 1-31, 2023'},
];

const ReportsPage: React.FC = () => {
    const [date, setDate] = React.useState<DateRange | undefined>();

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
       <div className="flex justify-between items-start">
         <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and download threat intelligence reports.</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report</CardTitle>
          <CardDescription>Select a date range to generate a new report.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-2">
             <Popover>
               <PopoverTrigger asChild>
                 <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
             </Popover>
           </div>
        </CardContent>
      </Card>

      <Card>
         <CardHeader>
          <CardTitle>Past Reports</CardTitle>
          <CardDescription>Access previously generated reports.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Report Type</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {report.id}
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.range}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                       <Download className="mr-2 h-4 w-4" />
                       Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
