
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const QuickEditPanel = () => {
  const [newContent, setNewContent] = useState({
    page_slug: 'home',
    section_key: '',
    content_type: 'text',
    content: ''
  });
  const { toast } = useToast();

  const pages = ['home', 'courses', 'about', 'contact', 'dashboard', 'announcements'];
  const contentTypes = [
    { value: 'text', label: 'Text Content' },
    { value: 'hero', label: 'Hero Section' },
    { value: 'card', label: 'Card Component' },
    { value: 'list', label: 'List Items' },
    { value: 'stats', label: 'Statistics' },
    { value: 'custom', label: 'Custom JSON' }
  ];

  const createContent = async () => {
    try {
      let content;
      
      if (newContent.content_type === 'text') {
        content = newContent.content;
      } else if (newContent.content_type === 'hero') {
        content = {
          title: newContent.content || 'New Hero Title',
          subtitle: 'Hero subtitle',
          buttonText: 'Get Started',
          buttonLink: '/courses'
        };
      } else if (newContent.content_type === 'stats') {
        content = {
          stats: [
            { label: 'Students', value: '1000+', color: 'orange' },
            { label: 'Courses', value: '50+', color: 'pink' },
            { label: 'Teachers', value: '25+', color: 'purple' },
            { label: 'Success', value: '98%', color: 'blue' }
          ]
        };
      } else {
        try {
          content = JSON.parse(newContent.content);
        } catch {
          content = newContent.content;
        }
      }

      const { error } = await supabase
        .from('page_content')
        .insert({
          page_slug: newContent.page_slug,
          section_key: newContent.section_key,
          content: content
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      
      setNewContent({
        page_slug: 'home',
        section_key: '',
        content_type: 'text',
        content: ''
      });
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Quick Content Creator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="page">Target Page</Label>
            <Select
              value={newContent.page_slug}
              onValueChange={(value) => setNewContent({ ...newContent, page_slug: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="section">Section Key</Label>
            <Input
              value={newContent.section_key}
              onChange={(e) => setNewContent({ ...newContent, section_key: e.target.value })}
              placeholder="e.g., hero, features, stats"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content_type">Content Type</Label>
          <Select
            value={newContent.content_type}
            onValueChange={(value) => setNewContent({ ...newContent, content_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          {newContent.content_type === 'text' ? (
            <Textarea
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              placeholder="Enter your text content..."
              className="min-h-[100px]"
            />
          ) : newContent.content_type === 'hero' ? (
            <Input
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              placeholder="Hero title text"
            />
          ) : newContent.content_type === 'stats' ? (
            <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded">
              Template stats will be created automatically
            </div>
          ) : (
            <Textarea
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              placeholder="Enter JSON content..."
              className="min-h-[100px] font-mono"
            />
          )}
        </div>

        <Button 
          onClick={createContent} 
          className="w-full"
          disabled={!newContent.section_key}
        >
          <Save className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickEditPanel;
