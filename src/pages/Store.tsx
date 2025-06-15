
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Palette, Brush, Scissors, PaintBucket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  original_price: number;
  in_stock: boolean;
  category: string;
  description?: string;
  icon: React.ReactNode;
}

const Store = () => {
  const categoryIcons = {
    'Art Supplies': <Palette className="h-4 w-4" />,
    'Canvas & Paper': <Brush className="h-4 w-4" />,
    'Brushes': <PaintBucket className="h-4 w-4" />,
    'Storage': <Scissors className="h-4 w-4" />
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data?.map(product => ({
        ...product,
        icon: categoryIcons[product.category as keyof typeof categoryIcons] || <Palette className="h-4 w-4" />
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10">
        <div className="pt-16 sm:pt-20 pb-8 sm:pb-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10">
      <div className="pt-16 sm:pt-20 pb-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Kala Suroop Art Store
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Premium art supplies and materials for every artist's journey
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <Card key={product.id} className={`group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg ${!product.in_stock ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className={`w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${!product.in_stock ? 'filter grayscale' : ''}`}
                    />
                    {!product.in_stock && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 sm:top-3 left-2 sm:left-3 text-xs"
                      >
                        Out of Stock
                      </Badge>
                    )}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs flex items-center gap-1"
                    >
                      {product.icon}
                      <span className="hidden sm:inline">{product.category}</span>
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2 text-gray-900 dark:text-white">
                      {product.title}
                    </CardTitle>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        ₹{product.original_price}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 sm:p-4 pt-0">
                    <Button 
                      className="w-full text-xs sm:text-sm" 
                      disabled={!product.in_stock}
                      variant={product.in_stock ? "default" : "secondary"}
                      size="sm"
                    >
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">🎨</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Art Store Opening Soon!
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto px-4">
                We're curating amazing art supplies and materials for our creative community. 
                Stay tuned for the grand opening! 🎨
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button variant="outline" size="sm" className="text-sm">
                  Notify Me When Available
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 text-sm">
                  Browse Art Classes Instead
                </Button>
              </div>
            </div>
          )}

          {/* Categories Filter (placeholder for future) */}
          {products.length > 0 && (
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                More art supplies coming soon! Follow us for updates on new arrivals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
