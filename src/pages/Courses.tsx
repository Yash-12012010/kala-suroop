
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Clock } from 'lucide-react';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('class-9');
  const navigate = useNavigate();

  const coursesByClass = {
    'class-9': [
      {
        id: 1,
        title: 'Mathematics Foundation',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
        originalPrice: 2499,
        discountedPrice: 1699,
        discount: 32,
        rating: 4.7,
        students: 892,
        duration: '80 hours'
      },
      {
        id: 2,
        title: 'Science Basics',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
        originalPrice: 2299,
        discountedPrice: 1599,
        discount: 30,
        rating: 4.6,
        students: 756,
        duration: '75 hours'
      }
    ],
    'class-10': [
      {
        id: 3,
        title: 'Mathematics Complete Course',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
        originalPrice: 2999,
        discountedPrice: 1999,
        discount: 33,
        rating: 4.8,
        students: 1250,
        duration: '120 hours'
      },
      {
        id: 4,
        title: 'Science Master Class',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
        originalPrice: 3199,
        discountedPrice: 2199,
        discount: 31,
        rating: 4.9,
        students: 1180,
        duration: '110 hours'
      }
    ],
    'class-11': [
      {
        id: 5,
        title: 'Physics Master Class',
        image: 'https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=400&h=250&fit=crop',
        originalPrice: 3499,
        discountedPrice: 2299,
        discount: 34,
        rating: 4.9,
        students: 890,
        duration: '100 hours'
      },
      {
        id: 6,
        title: 'Chemistry Advanced',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
        originalPrice: 3299,
        discountedPrice: 2199,
        discount: 33,
        rating: 4.8,
        students: 745,
        duration: '95 hours'
      }
    ],
    'skill-development': [
      {
        id: 7,
        title: 'Communication Skills',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
        originalPrice: 1999,
        discountedPrice: 1299,
        discount: 35,
        rating: 4.7,
        students: 523,
        duration: '60 hours'
      }
    ]
  };

  const handleEnrollClick = (course: any) => {
    navigate('/checkout', { state: { course } });
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose from our comprehensive collection of courses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="class-9">Class 9</TabsTrigger>
            <TabsTrigger value="class-10">Class 10</TabsTrigger>
            <TabsTrigger value="class-11">Class 11</TabsTrigger>
            <TabsTrigger value="skill-development">Skills</TabsTrigger>
          </TabsList>

          {Object.entries(coursesByClass).map(([tabKey, courses]) => (
            <TabsContent key={tabKey} value={tabKey}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
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
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </CardTitle>
                      
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

                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{course.discountedPrice}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{course.originalPrice}
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleEnrollClick(course)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Enroll Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
