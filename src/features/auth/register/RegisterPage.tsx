import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { isAllowedEmailDomain } from '../../../utils';
import '../login/LoginPage.css';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
      const res = await fetch('/api/signup-with-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem('verify_email', email);
      sessionStorage.setItem('verify_password', password);
      sessionStorage.setItem('verify_name', name);

      navigate('/verify-otp', { replace: true });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
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
          onClick={async () => {
            try {
              const redirect = searchParams.get('redirect');
              const redirectToUrl = redirect ? `${window.location.origin}${redirect}` : window.location.origin;
              const { supabase } = await import('../../../lib/supabase');
              const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: redirectToUrl }
              });
              if (googleError) throw googleError;
            } catch (err: any) {
              setError(err.message || 'An error occurred with Google authentication.');
            }
          }}
        >
          Sign up with Google
        </Button>

        <div className="login-footer">
          Already have an account? 
          <Link to={`/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="login-signup-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
