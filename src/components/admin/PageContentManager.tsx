
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ContentEditor from './ContentEditor';

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content: any;
  is_active: boolean;
  created_at: string;
}

const PageContentManager = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({
    page_slug: '',
    section_key: '',
    template_type: 'custom' as 'hero' | 'card' | 'list' | 'custom'
  });
  const { toast } = useToast();

  const availablePages = ['home', 'courses', 'about', 'contact', 'dashboard'];
  const templateTypes = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'card', label: 'Card Component' },
    { value: 'list', label: 'List Component' },
    { value: 'custom', label: 'Custom Content' }
  ];

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug', { ascending: true });

      if (error) throw error;
      setPageContents(data || []);
    } catch (error) {
      console.error('Error fetching page contents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch page contents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (content: any) => {
    try {
      if (editingContent) {
        const { error } = await supabase
          .from('page_content')
          .update({
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContent.id);

        if (error) throw error;
        toast({ title: "Success", description: "Content updated successfully" });
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert({
            page_slug: formData.page_slug,
            section_key: formData.section_key,
            content
          });

        if (error) throw error;
        toast({ title: "Success", description: "Content created successfully" });
      }

      setDialogOpen(false);
      setEditingContent(null);
      setFormData({ page_slug: '', section_key: '', template_type: 'custom' });
      fetchPageContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    }
  };

  const toggleContentStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Content ${!currentStatus ? 'activated' : 'deactivated'}` 
      });
      fetchPageContents();
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: "Error",
        description: "Failed to update content status",
        variant: "destructive"
      });
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Content deleted successfully" });
      fetchPageContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  const openDialog = (content?: PageContent) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        page_slug: content.page_slug,
        section_key: content.section_key,
        template_type: 'custom'
      });
    } else {
      setEditingContent(null);
      setFormData({ page_slug: '', section_key: '', template_type: 'custom' });
    }
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Page Content Management</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </DialogTitle>
            </DialogHeader>
            
            {!editingContent && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium">Page</label>
                  <Select
                    value={formData.page_slug}
                    onValueChange={(value) => setFormData({ ...formData, page_slug: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePages.map((page) => (
                        <SelectItem key={page} value={page}>
                          {page.charAt(0).toUpperCase() + page.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Section Key</label>
                  <Input
                    value={formData.section_key}
                    onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                    placeholder="hero, featured_courses, etc."
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Template Type</label>
                  <Select
                    value={formData.template_type}
                    onValueChange={(value: any) => setFormData({ ...formData, template_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templateTypes.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <ContentEditor
              initialContent={editingContent?.content || {}}
              onSave={handleSaveContent}
              templateType={formData.template_type}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading page contents...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">
                    {content.page_slug.charAt(0).toUpperCase() + content.page_slug.slice(1)}
                  </TableCell>
                  <TableCell>{content.section_key}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-gray-600">
                      {JSON.stringify(content.content).substring(0, 50)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={content.is_active ? "default" : "secondary"}>
                      {content.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(content.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleContentStatus(content.id, content.is_active)}
                      >
                        {content.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(content)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteContent(content.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PageContentManager;
