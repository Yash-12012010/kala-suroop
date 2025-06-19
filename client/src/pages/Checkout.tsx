
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Lock, Shield, Star, Users, Clock, Zap, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  
  const courseData = location.state?.course;
  
  if (!courseData) {
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <Award className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
            <p className="text-purple-200 mb-8">Please select a course to checkout.</p>
            <Button 
              onClick={() => navigate('/courses')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    setIsProcessing(true);
    setPaymentStep(2);
    
    // Simulate payment processing with realistic steps
    setTimeout(() => {
      setPaymentStep(3);
      setTimeout(() => {
        setPaymentStep(4);
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentStep(5);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }, 1000);
      }, 1500);
    }, 2000);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'beginner': 'from-emerald-500 to-teal-500',
      'intermediate': 'from-blue-500 to-purple-500',
      'advanced': 'from-purple-500 to-pink-500',
      'advance': 'from-purple-500 to-pink-500',
      'specialized': 'from-orange-500 to-red-500'
    };
    return colors[level?.toLowerCase() as keyof typeof colors] || colors.beginner;
  };

  if (isProcessing) {
    return (
      <div className="pt-20 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
            <div className="space-y-8">
              {paymentStep === 2 && (
                <>
                  <div className="relative inline-block">
                    <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-pink-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Processing Payment</h2>
                  <p className="text-purple-200">Securing your enrollment...</p>
                </>
              )}
              
              {paymentStep === 3 && (
                <>
                  <Shield className="h-20 w-20 text-green-400 mx-auto animate-pulse" />
                  <h2 className="text-3xl font-bold text-white">Verifying Transaction</h2>
                  <p className="text-purple-200">Almost there...</p>
                </>
              )}
              
              {paymentStep === 4 && (
                <>
                  <Zap className="h-20 w-20 text-yellow-400 mx-auto animate-bounce" />
                  <h2 className="text-3xl font-bold text-white">Setting Up Your Course</h2>
                  <p className="text-purple-200">Preparing your learning experience...</p>
                </>
              )}
              
              {paymentStep === 5 && (
                <>
                  <CheckCircle className="h-20 w-20 text-green-400 mx-auto" />
                  <h2 className="text-3xl font-bold text-green-400">Payment Successful!</h2>
                  <p className="text-purple-200">Welcome to your new course! Redirecting to dashboard...</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/courses')}
          className="mb-8 text-purple-200 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Course Summary */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-400" />
                Course Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={courseData.image} 
                  alt={courseData.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className={`absolute top-4 right-4 bg-gradient-to-r ${getLevelColor(courseData.level)} text-white font-semibold`}>
                  {courseData.level}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white leading-tight">{courseData.title}</h3>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      ₹{courseData.discountedPrice}
                    </div>
                    <div className="text-sm text-purple-300 line-through">
                      ₹{courseData.originalPrice}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-400">
                      {Math.round(((courseData.originalPrice - courseData.discountedPrice) / courseData.originalPrice) * 100)}% OFF
                    </div>
                    <div className="text-xs text-purple-300">Limited Time</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Clock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-sm text-white font-medium">{courseData.duration}</div>
                    <div className="text-xs text-purple-300">Duration</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Users className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-sm text-white font-medium">{courseData.students}</div>
                    <div className="text-xs text-purple-300">Students</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1 fill-current" />
                    <div className="text-sm text-white font-medium">{courseData.rating}</div>
                    <div className="text-xs text-purple-300">Rating</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">What You'll Get:</h4>
                  <ul className="space-y-2 text-sm text-purple-100">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Lifetime access to course materials</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Certificate of completion</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Direct instructor support</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />30-day money-back guarantee</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Payment Form */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <Lock className="h-6 w-6 mr-2 text-green-400" />
                Secure Payment
              </CardTitle>
              <p className="text-purple-200">Your information is protected with bank-level security</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200 mb-6 text-lg">
                    Please login to continue with your secure checkout
                  </p>
                  <Button 
                    onClick={() => navigate('/login', { state: { from: location } })}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg"
                  >
                    Login to Continue
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="bg-white/5 border-white/20 text-white rounded-xl h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card" className="text-white font-medium">Card Information</Label>
                    <div className="relative">
                      <Input 
                        id="card" 
                        placeholder="1234 5678 9012 3456" 
                        className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-purple-300 rounded-xl h-12"
                      />
                      <CreditCard className="h-5 w-5 absolute left-4 top-3.5 text-purple-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-white font-medium">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-white font-medium">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 rounded-xl h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">Cardholder Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 rounded-xl h-12"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-white/20">
                    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-400/30">
                      <span className="text-xl font-semibold text-white">Total Amount</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ₹{courseData.discountedPrice}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                      size="lg"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      {isProcessing ? 'Processing Payment...' : 'Complete Secure Payment'}
                    </Button>
                    
                    <div className="flex items-center justify-center mt-4 text-sm text-purple-300">
                      <Shield className="h-4 w-4 mr-2" />
                      256-bit SSL encrypted • 100% secure
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
