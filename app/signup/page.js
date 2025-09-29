'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Alert from '@/app/components/ui/Alert';
import Card, { CardHeader, CardBody, CardFooter } from '@/app/components/ui/Card';
import { validateForm } from '@/lib/utils/validation';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signup, isAuthenticated, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      // Use Next.js router for client-side navigation
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Enhanced validation using utility function
    const validation = validateForm(
      { name, email, password, confirmPassword },
      ['name', 'email', 'password', 'confirmPassword']
    );
    
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }
    
    try {
      const success = await signup({ name, email, password });
      if (success) {
        console.log('Signup successful, redirecting to dashboard');
        // Use Next.js router for client-side navigation
        router.push('/dashboard');
      } else {
        setErrorMessage('Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred during signup');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="mx-auto h-12 w-12 rounded-full bg-white flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Create Your Account
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Join our community today
            </p>
          </CardHeader>
          
          <CardBody className="pt-6">
            {errorMessage && (
              <Alert 
                variant="error" 
                className="mb-6"
                onDismiss={() => setErrorMessage('')}
              >
                {errorMessage}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Full Name"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                
                <Input
                  label="Confirm Password"
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                >
                  Create Account
                </Button>
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                By signing up, you agree to our
                <a href="#" className="text-indigo-600 hover:text-indigo-500"> Terms of Service </a>
                and
                <a href="#" className="text-indigo-600 hover:text-indigo-500"> Privacy Policy</a>
              </div>
            </form>
          </CardBody>
          
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
