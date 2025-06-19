
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Palette, Users, Award, Globe, Star, Sparkles, Heart, Crown, ArrowRight, BookOpen, Video, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726E75] via-[#F19A3E] to-[#7FC29B] relative overflow-hidden">
      {/* Premium Background Effects */}
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
                 radial-gradient(circle at 75% 75%, #7FC29B 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px, 40px 40px'
             }} />
      </div>

      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#F19A3E]/30 to-[#D7F171]/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border-3 border-white/40 shadow-2xl">
              <Crown className="h-6 w-6 text-[#D7F171] animate-pulse" />
              <span className="text-white font-black text-xl drop-shadow-lg">ABOUT KALA SUROOP</span>
              <Sparkles className="h-6 w-6 text-[#F19A3E] animate-pulse" />
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-10 leading-tight">
              <span className="block bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent drop-shadow-2xl">
                WHERE ART
              </span>
              <span className="block bg-gradient-to-r from-[#F19A3E] via-[#D7F171] to-[#7FC29B] bg-clip-text text-transparent drop-shadow-2xl mt-4">
                MEETS MASTERY
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-white max-w-5xl mx-auto leading-relaxed mb-12 font-bold drop-shadow-xl">
              Founded on the belief that every artist has the potential for greatness, 
              Kala Suroop is more than an academy—it's a creative revolution.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <Card className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl border-4 border-[#F19A3E] shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 rounded-3xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#F19A3E] to-[#D7F171] flex items-center justify-center shadow-xl border-3 border-white/50">
                  <Heart className="h-10 w-10 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">OUR MISSION</h3>
                <p className="text-white leading-relaxed font-bold drop-shadow-sm text-lg">
                  To democratize world-class art education by connecting passionate learners 
                  with industry masters, fostering a global community of creative excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl border-4 border-[#7FC29B] shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 rounded-3xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#7FC29B] to-[#B5EF8A] flex items-center justify-center shadow-xl border-3 border-white/50">
                  <Star className="h-10 w-10 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">OUR VISION</h3>
                <p className="text-white leading-relaxed font-bold drop-shadow-sm text-lg">
                  To be the world's premier destination for artistic transformation, 
                  where creativity knows no bounds and every student becomes a master.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
              { number: "50K+", label: "ARTISTS TRAINED", icon: Users, gradient: "from-[#F19A3E] to-[#D7F171]" },
              { number: "200+", label: "MASTER INSTRUCTORS", icon: Award, gradient: "from-[#7FC29B] to-[#B5EF8A]" },
              { number: "150+", label: "COUNTRIES REACHED", icon: Globe, gradient: "from-[#D7F171] to-[#B5EF8A]" }
            ].map((stat, index) => (
              <Card key={index} className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-2xl border-4 border-white/40 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 group rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-white/50`}>
                    <stat.icon className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="text-4xl font-black text-white mb-3 drop-shadow-2xl">{stat.number}</div>
                  <div className="text-white font-black text-sm drop-shadow-lg tracking-wider">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What Makes Us Different */}
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] text-white px-8 py-3 text-lg font-black mb-8 border-3 border-white/40">
              WHAT MAKES US DIFFERENT
            </Badge>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: "LIVE MASTERCLASSES",
                  description: "Real-time interaction with world-renowned artists and immediate feedback",
                  gradient: "from-[#F19A3E] to-[#D7F171]",
                  borderColor: "border-[#F19A3E]"
                },
                {
                  icon: BookOpen,
                  title: "PERSONALIZED CURRICULUM",
                  description: "Tailored learning paths that adapt to your unique artistic journey",
                  gradient: "from-[#7FC29B] to-[#B5EF8A]",
                  borderColor: "border-[#7FC29B]"
                },
                {
                  icon: Trophy,
                  title: "INDUSTRY RECOGNITION",
                  description: "Certificates and portfolios that open doors to professional opportunities",
                  gradient: "from-[#B5EF8A] to-[#D7F171]",
                  borderColor: "border-[#B5EF8A]"
                }
              ].map((feature, index) => (
                <Card key={index} className={`bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl border-4 ${feature.borderColor} hover:border-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 cursor-pointer rounded-3xl`}>
                  <CardContent className="p-10 text-center">
                    <div className={`w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${feature.gradient} border-3 border-white/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <feature.icon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-6 drop-shadow-lg tracking-wider">{feature.title}</h3>
                    <p className="text-white leading-relaxed font-bold drop-shadow-sm text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-2xl border-4 border-[#F19A3E] shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F19A3E]/30 via-[#D7F171]/20 to-[#7FC29B]/30" />
            <CardContent className="relative p-16 text-center">
              <h2 className="text-5xl font-black text-white mb-8 drop-shadow-xl">READY TO BEGIN YOUR ARTISTIC JOURNEY?</h2>
              <p className="text-white text-2xl mb-12 max-w-4xl mx-auto font-bold drop-shadow-lg leading-relaxed">
                Join thousands of artists who have transformed their passion into mastery with Kala Suroop.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white font-black px-12 py-6 text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-4 border-white/50">
                  <Link to="/courses">
                    <Palette className="h-8 w-8 mr-4" />
                    EXPLORE COURSES
                    <ArrowRight className="h-8 w-8 ml-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-xl border-4 border-white/70 text-white hover:bg-white/40 px-12 py-6 text-2xl rounded-2xl transition-all duration-300 font-black shadow-2xl hover:scale-110">
                  <Link to="/signup">
                    <Crown className="h-8 w-8 mr-4" />
                    JOIN THE ELITE
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

export default About;
