'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  FileText, 
  Download, 
  Share2, 
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface SavedReport {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  createdBy: string;
}

export default function CustomReportsPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  const savedReports: SavedReport[] = [
    {
      id: '1',
      name: 'Monthly Business Performance',
      type: 'Business Analytics',
      lastUpdated: '2024-03-15',
      createdBy: 'John Doe'
    },
    {
      id: '2',
      name: 'User Engagement Report',
      type: 'User Analytics',
      lastUpdated: '2024-03-14',
      createdBy: 'Jane Smith'
    },
    {
      id: '3',
      name: 'Revenue by Region',
      type: 'Revenue Analytics',
      lastUpdated: '2024-03-13',
      createdBy: 'Mike Johnson'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
        <Button onClick={() => setShowBuilder(!showBuilder)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>

      {showBuilder ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Name</label>
                  <Input placeholder="Enter report name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Business Analytics</option>
                    <option>User Analytics</option>
                    <option>Revenue Analytics</option>
                    <option>Custom Analytics</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex space-x-2">
                  <Input type="date" />
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Metrics</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bar Chart
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <LineChart className="h-4 w-4 mr-2" />
                    Line Chart
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <PieChart className="h-4 w-4 mr-2" />
                    Pie Chart
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowBuilder(false)}>
                  Cancel
                </Button>
                <Button>
                  Create Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last updated: {report.lastUpdated}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Created by: {report.createdBy}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 