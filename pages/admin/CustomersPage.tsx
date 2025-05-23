
import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Eye, Loader2, User } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { format } from 'date-fns';
import AdminLayout from '@/components/layout/AdminLayout';
import { CustomerType, fetchCustomers, getCustomerOrders } from '@/lib/api/customers';
import { formatCurrency } from '@/lib/utils';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const customersPerPage = 10;
  
  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomers();
  }, []);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (customer.first_name && customer.first_name.toLowerCase().includes(searchLower)) ||
      (customer.last_name && customer.last_name.toLowerCase().includes(searchLower)) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phone && customer.phone.includes(searchTerm))
    );
  });
  
  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const pageCount = Math.ceil(filteredCustomers.length / customersPerPage);
  
  const viewCustomer = async (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
    
    try {
      const orders = await getCustomerOrders(customer.id);
      setCustomerOrders(orders);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      setCustomerOrders([]);
    }
  };

  const getInitials = (first?: string | null, last?: string | null) => {
    let initials = '';
    if (first) initials += first[0].toUpperCase();
    if (last) initials += last[0].toUpperCase();
    return initials || 'U';
  };
  
  const getFullName = (customer: CustomerType) => {
    const firstName = customer.first_name || '';
    const lastName = customer.last_name || '';
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown User';
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">View and manage customer information</p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Since</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading customers...</p>
                      </TableCell>
                    </TableRow>
                  ) : currentCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {filteredCustomers.length === 0 && customers.length > 0
                            ? 'No customers found matching your search'
                            : 'No customers yet'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(customer.first_name, customer.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{getFullName(customer)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {customer.email && (
                              <div className="flex items-center">
                                <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.email}</span>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center">
                                <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.created_at ? format(new Date(customer.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {customer.orders_count || 0}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(customer.total_spent || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {filteredCustomers.length > customersPerPage && (
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
      
      {/* Customer Detail Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{getInitials(selectedCustomer.first_name, selectedCustomer.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{getFullName(selectedCustomer)}</h2>
                  <p className="text-muted-foreground">
                    Customer since {format(new Date(selectedCustomer.created_at), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                    <div className="mt-1 space-y-1">
                      {selectedCustomer.email && (
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                      )}
                      {selectedCustomer.phone && (
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedCustomer.address && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                      <div className="mt-1">
                        <p>{selectedCustomer.address}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Order Summary</h3>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span className="font-medium">{selectedCustomer.orders_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Spent:</span>
                        <span className="font-medium">{formatCurrency(selectedCustomer.total_spent || 0)}</span>
                      </div>
                      {selectedCustomer.last_order_date && (
                        <div className="flex justify-between">
                          <span>Last Order:</span>
                          <span className="font-medium">
                            {format(new Date(selectedCustomer.last_order_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order History</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            <p className="text-sm text-muted-foreground">No orders yet</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        customerOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                            <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{formatCurrency(order.total)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-50 text-green-700' :
                                order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CustomersPage;
