
import React from 'react';
import { Link } from 'react-router-dom';
import { featuredCategories } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function FeaturedCategories() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category, index) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className={cn(
                "group relative overflow-hidden rounded-lg h-64 transition-transform hover:scale-[1.02]",
                "animate-fade-in",
                { "animation-delay-100": index === 1 },
                { "animation-delay-200": index === 2 },
                { "animation-delay-300": index === 3 }
              )}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm mb-3">{category.description}</p>
                <span className="text-usha-gold text-sm font-medium group-hover:underline">
                  Shop Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
