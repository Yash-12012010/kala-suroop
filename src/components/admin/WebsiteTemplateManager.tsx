
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Download, Upload, Palette, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  preview_image: string;
  category: 'layout' | 'component' | 'page';
  is_active: boolean;
}

const WebsiteTemplateManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();

  const templates: Template[] = [
    {
      id: '1',
      name: 'Modern Hero Section',
      description: 'Clean, modern hero with gradient background',
      preview_image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
      category: 'component',
      is_active: true
    },
    {
      id: '2',
      name: 'Course Card Grid',
      description: 'Responsive grid layout for course cards',
      preview_image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
      category: 'layout',
      is_active: true
    },
    {
      id: '3',
      name: 'Landing Page Template',
      description: 'Complete landing page with hero, features, and CTA',
      preview_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      category: 'page',
      is_active: false
    }
  ];

  const applyTemplate = (template: Template) => {
    toast({
      title: "Template Applied",
      description: `${template.name} has been applied successfully`,
    });
  };

  const exportConfiguration = () => {
    // This would export the current website configuration
    const config = {
      pages: [],
      components: [],
      settings: {},
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-config.json';
    a.click();
    
    toast({
      title: "Configuration Exported",
      description: "Website configuration has been downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Website Templates & Themes</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={exportConfiguration}>
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Config
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <Badge 
                    className="absolute top-2 right-2"
                    variant={template.is_active ? "default" : "secondary"}
                  >
                    {template.category}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => applyTemplate(template)}
                      disabled={!template.is_active}
                    >
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Palette className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold mb-2">Art Academy Theme</h3>
                <p className="text-sm text-gray-600">Current active theme</p>
                <Badge className="mt-2">Active</Badge>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
              <CardContent className="p-6 text-center">
                <Palette className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Modern Minimal</h3>
                <p className="text-sm text-gray-600">Clean and professional</p>
                <Button size="sm" className="mt-2">Apply</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
              <CardContent className="p-6 text-center">
                <Palette className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold mb-2">Creative Studio</h3>
                <p className="text-sm text-gray-600">Bold and creative</p>
                <Button size="sm" className="mt-2">Apply</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="layouts" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Layout className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Grid Layout</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Responsive grid system with customizable columns
                </p>
                <Button size="sm">Configure</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Layout className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Masonry Layout</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pinterest-style masonry layout for dynamic content
                </p>
                <Button size="sm">Configure</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteTemplateManager;
