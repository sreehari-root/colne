
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import AdminLayout from '@/components/layout/AdminLayout';
import ProductForm from '@/components/products/ProductForm';
import ProductsTable from '@/components/products/ProductsTable';
import { ProductType, fetchProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api/products';
import { CategoryType, fetchCategories } from '@/lib/api/categories';

const ProductsPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const productsPerPage = 10;
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: '',
    price: 0,
    discount: 0,
    description: '',
    stock: 10,
    featured: false,
    bestseller: false,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Load products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products and categories',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setEditImagePreview(product.image);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      const success = await deleteProduct(productId);
      if (success) {
        setProducts(products.filter(product => product.id !== productId));
      }
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const product = await addProduct(newProduct, imageFile || undefined);
      if (product) {
        const updatedProduct = {
          ...product,
          category_name: categories.find(c => c.id === product.category_id)?.name
        };
        setProducts([updatedProduct, ...products]);
        setIsAddDialogOpen(false);
        resetNewProductForm();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    setIsLoading(true);
    try {
      const updatedProduct = await updateProduct(
        selectedProduct.id, 
        selectedProduct, 
        editImageFile || undefined
      );
      
      if (updatedProduct) {
        const updatedProductWithCategory = {
          ...updatedProduct,
          category_name: categories.find(c => c.id === updatedProduct.category_id)?.name
        };
        
        setProducts(products.map(p => 
          p.id === updatedProduct.id ? updatedProductWithCategory : p
        ));
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: '',
      category_id: '',
      price: 0,
      discount: 0,
      description: '',
      stock: 10,
      featured: false,
      bestseller: false,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [name]: name === 'price' || name === 'discount' || name === 'stock' 
          ? Number(value) 
          : value
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: name === 'price' || name === 'discount' || name === 'stock' 
          ? Number(value) 
          : value
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === 'stock') {
      const stockValue = checked ? 1 : 0;
      if (isEditDialogOpen && selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          stock: stockValue
        });
      } else {
        setNewProduct({
          ...newProduct,
          stock: stockValue
        });
      }
    } else {
      if (isEditDialogOpen && selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          [name]: checked
        });
      } else {
        setNewProduct({
          ...newProduct,
          [name]: checked
        });
      }
    }
  };

  const handleCategoryChange = (value: string) => {
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        category_id: value
      });
    } else {
      setNewProduct({
        ...newProduct,
        category_id: value
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file (JPEG, PNG, etc.)',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image size should not exceed 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEditDialogOpen) {
        setEditImageFile(file);
        setEditImagePreview(reader.result as string);
      } else {
        setImageFile(file);
        setImagePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                product={newProduct}
                categories={categories}
                imageFile={imageFile}
                imagePreview={imagePreview}
                isLoading={isLoading}
                onSubmit={handleAddProduct}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onSwitchChange={handleSwitchChange}
                onImageChange={handleImageChange}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ProductsTable
              products={currentProducts}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddProduct={() => setIsAddDialogOpen(true)}
            />
            
            {filteredProducts.length > productsPerPage && (
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
      
      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={selectedProduct}
              categories={categories}
              imageFile={editImageFile}
              imagePreview={editImagePreview}
              isLoading={isLoading}
              isEdit={true}
              onSubmit={handleUpdateProduct}
              onInputChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onSwitchChange={handleSwitchChange}
              onImageChange={handleImageChange}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default ProductsPage;
