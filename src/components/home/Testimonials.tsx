
import React from 'react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    text: "I purchased a Kanchipuram silk saree for my daughter's wedding and was amazed by the quality. The intricate zari work and vibrant colors made it stand out. Received many compliments!",
    author: "Priya Sharma",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: 2,
    text: "Usha Designs has become my go-to store for all ethnic wear. Their collection is unique and the customer service is excellent. The ready blouses fit perfectly!",
    author: "Meera Patel",
    location: "Ahmedabad",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: 3,
    text: "As someone who appreciates traditional craftsmanship, I can say that Usha Designs truly values quality. Their handloom cotton sarees are comfortable for daily wear while still looking elegant.",
    author: "Arjun Reddy",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          What Our Customers Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={cn(
                "bg-background p-6 rounded-lg border shadow-sm",
                "animate-fade-in",
                { "animation-delay-100": index === 1 },
                { "animation-delay-200": index === 2 }
              )}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-usha-gold opacity-80"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                
                <p className="text-muted-foreground flex-grow">
                  {testimonial.text}
                </p>
                
                <div className="flex items-center mt-4 pt-4 border-t">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
