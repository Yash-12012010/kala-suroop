
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const Store = () => {
  const products = [
    {
      id: 1,
      title: 'Premium Study Notes - Class 10 Math',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
      price: 299,
      originalPrice: 499,
      inStock: false,
      category: 'Study Material'
    },
    {
      id: 2,
      title: 'Physics Lab Equipment Kit',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
      price: 1999,
      originalPrice: 2999,
      inStock: false,
      category: 'Lab Equipment'
    },
    {
      id: 3,
      title: 'Chemistry Reference Guide',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      price: 599,
      originalPrice: 899,
      inStock: false,
      category: 'Reference Books'
    },
    {
      id: 4,
      title: 'Scientific Calculator',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
      price: 1299,
      originalPrice: 1799,
      inStock: false,
      category: 'Accessories'
    }
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Study Store
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Premium study materials and educational resources
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden opacity-75">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 filter grayscale"
                  />
                  <Badge 
                    variant="destructive" 
                    className="absolute top-3 left-3"
                  >
                    Out of Stock
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3"
                  >
                    {product.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {product.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    className="w-full" 
                    disabled={!product.inStock}
                    variant={product.inStock ? "default" : "secondary"}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Store Coming Soon!
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              We're working hard to bring you amazing study materials and educational resources. 
              Check back soon! 😉
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                Notify Me When Available
              </Button>
              <Button>
                Browse Courses Instead
              </Button>
            </div>
          </div>
        )}

        {/* Categories Filter (placeholder for future) */}
        {products.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              More products coming soon! Stay tuned for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
