'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideShoppingCart, LucideUsers, LucideBuilding, LucideCheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();

  // Dashboard stats (would be fetched from API in a real application)
  const stats = [
    { name: 'Pending Requests', value: '12', icon: LucideShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { name: 'Approved Requests', value: '28', icon: LucideCheckCircle, color: 'bg-green-100 text-green-600' },
    { name: 'Vendors', value: '45', icon: LucideUsers, color: 'bg-purple-100 text-purple-600' },
    { name: 'Entities', value: '3', icon: LucideBuilding, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName || 'User'}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your purchase management system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Requests</CardTitle>
            <CardDescription>Latest purchase requests across all entities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated with actual data in a real application */}
              <p className="text-sm text-muted-foreground">No recent purchase requests found.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Requests waiting for your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated with actual data in a real application */}
              <p className="text-sm text-muted-foreground">No pending approvals found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
