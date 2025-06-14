
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset email sending
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg lg:text-xl">Check your email</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl lg:text-6xl mb-4">📧</div>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs lg:text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full text-sm lg:text-base"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try again
                </Button>
                <Button asChild className="w-full text-sm lg:text-base">
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Reset your password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-sm lg:text-base">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm lg:text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm lg:text-base text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
