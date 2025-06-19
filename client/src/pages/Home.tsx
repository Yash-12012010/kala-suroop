
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Palette, Users, Star, Trophy, Video, BookOpen, Sparkles, Globe, Zap, Play, Award, Camera, Brush, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F19A3E] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7FC29B] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#B5EF8A] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-[#D7F171] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Artistic Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 25% 25%, #F19A3E 2px, transparent 2px),
                 radial-gradient(circle at 75% 75%, #7FC29B 1px, transparent 1px),
                 radial-gradient(circle at 50% 50%, #D7F171 1.5px, transparent 1.5px)
               `,
               backgroundSize: '60px 60px, 40px 40px, 80px 80px'
             }} />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-[#D7F171] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-40 right-32 w-3 h-3 bg-[#B5EF8A] rounded-full animate-bounce opacity-50" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-[#F19A3E] rounded-full animate-bounce opacity-40" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Hero Section - Enhanced for all devices */}
      <div className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20 animate-fade-in">
            {/* Premium Badge - Responsive */}
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#F19A3E]/30 to-[#D7F171]/30 backdrop-blur-xl rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 mb-6 sm:mb-8 border-2 sm:border-3 border-white/40 shadow-2xl hover:scale-105 transition-all duration-500">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#D7F171] animate-pulse" />
              <span className="text-white font-black text-sm sm:text-lg lg:text-xl drop-shadow-lg">WORLD-CLASS ART ACADEMY</span>
              <Award className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#F19A3E] animate-pulse" />
            </div>
            
            {/* Main Headline - Fully Responsive */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-6 sm:mb-8 lg:mb-10 leading-tight">
              <span className="block bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent drop-shadow-2xl">
                UNLEASH YOUR
              </span>
              <span className="block bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent drop-shadow-2xl mt-2 sm:mt-4">
                CREATIVE GENIUS
              </span>
            </h1>
            
            {/* Subtitle - Mobile Optimized */}
            <p className="text-base sm:text-xl lg:text-2xl xl:text-3xl text-white max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed mb-8 sm:mb-10 lg:mb-12 font-medium sm:font-bold drop-shadow-xl px-2 sm:px-0">
              Join the world's most exclusive art academy. Master your craft with industry legends, 
              connect with elite artists, and transform your passion into professional excellence.
            </p>

            {/* CTA Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 lg:mb-20 px-2 sm:px-0">
              <Button asChild size="lg" className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-black px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl rounded-xl lg:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 border-2 sm:border-3 lg:border-4 border-white/40 btn-enhanced">
                <Link to="/courses" className="flex items-center justify-center">
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mr-2 sm:mr-3 lg:mr-4" />
                  <span className="hidden sm:inline">START YOUR JOURNEY</span>
                  <span className="sm:hidden">START JOURNEY</span>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ml-2 sm:ml-3 lg:ml-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-gradient-to-r from-[#7FC29B]/40 to-[#B5EF8A]/40 backdrop-blur-xl border-2 sm:border-3 lg:border-4 border-white/60 text-white hover:bg-white/30 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl rounded-xl lg:rounded-2xl transition-all duration-300 font-black shadow-2xl hover:scale-105 sm:hover:scale-110 btn-enhanced">
                <Link to="/dashboard" className="flex items-center justify-center">
                  <Video className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mr-2 sm:mr-3 lg:mr-4" />
                  <span className="hidden sm:inline">LIVE STUDIO ACCESS</span>
                  <span className="sm:hidden">LIVE STUDIO</span>
                </Link>
              </Button>
            </div>

            {/* Enhanced Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-xs sm:max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0">
              {[
                { 
                  number: "50K+", 
                  label: "ELITE ARTISTS", 
                  icon: Users, 
                  gradient: "from-[#F19A3E] to-[#D7F171]",
                  border: "border-[#F19A3E]"
                },
                { 
                  number: "1000+", 
                  label: "MASTER CLASSES", 
                  icon: BookOpen, 
                  gradient: "from-[#7FC29B] to-[#B5EF8A]",
                  border: "border-[#7FC29B]"
                },
                { 
                  number: "99.8%", 
                  label: "SUCCESS RATE", 
                  icon: Trophy, 
                  gradient: "from-[#D7F171] to-[#B5EF8A]",
                  border: "border-[#D7F171]"
                }
              ].map((stat, index) => (
                <Card key={index} className={`bg-white/95 backdrop-blur-xl border-4 ${stat.border} shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 group rounded-3xl`}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-white/50`}>
                      <stat.icon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                    <div className="text-5xl font-black text-gray-900 mb-3 drop-shadow-sm">{stat.number}</div>
                    <div className="text-gray-800 font-bold text-lg tracking-wider">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] text-white px-8 py-3 text-lg font-black mb-8 border-3 border-white/40">
              PREMIUM EXPERIENCE
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 drop-shadow-2xl">
              WHY CHOOSE <span className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] bg-clip-text text-transparent">KALA SUROOP</span>
            </h2>
            <p className="text-2xl text-white max-w-4xl mx-auto font-bold drop-shadow-lg leading-relaxed">
              Experience the pinnacle of artistic education with world-class mentorship and cutting-edge technology
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Palette,
                title: "LEGENDARY MENTORS",
                description: "Learn from industry titans who've shaped the creative world",
                gradient: "from-[#F19A3E] to-[#D7F171]",
                borderColor: "border-[#F19A3E]",
                bgAccent: "bg-[#F19A3E]/20"
              },
              {
                icon: Video,
                title: "LIVE INTERACTIVE SESSIONS",
                description: "Real-time feedback and personalized guidance from masters",
                gradient: "from-[#7FC29B] to-[#B5EF8A]",
                borderColor: "border-[#7FC29B]",
                bgAccent: "bg-[#7FC29B]/20"
              },
              {
                icon: Users,
                title: "ELITE COMMUNITY",
                description: "Connect with passionate artists and build creative partnerships",
                gradient: "from-[#B5EF8A] to-[#D7F171]",
                borderColor: "border-[#B5EF8A]",
                bgAccent: "bg-[#B5EF8A]/20"
              },
              {
                icon: Trophy,
                title: "PRESTIGIOUS CERTIFICATION",
                description: "Earn globally recognized certificates that open career doors",
                gradient: "from-[#D7F171] to-[#F19A3E]",
                borderColor: "border-[#D7F171]",
                bgAccent: "bg-[#D7F171]/20"
              },
              {
                icon: Zap,
                title: "CUTTING-EDGE TOOLS",
                description: "Access premium creative software and digital art tools",
                gradient: "from-[#726E75] to-[#F19A3E]",
                borderColor: "border-[#726E75]",
                bgAccent: "bg-[#726E75]/20"
              },
              {
                icon: Globe,
                title: "GLOBAL NETWORK",
                description: "Join a worldwide community and expand creative horizons",
                gradient: "from-[#F19A3E] to-[#7FC29B]",
                borderColor: "border-[#F19A3E]",
                bgAccent: "bg-[#F19A3E]/20"
              }
            ].map((feature, index) => (
              <Card key={index} className={`group bg-white/95 backdrop-blur-xl border-4 ${feature.borderColor} hover:border-[#F19A3E] shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 cursor-pointer rounded-3xl overflow-hidden`}>
                <div className={`absolute inset-0 ${feature.bgAccent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <CardContent className="relative p-10 text-center">
                  <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${feature.gradient} border-4 border-white/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                    <feature.icon className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-wider">{feature.title}</h3>
                  <p className="text-gray-800 leading-relaxed font-semibold text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section - Mobile Optimized */}
      <div className="relative z-10 py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Card className="bg-white/95 backdrop-blur-xl border-2 sm:border-3 lg:border-4 border-[#F19A3E] shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 rounded-2xl lg:rounded-3xl overflow-hidden card-enhanced">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F19A3E]/10 via-[#D7F171]/10 to-[#7FC29B]/10" />
            <CardContent className="relative p-6 sm:p-10 lg:p-16 text-center">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="flex space-x-2 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-[#F19A3E] to-[#D7F171] flex items-center justify-center animate-bounce">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-[#7FC29B] to-[#B5EF8A] flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-[#B5EF8A] to-[#D7F171] flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                    <Brush className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6 lg:mb-8">
                READY TO JOIN THE ELITE?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-800 mb-8 sm:mb-10 lg:mb-12 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto font-semibold leading-relaxed px-2 sm:px-0">
                Transform your artistic journey with world-class education and mentorship. 
                Your creative breakthrough starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-black px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl rounded-xl lg:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 border-2 sm:border-3 lg:border-4 border-white/50 btn-enhanced">
                  <Link to="/signup" className="flex items-center justify-center">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mr-2 sm:mr-3 lg:mr-4" />
                    <span className="hidden sm:inline">START YOUR JOURNEY</span>
                    <span className="sm:hidden">START JOURNEY</span>
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ml-2 sm:ml-3 lg:ml-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-xl border-2 sm:border-3 lg:border-4 border-white/70 text-white hover:bg-white/40 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl rounded-xl lg:rounded-2xl transition-all duration-300 font-black shadow-2xl hover:scale-105 sm:hover:scale-110 btn-enhanced">
                  <Link to="/courses" className="flex items-center justify-center">
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mr-2 sm:mr-3 lg:mr-4" />
                    <span className="hidden sm:inline">EXPLORE COURSES</span>
                    <span className="sm:hidden">EXPLORE</span>
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
