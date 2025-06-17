
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Palette, Users, Award, Target, Heart, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <Palette className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">About Us</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Kala Suroop
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Art Academy
              </span>
            </h1>
            
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
              Nurturing creativity and artistic excellence through innovative education and passionate instruction
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Target className="h-6 w-6 mr-3 text-purple-400" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-100 text-lg leading-relaxed">
                To provide world-class art education that empowers students to discover their creative potential, 
                develop technical skills, and express their unique artistic voice in a supportive and inspiring environment.
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Heart className="h-6 w-6 mr-3 text-pink-400" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-100 text-lg leading-relaxed">
                To be the premier destination for artistic learning, fostering a global community of artists who 
                create meaningful work that enriches lives and contributes to cultural heritage.
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-white text-center flex items-center justify-center">
                <Star className="h-8 w-8 mr-3 text-yellow-400" />
                Why Choose Kala Suroop?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expert Instructors</h3>
                  <p className="text-purple-200">Learn from industry professionals and renowned artists</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Curriculum</h3>
                  <p className="text-purple-200">From fundamentals to advanced techniques across all mediums</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Proven Results</h3>
                  <p className="text-purple-200">Students consistently achieve their artistic goals and beyond</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { number: '500+', label: 'Happy Students' },
              { number: '15+', label: 'Expert Instructors' },
              { number: '25+', label: 'Art Courses' },
              { number: '10+', label: 'Years Experience' }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-purple-200">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-500/30">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Artistic Journey?</h2>
                <p className="text-purple-200 mb-6 text-lg">Join thousands of students who have discovered their creative potential with us</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                    onClick={() => window.location.href = '/courses'}
                  >
                    Explore Courses
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
                    onClick={() => window.location.href = '/signup'}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
