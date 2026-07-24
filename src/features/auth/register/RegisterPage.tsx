import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { supabase } from '../../../lib/supabase';
import { isAllowedEmailDomain } from '../../../utils';
import '../login/LoginPage.css';

type Step = 'REGISTER' | 'SUCCESS';

export function RegisterPage() {
  const [step, setStep] = useState<Step>('REGISTER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const redirect = searchParams.get('redirect');
      const redirectToUrl = redirect ? `${window.location.origin}${redirect}` : window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectToUrl
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google authentication.');
    }
  };

  const resendConfirmation = async () => {
    setError('');
    setIsResending(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (resendError) throw resendError;
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email.');
      return false;
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!isAllowedEmailDomain(email)) {
      setError('Only @gmail.com and @outlook.com email addresses are allowed.');
      setIsLoading(false);
      return;
    }

    try {
      if (email && password && name) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            },
            emailRedirectTo: `${window.location.origin}/confirm-email`
          }
        });

        if (signUpError) throw signUpError;

        if (data.session === null && data.user) {
          setStep('SUCCESS');
        } else {
          const redirect = searchParams.get('redirect');
          if (redirect) {
            navigate(redirect);
          } else {
            navigate('/');
          }
        }
      } else {
        setError('Please fill in all fields.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {step === 'REGISTER' && (
          <>
            <div className="login-header">
              <h1 className="login-title">Create Account</h1>
               <p className="login-subtitle">Join us to explore premium personal care and wellness</p>
            </div>

            {error && (
              <div className="bg-error-muted text-error border border-error rounded-md p-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <Input 
                label="Full Name" 
                type="text" 
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon size={18} />}
                required
              />

              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
              />

              <Input 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-4" 
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              type="button"
              onClick={handleGoogleAuth}
            >
              Sign up with Google
            </Button>

            <div className="login-footer">
              Already have an account? 
              <Link to={`/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="login-signup-link">
                Sign in
              </Link>
            </div>
          </>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="login-title mb-4">Check Your Email</h1>
            <p className="login-subtitle mb-6">
              We've sent a confirmation email to <strong>{email}</strong>. 
              Please check your inbox (and spam folder) and click the link to verify your account.
            </p>
            <p className="login-subtitle mb-8">
              You'll be able to sign in once your email is verified.
            </p>

            {error && (
              <div className="bg-error-muted text-error border border-error rounded-md p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <Button 
              onClick={async () => {
                const sent = await resendConfirmation();
                if (sent && !error) {
                  const toast = await import('../../../stores/uiStore').then(m => m.useUIStore.getState());
                  toast.addToast({ type: 'success', title: 'Confirmation email resent', message: 'Check your inbox for the verification link.' });
                }
              }} 
              variant="outline" 
              size="lg" 
              className="w-full mb-3"
              isLoading={isResending}
            >
              Resend Confirmation Email
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="secondary" 
              size="lg" 
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
