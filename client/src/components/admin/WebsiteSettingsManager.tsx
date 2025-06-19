import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WebsiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  category: string;
  is_public: boolean;
}

const WebsiteSettingsManager = () => {
  const [settings, setSettings] = useState<WebsiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    description: '',
    category: 'general',
    is_public: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch website settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (id: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('website_settings')
        .update({ 
          value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const createSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let value: any = newSetting.value;
      
      // Try to parse as JSON if it looks like JSON
      if (value.startsWith('{') || value.startsWith('[') || value === 'true' || value === 'false') {
        try {
          value = JSON.parse(value);
        } catch {
          // If parsing fails, keep as string
        }
      }

      const { error } = await supabase
        .from('website_settings')
        .insert([{
          ...newSetting,
          value: value
        }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Setting created successfully",
      });
      
      setNewSetting({
        key: '',
        value: '',
        description: '',
        category: 'general',
        is_public: false
      });
      setIsDialogOpen(false);
      fetchSettings();
    } catch (error) {
      console.error('Error creating setting:', error);
      toast({
        title: "Error",
        description: "Failed to create setting",
        variant: "destructive",
      });
    }
  };

  const renderSettingInput = (setting: WebsiteSetting) => {
    const value = setting.value;
    
    if (typeof value === 'boolean') {
      return (
        <Switch
          checked={value}
          onCheckedChange={(checked) => updateSetting(setting.id, checked)}
        />
      );
    }
    
    if (typeof value === 'number') {
      return (
        <Input
          type="number"
          defaultValue={value}
          onBlur={(e) => updateSetting(setting.id, parseFloat(e.target.value) || 0)}
        />
      );
    }
    
    return (
      <Input
        defaultValue={typeof value === 'string' ? value : JSON.stringify(value)}
        onBlur={(e) => updateSetting(setting.id, e.target.value)}
      />
    );
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, WebsiteSetting[]>);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Website Settings</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Setting</DialogTitle>
            </DialogHeader>
            <form onSubmit={createSetting} className="space-y-4">
              <div>
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newSetting.category} onValueChange={(value) => setNewSetting({ ...newSetting, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                    <SelectItem value="styling">Styling</SelectItem>
                    <SelectItem value="display">Display</SelectItem>
                    <SelectItem value="features">Features</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newSetting.is_public}
                  onCheckedChange={(checked) => setNewSetting({ ...newSetting, is_public: checked })}
                />
                <Label htmlFor="is_public">Public (visible to non-admins)</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category} Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <Label className="font-medium">{setting.key}</Label>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded ${
                        setting.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {setting.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsiteSettingsManager;
