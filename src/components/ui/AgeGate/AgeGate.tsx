import { ShieldAlert } from 'lucide-react';
import { Button } from '../Button/Button';
import './AgeGate.css';

interface AgeGateProps {
  onVerify: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-card">
        <div className="age-gate-icon">
          <ShieldAlert size={48} />
        </div>
        
        <h2 className="heading-2xl age-gate-title">Age Verification Required</h2>
        
        <div className="age-gate-content">
          <p className="text-secondary mb-4">
            This website contains adult-oriented products and information. You must be at least 20 years of age to enter.
          </p>
          <p className="text-secondary">
            By entering this site, you agree to our Terms of Service and Privacy Policy, and you confirm that you are of legal age in your jurisdiction.
          </p>
        </div>

        <div className="age-gate-actions">
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={onVerify}
            className="age-gate-btn-yes"
          >
            Yes, I am 20+ and Accept
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            fullWidth 
            onClick={handleReject}
            className="age-gate-btn-no"
          >
            No, Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
