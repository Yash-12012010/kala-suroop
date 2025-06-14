import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content: any;
  is_active: boolean;
}

const PageContentManager = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    page_slug: '',
    section_key: '',
    content: '',
    is_active: true
  });

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug');

      if (error) throw error;
      setPageContents(data || []);
    } catch (error) {
      console.error('Error fetching page contents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch page contents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let content: any = formData.content;
      
      // Try to parse as JSON if it looks like JSON
      if (content.startsWith('{') || content.startsWith('[')) {
        try {
          content = JSON.parse(content);
        } catch {
          // If parsing fails, keep as string
        }
      }

      if (editingContent) {
        const { error } = await supabase
          .from('page_content')
          .update({
            ...formData,
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContent.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Page content updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert([{
            ...formData,
            content: content
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Page content created successfully",
        });
      }

      resetForm();
      fetchPageContents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving page content:', error);
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive",
      });
    }
  };

  const deletePageContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Page content deleted successfully",
      });
      fetchPageContents();
    } catch (error) {
      console.error('Error deleting page content:', error);
      toast({
        title: "Error",
        description: "Failed to delete page content",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      page_slug: '',
      section_key: '',
      content: '',
      is_active: true
    });
    setEditingContent(null);
  };

  const editPageContent = (content: PageContent) => {
    setFormData({
      page_slug: content.page_slug,
      section_key: content.section_key,
      content: typeof content.content === 'string' ? content.content : JSON.stringify(content.content, null, 2),
      is_active: content.is_active
    });
    setEditingContent(content);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading page contents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Page Content Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Edit Page Content' : 'Create Page Content'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page_slug">Page Slug</Label>
                  <Input
                    id="page_slug"
                    value={formData.page_slug}
                    onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
                    placeholder="e.g. home, about, contact"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="section_key">Section Key</Label>
                  <Input
                    id="section_key"
                    value={formData.section_key}
                    onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                    placeholder="e.g. hero, features, testimonials"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content (JSON or text)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContent ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pageContents.map((content) => (
          <Card key={content.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {content.page_slug} / {content.section_key}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded ${
                      content.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {content.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editPageContent(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePageContent(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {typeof content.content === 'string' 
                    ? content.content 
                    : JSON.stringify(content.content, null, 2)
                  }
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {pageContents.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No page content created yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PageContentManager;
