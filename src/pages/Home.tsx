
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Palette, Users, Star, Trophy, Video, BookOpen, Sparkles, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-purple-200 font-medium">Premium Art Education</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Creative Genius
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-purple-200/80 max-w-4xl mx-auto leading-relaxed mb-10">
              Join the world's most exclusive art academy. Master your craft with industry legends, 
              connect with elite artists, and transform your passion into professional excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="btn-premium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
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
                <div className="text-purple-300">Elite Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-purple-300">Master Classes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-purple-300">Success Rate</div>
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
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kala Suroop</span>
            </h2>
            <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
              Experience the difference of premium art education with world-class mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Expert Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200/80 text-center">
                  Learn from industry legends and master artists who have shaped the creative world
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Live Interactive Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200/80 text-center">
                  Join real-time sessions with direct feedback and personalized guidance
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Elite Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200/80 text-center">
                  Connect with passionate artists and build lifelong creative partnerships
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200/80 text-center">
                  Earn recognized certificates that open doors to professional opportunities
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Cutting-Edge Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200/80 text-center">
                  Access the latest digital art tools and premium creative software
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover:scale-105 transition-all duration-500 animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200/80 text-center">
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
          <Card className="card-premium bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Join the Elite?
              </h2>
              <p className="text-xl text-purple-200/80 mb-8 max-w-2xl mx-auto">
                Transform your artistic journey with world-class education and mentorship. 
                Your creative breakthrough starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-premium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
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
