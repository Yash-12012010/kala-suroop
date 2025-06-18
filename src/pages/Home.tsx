
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Palette, Users, Star, Trophy, Video, BookOpen, Sparkles, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-[#B5EF8A] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-[#D7F171] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#F19A3E]/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(241,154,62,0.1) 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-[#F19A3E]/20">
              <Sparkles className="h-5 w-5 text-[#F19A3E]" />
              <span className="text-white font-medium">Premium Art Education</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent">
                Creative Genius
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-10 font-medium">
              Join the world's most exclusive art academy. Master your craft with industry legends, 
              connect with elite artists, and transform your passion into professional excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                <Link to="/courses">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Elite Courses
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl transition-all duration-300">
                <Link to="/dashboard">
                  <Video className="h-5 w-5 mr-2" />
                  Live Studio Access
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/90 font-medium">Elite Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-white/90 font-medium">Master Classes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-white/90 font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] bg-clip-text text-transparent">Kala Suroop</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
              Experience the difference of premium art education with world-class mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 hover:scale-105 transition-all duration-500 animate-slide-in-bottom shadow-xl hover:shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F19A3E] to-[#D7F171] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white font-bold">Expert Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-center font-medium">
                  Learn from industry legends and master artists who have shaped the creative world
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 hover:scale-105 transition-all duration-500 animate-slide-in-bottom shadow-xl hover:shadow-2xl" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white font-bold">Live Interactive Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-center font-medium">
                  Join real-time sessions with direct feedback and personalized guidance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 hover:scale-105 transition-all duration-500 animate-slide-in-bottom shadow-xl hover:shadow-2xl" style={{ animationDelay: '200ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#B5EF8A] to-[#D7F171] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white font-bold">Elite Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-center font-medium">
                  Connect with passionate artists and build lifelong creative partnerships
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 hover:scale-105 transition-all duration-500 animate-slide-in-bottom shadow-xl hover:shadow-2xl" style={{ animationDelay: '300ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D7F171] to-[#F19A3E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white font-bold">Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-center font-medium">
                  Earn recognized certificates that open doors to professional opportunities
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 hover:scale-105 transition-all duration-500 animate-slide-in-bottom shadow-xl hover:shadow-2xl" style={{ animationDelay: '400ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F19A3E] to-[#7FC29B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white font-bold">Cutting-Edge Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-center font-medium">
                  Access the latest digital art tools and premium creative software
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border border-[#F19A3E]/30 hover:bg-white/25 hover:scale-105 transition-all duration-500 animate-slide-in-bottom shadow-xl hover:shadow-2xl" style={{ animationDelay: '500ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#726E75] to-[#F19A3E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white font-bold">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-center font-medium">
                  Join a worldwide community of artists and expand your creative horizons
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-[#F19A3E]/30 to-[#7FC29B]/30 backdrop-blur-md border border-[#F19A3E]/40 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Join the Elite?
              </h2>
              <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto font-medium">
                Transform your artistic journey with world-class education and mentorship. 
                Your creative breakthrough starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/signup">
                    <Star className="h-5 w-5 mr-2" />
                    Start Your Journey
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl transition-all duration-300">
                  <Link to="/courses">
                    Explore Courses
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
