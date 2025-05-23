
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { carouselSlides } from '@/lib/constants';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slideCount = carouselSlides.length;

  const nextSlide = () => {
    setCurrent((current + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + slideCount) % slideCount);
  };

  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {carouselSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            current === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 z-20">
            <div className="max-w-md text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                {slide.subtitle}
              </p>
              <Button 
                asChild
                className="bg-usha-gold hover:bg-usha-gold/90 text-usha-dark"
              >
                <Link to={slide.buttonLink}>
                  {slide.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              current === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
