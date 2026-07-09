import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { supabase } from '../../../lib/supabase';
import '../login/LoginPage.css'; // We can reuse the login page styles since the layout is identical

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      if (email && password && name) {
        // Sign up with Supabase, passing the name as metadata so our trigger can use it
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });

        if (signUpError) throw signUpError;
        
        // The profile is now created automatically by the database trigger!
        
        // If email confirmation is enabled on Supabase, the user might need to check their email.
        // We will navigate them to the home page (or a "check email" page if you prefer)
        navigate('/');
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
        <div className="login-header">
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join us to explore premium intimate wellness</p>
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
          <Link to="/login" className="login-signup-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
