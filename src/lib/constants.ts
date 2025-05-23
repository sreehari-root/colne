
// Logo setup
export const ushaLogo = "/lovable-uploads/58e143db-43bd-4d54-a076-852305928435.png";

// Product Categories
export const productCategories = [
  "Pure Linen Sarees",
  "Chanderi Kotta Sarees",
  "Georgette Sarees",
  "Crepe Silk Sarees",
  "Bandhini Sarees",
  "Handloom Cotton Sarees",
  "Silk & Semi-Silk Sarees",
  "Organza Sarees",
  "Jute Silk Sarees",
  "Crispy Georgette Sarees",
  "Uppada Silk Sarees",
  "Pure Chander Sarees",
  "Georgette with Banarasi Weave Sarees",
  "Pure Kanchi silk",
  "Pure Tusser silk",
  "Gicha silk",
  "Handloom cotton silk (Mangalagiri)",
  "Raw mango silk",
  "Pure pathani silk",
  "Benarasi silk",
  "Hand embroidery sarees",
  "Ready blouse sarees",
  "Designer Kurtis nd 3Pc sets",
  "Dress materials",
  "Ready blouses"
];

// Group categories for menu display
export const groupedCategories = {
  silk: [
    "Pure Kanchi silk", 
    "Pure Tusser silk", 
    "Gicha silk", 
    "Raw mango silk", 
    "Pure pathani silk", 
    "Benarasi silk",
    "Uppada Silk Sarees",
    "Silk & Semi-Silk Sarees"
  ],
  cotton: [
    "Handloom Cotton Sarees", 
    "Handloom cotton silk (Mangalagiri)"
  ],
  georgette: [
    "Georgette Sarees", 
    "Crispy Georgette Sarees", 
    "Georgette with Banarasi Weave Sarees"
  ],
  designer: [
    "Designer Kurtis nd 3Pc sets", 
    "Hand embroidery sarees"
  ],
  ready: [
    "Ready blouse sarees", 
    "Ready blouses", 
    "Dress materials"
  ],
  other: [
    "Pure Linen Sarees",
    "Chanderi Kotta Sarees",
    "Crepe Silk Sarees",
    "Bandhini Sarees",
    "Organza Sarees",
    "Jute Silk Sarees",
    "Pure Chander Sarees"
  ]
};

// Featured Categories for homepage
export const featuredCategories = [
  {
    id: "silk-sarees",
    name: "Silk Sarees",
    description: "Luxurious silk sarees for special occasions",
    image: "https://images.unsplash.com/photo-1604502130252-20cdd1c80d13?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "cotton-sarees",
    name: "Cotton Sarees",
    description: "Comfortable handloom cotton for everyday elegance",
    image: "https://images.unsplash.com/photo-1581084324492-c5bd05cbd1a4?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "designer-sets",
    name: "Designer Sets",
    description: "Complete designer outfits for the modern woman",
    image: "https://images.unsplash.com/photo-1597983073453-ef06cfc2240e?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "ready-blouses",
    name: "Ready Blouses",
    description: "Perfect match for your favorite sarees",
    image: "https://images.unsplash.com/photo-1631233859262-0d7b12ea7d4c?q=80&w=500&auto=format&fit=crop"
  }
];

// Mock product data
export const mockProducts = [
  {
    id: 1,
    name: "Pure Kanchipuram Silk Saree",
    category: "Pure Kanchi silk",
    price: 12999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1610189356738-62e33e86eada?q=80&w=500&auto=format&fit=crop",
    description: "Authentic handwoven pure silk saree from Kanchipuram with gold zari work and traditional motifs.",
    colors: ["Burgundy", "Navy Blue", "Green"],
    inStock: true,
    rating: 4.8,
    salesCount: 126
  },
  {
    id: 2,
    name: "Handloom Cotton Silk Mangalagiri Saree",
    category: "Handloom cotton silk (Mangalagiri)",
    price: 4999,
    discount: 15,
    image: "https://images.unsplash.com/photo-1604502130252-20cdd1c80d13?q=80&w=500&auto=format&fit=crop",
    description: "Elegant Mangalagiri cotton-silk blend saree with traditional temple border and checks pattern.",
    colors: ["Yellow", "Pink", "Blue"],
    inStock: true,
    rating: 4.5,
    salesCount: 98
  },
  {
    id: 3,
    name: "Georgette Embroidered Saree",
    category: "Georgette Sarees",
    price: 7999,
    discount: 5,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=500&auto=format&fit=crop",
    description: "Lightweight georgette saree with intricate embroidery work and sequin detailing.",
    colors: ["Red", "Black", "Beige"],
    inStock: true,
    rating: 4.3,
    salesCount: 75
  },
  {
    id: 4,
    name: "Designer Bridal Banarasi Silk",
    category: "Benarasi silk",
    price: 18999,
    discount: 0,
    image: "https://images.unsplash.com/photo-1603189817218-32a1ec250280?q=80&w=500&auto=format&fit=crop",
    description: "Luxurious Banarasi silk saree with rich gold zari work and intricate designs perfect for bridal wear.",
    colors: ["Red", "Maroon"],
    inStock: true,
    rating: 4.9,
    salesCount: 42
  },
  {
    id: 5,
    name: "Ready-to-Wear Designer Blouse",
    category: "Ready blouses",
    price: 2999,
    discount: 20,
    image: "https://images.unsplash.com/photo-1631233859262-0d7b12ea7d4c?q=80&w=500&auto=format&fit=crop",
    description: "Ready-to-wear designer blouse with mirror work and embroidery, perfect to pair with any saree.",
    colors: ["Gold", "Silver", "Black"],
    inStock: true,
    rating: 4.2,
    salesCount: 154
  },
  {
    id: 6,
    name: "Designer Kurta with Palazzo",
    category: "Designer Kurtis nd 3Pc sets",
    price: 6499,
    discount: 12,
    image: "https://images.unsplash.com/photo-1528855275993-0f4a23fedd62?q=80&w=500&auto=format&fit=crop",
    description: "Elegant designer kurta with matching palazzo pants and dupatta, perfect for festive occasions.",
    colors: ["Turquoise", "Pink", "Yellow"],
    inStock: true,
    rating: 4.6,
    salesCount: 89
  },
  {
    id: 7,
    name: "Organza Silk Designer Saree",
    category: "Organza Sarees",
    price: 9999,
    discount: 8,
    image: "https://images.unsplash.com/photo-1614177173211-7bab9e0a3f29?q=80&w=500&auto=format&fit=crop",
    description: "Lightweight organza silk saree with floral embroidery and pearl work for a contemporary look.",
    colors: ["Pastel Pink", "Sky Blue", "Mint Green"],
    inStock: true,
    rating: 4.7,
    salesCount: 67
  },
  {
    id: 8,
    name: "Pure Linen Digital Print Saree",
    category: "Pure Linen Sarees",
    price: 5999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop",
    description: "Pure linen saree with modern digital print design, perfect for office and casual gatherings.",
    colors: ["Beige", "Gray", "Teal"],
    inStock: true,
    rating: 4.4,
    salesCount: 112
  }
];

// Carousel slides for homepage
export const carouselSlides = [
  {
    id: 1,
    title: "Finest Collection of Traditional Silk Sarees",
    subtitle: "Explore our exclusive Kanchipuram & Banarasi collection",
    image: "https://images.unsplash.com/photo-1610189356738-62e33e86eada?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "/category/silk"
  },
  {
    id: 2,
    title: "Designer Festive Collection",
    subtitle: "Celebrate the season with our exquisite designer wear",
    image: "https://images.unsplash.com/photo-1603189817218-32a1ec250280?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Discover",
    buttonLink: "/category/festive"
  },
  {
    id: 3,
    title: "Handcrafted Cotton Collections",
    subtitle: "Comfortable, sustainable, and beautifully crafted",
    image: "https://images.unsplash.com/photo-1604502130252-20cdd1c80d13?q=80&w=1200&auto=format&fit=crop", 
    buttonText: "Browse Collection",
    buttonLink: "/category/cotton"
  }
];

// Admin default credentials
export const adminCredentials = {
  email: "admin@admin.com",
  password: "Admin@123"
};
