
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  category: string;
  description?: string;
}

const StoreManager = () => {
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

  // Mock data - in real implementation this would come from database
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: 'Professional Watercolor Paint Set',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
      price: 2499,
      originalPrice: 3999,
      inStock: true,
      category: 'Art Supplies',
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
      description: 'Professional canvas set in multiple sizes'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const updatedProducts = products.map(product =>
          product.id === editingProduct.id
            ? { ...product, ...formData }
            : product
        );
        setProducts(updatedProducts);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const newProduct: Product = {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          ...formData
        };
        setProducts([...products, newProduct]);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Store Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-green-600">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Products:</span>
                <span className="font-semibold">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Stock:</span>
                <span className="font-semibold">
                  {products.filter(p => p.inStock).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Out of Stock:</span>
                <span className="font-semibold">
                  {products.filter(p => !p.inStock).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Value:</span>
                <span className="font-semibold">
                  ₹{products.reduce((sum, product) => sum + product.price, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Potential Savings:</span>
                <span className="font-semibold">
                  ₹{products.reduce((sum, product) => sum + (product.originalPrice - product.price), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              Bulk Import Products
            </Button>
            <Button className="w-full" variant="outline">
              Export Product Data
            </Button>
            <Button className="w-full" variant="outline">
              Generate Store Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreManager;
