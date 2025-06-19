
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, FileText, Settings, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuickEditPanel = () => {
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    type: 'announcement'
  });
  const { toast } = useToast();

  const contentTypes = [
    { value: 'announcement', label: 'Announcement', icon: FileText },
    { value: 'setting', label: 'Website Setting', icon: Settings },
    { value: 'template', label: 'Template Content', icon: Palette }
  ];

  const createContent = async () => {
    try {
      // This is a simplified version for demonstration
      // In a real implementation, you would save to appropriate tables
      console.log('Creating content:', newContent);
      
      toast({
        title: "Success",
        description: "Content template created successfully",
      });
      
      setNewContent({
        title: '',
        content: '',
        type: 'announcement'
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

  const selectedType = contentTypes.find(type => type.value === newContent.type);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
        <CardTitle className="flex items-center text-xl font-bold">
          <Plus className="h-6 w-6 mr-3 text-indigo-600" />
          Quick Content Creator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Content Title</Label>
            <Input
              id="title"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              placeholder="Enter content title..."
              className="border-gray-300 focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content_type" className="text-sm font-semibold">Content Type</Label>
            <Select
              value={newContent.type}
              onValueChange={(value) => setNewContent({ ...newContent, type: value })}
            >
              <SelectTrigger className="border-gray-300 focus:border-indigo-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                    <div className="flex items-center">
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-semibold">Content</Label>
          <Textarea
            id="content"
            value={newContent.content}
            onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
            placeholder={`Enter your ${selectedType?.label.toLowerCase()} content...`}
            className="min-h-[120px] border-gray-300 focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={createContent} 
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            disabled={!newContent.title.trim() || !newContent.content.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Create {selectedType?.label}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setNewContent({ title: '', content: '', type: 'announcement' })}
            className="border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Clear Form
          </Button>
        </div>

        {newContent.title && newContent.content && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
            <div className="space-y-2">
              <p className="font-medium">{newContent.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{newContent.content}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickEditPanel;
