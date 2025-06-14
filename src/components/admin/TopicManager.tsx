
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Topic {
  id: string;
  name: string;
  description: string | null;
  subject_id: string;
  order_index: number;
  subject_name: string;
  class_name: string;
  created_at: string;
}

interface Subject {
  id: string;
  name: string;
  class_name: string;
}

const TopicManager = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    subject_id: '', 
    order_index: 0 
  });
  const { toast } = useToast();

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          subjects!inner(
            name,
            classes!inner(name)
          )
        `)
        .order('order_index');

      if (error) throw error;
      
      const formattedData = data?.map(topic => ({
        ...topic,
        subject_name: topic.subjects.name,
        class_name: topic.subjects.classes.name
      })) || [];
      
      setTopics(formattedData);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch topics",
        variant: "destructive"
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          id, 
          name,
          classes!inner(name)
        `)
        .order('name');

      if (error) throw error;
      
      const formattedData = data?.map(subject => ({
        id: subject.id,
        name: subject.name,
        class_name: subject.classes.name
      })) || [];
      
      setSubjects(formattedData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        const { error } = await supabase
          .from('topics')
          .update({
            name: formData.name,
            description: formData.description || null,
            subject_id: formData.subject_id,
            order_index: formData.order_index,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTopic.id);

        if (error) throw error;
        toast({ title: "Success", description: "Topic updated successfully" });
      } else {
        const { error } = await supabase
          .from('topics')
          .insert({
            name: formData.name,
            description: formData.description || null,
            subject_id: formData.subject_id,
            order_index: formData.order_index
          });

        if (error) throw error;
        toast({ title: "Success", description: "Topic created successfully" });
      }

      setFormData({ name: '', description: '', subject_id: '', order_index: 0 });
      setEditingTopic(null);
      setDialogOpen(false);
      fetchTopics();
    } catch (error) {
      console.error('Error saving topic:', error);
      toast({
        title: "Error",
        description: "Failed to save topic",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Topic deleted successfully" });
      fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive"
      });
    }
  };

  const openDialog = (topic?: Topic) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        name: topic.name,
        description: topic.description || '',
        subject_id: topic.subject_id,
        order_index: topic.order_index
      });
    } else {
      setEditingTopic(null);
      setFormData({ name: '', description: '', subject_id: '', order_index: 0 });
    }
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Topics</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTopic ? 'Edit Topic' : 'Add New Topic'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter topic name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.class_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Order Index</label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="Enter order index"
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter topic description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTopic ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading topics...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell>{topic.subject_name}</TableCell>
                  <TableCell>{topic.class_name}</TableCell>
                  <TableCell>{topic.order_index}</TableCell>
                  <TableCell>{topic.description || '-'}</TableCell>
                  <TableCell>{new Date(topic.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(topic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(topic.id)}
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

export default TopicManager;
