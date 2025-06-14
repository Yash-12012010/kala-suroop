
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  page_slug: string;
  section_key: string;
  content: any;
  is_active: boolean;
}

const LiveContentManager = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<any>({});
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetchContents();
    setupRealtimeSubscription();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    // Clean up existing channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new channel
    const channel = supabase
      .channel('page_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content'
        },
        () => {
          fetchContents();
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  const updateContent = async (id: string, newContent: any) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .update({
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content updated in real-time",
      });
      
      setEditingId(null);
      setEditContent({});
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
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
        description: `Content ${!currentStatus ? 'activated' : 'deactivated'} in real-time`,
      });
    } catch (error) {
      console.error('Error toggling content status:', error);
    }
  };

  const startEdit = (content: ContentItem) => {
    setEditingId(content.id);
    setEditContent(content.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent({});
  };

  const renderContentEditor = (content: any, onChange: (newContent: any) => void) => {
    if (typeof content === 'string') {
      return (
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[100px]"
        />
      );
    }

    if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <Label className="font-medium">{key}</Label>
              {typeof value === 'string' ? (
                <Textarea
                  value={value}
                  onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={JSON.stringify(value)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      onChange({ ...content, [key]: parsed });
                    } catch {
                      onChange({ ...content, [key]: e.target.value });
                    }
                  }}
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <Input
        value={String(content)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Live Content Editor
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Edit website content with real-time preview updates
        </p>
      </div>

      <div className="grid gap-4">
        {contents.map((content) => (
          <Card key={content.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {content.page_slug} - {content.section_key}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={content.is_active ? "default" : "secondary"}>
                      {content.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleContentStatus(content.id, content.is_active)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {editingId === content.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateContent(content.id, editContent)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(content)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {editingId === content.id ? (
                renderContentEditor(editContent, setEditContent)
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {typeof content.content === 'string' 
                      ? content.content 
                      : JSON.stringify(content.content, null, 2)
                    }
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveContentManager;
