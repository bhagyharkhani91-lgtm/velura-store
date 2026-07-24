import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { supabase } from '../../../lib/supabase';
import { isAllowedEmailDomain } from '../../../utils';
import './ForgotPasswordPage.css';

type Step = 'REQUEST_LINK' | 'SUCCESS';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('REQUEST_LINK');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  
  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isAllowedEmailDomain(email)) {
        setError('Only @gmail.com and @outlook.com email addresses are supported for password recovery.');
        setIsLoading(false);
        return;
      }

      // Directs the magic link back to our new /update-password route
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (resetError) throw resetError;
      
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        {step === 'REQUEST_LINK' && (
          <>
            <div className="forgot-password-header">
              <h1 className="forgot-password-title">Reset Password</h1>
              <p className="forgot-password-subtitle">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {error && (
              <div className="bg-error-muted text-error border border-error rounded-md p-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form className="forgot-password-form" onSubmit={handleRequestLink}>
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />

              <Button type="submit" size="lg" className="w-full mt-4" isLoading={isLoading}>
                Send Recovery Link <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>
          </>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="forgot-password-title mb-4">Check Your Email</h1>
            <p className="forgot-password-subtitle mb-8">
              We've sent a secure recovery link to <strong>{email}</strong>. 
              Please check your inbox (and spam folder) and click the link to reset your password.
            </p>
            <Button onClick={() => setStep('REQUEST_LINK')} variant="outline" className="w-full mb-4">
              Send Again
            </Button>
          </div>
        )}

        <div className="forgot-password-footer mt-6">
          Remember your password?{' '}
          <Link to="/login" className="forgot-password-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
