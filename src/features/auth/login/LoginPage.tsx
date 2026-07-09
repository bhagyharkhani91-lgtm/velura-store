import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { supabase } from '../../../lib/supabase';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
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
           const { data: profile } = await supabase
             .from('profiles')
             .select('role')
             .eq('id', data.user.id)
             .single();
             
           if (profile?.role === 'admin') {
             navigate('/admin');
           } else {
             navigate('/');
           }
        }
      } else {
        setError('Please enter both email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.');
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

        {error && (
          <div className="bg-error-muted text-error border border-error rounded-md p-3 mb-6 text-sm">
            {error}
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
          <Link to="/register" className="login-signup-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
