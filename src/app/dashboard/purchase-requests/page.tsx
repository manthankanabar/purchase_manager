'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PurchaseRequestsPage() {
  // This would be fetched from the database in a real application
  const purchaseRequests = [
    { id: 'PR001', title: 'Office Supplies', status: 'Pending', entity: 'Entity A', requestedBy: 'John Doe', date: '2025-05-01', amount: '₹15,000' },
    { id: 'PR002', title: 'Construction Materials', status: 'Approved', entity: 'Entity B', requestedBy: 'Jane Smith', date: '2025-04-28', amount: '₹250,000' },
    { id: 'PR003', title: 'IT Equipment', status: 'Rejected', entity: 'Entity A', requestedBy: 'Mike Johnson', date: '2025-04-25', amount: '₹75,000' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Purchase Requests</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchase Requests</CardTitle>
          <CardDescription>
            View and manage all purchase requests across entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.entity}</TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/purchase-requests/${request.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
