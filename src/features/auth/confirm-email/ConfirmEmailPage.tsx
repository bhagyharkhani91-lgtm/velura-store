import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import './ConfirmEmailPage.css';

type State = 'LOADING' | 'SUCCESS' | 'ERROR';

export function ConfirmEmailPage() {
  const [state, setState] = useState<State>('LOADING');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const code = searchParams.get('code');
    
    const handleConfirmation = async () => {
      try {
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) throw error;
          
          if (data?.session) {
            setState('SUCCESS');
            setMessage('Your email has been verified. You are now signed in.');
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
            
            timerRef.current = setTimeout(() => {
              if (profile?.role === 'admin') {
                navigate('/admin', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            }, 2000);
            return;
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          setState('SUCCESS');
          setMessage('Your email has been verified. You are now signed in.');
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          timerRef.current = setTimeout(() => {
            if (profile?.role === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }, 2000);
          return;
        }

        setState('SUCCESS');
        setMessage('Your email has been verified. You can now sign in to your account.');
        
        timerRef.current = setTimeout(() => {
          navigate('/login?confirmed=true', { replace: true });
        }, 2500);
        
      } catch (err: any) {
        setState('ERROR');
        setMessage(err.message || 'Failed to verify email. The link may be expired or invalid.');
      }
    };

    handleConfirmation();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="confirm-email-page">
      <div className="confirm-email-card">
        {state === 'LOADING' && (
          <div className="text-center">
            <div className="confirm-email-icon-wrapper loading">
              <Loader2 size={32} className="spin-icon" />
            </div>
            <h1 className="confirm-email-title">Verifying Your Email</h1>
            <p className="confirm-email-subtitle">
              Please wait while we confirm your email address...
            </p>
          </div>
        )}

        {state === 'SUCCESS' && (
          <div className="text-center">
            <div className="confirm-email-icon-wrapper success">
              <ShieldCheck size={32} />
            </div>
            <h1 className="confirm-email-title">Email Verified!</h1>
            <p className="confirm-email-subtitle">{message}</p>
            {!isAuthenticated && !authLoading && (
              <Button onClick={() => navigate('/login')} className="w-full mt-4">
                Go to Sign In
              </Button>
            )}
          </div>
        )}

        {state === 'ERROR' && (
          <div className="text-center">
            <div className="confirm-email-icon-wrapper error">
              <ShieldAlert size={32} />
            </div>
            <h1 className="confirm-email-title">Verification Failed</h1>
            <p className="confirm-email-subtitle mb-6">{message}</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
