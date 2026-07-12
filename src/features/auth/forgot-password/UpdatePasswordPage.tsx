import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import './ForgotPasswordPage.css'; // Reusing the same styles

export function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Supabase automatically parses the URL hash and establishes a session.
    // We just need to make sure the auth store is initialized so we can use it.
    const setupSession = async () => {
      await initialize();
    };
    setupSession();
  }, [initialize]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isAuthenticated) {
      setError('Your secure session has expired or is invalid. Please request a new recovery link.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;
      
      setIsSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Your session may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        {!isSuccess ? (
          <>
            <div className="forgot-password-header">
              <h1 className="forgot-password-title">New Password</h1>
              <p className="forgot-password-subtitle">
                Your email is verified. Please enter your new password below.
              </p>
            </div>

            {error && (
              <div className="bg-error-muted text-error border border-error rounded-md p-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form className="forgot-password-form" onSubmit={handleResetPassword}>
              <Input 
                label="New Password" 
                type="password" 
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
              />
              
              <Input 
                label="Confirm New Password" 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
              />

              <Button type="submit" size="lg" className="w-full mt-4" isLoading={isLoading}>
                Securely Reset Password
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="forgot-password-title mb-4">Password Reset Complete</h1>
            <p className="forgot-password-subtitle mb-8">
              Your password has been securely updated. You will be redirected to the login page momentarily.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
