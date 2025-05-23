
import React, { useState } from 'react';
import { Package, Search, Eye, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import AdminLayout from '@/components/layout/AdminLayout';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-1001',
    customer: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    date: new Date(2025, 4, 20),
    status: 'completed',
    total: 12500,
    items: [
      { id: 1, name: 'Embroidered Silk Saree', price: 8500, quantity: 1 },
      { id: 2, name: 'Designer Blouse', price: 4000, quantity: 1 },
    ],
    address: {
      line1: '42 Brigade Road',
      line2: 'Apartment 303',
      city: 'Bangalore',
      state: 'Karnataka',
      postal_code: '560001',
    },
  },
  {
    id: 'ORD-1002',
    customer: 'Priya Patel',
    email: 'priya.p@example.com',
    date: new Date(2025, 4, 21),
    status: 'processing',
    total: 7200,
    items: [
      { id: 3, name: 'Handcrafted Jhumkas', price: 2400, quantity: 3 },
    ],
    address: {
      line1: '78 Park Street',
      line2: 'Floor 2',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400001',
    },
  },
  {
    id: 'ORD-1003',
    customer: 'Vijay Kumar',
    email: 'vijay.k@example.com',
    date: new Date(2025, 4, 22),
    status: 'pending',
    total: 18700,
    items: [
      { id: 4, name: 'Designer Lehenga', price: 15000, quantity: 1 },
      { id: 5, name: 'Matching Dupatta', price: 3700, quantity: 1 },
    ],
    address: {
      line1: '23 MG Road',
      line2: '',
      city: 'Delhi',
      state: 'Delhi',
      postal_code: '110001',
    },
  },
  {
    id: 'ORD-1004',
    customer: 'Ananya Singh',
    email: 'ananya.s@example.com',
    date: new Date(2025, 4, 23),
    status: 'shipped',
    total: 9500,
    items: [
      { id: 6, name: 'Traditional Anarkali Suit', price: 9500, quantity: 1 },
    ],
    address: {
      line1: '56 Gandhi Nagar',
      line2: 'House No. 12',
      city: 'Hyderabad',
      state: 'Telangana',
      postal_code: '500001',
    },
  },
  {
    id: 'ORD-1005',
    customer: 'Kiran Rao',
    email: 'kiran.r@example.com',
    date: new Date(2025, 4, 23),
    status: 'cancelled',
    total: 6800,
    items: [
      { id: 7, name: 'Designer Clutch', price: 3400, quantity: 2 },
    ],
    address: {
      line1: '89 Civil Lines',
      line2: 'Near City Park',
      city: 'Jaipur',
      state: 'Rajasthan',
      postal_code: '302001',
    },
  },
];

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const OrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const ordersPerPage = 10;
  
  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const viewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Shipped</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">View and manage customer orders</p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter by Status
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('shipped')}>
                    Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{format(order.date, 'PP')}</TableCell>
                      <TableCell>{getStatusBadge(order.status as OrderStatus)}</TableCell>
                      <TableCell>₹{order.total.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Change Status</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'pending')}
                                disabled={order.status === 'pending'}
                              >
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                                disabled={order.status === 'processing'}
                              >
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                disabled={order.status === 'shipped'}
                              >
                                Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                disabled={order.status === 'completed'}
                              >
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                disabled={order.status === 'cancelled'}
                                className="text-red-600"
                              >
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredOrders.length > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                      const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, pageCount));
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                        className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Order Detail Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                  <p>{format(selectedOrder.date, 'PPP')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                {getStatusBadge(selectedOrder.status as OrderStatus)}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</h3>
                <p>{selectedOrder.address.line1}</p>
                {selectedOrder.address.line2 && <p>{selectedOrder.address.line2}</p>}
                <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postal_code}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">₹{item.price.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="w-1/2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrdersPage;
