
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronsUpDown } from "lucide-react"
import MainLayout from '@/components/layout/MainLayout';
import { mockProducts } from '@/lib/constants';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  
  // Define available sizes manually since the mock data doesn't have sizes
  const [availableSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Define colors from the products' colors arrays
  const [availableColors] = useState(Array.from(new Set(mockProducts.flatMap(product => product.colors))));
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState(Math.min(...mockProducts.map(product => product.price)));
  const [maxPrice, setMaxPrice] = useState(Math.max(...mockProducts.map(product => product.price)));
  const [priceFilterRange, setPriceFilterRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    if (category) {
      const categoryProducts = mockProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
      setMinPrice(Math.min(...categoryProducts.map(product => product.price)));
      setMaxPrice(Math.max(...categoryProducts.map(product => product.price)));
      setPriceFilterRange([Math.min(...categoryProducts.map(product => product.price)), Math.max(...categoryProducts.map(product => product.price))]);
    } else {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setMinPrice(Math.min(...mockProducts.map(product => product.price)));
      setMaxPrice(Math.max(...mockProducts.map(product => product.price)));
      setPriceFilterRange([Math.min(...mockProducts.map(product => product.price)), Math.max(...mockProducts.map(product => product.price))]);
    }
    setCurrentPage(1); // Reset to first page when category changes
  }, [category]);

  // Sorting function
  const sortProducts = useCallback((productsToSort: any[]) => {
    let sortedProducts = [...productsToSort];
    switch (sortOrder) {
      case 'asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default sorting: reset to original order
        sortedProducts = category ? mockProducts.filter(product =>
          product.category.toLowerCase() === category.toLowerCase()
        ) : mockProducts;
        break;
    }
    return sortedProducts;
  }, [sortOrder, category]);

  // Size filtering
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prevSizes =>
      prevSizes.includes(size) ? prevSizes.filter(s => s !== size) : [...prevSizes, size]
    );
  };

  // Color filtering
  const handleColorChange = (color: string) => {
    setSelectedColors(prevColors =>
      prevColors.includes(color) ? prevColors.filter(c => c !== color) : [...prevColors, color]
    );
  };

  // Price filtering
  const handlePriceChange = (value: number[]) => {
    setPriceFilterRange(value);
  };

  useEffect(() => {
    // Apply filters
    let newFilteredProducts = [...products];

    // Filter by size (if we had size data in the products)
    if (selectedSizes.length > 0) {
      // Since our mock data doesn't have size information, this is a placeholder
      // In a real app, you would filter based on actual product sizes
      // newFilteredProducts = newFilteredProducts.filter(product =>
      //   product.sizes.some(size => selectedSizes.includes(size))
      // );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      newFilteredProducts = newFilteredProducts.filter(product =>
        product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Filter by price
    newFilteredProducts = newFilteredProducts.filter(product =>
      product.price >= priceFilterRange[0] && product.price <= priceFilterRange[1]
    );

    // Sort products
    newFilteredProducts = sortProducts(newFilteredProducts);

    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedSizes, selectedColors, priceFilterRange, products, sortProducts]);

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 flex flex-col md:flex-row gap-8">
        {/* Filter Section */}
        <aside className="w-full md:w-80 p-4 border rounded">
          <ScrollArea className="h-[500px] w-full">
            <Card>
              <CardHeader>
                <CardTitle>Filter by Price</CardTitle>
                <CardDescription>Set the price range for products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={priceFilterRange[0]}
                    onChange={(e) => handlePriceChange([Number(e.target.value), priceFilterRange[1]])}
                    className="w-24"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={priceFilterRange[1]}
                    onChange={(e) => handlePriceChange([priceFilterRange[0], Number(e.target.value)])}
                    className="w-24"
                  />
                </div>
                <Slider
                  value={priceFilterRange}
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  onValueChange={handlePriceChange}
                />
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Filter by Size</CardTitle>
                <CardDescription>Select the sizes you want to filter by</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1">
                  {availableSizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                      />
                      <label
                        htmlFor={`size-${size}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Filter by Color</CardTitle>
                <CardDescription>Select the colors you want to filter by</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1">
                  {availableColors.map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => handleColorChange(color)}
                      />
                      <label
                        htmlFor={`color-${color}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </aside>

        {/* Product Listing Section */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{category ? category : 'All Products'}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Sort by Price
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder('default')}>
                  <ChevronsUpDown className="mr-2 h-4 w-4" />
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                  <ChevronDown className="mr-2 h-4 w-4 rotate-180" />
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group">
                <Card className="h-full flex flex-col">
                  <CardHeader className="p-0">
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover rounded-md aspect-video"
                      />
                    </AspectRatio>
                  </CardHeader>
                  <CardContent className="flex flex-col p-4 space-y-2 flex-grow">
                    <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription>
                      ₹{product.price.toLocaleString('en-IN')}
                    </CardDescription>
                    {product.discount && (
                      <Badge variant="secondary">
                        {product.discount}% off
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {/* Display up to 5 page numbers */}
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, pageCount));
                    return (
                      <PaginationItem key={pageNumber} hidden={pageNumber > pageCount}>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.min(prev + 1, pageCount));
                      }}
                      className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
