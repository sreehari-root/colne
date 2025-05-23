
import React, { useState } from 'react';
import { Star, Search, Eye, Trash2, Check, X } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import AdminLayout from '@/components/layout/AdminLayout';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    productId: 101,
    productName: 'Embroidered Silk Saree',
    productImage: 'https://images.unsplash.com/photo-1583391733981-8b530c1b94fe?auto=format&fit=crop&w=800&q=60',
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely gorgeous saree! The embroidery work is intricate and beautiful. The fabric quality is excellent and it drapes beautifully. Got so many compliments when I wore it to a wedding.',
    date: new Date(2025, 4, 15),
    status: 'published',
  },
  {
    id: 2,
    productId: 102,
    productName: 'Designer Lehenga',
    productImage: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=60',
    customerName: 'Nisha Patel',
    rating: 4,
    comment: 'Beautiful lehenga with great craftsmanship. The color is vibrant and true to the pictures. The only reason for 4 stars is that the blouse needed some alterations.',
    date: new Date(2025, 4, 12),
    status: 'published',
  },
  {
    id: 3,
    productId: 103,
    productName: 'Handcrafted Jhumkas',
    productImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=60',
    customerName: 'Aarti Kumar',
    rating: 5,
    comment: 'These jhumkas are stunning! They are lightweight despite their size and the craftsmanship is wonderful. They add the perfect touch to my ethnic outfits.',
    date: new Date(2025, 4, 10),
    status: 'pending',
  },
  {
    id: 4,
    productId: 104,
    productName: 'Traditional Kurta',
    productImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=60',
    customerName: 'Rohit Singh',
    rating: 2,
    comment: 'The color was not as shown in the picture. The fabric quality is also mediocre. Quite disappointed with the purchase.',
    date: new Date(2025, 4, 8),
    status: 'pending',
  },
  {
    id: 5,
    productId: 105,
    productName: 'Designer Clutch',
    productImage: 'https://images.unsplash.com/photo-1594223274512-ad4b504bff69?auto=format&fit=crop&w=800&q=60',
    customerName: 'Meena Reddy',
    rating: 4,
    comment: 'Lovely clutch with beautiful embellishments. The size is perfect and it has enough compartments for essentials. The clasp is a bit tight though.',
    date: new Date(2025, 4, 5),
    status: 'published',
  },
];

type ReviewStatus = 'pending' | 'published' | 'rejected';

const ReviewsPage = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const reviewsPerPage = 10;
  
  // Filter reviews based on search term and status
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
  
  const viewReview = (review: any) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };
  
  const updateReviewStatus = (reviewId: number, newStatus: ReviewStatus) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    );
    setReviews(updatedReviews);
    
    toast({
      title: "Review status updated",
      description: `The review has been ${newStatus}.`,
    });
  };
  
  const deleteReview = (reviewId: number) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    
    toast({
      title: "Review deleted",
      description: "The review has been permanently removed.",
    });
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Published</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
    ));
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reviews Management</h1>
            <p className="text-muted-foreground">Manage customer reviews and ratings</p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reviews..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    Filter by Status
                    {statusFilter !== 'all' && (
                      <Badge variant="secondary" className="ml-2">
                        {statusFilter}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Reviews
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img 
                            src={review.productImage} 
                            alt={review.productName} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{review.customerName}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate">{review.comment}</p>
                      </TableCell>
                      <TableCell>{format(review.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(review.status as ReviewStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewReview(review)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          {review.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600"
                                onClick={() => updateReviewStatus(review.id, 'published')}
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => updateReviewStatus(review.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => deleteReview(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredReviews.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No reviews found matching your criteria.</p>
              </div>
            )}
            
            {filteredReviews.length > 0 && pageCount > 1 && (
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
      
      {/* Review Detail Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-md overflow-hidden">
                  <img 
                    src={selectedReview.productImage} 
                    alt={selectedReview.productName} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{selectedReview.productName}</h3>
                  <p className="text-muted-foreground">Product ID: {selectedReview.productId}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Customer:</p>
                    <p>{selectedReview.customerName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium">Submitted:</p>
                    <p>{format(selectedReview.date, 'MMMM dd, yyyy')}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium">Status:</p>
                    <p>{getStatusBadge(selectedReview.status as ReviewStatus)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium">Rating:</p>
                    <div className="flex">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Comment:</p>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                {selectedReview.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => {
                        updateReviewStatus(selectedReview.id, 'rejected');
                        setIsViewModalOpen(false);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-green-600"
                      onClick={() => {
                        updateReviewStatus(selectedReview.id, 'published');
                        setIsViewModalOpen(false);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsViewModalOpen(false)}>
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

export default ReviewsPage;
