import { useState, useEffect, useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import './VerifyOtpPage.css';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = sessionStorage.getItem('verify_email') || '';
  const password = sessionStorage.getItem('verify_password') || '';

  useEffect(() => {
    if (!email || !password) {
      navigate('/register', { replace: true });
    }
  }, [email, password, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setError('');

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pasted.length, 6); i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      setTimeout(() => verifyOtp(newOtp.join('')), 100);
    }
  };

  const verifyOtp = async (otpCode: string) => {
    setIsVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        if (data.error?.includes('remaining')) {
          setOtp(Array(6).fill(''));
          inputRefs.current[0]?.focus();
        }
        return;
      }

      setSuccess('Email verified! Signing you in...');
      setError('');

      // Auto-login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Verification succeeded but auto-login failed. Please go to the login page.');
        setSuccess('');
        return;
      }

      // Clean up sessionStorage
      sessionStorage.removeItem('verify_email');
      sessionStorage.removeItem('verify_password');
      sessionStorage.removeItem('verify_name');

      // Redirect to home
      const timer = setTimeout(() => {
        const { user: profile } = useAuthStore.getState();
        if (profile?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend', email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP');
        return;
      }

      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      setCountdown(30);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (!email || !password) return null;

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-card">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-5">
          <ShieldCheck size={28} />
        </div>
        <h1 className="verify-otp-title">Verify Your Email</h1>
        <p className="verify-otp-subtitle">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && <div className="verify-otp-error">{error}</div>}
        {success && <div className="verify-otp-success">{success}</div>}

        <div className="otp-inputs">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={isVerifying || !!success}
              className={`otp-input ${error ? 'otp-input--error' : ''}`}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <div className="verify-otp-actions">
          {!success && (
            <>
              <Button
                size="lg"
                className="w-full"
                isLoading={isVerifying}
                onClick={() => verifyOtp(otp.join(''))}
                disabled={otp.some(d => d === '') || otp.join('').length !== 6 || isResending}
              >
                Verify Code
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleResend}
                isLoading={isResending}
                disabled={countdown > 0 || isVerifying}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              sessionStorage.removeItem('verify_email');
              sessionStorage.removeItem('verify_password');
              sessionStorage.removeItem('verify_name');
              navigate('/register');
            }}
          >
            Change Email
          </Button>
        </div>
      </div>
    </div>
  );
}
