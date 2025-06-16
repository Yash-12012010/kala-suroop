
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Palette, Brush, Scissors, PaintBucket, Sparkles, Star, ArrowRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white/80 text-lg">Loading premium art supplies...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <ShoppingCart className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Premium Art Store</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Elite Art
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Supplies
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
              Discover premium art supplies and materials curated for creative excellence
            </p>
          </div>

          {/* Products Grid or Coming Soon */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className={`card-premium group hover:scale-[1.02] transition-all duration-500 animate-slide-in-bottom overflow-hidden ${!product.in_stock ? 'opacity-75' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${!product.in_stock ? 'filter grayscale' : ''}`}
                    />
                    {!product.in_stock && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-3 left-3 text-xs"
                      >
                        Out of Stock
                      </Badge>
                    )}
                    <Badge 
                      className="absolute top-3 right-3 bg-white/10 backdrop-blur-md text-white border-white/20 text-xs flex items-center space-x-1"
                    >
                      {product.icon}
                      <span className="hidden sm:inline">{product.category}</span>
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                      {product.title}
                    </CardTitle>
                    {product.description && (
                      <p className="text-sm text-purple-200/80 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xl font-bold text-green-400">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-purple-300 line-through">
                        ₹{product.original_price}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full btn-premium" 
                      disabled={!product.in_stock}
                      variant={product.in_stock ? "default" : "secondary"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-premium text-center py-20 animate-fade-in">
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Palette className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">
                      Elite Art Store Opening Soon!
                    </h2>
                    <p className="text-lg text-purple-200/80 max-w-md mx-auto">
                      We're curating the finest art supplies and materials for our creative elite. 
                      Stay tuned for the grand opening!
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Sparkles className="h-5 w-5" />
                    <span>Premium quality guaranteed</span>
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Notify Me When Available
                    </Button>
                    <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300">
                      Explore Art Courses
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories Information */}
          {products.length > 0 && (
            <div className="mt-16 text-center animate-slide-in-bottom">
              <p className="text-lg text-purple-200/80">
                More premium art supplies arriving soon! Follow us for updates on new collections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
