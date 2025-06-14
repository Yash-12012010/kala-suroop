
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Beginner', description: 'Foundation art courses for beginners', courses: 12, color: 'bg-pink-500' },
    { name: 'Intermediate', description: 'Advanced techniques and skills', courses: 18, color: 'bg-purple-500' },
    { name: 'Advanced', description: 'Master-level artistic expression', courses: 15, color: 'bg-indigo-500' }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: 'Digital Painting Mastery',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
      originalPrice: 2999,
      discountedPrice: 1999,
      discount: 33,
      rating: 4.8,
      students: 1250,
      duration: '120 hours'
    },
    {
      id: 2,
      title: 'Watercolor Techniques',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop',
      originalPrice: 3499,
      discountedPrice: 2299,
      discount: 34,
      rating: 4.9,
      students: 890,
      duration: '100 hours'
    },
    {
      id: 3,
      title: 'Abstract Art Fundamentals',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
      originalPrice: 2499,
      discountedPrice: 1699,
      discount: 32,
      rating: 4.7,
      students: 967,
      duration: '80 hours'
    }
  ];

  const handleEnrollClick = (course: any) => {
    navigate('/checkout', { state: { course } });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to Kala Suroop
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover your artistic potential with our comprehensive art courses. From traditional painting to digital masterpieces, unleash your creativity with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700">
              <Link to="/courses">Explore Art Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-pink-600 text-pink-600 hover:bg-pink-50">
              <Link to="/signup">Start Your Art Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-orange-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Art Level
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Select your skill level to access courses designed for your artistic journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                    <span className="text-white font-bold text-lg">🎨</span>
                  </div>
                  <CardTitle className="text-xl text-center">{category.name}</CardTitle>
                  <p className="text-muted-foreground text-center">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{category.courses} courses available</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-pink-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Art Courses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our most popular and highly-rated artistic masterclasses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0">
                    {course.discount}% OFF
                  </Badge>
                  <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-gray-800">
                    {course.level}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-pink-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
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
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{course.discountedPrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{course.originalPrice}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handleEnrollClick(course)}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
              <Link to="/courses">View All Art Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-muted-foreground">Creative Artists</div>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-muted-foreground">Master Artists</div>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">100+</div>
              <div className="text-muted-foreground">Art Courses</div>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-muted-foreground">Creative Success</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
