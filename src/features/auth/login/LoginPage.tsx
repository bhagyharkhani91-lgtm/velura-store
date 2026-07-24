import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { isAllowedEmailDomain } from '../../../utils';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirect = searchParams.get('redirect');
      if (user?.role === 'admin') {
        navigate(redirect || '/admin', { replace: true });
      } else {
        navigate(redirect || '/', { replace: true });
      }
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (searchParams.get('verified') === 'true') {
      setError('');
      import('../../../stores/uiStore').then(m => {
        m.useUIStore.getState().addToast({
          type: 'success',
          title: 'Email Verified',
          message: 'Your email has been confirmed. You can now sign in.',
        });
      });
    }
    if (searchParams.get('confirmed') === 'true') {
      setError('');
      import('../../../stores/uiStore').then(m => {
        m.useUIStore.getState().addToast({
          type: 'success',
          title: 'Account Confirmed',
          message: 'Your account has been confirmed. You can now sign in.',
        });
      });
    }
  }, []);

  const resendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (resendError) throw resendError;
      import('../../../stores/uiStore').then(m => {
        m.useUIStore.getState().addToast({
          type: 'success',
          title: 'Confirmation Email Sent',
          message: 'Check your inbox for the verification link.',
        });
      });
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isAllowedEmailDomain(email)) {
      setError('Only @gmail.com and @outlook.com email addresses are allowed.');
      setIsLoading(false);
      return;
    }

    try {
      if (email && password) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Wait briefly for authStore state to update via onAuthStateChange listener
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if admin for routing
        if (data.user) {
           const redirect = searchParams.get('redirect');
           const { data: profile } = await supabase
             .from('profiles')
             .select('role')
             .eq('id', data.user.id)
             .single();
             
           if (redirect) {
             navigate(redirect);
           } else if (profile?.role === 'admin') {
             navigate('/admin');
           } else {
             navigate('/');
           }
        }
      } else {
        setError('Please enter both email and password.');
      }
    } catch (err: any) {
      const message = err.message || 'An error occurred during login. Please try again.';
      setError(message);
      if (message.toLowerCase().includes('email not confirmed') || message.toLowerCase().includes('email not verified')) {
        setUnconfirmedEmail(true);
      } else {
        setUnconfirmedEmail(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Enter your credentials to access your account</p>
        </div>

        {error && !unconfirmedEmail && (
          <div className="bg-error-muted text-error border border-error rounded-md p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {unconfirmedEmail && (
          <div className="bg-warning-muted text-warning rounded-md p-4 mb-6 text-sm" style={{ border: '1px solid var(--color-warning)' }}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} />
              <strong>Email Not Verified</strong>
            </div>
            <p className="mb-3">{error}. Please check your inbox for the confirmation email we sent during registration.</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={resendConfirmation}
              isLoading={isResending}
            >
              Resend Confirmation Email
            </Button>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="login-options">
            <label className="login-checkbox">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="login-forgot-link">
              Forgot Password?
            </Link>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-2" 
            isLoading={isLoading}
          >
            Sign In
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
          Continue with Google
        </Button>

        <div className="login-footer">
          Don't have an account? 
          <Link to={`/register${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="login-signup-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
