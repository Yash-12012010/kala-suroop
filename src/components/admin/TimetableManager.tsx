
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TimetableEditor from '@/components/TimetableEditor';

interface SubjectLegend {
  subject: string;
  color: string;
  description?: string;
}

const TimetableManager = () => {
  const [scheduleData, setScheduleData] = useState<Record<string, Record<string, any>>>({});
  const [subjectLegends, setSubjectLegends] = useState<SubjectLegend[]>([
    { subject: 'Mathematics', color: 'bg-blue-100 text-blue-800', description: 'Core mathematics concepts' },
    { subject: 'Physics', color: 'bg-purple-100 text-purple-800', description: 'Fundamental physics principles' },
    { subject: 'Chemistry', color: 'bg-green-100 text-green-800', description: 'Chemical reactions and compounds' },
    { subject: 'Biology', color: 'bg-red-100 text-red-800', description: 'Life sciences and biology' },
    { subject: 'English', color: 'bg-yellow-100 text-yellow-800', description: 'Language and literature' },
    { subject: 'Doubt Session', color: 'bg-orange-100 text-orange-800', description: 'Interactive Q&A sessions' },
    { subject: 'Test Series', color: 'bg-pink-100 text-pink-800', description: 'Practice tests and mock exams' },
    { subject: 'Revision Class', color: 'bg-indigo-100 text-indigo-800', description: 'Review and revision sessions' }
  ]);
  const [loading, setLoading] = useState(true);
  const [legendDialogOpen, setLegendDialogOpen] = useState(false);
  const [editingLegend, setEditingLegend] = useState<SubjectLegend | null>(null);
  const [legendFormData, setLegendFormData] = useState({
    subject: '',
    color: '',
    description: ''
  });
  const { toast } = useToast();

  const colorOptions = [
    { name: 'Blue', value: 'bg-blue-100 text-blue-800' },
    { name: 'Purple', value: 'bg-purple-100 text-purple-800' },
    { name: 'Green', value: 'bg-green-100 text-green-800' },
    { name: 'Red', value: 'bg-red-100 text-red-800' },
    { name: 'Yellow', value: 'bg-yellow-100 text-yellow-800' },
    { name: 'Orange', value: 'bg-orange-100 text-orange-800' },
    { name: 'Pink', value: 'bg-pink-100 text-pink-800' },
    { name: 'Indigo', value: 'bg-indigo-100 text-indigo-800' },
    { name: 'Gray', value: 'bg-gray-100 text-gray-800' },
    { name: 'Emerald', value: 'bg-emerald-100 text-emerald-800' },
    { name: 'Cyan', value: 'bg-cyan-100 text-cyan-800' },
    { name: 'Violet', value: 'bg-violet-100 text-violet-800' }
  ];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .order('day_of_week')
        .order('time_slot');

      if (error) {
        console.error('Error fetching timetable:', error);
        toast({
          title: "Error",
          description: "Failed to fetch timetable data",
          variant: "destructive"
        });
        return;
      }

      // Convert array to nested object structure
      const scheduleStructure: Record<string, Record<string, any>> = {};
      
      data?.forEach((entry) => {
        if (!scheduleStructure[entry.day_of_week]) {
          scheduleStructure[entry.day_of_week] = {};
        }
        scheduleStructure[entry.day_of_week][entry.time_slot] = entry;
      });

      setScheduleData(scheduleStructure);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timetable data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleLegendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLegend) {
        // Update existing legend
        const updatedLegends = subjectLegends.map(legend =>
          legend.subject === editingLegend.subject
            ? { ...legend, ...legendFormData }
            : legend
        );
        setSubjectLegends(updatedLegends);
        toast({ title: "Success", description: "Subject legend updated successfully" });
      } else {
        // Create new legend
        const newLegend: SubjectLegend = {
          subject: legendFormData.subject,
          color: legendFormData.color,
          description: legendFormData.description
        };
        setSubjectLegends([...subjectLegends, newLegend]);
        toast({ title: "Success", description: "Subject legend created successfully" });
      }

      setLegendFormData({ subject: '', color: '', description: '' });
      setEditingLegend(null);
      setLegendDialogOpen(false);
    } catch (error) {
      console.error('Error saving subject legend:', error);
      toast({
        title: "Error",
        description: "Failed to save subject legend",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLegend = (subject: string) => {
    if (!confirm('Are you sure you want to delete this subject legend?')) {
      return;
    }

    try {
      const updatedLegends = subjectLegends.filter(legend => legend.subject !== subject);
      setSubjectLegends(updatedLegends);
      toast({ title: "Success", description: "Subject legend deleted successfully" });
    } catch (error) {
      console.error('Error deleting subject legend:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject legend",
        variant: "destructive"
      });
    }
  };

  const openLegendDialog = (legend?: SubjectLegend) => {
    if (legend) {
      setEditingLegend(legend);
      setLegendFormData({
        subject: legend.subject,
        color: legend.color,
        description: legend.description || ''
      });
    } else {
      setEditingLegend(null);
      setLegendFormData({ subject: '', color: '', description: '' });
    }
    setLegendDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Timetable & Schedule Management
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage class schedules and subject legends
        </p>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Management
          </TabsTrigger>
          <TabsTrigger value="legends" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Subject Legends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule Editor</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Loading schedule...</p>
                </div>
              ) : (
                <TimetableEditor scheduleData={scheduleData} onRefresh={fetchTimetable} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legends" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Subject Legend Management</CardTitle>
              <Dialog open={legendDialogOpen} onOpenChange={setLegendDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openLegendDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingLegend ? 'Edit Subject Legend' : 'Add New Subject Legend'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLegendSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subject Name</label>
                      <Input
                        value={legendFormData.subject}
                        onChange={(e) => setLegendFormData({ ...legendFormData, subject: e.target.value })}
                        placeholder="Enter subject name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Color Theme</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`p-2 rounded border text-sm ${color.value} ${
                              legendFormData.color === color.value ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setLegendFormData({ ...legendFormData, color: color.value })}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={legendFormData.description}
                        onChange={(e) => setLegendFormData({ ...legendFormData, description: e.target.value })}
                        placeholder="Enter description (optional)"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setLegendDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingLegend ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectLegends.map((legend) => (
                  <div key={legend.subject} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={legend.color}>
                        {legend.subject}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openLegendDialog(legend)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteLegend(legend.subject)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {legend.description && (
                      <p className="text-sm text-muted-foreground">
                        {legend.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimetableManager;
