
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ShoppingCart, Palette, Brush, Scissors, PaintBucket, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  category: string;
  icon: React.ReactNode;
  description?: string;
}

const Store = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    price: 0,
    originalPrice: 0,
    inStock: false,
    category: '',
    description: ''
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: 'Professional Watercolor Paint Set',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
      price: 2499,
      originalPrice: 3999,
      inStock: true,
      category: 'Art Supplies',
      icon: <Palette className="h-4 w-4" />,
      description: 'High-quality watercolor paints for professional artists'
    },
    {
      id: 2,
      title: 'Premium Canvas Set - Various Sizes',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
      price: 1899,
      originalPrice: 2999,
      inStock: true,
      category: 'Canvas & Paper',
      icon: <Brush className="h-4 w-4" />,
      description: 'Professional canvas set in multiple sizes'
    },
    {
      id: 3,
      title: 'Acrylic Paint Brushes Collection',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
      price: 1299,
      originalPrice: 1899,
      inStock: false,
      category: 'Brushes',
      icon: <PaintBucket className="h-4 w-4" />,
      description: 'Complete set of acrylic paint brushes'
    },
    {
      id: 4,
      title: 'Art Supplies Organizer Kit',
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=250&fit=crop',
      price: 1599,
      originalPrice: 2299,
      inStock: true,
      category: 'Storage',
      icon: <Scissors className="h-4 w-4" />,
      description: 'Keep your art supplies organized and accessible'
    }
  ]);

  const categoryIcons = {
    'Art Supplies': <Palette className="h-4 w-4" />,
    'Canvas & Paper': <Brush className="h-4 w-4" />,
    'Brushes': <PaintBucket className="h-4 w-4" />,
    'Storage': <Scissors className="h-4 w-4" />
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const icon = categoryIcons[formData.category as keyof typeof categoryIcons] || <Palette className="h-4 w-4" />;
      
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(product =>
          product.id === editingProduct.id
            ? { ...product, ...formData, icon }
            : product
        );
        setProducts(updatedProducts);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create new product
        const newProduct: Product = {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          ...formData,
          icon
        };
        setProducts([...products, newProduct]);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      
      // Reset form and close dialog
      setFormData({
        title: '',
        image: '',
        price: 0,
        originalPrice: 0,
        inStock: false,
        category: '',
        description: ''
      });
      setEditingProduct(null);
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      inStock: product.inStock,
      category: product.category,
      description: product.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      image: '',
      price: 0,
      originalPrice: 0,
      inStock: false,
      category: '',
      description: ''
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10">
      <div className="pt-16 sm:pt-20 pb-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                  Kala Suroop Art Store
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Premium art supplies and materials for every artist's journey
                </p>
              </div>
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddDialog} className="ml-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Enter product title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="Enter image URL"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            placeholder="0"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="originalPrice">Original Price (₹)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          placeholder="Enter category"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inStock"
                          checked={formData.inStock}
                          onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                        />
                        <Label htmlFor="inStock">In Stock</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingProduct ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <Card key={product.id} className={`group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg ${!product.inStock ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className={`w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${!product.inStock ? 'filter grayscale' : ''}`}
                    />
                    {!product.inStock && (
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
                    {isAdmin && (
                      <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
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
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 sm:p-4 pt-0">
                    <Button 
                      className="w-full text-xs sm:text-sm" 
                      disabled={!product.inStock}
                      variant={product.inStock ? "default" : "secondary"}
                      size="sm"
                    >
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
