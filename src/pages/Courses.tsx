
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Clock, Filter } from 'lucide-react';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      class: 'Class 10',
      category: '10',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
      originalPrice: 2999,
      discountedPrice: 1999,
      discount: 33,
      rating: 4.8,
      students: 1250,
      duration: '120 hours',
      instructor: 'Dr. Sharma'
    },
    {
      id: 2,
      title: 'Physics Complete',
      class: 'Class 11',
      category: '11',
      image: 'https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=400&h=250&fit=crop',
      originalPrice: 3499,
      discountedPrice: 2299,
      discount: 34,
      rating: 4.9,
      students: 890,
      duration: '100 hours',
      instructor: 'Prof. Gupta'
    },
    {
      id: 3,
      title: 'Chemistry Basics',
      class: 'Class 9',
      category: '9',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
      originalPrice: 2499,
      discountedPrice: 1699,
      discount: 32,
      rating: 4.7,
      students: 967,
      duration: '80 hours',
      instructor: 'Ms. Patel'
    },
    {
      id: 4,
      title: 'Biology Fundamentals',
      class: 'Class 10',
      category: '10',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      originalPrice: 2799,
      discountedPrice: 1899,
      discount: 32,
      rating: 4.6,
      students: 723,
      duration: '90 hours',
      instructor: 'Dr. Singh'
    },
    {
      id: 5,
      title: 'English Literature',
      class: 'Class 11',
      category: '11',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
      originalPrice: 2299,
      discountedPrice: 1599,
      discount: 30,
      rating: 4.5,
      students: 654,
      duration: '70 hours',
      instructor: 'Ms. Verma'
    },
    {
      id: 6,
      title: 'Web Development',
      class: 'Skill Development',
      category: 'skill',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      originalPrice: 4999,
      discountedPrice: 3499,
      discount: 30,
      rating: 4.8,
      students: 1456,
      duration: '150 hours',
      instructor: 'Mr. Kumar'
    }
  ];

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeTab);

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive courses designed by expert educators to help you excel in your studies
          </p>
        </div>

        {/* Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="9">Class 9</TabsTrigger>
              <TabsTrigger value="10">Class 10</TabsTrigger>
              <TabsTrigger value="11">Class 11</TabsTrigger>
              <TabsTrigger value="skill">Skills</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredCourses.length} courses found
              </span>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                      {course.discount}% OFF
                    </Badge>
                    <Badge variant="secondary" className="absolute top-3 right-3">
                      {course.class}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>
                    
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {course.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>
                  </CardHeader>

                  <CardFooter className="pt-0">
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">
                            ₹{course.discountedPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{course.originalPrice}
                          </span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Enroll Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try selecting a different category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
