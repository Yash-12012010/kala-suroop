
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: string | null;
  parent_id: string | null;
  order_index: number;
  is_active: boolean;
  required_role: string | null;
  is_external: boolean;
}

const NavigationManager = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    path: '',
    icon: '',
    parent_id: '',
    order_index: 0,
    is_active: true,
    required_role: 'user',
    is_external: false
  });

  useEffect(() => {
    fetchNavigationItems();
  }, []);

  const fetchNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order_index');

      if (error) throw error;
      
      // Map the data to match our interface
      const mappedData: NavigationItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        icon: item.icon,
        parent_id: item.parent_id,
        order_index: item.order_index,
        is_active: item.is_active,
        required_role: item.required_role,
        is_external: item.is_external
      }));
      
      setNavItems(mappedData);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch navigation items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('navigation_items')
          .update({
            ...formData,
            parent_id: formData.parent_id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Navigation item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('navigation_items')
          .insert([{
            ...formData,
            parent_id: formData.parent_id || null
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Navigation item created successfully",
        });
      }

      resetForm();
      fetchNavigationItems();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving navigation item:', error);
      toast({
        title: "Error",
        description: "Failed to save navigation item",
        variant: "destructive",
      });
    }
  };

  const deleteNavItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Navigation item deleted successfully",
      });
      fetchNavigationItems();
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      toast({
        title: "Error",
        description: "Failed to delete navigation item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      path: '',
      icon: '',
      parent_id: '',
      order_index: 0,
      is_active: true,
      required_role: 'user',
      is_external: false
    });
    setEditingItem(null);
  };

  const editNavItem = (item: NavigationItem) => {
    setFormData({
      name: item.name,
      path: item.path,
      icon: item.icon || '',
      parent_id: item.parent_id || '',
      order_index: item.order_index,
      is_active: item.is_active,
      required_role: item.required_role,
      is_external: item.is_external
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading navigation items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Navigation Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Navigation Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Navigation Item' : 'Create Navigation Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. Home, User, Settings"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="required_role">Required Role</Label>
                  <Select value={formData.required_role} onValueChange={(value) => setFormData({ ...formData, required_role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="order_index">Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_external"
                    checked={formData.is_external}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_external: checked })}
                  />
                  <Label htmlFor="is_external">External Link</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {navItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">{item.path}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {item.required_role}
                      </span>
                      {item.is_external && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          External
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editNavItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteNavItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        
        {navItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No navigation items found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NavigationManager;
