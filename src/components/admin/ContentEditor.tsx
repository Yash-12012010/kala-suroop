
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ContentField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'color' | 'select';
  value: any;
  options?: string[]; // For select type
}

interface ContentEditorProps {
  initialContent?: any;
  onSave: (content: any) => void;
  templateType?: 'hero' | 'card' | 'list' | 'custom';
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  initialContent = {}, 
  onSave, 
  templateType = 'custom' 
}) => {
  const [content, setContent] = useState(initialContent);
  const [fields, setFields] = useState<ContentField[]>(() => {
    // Initialize fields based on template type
    switch (templateType) {
      case 'hero':
        return [
          { name: 'title', type: 'text', value: content.title || '' },
          { name: 'subtitle', type: 'text', value: content.subtitle || '' },
          { name: 'description', type: 'textarea', value: content.description || '' },
          { name: 'image_url', type: 'image', value: content.image_url || '' },
          { name: 'button_text', type: 'text', value: content.button_text || '' },
          { name: 'button_link', type: 'text', value: content.button_link || '' },
          { name: 'background_color', type: 'color', value: content.background_color || '#ffffff' },
        ];
      case 'card':
        return [
          { name: 'title', type: 'text', value: content.title || '' },
          { name: 'description', type: 'textarea', value: content.description || '' },
          { name: 'image_url', type: 'image', value: content.image_url || '' },
          { name: 'link_url', type: 'text', value: content.link_url || '' },
          { name: 'is_featured', type: 'boolean', value: content.is_featured || false },
        ];
      default:
        return Object.keys(content).map(key => ({
          name: key,
          type: typeof content[key] === 'boolean' ? 'boolean' : 'text',
          value: content[key]
        }));
    }
  });

  const addField = () => {
    setFields([...fields, { name: '', type: 'text', value: '' }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<ContentField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleSave = () => {
    const finalContent = fields.reduce((acc, field) => {
      if (field.name) {
        acc[field.name] = field.value;
      }
      return acc;
    }, {} as any);
    
    onSave(finalContent);
  };

  const renderFieldInput = (field: ContentField, index: number) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={field.value}
            onChange={(e) => updateField(index, { value: e.target.value })}
            placeholder="Enter content..."
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={field.value}
            onChange={(e) => updateField(index, { value: parseFloat(e.target.value) || 0 })}
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={field.value}
            onCheckedChange={(checked) => updateField(index, { value: checked })}
          />
        );
      case 'color':
        return (
          <Input
            type="color"
            value={field.value}
            onChange={(e) => updateField(index, { value: e.target.value })}
          />
        );
      case 'select':
        return (
          <Select
            value={field.value}
            onValueChange={(value) => updateField(index, { value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={field.value}
            onChange={(e) => updateField(index, { value: e.target.value })}
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content Editor</CardTitle>
        <div className="space-x-2">
          <Button onClick={addField} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Visual Editor</TabsTrigger>
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <Label>Field Name</Label>
                  <Input
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    placeholder="field_name"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(type: any) => updateField(index, { type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="image">Image URL</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6">
                  <Label>Value</Label>
                  {renderFieldInput(field, index)}
                </div>
                <div className="col-span-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="json">
            <div>
              <Label>JSON Content</Label>
              <Textarea
                value={JSON.stringify(
                  fields.reduce((acc, field) => {
                    if (field.name) acc[field.name] = field.value;
                    return acc;
                  }, {} as any),
                  null,
                  2
                )}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFields(
                      Object.keys(parsed).map(key => ({
                        name: key,
                        type: typeof parsed[key] === 'boolean' ? 'boolean' : 'text',
                        value: parsed[key]
                      }))
                    );
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={10}
                className="font-mono"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;
