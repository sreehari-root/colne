
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Edit, Trash2, ChevronDown, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dropdown-menu';
import { ProductType } from '@/lib/api/products';
import { formatCurrency } from '@/lib/utils';

interface ProductsTableProps {
  products: ProductType[];
  isLoading: boolean;
  onEdit: (product: ProductType) => void;
  onDelete: (productId: string) => void;
  onAddProduct: () => void;
}

const ProductsTable = ({ products, isLoading, onEdit, onDelete, onAddProduct }: ProductsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Package className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">No products yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={onAddProduct}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category_name || 'Uncategorized'}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  {product.stock && product.stock > 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      In Stock ({product.stock})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                      Out of Stock
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/product/${product.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
