
import React from 'react';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/constants';

export default function BestSelling() {
  // For best selling products, sort by salesCount and take top 4
  const bestSellingProducts = [...mockProducts]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Best Selling Products
          </h2>
          <a href="/products" className="mt-4 md:mt-0 text-usha-burgundy hover:underline">
            View All Products
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellingProducts.map((product) => (
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
