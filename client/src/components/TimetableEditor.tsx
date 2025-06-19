
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimetableEntry {
  id: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
  class_name: string;
  teacher: string;
}

interface TimetableEditorProps {
  scheduleData: Record<string, Record<string, TimetableEntry>>;
  onRefresh: () => void;
}

const TimetableEditor: React.FC<TimetableEditorProps> = ({ scheduleData, onRefresh }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    day_of_week: '',
    time_slot: '',
    subject: '',
    class_name: '',
    teacher: ''
  });
  const { toast } = useToast();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Doubt Session', 'Test Series', 'Revision Class'];
  const classes = ['Class 9', 'Class 10', 'Class 11', 'All Classes'];
  const teachers = ['Mr. Kumar', 'Dr. Sharma', 'Ms. Patel', 'Mrs. Singh', 'Dr. Verma', 'All Teachers', 'Academic Team'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('timetable')
          .update({
            day_of_week: formData.day_of_week,
            time_slot: formData.time_slot,
            subject: formData.subject,
            class_name: formData.class_name,
            teacher: formData.teacher,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Timetable entry updated successfully",
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from('timetable')
          .insert([{
            day_of_week: formData.day_of_week,
            time_slot: formData.time_slot,
            subject: formData.subject,
            class_name: formData.class_name,
            teacher: formData.teacher
          }]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Timetable entry created successfully",
        });
      }
      
      // Reset form and close dialog
      setFormData({
        day_of_week: '',
        time_slot: '',
        subject: '',
        class_name: '',
        teacher: ''
      });
      setEditingEntry(null);
      setIsDialogOpen(false);
      onRefresh();
      
    } catch (error) {
      console.error('Error saving timetable entry:', error);
      toast({
        title: "Error",
        description: "Failed to save timetable entry",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      day_of_week: entry.day_of_week,
      time_slot: entry.time_slot,
      subject: entry.subject,
      class_name: entry.class_name,
      teacher: entry.teacher
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Timetable entry deleted successfully",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete timetable entry",
        variant: "destructive"
      });
    }
  };

  const openAddDialog = () => {
    setEditingEntry(null);
    setFormData({
      day_of_week: '',
      time_slot: '',
      subject: '',
      class_name: '',
      teacher: ''
    });
    setIsDialogOpen(true);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Admin: Timetable Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? 'Edit Class' : 'Add New Class'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="day">Day</Label>
                  <Select value={formData.day_of_week} onValueChange={(value) => setFormData({...formData, day_of_week: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time">Time Slot</Label>
                  <Select value={formData.time_slot} onValueChange={(value) => setFormData({...formData, time_slot: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={formData.class_name} onValueChange={(value) => setFormData({...formData, class_name: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="teacher">Teacher</Label>
                  <Select value={formData.teacher} onValueChange={(value) => setFormData({...formData, teacher: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEntry ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(scheduleData).map(([day, daySchedule]) => (
            <div key={day}>
              <h3 className="font-semibold text-lg mb-2">{day}</h3>
              <div className="grid gap-2">
                {Object.entries(daySchedule).map(([time, entry]) => (
                  <div key={`${day}-${time}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{entry.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {time} • {entry.class_name} • {entry.teacher}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimetableEditor;
