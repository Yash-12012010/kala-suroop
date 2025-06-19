
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Palette, Brush, Scissors, PaintBucket, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, type Product as APIProduct } from '@/lib/api';

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
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
      const data = await api.getProducts();
      
      return data?.map(product => ({
        ...product,
        icon: categoryIcons[product.category as keyof typeof categoryIcons] || <Palette className="h-4 w-4" />
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-white/90 text-lg font-medium">Loading premium art supplies...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-[#B5EF8A] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-[#D7F171] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#F19A3E]/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(241,154,62,0.1) 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-[#F19A3E]/20">
              <ShoppingCart className="h-5 w-5 text-[#F19A3E]" />
              <span className="text-white font-medium">Premium Art Store</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent">
                Elite Art
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent">
                Supplies
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Discover premium art supplies and materials curated for creative excellence
            </p>
          </div>

          {/* Products Grid or Coming Soon */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className={`bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 group hover:scale-[1.02] transition-all duration-500 animate-slide-in-bottom overflow-hidden shadow-xl hover:shadow-2xl ${!product.inStock ? 'opacity-75' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${!product.inStock ? 'filter grayscale' : ''}`}
                    />
                    {!product.inStock && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-3 left-3 text-xs bg-red-500/80 text-white"
                      >
                        Out of Stock
                      </Badge>
                    )}
                    <Badge 
                      className="absolute top-3 right-3 bg-[#F19A3E]/80 backdrop-blur-md text-white border-[#F19A3E]/40 text-xs flex items-center space-x-1"
                    >
                      {product.icon}
                      <span className="hidden sm:inline">{product.category}</span>
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white font-bold group-hover:text-[#D7F171] transition-colors duration-300 line-clamp-2">
                      {product.title}
                    </CardTitle>
                    {product.description && (
                      <p className="text-sm text-white/90 line-clamp-2 font-medium">
                        {product.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xl font-bold text-[#B5EF8A]">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-white/70 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-medium" 
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
            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 text-center py-20 animate-fade-in shadow-xl">
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#F19A3E] to-[#D7F171] rounded-full flex items-center justify-center animate-pulse">
                    <Palette className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">
                      Elite Art Store Opening Soon!
                    </h2>
                    <p className="text-lg text-white/90 max-w-md mx-auto font-medium">
                      We're curating the finest art supplies and materials for our creative elite. 
                      Stay tuned for the grand opening!
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[#D7F171]">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">Premium quality guaranteed</span>
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
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
              <p className="text-lg text-white/90 font-medium">
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
