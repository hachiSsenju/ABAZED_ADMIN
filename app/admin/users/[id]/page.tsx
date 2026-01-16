"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Mail, Calendar, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const user = {
    id: params.id,
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    status: "active",
    joined: "2024-01-15",
    totalOrders: 12,
    totalSpent: 1248.5,
  }

  const orders = [
    { id: "ORD-001", date: "2024-03-15", items: 3, total: 149.99, status: "completed" },
    { id: "ORD-002", date: "2024-03-10", items: 2, total: 89.98, status: "completed" },
    { id: "ORD-003", date: "2024-02-28", items: 1, total: 129.99, status: "completed" },
    { id: "ORD-004", date: "2024-02-20", items: 4, total: 249.96, status: "refunded" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground mt-1">View customer information and order history</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{user.name}</p>
              <Badge className="mt-2" variant={user.status === "active" ? "default" : "destructive"}>
                {user.status}
              </Badge>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(user.joined).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span>{user.totalOrders} orders</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold mt-1">${user.totalSpent.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "refunded"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
