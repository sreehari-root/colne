
import React from 'react';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/constants';

export default function FeaturedProducts() {
  // For featured products, we'll use the first 4 products from our mock data
  const featuredProducts = mockProducts.slice(0, 4);
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured Collection
          </h2>
          <a href="/products" className="mt-4 md:mt-0 text-usha-burgundy hover:underline">
            View All Products
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              discount={product.discount}
              image={product.image}
              category={product.category}
              inStock={product.inStock}
              rating={product.rating}
              salesCount={product.salesCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
